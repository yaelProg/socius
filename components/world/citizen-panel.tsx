'use client'

import type { Citizen, Opinion, RelationshipType } from '@/lib/vs-types'
import { CITIZENS, activityEmoji } from '@/lib/vs-data'
import { X, MapPin, Briefcase, Heart, ChevronRight } from 'lucide-react'

const OPINION_META: Record<Opinion, { label: string; color: string; bg: string; emoji: string }> = {
  positive: { label: 'Positive', color: 'var(--positive)', bg: 'color-mix(in oklch, var(--positive) 16%, transparent)', emoji: '❤️' },
  considering: { label: 'Considering', color: 'var(--considering)', bg: 'color-mix(in oklch, var(--considering) 16%, transparent)', emoji: '🤔' },
  neutral: { label: 'Neutral', color: 'var(--muted-foreground)', bg: 'var(--muted)', emoji: '😐' },
  negative: { label: 'Negative', color: 'var(--negative)', bg: 'color-mix(in oklch, var(--negative) 16%, transparent)', emoji: '👎' },
}

const REL_META: Record<RelationshipType, { emoji: string; label: string }> = {
  partner: { emoji: '❤️', label: 'Partner' },
  friend: { emoji: '👭', label: 'Friend' },
  coworker: { emoji: '💼', label: 'Coworker' },
  family: { emoji: '👨‍👩‍👧', label: 'Family' },
}

function traitLabel(openness: number, extraversion: number, agreeableness: number, riskTolerance: number) {
  return [
    { label: openness >= 70 ? 'Curious' : openness >= 45 ? 'Balanced' : 'Cautious', value: openness },
    { label: extraversion >= 70 ? 'Social' : extraversion >= 45 ? 'Friendly' : 'Reserved', value: extraversion },
    { label: agreeableness >= 70 ? 'Warm' : agreeableness >= 45 ? 'Fair' : 'Direct', value: agreeableness },
    { label: riskTolerance >= 60 ? 'Risk-taker' : riskTolerance >= 40 ? 'Careful' : 'Price sensitive', value: riskTolerance },
  ]
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
  onSelectCitizen,
}: {
  citizen: Citizen
  onClose: () => void
  showReaction?: boolean
  onSelectCitizen?: (c: Citizen) => void
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
            {traitLabel(citizen.personality.openness, citizen.personality.extraversion, citizen.personality.agreeableness, citizen.personality.riskTolerance).map((t) => (
              <Trait key={t.label} label={t.label} value={t.value} />
            ))}
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
          <h3 className="mb-2 font-display text-sm font-600 text-foreground">Current activity</h3>
          <p className="flex items-center gap-2 rounded-xl bg-secondary/50 px-3 py-2 text-sm font-medium text-foreground">
            <span className="text-base leading-none">{activityEmoji(citizen.currentActivity)}</span>
            {citizen.currentActivity}
          </p>
        </section>

        {citizen.relationships.length > 0 && (
          <section>
            <h3 className="mb-2 font-display text-sm font-600 uppercase tracking-wide text-muted-foreground">
              People in {citizen.name.split(' ')[0]}&apos;s life
            </h3>
            <div className="space-y-1.5">
              {citizen.relationships.map((r, i) => {
                const m = REL_META[r.type]
                const match = CITIZENS.find((c) => c.name === r.name && c.id !== citizen.id)
                const clickable = !!match && !!onSelectCitizen
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!clickable}
                    onClick={() => match && onSelectCitizen?.(match)}
                    className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-left text-sm transition ${
                      clickable
                        ? 'border-border bg-card hover:border-primary/50 hover:bg-secondary/60'
                        : 'cursor-default border-transparent bg-secondary/30'
                    }`}
                  >
                    <span className="text-base leading-none">{m.emoji}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-foreground">{r.name}</span>
                      <span className="block text-xs text-muted-foreground">{m.label}</span>
                    </span>
                    {clickable && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
                  </button>
                )
              })}
            </div>
          </section>
        )}

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

function initialLabel(o: Opinion) {
  return o === 'positive' ? 'Was interested' : o === 'considering' ? 'Was curious' : o === 'negative' ? 'Was skeptical' : 'Was unsure'
}
function finalLabel(o: Opinion) {
  return o === 'positive' ? 'Became interested' : o === 'considering' ? 'Leaning towards yes' : o === 'negative' ? 'Stayed skeptical' : 'Stayed on the fence'
}

function ReactionCard({ citizen }: { citizen: Citizen }) {
  const before = OPINION_META[citizen.initialOpinion]
  const after = OPINION_META[citizen.finalOpinion]
  const changed = citizen.initialOpinion !== citizen.finalOpinion

  // pick a trusted person (partner first, then a friend) for the timeline
  const trusted =
    citizen.relationships.find((r) => r.type === 'partner') ??
    citizen.relationships.find((r) => r.type === 'friend') ??
    citizen.relationships[0]
  const trustedFirst = trusted?.name.split(' ')[0]

  const steps: { label: string; emoji?: string; highlight?: boolean }[] = [
    { label: 'Saw the campaign' },
    { label: initialLabel(citizen.initialOpinion) },
    ...(trustedFirst ? [{ label: `Talked with ${trustedFirst}` }] : []),
    { label: finalLabel(citizen.finalOpinion) },
    { label: after.label, emoji: after.emoji, highlight: true },
  ]

  return (
    <section className="rounded-2xl border border-primary/25 bg-secondary/50 p-3.5">
      <h3 className="mb-3 flex items-center gap-1.5 font-display text-xs font-700 uppercase tracking-wide text-primary">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        Reaction to experiment
      </h3>

      {/* before / campaign / after summary */}
      <div className="mb-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
        <span className="text-muted-foreground">Initial opinion</span>
        <span className="font-semibold text-foreground">{before.emoji} {before.label}</span>
        <span className="text-muted-foreground">Saw campaign</span>
        <span className="font-semibold text-foreground">Day 2</span>
        <span className="text-muted-foreground">Current opinion</span>
        <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: after.color }}>
          {after.emoji} {after.label}
          {changed && (
            <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold text-primary">CHANGED</span>
          )}
        </span>
      </div>

      {citizen.changeReason && (
        <div className="mb-3">
          <div className="text-xs font-600 text-foreground">Why?</div>
          <p className="mt-1 text-sm italic leading-relaxed text-muted-foreground">&ldquo;{citizen.changeReason}&rdquo;</p>
        </div>
      )}

      {/* tiny timeline */}
      <ol className="relative ml-1 border-l-2 border-dashed border-border pl-4">
        {steps.map((s, i) => (
          <li key={i} className={i === steps.length - 1 ? 'relative' : 'relative pb-2.5'}>
            <span
              className="absolute -left-[1.28rem] top-1 h-2.5 w-2.5 rounded-full border-2 border-card"
              style={{ background: s.highlight ? after.color : 'var(--muted-foreground)' }}
            />
            <span className={`text-xs ${s.highlight ? 'font-700 text-foreground' : 'text-muted-foreground'}`}>
              {s.emoji ? `${s.emoji} ` : ''}
              {s.label}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
