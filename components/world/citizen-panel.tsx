'use client'

import type { Citizen, Opinion } from '@/lib/vs-types'
import { X, MapPin, Briefcase, Heart } from 'lucide-react'

const OPINION_META: Record<Opinion, { label: string; color: string; bg: string }> = {
  positive: { label: 'Positive', color: 'var(--positive)', bg: 'color-mix(in oklch, var(--positive) 16%, transparent)' },
  considering: { label: 'Considering', color: 'var(--considering)', bg: 'color-mix(in oklch, var(--considering) 16%, transparent)' },
  neutral: { label: 'Neutral', color: 'var(--muted-foreground)', bg: 'var(--muted)' },
  negative: { label: 'Negative', color: 'var(--negative)', bg: 'color-mix(in oklch, var(--negative) 16%, transparent)' },
}

function Trait({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export function CitizenPanel({
  citizen,
  onClose,
  showReaction,
}: {
  citizen: Citizen
  onClose: () => void
  showReaction?: boolean
}) {
  const p = citizen.palette
  return (
    <aside className="flex h-full w-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
      {/* header */}
      <div className="relative shrink-0 bg-gradient-to-br from-primary to-[oklch(0.7_0.16_265)] px-5 pb-5 pt-5 text-primary-foreground">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/20 text-primary-foreground transition hover:bg-white/30"
          aria-label="Close citizen details"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3">
          {/* avatar */}
          <div className="relative h-16 w-14 shrink-0">
            <div className="absolute bottom-3 left-1/2 h-9 w-11 -translate-x-1/2 rounded-t-2xl" style={{ background: p.top }} />
            <div className="absolute bottom-8 left-1/2 h-8 w-8 -translate-x-1/2 rounded-2xl" style={{ background: p.skin }} />
            <div className="absolute bottom-[3.15rem] left-1/2 h-4 w-9 -translate-x-1/2 rounded-t-2xl" style={{ background: p.hair }} />
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-xl font-700 leading-tight">{citizen.name}</h2>
            <p className="text-sm text-primary-foreground/80">
              {citizen.age} · {citizen.segment}
            </p>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold">
              {citizen.moodEmoji} {citizen.mood}
            </span>
          </div>
        </div>
      </div>

      {/* body */}
      <div className="vs-scrollbar min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-4">
        <div className="flex flex-col gap-2 text-sm">
          <span className="inline-flex items-center gap-2 text-foreground">
            <Briefcase className="h-4 w-4 text-muted-foreground" /> {citizen.job}
          </span>
          <span className="inline-flex items-center gap-2 text-foreground">
            <MapPin className="h-4 w-4 text-muted-foreground" /> {citizen.neighborhood}
          </span>
        </div>

        {showReaction && (
          <ReactionCard citizen={citizen} />
        )}

        <section>
          <h3 className="mb-2 font-display text-sm font-600 text-foreground">Personality</h3>
          <div className="space-y-2.5">
            <Trait label="Openness" value={citizen.personality.openness} />
            <Trait label="Extraversion" value={citizen.personality.extraversion} />
            <Trait label="Agreeableness" value={citizen.personality.agreeableness} />
            <Trait label="Risk tolerance" value={citizen.personality.riskTolerance} />
          </div>
        </section>

        <section>
          <h3 className="mb-2 flex items-center gap-1.5 font-display text-sm font-600 text-foreground">
            <Heart className="h-3.5 w-3.5 text-muted-foreground" /> Interests
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {citizen.interests.map((it) => (
              <span key={it} className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                {it}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 font-display text-sm font-600 text-foreground">Life story</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{citizen.lifeStory}</p>
        </section>

        <section>
          <h3 className="mb-2 font-display text-sm font-600 text-foreground">Today&apos;s activity</h3>
          <ol className="relative space-y-3 border-l-2 border-border pl-4">
            {citizen.activity.map((a, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[1.32rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-card bg-primary" />
                <div className="text-xs font-semibold text-foreground">{a.time}</div>
                <div className="text-sm text-muted-foreground">{a.text}</div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </aside>
  )
}

function ReactionCard({ citizen }: { citizen: Citizen }) {
  const before = OPINION_META[citizen.initialOpinion]
  const after = OPINION_META[citizen.finalOpinion]
  const changed = citizen.initialOpinion !== citizen.finalOpinion
  return (
    <section className="rounded-2xl border border-border bg-secondary/50 p-3">
      <h3 className="mb-2 font-display text-sm font-600 text-foreground">Reaction to experiment</h3>
      <div className="flex items-center gap-2">
        <span
          className="rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ color: before.color, background: before.bg }}
        >
          {before.label}
        </span>
        <span className="text-muted-foreground">→</span>
        <span
          className="rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ color: after.color, background: after.bg }}
        >
          {after.label}
        </span>
        {changed && (
          <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
            CHANGED
          </span>
        )}
      </div>
      {citizen.changeReason && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{citizen.changeReason}</p>
      )}
    </section>
  )
}
