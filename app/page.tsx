'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Building, Citizen } from '@/lib/vs-types'
import { CITIZENS, NEIGHBORHOODS } from '@/lib/vs-data'
import { IsoWorld, type Thought } from '@/components/world/iso-world'
import { CitizenPanel } from '@/components/world/citizen-panel'
import { SetupScreen, type SocietyConfig } from '@/components/setup/setup-screen'
import { GeneratingScreen } from '@/components/setup/generating-screen'
import { ExperimentModal, type Experiment } from '@/components/experiment/experiment-modal'
import { ResultsOverlay } from '@/components/experiment/results-overlay'
import { FlaskConical, Pause, Play, FastForward, Users, MapPin, Gauge } from 'lucide-react'

type Phase = 'setup' | 'generating' | 'world'

const SPEEDS = [1, 2, 4] as const

// thought bubble snippets shown while an experiment spreads
const POS_THOUGHTS = ['Ooh, interesting!', 'I want one!', 'Finally affordable', 'Telling my friends', 'Love the design']
const NEU_THOUGHTS = ['Hmm, maybe…', 'Need to think', 'Is it worth it?', 'Let me look it up']
const NEG_THOUGHTS = ['Not for me', 'Too pricey', "I'll pass", 'Prefer my old one']

export default function Page() {
  const [phase, setPhase] = useState<Phase>('setup')
  const [config, setConfig] = useState<SocietyConfig | null>(null)

  // simulation state
  const [speed, setSpeed] = useState(1)
  const [paused, setPaused] = useState(false)
  const [selected, setSelected] = useState<Citizen | null>(null)
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)

  // experiment state
  const [showModal, setShowModal] = useState(false)
  const [experiment, setExperiment] = useState<Experiment | null>(null)
  const [spreading, setSpreading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [reacted, setReacted] = useState(false)
  const [thoughts, setThoughts] = useState<Record<string, Thought>>({})
  const [progress, setProgress] = useState(0)
  const [liveStats, setLiveStats] = useState<{ positive: number; considering: number; neutral: number; negative: number; exposed: number; conversations: number; changed: number } | null>(null)

  const thoughtTimers = useRef<ReturnType<typeof setTimeout>[]>([])
  const liveTimers = useRef<ReturnType<typeof setInterval>[]>([])

  const effectiveSpeed = paused ? 0 : speed

  const citizens = CITIZENS

  const openCitizen = useCallback((c: Citizen) => {
    setSelectedBuilding(null)
    setSelected(c)
  }, [])

  const startExperiment = useCallback(
    (exp: Experiment) => {
      setExperiment(exp)
      setShowModal(false)
      setSpreading(true)
      setReacted(false)
      setProgress(0)
      setSpeed(2)
      setPaused(false)
      setLiveStats({ positive: 0, considering: 0, neutral: 0, negative: 0, exposed: 0, conversations: 0, changed: 0 })

      // gradual live stats timer
      liveTimers.current.forEach(clearInterval)
      liveTimers.current = []
      const totalExposed = 1284
      const totalConversations = 328
      const totalChanged = 74
      const finalPositive = 42
      const finalConsidering = 26
      const finalNeutral = 19
      const finalNegative = 13
      const statsInterval = setInterval(() => {
        setLiveStats((prev) => {
          if (!prev) return prev
          const elapsed = prev.exposed + Math.floor(totalExposed / 52) + Math.floor(Math.random() * 8)
          const exposed = Math.min(totalExposed, elapsed)
          const conversations = Math.min(totalConversations, Math.floor((exposed / totalExposed) * totalConversations))
          const changed = Math.min(totalChanged, Math.floor((exposed / totalExposed) * totalChanged))
          const ratio = exposed / totalExposed
          return {
            positive: Math.round(finalPositive * ratio),
            considering: Math.round(finalConsidering * ratio),
            neutral: Math.round(finalNeutral * ratio),
            negative: Math.round(finalNegative * ratio),
            exposed,
            conversations,
            changed,
          }
        })
      }, 100)
      liveTimers.current.push(statsInterval)

      // emit rolling thought bubbles as the idea spreads
      thoughtTimers.current.forEach(clearTimeout)
      thoughtTimers.current = []
      const order = [...citizens].sort(() => Math.random() - 0.5)
      const duration = 5200
      order.forEach((c, i) => {
        const at = (i / order.length) * duration
        const t = setTimeout(() => {
          const tone: Thought['tone'] =
            c.finalOpinion === 'positive' ? 'pos' : c.finalOpinion === 'negative' ? 'neg' : 'neu'
          const pool = tone === 'pos' ? POS_THOUGHTS : tone === 'neg' ? NEG_THOUGHTS : NEU_THOUGHTS
          setThoughts((prev) => ({
            ...prev,
            [c.id]: { text: pool[Math.floor(Math.random() * pool.length)], key: Date.now() + i, tone },
          }))
          setProgress(Math.round(((i + 1) / order.length) * 100))
        }, at)
        thoughtTimers.current.push(t)
      })

      // finish: lock in reactions & show results
      const done = setTimeout(() => {
        setReacted(true)
        setSpreading(false)
        setShowResults(true)
        liveTimers.current.forEach(clearInterval)
        setLiveStats(null)
      }, duration + 500)
      thoughtTimers.current.push(done)
    },
    [citizens],
  )

  const resetExperiment = useCallback(() => {
    thoughtTimers.current.forEach(clearTimeout)
    thoughtTimers.current = []
    liveTimers.current.forEach(clearInterval)
    liveTimers.current = []
    setThoughts({})
    setExperiment(null)
    setReacted(false)
    setShowResults(false)
    setSpreading(false)
    setProgress(0)
    setLiveStats(null)
    setShowModal(true)
  }, [])

  // clear expired thought bubbles
  useEffect(() => {
    if (Object.keys(thoughts).length === 0) return
    const t = setTimeout(() => setThoughts({}), 3600)
    return () => clearTimeout(t)
  }, [thoughts])

  useEffect(() => () => {
    thoughtTimers.current.forEach(clearTimeout)
    liveTimers.current.forEach(clearInterval)
  }, [])

  const campaign = useMemo(
    () => (experiment ? { title: experiment.title } : null),
    [experiment],
  )

  if (phase === 'setup') {
    return (
      <SetupScreen
        onCreate={(cfg) => {
          setConfig(cfg)
          setPhase('generating')
        }}
      />
    )
  }

  if (phase === 'generating' && config) {
    return <GeneratingScreen config={config} onDone={() => setPhase('world')} />
  }

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-sky">
      <IsoWorld
        citizens={citizens}
        selectedCitizenId={selected?.id}
        onSelectCitizen={openCitizen}
        selectedBuildingId={selectedBuilding?.id}
        onSelectBuilding={(b) => {
          setSelected(null)
          setSelectedBuilding(b)
        }}
        speed={effectiveSpeed}
        campaign={campaign}
        thoughts={thoughts}
        showConversations={spreading}
        heatmap={reacted}
        neighborhoods={NEIGHBORHOODS}
        experimentLive={spreading}
        liveStats={liveStats ?? undefined}
      />

      {/* top bar */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-3 sm:p-4">
        <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-border bg-card/85 px-3 py-2 shadow-lg backdrop-blur">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-display text-lg font-700 text-primary-foreground">
            {config?.name.charAt(0) ?? 'S'}
          </span>
          <div className="leading-tight">
            <div className="font-display text-sm font-700 text-foreground">{config?.name ?? 'Society'}</div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-0.5">
                <Users className="h-3 w-3" /> {(config?.size ?? 10000).toLocaleString()}
              </span>
              <span className="inline-flex items-center gap-0.5">
                <MapPin className="h-3 w-3" /> {NEIGHBORHOODS.length} areas
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 font-display text-sm font-700 text-primary-foreground shadow-lg transition hover:brightness-105 active:scale-[0.98]"
        >
          <FlaskConical className="h-4 w-4" />
          <span className="hidden sm:inline">Run experiment</span>
          <span className="sm:hidden">Experiment</span>
        </button>
      </header>

      {/* spreading progress banner */}
      {spreading && experiment && (
        <div className="pointer-events-none absolute inset-x-0 top-20 z-30 flex justify-center px-4 sm:top-24">
          <div className="pointer-events-auto w-full max-w-sm rounded-2xl border border-border bg-card/90 px-4 py-3 shadow-lg backdrop-blur">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">Spreading &ldquo;{experiment.title}&rdquo;</span>
              <span className="font-bold text-primary tabular-nums">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* time controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center p-3 sm:p-4">
        <div className="pointer-events-auto flex items-center gap-1 rounded-2xl border border-border bg-card/85 p-1.5 shadow-lg backdrop-blur">
          <button
            onClick={() => setPaused((p) => !p)}
            className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-secondary-foreground transition hover:brightness-95"
            aria-label={paused ? 'Play' : 'Pause'}
          >
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
          <div className="mx-1 flex items-center gap-0.5 rounded-xl bg-secondary/60 p-0.5">
            <Gauge className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setSpeed(s)
                  setPaused(false)
                }}
                className={`min-w-9 rounded-lg px-2 py-1.5 text-xs font-bold transition ${
                  speed === s && !paused
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
          {experiment && !spreading && (
            <button
              onClick={resetExperiment}
              className="ml-1 flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-2 text-xs font-bold text-secondary-foreground transition hover:brightness-95"
            >
              <FastForward className="h-3.5 w-3.5" /> New test
            </button>
          )}
        </div>
      </div>

      {/* results button when overlay dismissed */}
      {reacted && !showResults && experiment && (
        <button
          onClick={() => setShowResults(true)}
          className="pointer-events-auto absolute bottom-20 left-1/2 z-30 -translate-x-1/2 rounded-2xl border border-border bg-card/90 px-4 py-2 text-xs font-bold text-primary shadow-lg backdrop-blur transition hover:brightness-105 sm:bottom-24"
        >
          View results
        </button>
      )}

      {/* citizen panel */}
      {selected && (
        <div className="absolute inset-y-0 right-0 z-40 w-full max-w-sm p-3 sm:p-4">
          <CitizenPanel citizen={selected} onClose={() => setSelected(null)} showReaction={reacted} />
        </div>
      )}

      {/* building panel */}
      {selectedBuilding && (
        <div className="absolute bottom-20 left-1/2 z-30 w-[min(20rem,calc(100%-1.5rem))] -translate-x-1/2 rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur sm:left-4 sm:translate-x-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-display text-sm font-700 text-foreground">
                {selectedBuilding.label ?? labelFor(selectedBuilding.type)}
              </div>
              {selectedBuilding.neighborhood && (
                <div className="text-xs text-muted-foreground">{selectedBuilding.neighborhood}</div>
              )}
            </div>
            <button
              onClick={() => setSelectedBuilding(null)}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{describe(selectedBuilding.type)}</p>
        </div>
      )}

      {showModal && (
        <ExperimentModal onClose={() => setShowModal(false)} onRun={startExperiment} />
      )}

      {showResults && experiment && (
        <ResultsOverlay
          experiment={experiment}
          citizens={citizens}
          neighborhoods={NEIGHBORHOODS}
          onClose={() => setShowResults(false)}
          onReset={resetExperiment}
        />
      )}
    </main>
  )
}

function labelFor(type: Building['type']) {
  const m: Record<Building['type'], string> = {
    house: 'Family Home',
    apartment: 'Apartments',
    office: 'Office',
    cafe: 'Café',
    supermarket: 'Supermarket',
    park: 'Park',
    tree: 'Tree',
  }
  return m[type]
}

function describe(type: Building['type']) {
  const m: Record<Building['type'], string> = {
    house: 'A residential home where citizens rest, charge devices, and spend time with family.',
    apartment: 'A dense residential block housing dozens of citizens across many life stages.',
    office: 'A workplace where citizens commute each morning and exchange ideas throughout the day.',
    cafe: 'A social hub — one of the fastest places for new ideas to spread through conversation.',
    supermarket: 'Where citizens shop for essentials and first encounter new products on the shelf.',
    park: 'Open green space for gatherings, events, and weekend relaxation.',
    tree: 'Part of the city greenery that keeps the society pleasant.',
  }
  return m[type]
}
