'use client'

import { useState } from 'react'
import { Users, Sparkles, ArrowRight, Building2, Home, TreePine } from 'lucide-react'

export type SocietyConfig = {
  name: string
  size: number
  segments: string[]
  vibe: string
}

const SEGMENTS = [
  { id: 'Young adults', emoji: '🎓', desc: 'Ages 18–35' },
  { id: 'Families', emoji: '👨‍👩‍👧', desc: 'Households with kids' },
  { id: 'Older adults', emoji: '👵', desc: 'Ages 55+' },
]

const VIBES = [
  { id: 'balanced', label: 'Balanced City', icon: Building2, desc: 'A realistic mix of everyone' },
  { id: 'trendy', label: 'Trendsetters', icon: Sparkles, desc: 'Early adopters & influencers' },
  { id: 'suburban', label: 'Suburban', icon: Home, desc: 'Family-first neighborhoods' },
  { id: 'traditional', label: 'Traditional', icon: TreePine, desc: 'Slower to change, loyal' },
]

const SIZES = [1000, 10000, 100000]

export function SetupScreen({ onCreate }: { onCreate: (cfg: SocietyConfig) => void }) {
  const [name, setName] = useState('New Harbor')
  const [size, setSize] = useState(10000)
  const [segments, setSegments] = useState<string[]>(['Young adults', 'Families', 'Older adults'])
  const [vibe, setVibe] = useState('balanced')

  const toggleSegment = (id: string) =>
    setSegments((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const canCreate = name.trim().length > 0 && segments.length > 0

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-[oklch(0.9_0.06_235)] via-background to-[oklch(0.9_0.08_150)]">
      {/* floating decorative clouds */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          { top: '8%', left: '10%', s: 1.2 },
          { top: '20%', right: '12%', s: 1.6 },
          { top: '55%', left: '6%', s: 1 },
        ].map((c, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/50 blur-md"
            style={{
              top: c.top,
              left: (c as { left?: string }).left,
              right: (c as { right?: string }).right,
              width: 130 * c.s,
              height: 44 * c.s,
              animation: `vs-cloud ${20 + i * 5}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-5 py-10">
        <header className="mb-8 text-center">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Virtual Society
          </span>
          <h1 className="text-balance font-display text-4xl font-700 leading-[1.05] text-foreground sm:text-5xl">
            Build a world.
            <br />
            Test your idea on it.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
            Create a living population of simulated people, then watch how they react to your ads,
            products and events — before you try them on anyone real.
          </p>
        </header>

        <div className="space-y-5 rounded-3xl border border-border bg-card/80 p-5 shadow-xl backdrop-blur sm:p-6">
          {/* name */}
          <div>
            <label htmlFor="soc-name" className="mb-1.5 block font-display text-sm font-600 text-foreground">
              Name your society
            </label>
            <input
              id="soc-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="e.g. New Harbor"
            />
          </div>

          {/* size */}
          <div>
            <span className="mb-1.5 block font-display text-sm font-600 text-foreground">Population size</span>
            <div className="grid grid-cols-3 gap-2">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex flex-col items-center gap-0.5 rounded-2xl border px-2 py-3 transition ${
                    size === s
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-muted-foreground hover:border-primary/40'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-bold">{s.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* segments */}
          <div>
            <span className="mb-1.5 block font-display text-sm font-600 text-foreground">
              Who lives here?
            </span>
            <div className="grid grid-cols-3 gap-2">
              {SEGMENTS.map((seg) => {
                const on = segments.includes(seg.id)
                return (
                  <button
                    key={seg.id}
                    onClick={() => toggleSegment(seg.id)}
                    className={`rounded-2xl border px-2 py-3 text-center transition ${
                      on
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-background hover:border-primary/40'
                    }`}
                  >
                    <div className="text-2xl leading-none">{seg.emoji}</div>
                    <div className={`mt-1 text-xs font-bold ${on ? 'text-primary' : 'text-foreground'}`}>
                      {seg.id}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{seg.desc}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* vibe */}
          <div>
            <span className="mb-1.5 block font-display text-sm font-600 text-foreground">Society character</span>
            <div className="grid grid-cols-2 gap-2">
              {VIBES.map((v) => {
                const Icon = v.icon
                const on = vibe === v.id
                return (
                  <button
                    key={v.id}
                    onClick={() => setVibe(v.id)}
                    className={`flex items-start gap-2.5 rounded-2xl border px-3 py-2.5 text-left transition ${
                      on ? 'border-primary bg-primary/10' : 'border-border bg-background hover:border-primary/40'
                    }`}
                  >
                    <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl ${on ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className={`block text-sm font-bold ${on ? 'text-primary' : 'text-foreground'}`}>{v.label}</span>
                      <span className="block text-[11px] leading-tight text-muted-foreground">{v.desc}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <button
            disabled={!canCreate}
            onClick={() => onCreate({ name: name.trim(), size, segments, vibe })}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-4 font-display text-base font-700 text-primary-foreground shadow-lg transition enabled:hover:brightness-105 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Generate my society
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
