'use client'

import { useState } from 'react'
import { X, Megaphone, Package, CalendarDays, ArrowRight } from 'lucide-react'

export type Experiment = {
  kind: 'ad' | 'product' | 'event'
  title: string
  message: string
}

const KINDS = [
  {
    id: 'ad' as const,
    icon: Megaphone,
    label: 'Advertisement',
    desc: 'Run a campaign across the city',
    placeholder: 'The new Volt EV — smart, electric, and finally affordable.',
    titlePh: 'Volt EV Launch',
  },
  {
    id: 'product' as const,
    icon: Package,
    label: 'Product',
    desc: 'Introduce something new to buy',
    placeholder: 'A $199 smart water bottle that tracks your hydration.',
    titlePh: 'HydroSmart Bottle',
  },
  {
    id: 'event' as const,
    icon: CalendarDays,
    label: 'Event',
    desc: 'Stage a happening in the world',
    placeholder: 'A free weekend music festival in the city park.',
    titlePh: 'Harbor Music Fest',
  },
]

const PRESETS: Record<Experiment['kind'], { title: string; message: string }> = {
  ad: { title: 'Volt EV Launch', message: 'The new Volt EV — smart, electric, and finally affordable at $24,900.' },
  product: { title: 'HydroSmart Bottle', message: 'A $199 smart water bottle that tracks your hydration all day.' },
  event: { title: 'Harbor Music Fest', message: 'A free weekend music festival in the city park with 20 live acts.' },
}

export function ExperimentModal({
  onClose,
  onRun,
}: {
  onClose: () => void
  onRun: (e: Experiment) => void
}) {
  const [kind, setKind] = useState<Experiment['kind']>('ad')
  const [title, setTitle] = useState(PRESETS.ad.title)
  const [message, setMessage] = useState(PRESETS.ad.message)

  const active = KINDS.find((k) => k.id === kind)!

  const pick = (k: Experiment['kind']) => {
    setKind(k)
    setTitle(PRESETS[k].title)
    setMessage(PRESETS[k].message)
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-700 text-foreground">Run an experiment</h2>
            <p className="text-xs text-muted-foreground">See how your society reacts in real time</p>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-secondary-foreground transition hover:brightness-95"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="grid grid-cols-3 gap-2">
            {KINDS.map((k) => {
              const Icon = k.icon
              const on = kind === k.id
              return (
                <button
                  key={k.id}
                  onClick={() => pick(k.id)}
                  className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-center transition ${
                    on ? 'border-primary bg-primary/10' : 'border-border bg-background hover:border-primary/40'
                  }`}
                >
                  <span className={`grid h-9 w-9 place-items-center rounded-xl ${on ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className={`text-xs font-bold ${on ? 'text-primary' : 'text-foreground'}`}>{k.label}</span>
                </button>
              )
            })}
          </div>

          <div>
            <label htmlFor="exp-title" className="mb-1.5 block text-sm font-600 text-foreground">
              Title
            </label>
            <input
              id="exp-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={active.titlePh}
              className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label htmlFor="exp-msg" className="mb-1.5 block text-sm font-600 text-foreground">
              Message
            </label>
            <textarea
              id="exp-msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={active.placeholder}
              rows={3}
              className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-2.5 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            disabled={!title.trim() || !message.trim()}
            onClick={() => onRun({ kind, title: title.trim(), message: message.trim() })}
            className="group flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-700 text-primary-foreground shadow transition enabled:hover:brightness-105 disabled:opacity-50"
          >
            Launch experiment
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
