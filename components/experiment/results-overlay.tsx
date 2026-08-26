'use client'

import type { Citizen, Neighborhood } from '@/lib/vs-types'
import type { Experiment } from './experiment-modal'
import { X, TrendingUp, Users, RotateCcw } from 'lucide-react'

const ZONE = {
  positive: { label: 'Enthusiastic', color: 'var(--positive)' },
  mixed: { label: 'Divided', color: 'var(--considering)' },
  negative: { label: 'Resistant', color: 'var(--negative)' },
}

export function ResultsOverlay({
  experiment,
  citizens,
  neighborhoods,
  onClose,
  onReset,
}: {
  experiment: Experiment
  citizens: Citizen[]
  neighborhoods: Neighborhood[]
  onClose: () => void
  onReset: () => void
}) {
  const total = citizens.length
  const counts = citizens.reduce(
    (acc, c) => {
      acc[c.finalOpinion] = (acc[c.finalOpinion] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )
  const positive = counts.positive ?? 0
  const considering = counts.considering ?? 0
  const negative = (counts.negative ?? 0) + (counts.neutral ?? 0)
  const changed = citizens.filter((c) => c.initialOpinion !== c.finalOpinion).length

  const pct = (n: number) => Math.round((n / total) * 100)

  const bars = [
    { label: 'Positive', n: positive, color: 'var(--positive)' },
    { label: 'Considering', n: considering, color: 'var(--considering)' },
    { label: 'Not interested', n: negative, color: 'var(--negative)' },
  ]

  const approval = pct(positive)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="vs-scrollbar max-h-dvh w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-border bg-card shadow-2xl sm:rounded-3xl">
        {/* header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-border bg-card px-5 py-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wide text-primary">Experiment results</span>
            <h2 className="font-display text-xl font-700 leading-tight text-foreground">{experiment.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-secondary-foreground transition hover:brightness-95"
            aria-label="Close results"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 px-5 py-5">
          {/* headline stats */}
          <div className="grid grid-cols-3 gap-3">
            <Stat icon={<TrendingUp className="h-4 w-4" />} value={`${approval}%`} label="Overall approval" tone="var(--positive)" />
            <Stat icon={<Users className="h-4 w-4" />} value={changed.toLocaleString()} label="Changed their mind" tone="var(--primary)" />
            <Stat icon={<Users className="h-4 w-4" />} value={total.toLocaleString()} label="Citizens reached" tone="var(--considering)" />
          </div>

          {/* sentiment bars */}
          <section>
            <h3 className="mb-3 font-display text-sm font-600 text-foreground">Overall sentiment</h3>
            <div className="space-y-3">
              {bars.map((b) => (
                <div key={b.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{b.label}</span>
                    <span className="font-bold text-foreground">{pct(b.n)}%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct(b.n)}%`, background: b.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* neighborhood heatmap breakdown */}
          <section>
            <h3 className="mb-3 font-display text-sm font-600 text-foreground">By neighborhood</h3>
            <div className="grid grid-cols-2 gap-3">
              {neighborhoods.map((n) => {
                const z = ZONE[n.zone]
                return (
                  <div key={n.id} className="rounded-2xl border border-border bg-background p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-600 text-foreground">{n.name}</span>
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{ color: z.color, background: `color-mix(in oklch, ${z.color} 16%, transparent)` }}
                      >
                        {z.label}
                      </span>
                    </div>
                    <div className="mt-2 flex items-end gap-1">
                      <span className="font-display text-2xl font-700 tabular-nums" style={{ color: z.color }}>
                        {n.positive}%
                      </span>
                      <span className="pb-1 text-xs text-muted-foreground">positive</span>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {n.concerns.map((c, i) => (
                        <li key={i} className="truncate text-xs italic text-muted-foreground">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </section>

          {/* insight */}
          <section className="rounded-2xl bg-primary/10 p-4">
            <h3 className="mb-1 font-display text-sm font-700 text-primary">Key insight</h3>
            <p className="text-sm leading-relaxed text-foreground">
              {experiment.title} resonated most with{' '}
              <span className="font-semibold">young adults and the Tech District</span>, where affordability
              and design drove enthusiasm. Resistance concentrated in{' '}
              <span className="font-semibold">Old Town</span>, where price and unfamiliarity remain barriers.
              Consider a targeted follow-up to convert the &ldquo;considering&rdquo; segment.
            </p>
          </section>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={onClose}
              className="flex-1 rounded-2xl bg-primary px-5 py-3 font-display text-sm font-700 text-primary-foreground shadow transition hover:brightness-105"
            >
              Explore the reactions
            </button>
            <button
              onClick={onReset}
              className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-secondary"
            >
              <RotateCcw className="h-4 w-4" /> Run another
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode
  value: string
  label: string
  tone: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3 text-center">
      <span
        className="mx-auto mb-1 grid h-8 w-8 place-items-center rounded-xl"
        style={{ color: tone, background: `color-mix(in oklch, ${tone} 14%, transparent)` }}
      >
        {icon}
      </span>
      <div className="font-display text-xl font-700 tabular-nums text-foreground">{value}</div>
      <div className="text-[11px] leading-tight text-muted-foreground">{label}</div>
    </div>
  )
}
