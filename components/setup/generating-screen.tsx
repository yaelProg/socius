'use client'

import { useEffect, useState } from 'react'
import type { SocietyConfig } from './setup-screen'
import { Check, Loader2 } from 'lucide-react'

const STEPS = [
  'Laying out neighborhoods & roads',
  'Constructing homes and workplaces',
  'Generating citizens & personalities',
  'Writing life stories',
  'Forming social connections',
  'Bringing the world to life',
]

export function GeneratingScreen({
  config,
  onDone,
}: {
  config: SocietyConfig
  onDone: () => void
}) {
  const [step, setStep] = useState(0)
  const [count, setCount] = useState(0)

  // step ticker
  useEffect(() => {
    if (step >= STEPS.length) {
      const t = setTimeout(onDone, 650)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setStep((s) => s + 1), 700)
    return () => clearTimeout(t)
  }, [step, onDone])

  // population counter
  useEffect(() => {
    const total = config.size
    const start = performance.now()
    const dur = STEPS.length * 700
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.floor(eased * total))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [config.size])

  return (
    <div className="grid min-h-dvh place-items-center bg-gradient-to-b from-[oklch(0.9_0.06_235)] via-background to-[oklch(0.9_0.08_150)] px-5">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="relative mx-auto mb-5 h-20 w-20">
            <div className="absolute inset-0 rounded-3xl bg-primary/20" style={{ animation: 'vs-pulse-ring 2s ease-out infinite' }} />
            <div className="absolute inset-0 grid place-items-center rounded-3xl bg-primary text-primary-foreground shadow-lg">
              <span className="font-display text-3xl font-700">{config.name.charAt(0)}</span>
            </div>
          </div>
          <h2 className="font-display text-2xl font-700 text-foreground">Building {config.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Simulating{' '}
            <span className="font-bold text-primary tabular-nums">{count.toLocaleString()}</span>{' '}
            citizens
          </p>
        </div>

        <ol className="space-y-2.5 rounded-3xl border border-border bg-card/80 p-4 shadow-xl backdrop-blur">
          {STEPS.map((label, i) => {
            const done = i < step
            const active = i === step
            return (
              <li
                key={label}
                className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 transition ${
                  active ? 'bg-primary/10' : ''
                }`}
              >
                <span
                  className={`grid h-6 w-6 shrink-0 place-items-center rounded-full transition ${
                    done
                      ? 'bg-positive text-white'
                      : active
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {done ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : active ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </span>
                <span
                  className={`text-sm transition ${
                    done || active ? 'font-semibold text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {label}
                </span>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
