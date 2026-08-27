'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Building, Citizen, Neighborhood } from '@/lib/vs-types'
import {
  GRID,
  ORIGIN_X,
  ORIGIN_Y,
  ROAD_LINES,
  TILE_H,
  TILE_W,
  UNIT_H,
  WORLD_H,
  WORLD_W,
  depth,
  isoX,
  isoY,
  pointAt,
} from '@/lib/vs-iso'
import { BILLBOARDS, BUILDINGS, BICYCLE_ROUTES, CAR_ROUTES, PROPS, ROUTES } from '@/lib/vs-data'
import { IsoBuilding } from './iso-building'
import { IsoProp } from './iso-prop'
import { Minus, Plus, Locate } from 'lucide-react'

export type Thought = { text: string; key: number; tone?: 'pos' | 'neg' | 'neu' }

const BASE_SPEED = 1.15 // grid units / second at 1x
const CAR_COLORS = ['#3b6bf0', '#ef4444', '#f59e0b', '#10b981']
const BIKE_COLORS = ['#10b981', '#f59e0b']

const ZONE_COLOR: Record<Neighborhood['zone'], string> = {
  positive: 'rgba(52,199,120,0.42)',
  mixed: 'rgba(245,180,60,0.42)',
  negative: 'rgba(239,80,80,0.42)',
}

export function IsoWorld({
  citizens,
  selectedCitizenId,
  onSelectCitizen,
  selectedBuildingId,
  onSelectBuilding,
  speed,
  campaign,
  thoughts = {},
  showConversations = false,
  heatmap,
  neighborhoods = [],
  interactive = true,
  experimentLive = false,
  liveStats,
}: {
  citizens: Citizen[]
  selectedCitizenId?: string | null
  onSelectCitizen?: (c: Citizen) => void
  selectedBuildingId?: string | null
  onSelectBuilding?: (b: Building) => void
  speed: number
  campaign?: { title: string } | null
  thoughts?: Record<string, Thought>
  showConversations?: boolean
  heatmap?: boolean
  neighborhoods?: Neighborhood[]
  interactive?: boolean
  experimentLive?: boolean
  liveStats?: { positive: number; considering: number; neutral: number; negative: number; exposed: number; conversations: number; changed: number }
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const spriteRefs = useRef<(HTMLDivElement | null)[]>([])
  const carRefs = useRef<(HTMLDivElement | null)[]>([])
  const bikeRefs = useRef<(HTMLDivElement | null)[]>([])
  const lineRefs = useRef<(SVGLineElement | null)[]>([])
  const distRef = useRef<number[]>([])
  const carDistRef = useRef<number[]>([])
  const bikeDistRef = useRef<number[]>([])
  const posRef = useRef<{ x: number; y: number }[]>([])
  const speedRef = useRef(speed)
  const convRef = useRef(showConversations)

  const [scale, setScale] = useState(0.9)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  speedRef.current = speed
  convRef.current = showConversations

  // conversation pairs (fixed indices, drawn only when active)
  const convPairs = useRef<[number, number][]>([
    [0, 2],
    [4, 5],
    [8, 3],
    [15, 1],
    [10, 20],
    [12, 19],
  ]).current

  // init distances
  if (distRef.current.length !== citizens.length) {
    distRef.current = citizens.map((c) => c.phase * 40 + Math.random() * 3)
    posRef.current = citizens.map(() => ({ x: 0, y: 0 }))
  }
  if (carDistRef.current.length !== CAR_ROUTES.length) {
    carDistRef.current = CAR_ROUTES.map((_, i) => i * 9)
  }
  if (bikeDistRef.current.length !== BICYCLE_ROUTES.length) {
    bikeDistRef.current = BICYCLE_ROUTES.map((_, i) => i * 14)
  }

  // fit to viewport
  useLayoutEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const fit = () => {
      const cw = el.clientWidth
      const ch = el.clientHeight
      const s = Math.min(cw / WORLD_W, ch / WORLD_H) * 1.08
      setScale(s)
      setPan({ x: (cw - WORLD_W * s) / 2, y: (ch - WORLD_H * s) / 2 })
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // animation loop
  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000)
      last = t
      const spd = speedRef.current
      for (let i = 0; i < citizens.length; i++) {
        const cz = citizens[i]
        let x: number, y: number
        if (cz.behavior === 'sit' && cz.fixedGx != null && cz.fixedGy != null) {
          x = isoX(cz.fixedGx, cz.fixedGy)
          y = isoY(cz.fixedGx, cz.fixedGy)
        } else {
          distRef.current[i] += dt * BASE_SPEED * cz.speed * spd
          const p = pointAt(ROUTES[cz.route], distRef.current[i])
          x = isoX(p.gx, p.gy)
          y = isoY(p.gx, p.gy)
        }
        posRef.current[i] = { x, y }
        const el = spriteRefs.current[i]
        if (el) {
          el.style.transform = `translate3d(${x - 15}px, ${y - 46}px, 0)`
          el.style.zIndex = String(Math.round(depth(cz.fixedGx ?? 0, cz.fixedGy ?? 0) * 10) + 5)
        }
      }
      for (let i = 0; i < CAR_ROUTES.length; i++) {
        carDistRef.current[i] += dt * BASE_SPEED * 2.1 * spd
        const p = pointAt(ROUTES[CAR_ROUTES[i]], carDistRef.current[i])
        const x = isoX(p.gx, p.gy)
        const y = isoY(p.gx, p.gy)
        const el = carRefs.current[i]
        if (el) {
          el.style.transform = `translate3d(${x - 17}px, ${y - 20}px, 0)`
          el.style.zIndex = String(Math.round(depth(p.gx, p.gy) * 10) + 4)
        }
      }
      for (let i = 0; i < BICYCLE_ROUTES.length; i++) {
        bikeDistRef.current[i] += dt * BASE_SPEED * 1.4 * spd
        const p = pointAt(ROUTES[BICYCLE_ROUTES[i]], bikeDistRef.current[i])
        const x = isoX(p.gx, p.gy)
        const y = isoY(p.gx, p.gy)
        const el = bikeRefs.current[i]
        if (el) {
          el.style.transform = `translate3d(${x - 10}px, ${y - 16}px, 0)`
          el.style.zIndex = String(Math.round(depth(p.gx, p.gy) * 10) + 4)
        }
      }
      if (convRef.current) {
        for (let i = 0; i < convPairs.length; i++) {
          const [a, b] = convPairs[i]
          const pa = posRef.current[a]
          const pb = posRef.current[b]
          const ln = lineRefs.current[i]
          if (ln && pa && pb) {
            ln.setAttribute('x1', String(pa.x))
            ln.setAttribute('y1', String(pa.y - 26))
            ln.setAttribute('x2', String(pb.x))
            ln.setAttribute('y2', String(pb.y - 26))
          }
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [citizens, convPairs])

  // ---- pan / zoom ----
  const drag = useRef<{ active: boolean; sx: number; sy: number; px: number; py: number; moved: boolean }>(
    { active: false, sx: 0, sy: 0, px: 0, py: 0, moved: false },
  )

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!interactive) return
      drag.current = { active: true, sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y, moved: false }
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    },
    [interactive, pan],
  )
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!drag.current.active) return
    const dx = e.clientX - drag.current.sx
    const dy = e.clientY - drag.current.sy
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.current.moved = true
    setPan({ x: drag.current.px + dx, y: drag.current.py + dy })
  }, [])
  const onPointerUp = useCallback(() => {
    drag.current.active = false
  }, [])

  const zoomBy = useCallback(
    (factor: number) => {
      const el = viewportRef.current
      if (!el) return
      const cw = el.clientWidth
      const ch = el.clientHeight
      setScale((s) => {
        const ns = Math.max(0.45, Math.min(2.4, s * factor))
        setPan((p) => {
          const cx = cw / 2
          const cy = ch / 2
          const wx = (cx - p.x) / s
          const wy = (cy - p.y) / s
          return { x: cx - wx * ns, y: cy - wy * ns }
        })
        return ns
      })
    },
    [],
  )

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!interactive) return
      zoomBy(e.deltaY < 0 ? 1.12 : 0.9)
    },
    [interactive, zoomBy],
  )

  const recenter = useCallback(() => {
    const el = viewportRef.current
    if (!el) return
    const cw = el.clientWidth
    const ch = el.clientHeight
    const s = Math.min(cw / WORLD_W, ch / WORLD_H) * 1.08
    setScale(s)
    setPan({ x: (cw - WORLD_W * s) / 2, y: (ch - WORLD_H * s) / 2 })
  }, [])

  // ground tiles
  const tiles: React.ReactElement[] = []
  for (let i = 0; i <= GRID; i++) {
    for (let j = 0; j <= GRID; j++) {
      const isRoad = ROAD_LINES.includes(i) || ROAD_LINES.includes(j)
      const x = isoX(i, j)
      const y = isoY(i, j)
      const grass = (i + j) % 2 === 0 ? '#a6db88' : '#9bd07a'
      tiles.push(
        <div
          key={`t-${i}-${j}`}
          style={{
            position: 'absolute',
            left: x - TILE_W,
            top: y - TILE_H,
            width: TILE_W * 2,
            height: TILE_H * 2,
            background: isRoad ? '#8b93a1' : grass,
            clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
          }}
        />,
      )
    }
  }

  return (
    <div
      ref={viewportRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onWheel={onWheel}
      className="relative h-full w-full overflow-hidden"
      style={{
        touchAction: 'none',
        cursor: interactive ? 'grab' : 'default',
        background:
          'linear-gradient(180deg, oklch(0.9 0.06 235) 0%, oklch(0.86 0.07 220) 55%, oklch(0.88 0.08 150) 100%)',
      }}
    >
      {/* drifting clouds */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {[
          { top: '10%', left: '12%', s: 1 },
          { top: '18%', left: '62%', s: 1.3 },
          { top: '6%', left: '40%', s: 0.8 },
        ].map((cl, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: cl.top,
              left: cl.left,
              width: 120 * cl.s,
              height: 40 * cl.s,
              background: 'rgba(255,255,255,0.55)',
              borderRadius: 999,
              filter: 'blur(6px)',
              animation: `vs-cloud ${18 + i * 6}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* camera */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: WORLD_W,
          height: WORLD_H,
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        {/* ground */}
        <div style={{ position: 'absolute', inset: 0 }}>{tiles}</div>

        {/* soft ground shadow disc */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: ORIGIN_X - WORLD_W * 0.32,
            top: ORIGIN_Y + (GRID / 2) * 2 * TILE_H - WORLD_H * 0.2,
            width: WORLD_W * 0.64,
            height: WORLD_H * 0.4,
            background: 'radial-gradient(ellipse at center, rgba(20,40,20,0.12), transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* heatmap zone glows */}
        {heatmap &&
          neighborhoods.map((n) => (
            <div
              key={n.id}
              style={{
                position: 'absolute',
                left: isoX(n.cx, n.cy) - 150,
                top: isoY(n.cx, n.cy) - 110,
                width: 300,
                height: 220,
                background: `radial-gradient(ellipse at center, ${ZONE_COLOR[n.zone]}, transparent 68%)`,
                pointerEvents: 'none',
                zIndex: 999,
                mixBlendMode: 'multiply',
              }}
            />
          ))}

        {/* buildings */}
        {BUILDINGS.map((b) => (
          <IsoBuilding
            key={b.id}
            b={b}
            selected={selectedBuildingId === b.id}
            onSelect={onSelectBuilding}
          />
        ))}

        {/* decorative props */}
        {PROPS.map((p) => (
          <IsoProp key={p.id} p={p} />
        ))}

        {/* billboards */}
        {BILLBOARDS.map((p, i) => {
          const x = isoX(p.gx, p.gy)
          const y = isoY(p.gx, p.gy)
          const active = !!campaign
          return (
            <div
              key={`bb-${i}`}
              style={{
                position: 'absolute',
                left: x - 34,
                top: y - 96,
                width: 68,
                zIndex: Math.round(depth(p.gx, p.gy) * 10) + 6,
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  width: 68,
                  height: 46,
                  borderRadius: 8,
                  background: active
                    ? 'linear-gradient(135deg, #3b6bf0, #6d9bff)'
                    : 'linear-gradient(135deg, #eef1f6, #dfe5ee)',
                  color: active ? '#fff' : '#9aa4b4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  fontSize: active ? 8 : 11,
                  fontWeight: 800,
                  letterSpacing: active ? 0 : 1,
                  lineHeight: 1.05,
                  padding: 4,
                  border: active ? '2px solid rgba(255,255,255,0.8)' : '2px solid #cbd3df',
                  boxShadow: '0 3px 6px rgba(30,45,80,0.18)',
                  animation: active ? 'vs-billboard-glow 2s ease-in-out infinite' : undefined,
                }}
              >
                {active ? campaign?.title ?? 'AD' : 'AD'}
              </div>
              <div style={{ width: 5, height: 40, background: '#7a828f', margin: '0 auto', borderRadius: 2 }} />
            </div>
          )
        })}

        {/* conversation lines */}
        {showConversations && (
          <svg
            width={WORLD_W}
            height={WORLD_H}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'visible' }}
          >
            {convPairs.map((_, i) => (
              <line
                key={i}
                ref={(el) => {
                  lineRefs.current[i] = el
                }}
                stroke="#3b6bf0"
                strokeWidth={2}
                strokeDasharray="4 4"
                strokeLinecap="round"
                opacity={0.55}
                style={{ animation: `vs-convo ${2.4 + (i % 3) * 0.5}s linear infinite` }}
              />
            ))}
          </svg>
        )}

        {/* cars */}
        {CAR_ROUTES.map((_, i) => (
          <div
            key={`car-${i}`}
            ref={(el) => {
              carRefs.current[i] = el
            }}
            style={{ position: 'absolute', left: 0, top: 0, width: 34, height: 24, willChange: 'transform' }}
            aria-hidden
          >
            <div
              style={{
                width: 30,
                height: 15,
                background: CAR_COLORS[i % CAR_COLORS.length],
                borderRadius: '7px 7px 5px 5px',
                boxShadow: '0 4px 5px rgba(20,30,60,0.25)',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -6,
                  left: 6,
                  width: 16,
                  height: 9,
                  background: 'rgba(255,255,255,0.85)',
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        ))}

        {/* bicycles */}
        {BICYCLE_ROUTES.map((_, i) => (
          <div
            key={`bike-${i}`}
            ref={(el) => {
              bikeRefs.current[i] = el
            }}
            style={{ position: 'absolute', left: 0, top: 0, width: 20, height: 16, willChange: 'transform' }}
            aria-hidden
          >
            <div style={{ position: 'relative', width: 20, height: 16 }}>
              <div style={{ position: 'absolute', bottom: 0, left: 1, width: 8, height: 8, border: `2px solid ${BIKE_COLORS[i % BIKE_COLORS.length]}`, borderRadius: '50%' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 1, width: 8, height: 8, border: `2px solid ${BIKE_COLORS[i % BIKE_COLORS.length]}`, borderRadius: '50%' }} />
              <div style={{ position: 'absolute', bottom: 4, left: 8, width: 2, height: 8, background: '#6b7280', transform: 'rotate(20deg)' }} />
            </div>
          </div>
        ))}

        {/* citizens */}
        {citizens.map((cz, i) => {
          const selected = selectedCitizenId === cz.id
          const th = thoughts[cz.id]
          const moving = speed > 0
          return (
            <div
              key={cz.id}
              ref={(el) => {
                spriteRefs.current[i] = el
              }}
              className="group"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 30,
                height: 46,
                willChange: 'transform',
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.stopPropagation()
                if (!drag.current.moved) onSelectCitizen?.(cz)
              }}
            >
              {/* shadow */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -3,
                  left: 5,
                  width: 20,
                  height: 7,
                  background: 'rgba(20,30,20,0.22)',
                  borderRadius: '50%',
                  filter: 'blur(1px)',
                }}
              />
              {/* conversation pulse */}
              {showConversations && i % 3 === 0 && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: -2,
                    left: 7,
                    width: 16,
                    height: 8,
                    border: '2px solid rgba(59,107,240,0.5)',
                    borderRadius: '50%',
                    animation: 'vs-pulse-ring 2s ease-out infinite',
                  }}
                />
              )}

              {/* selection ring */}
              {selected && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: -5,
                    left: 2,
                    width: 26,
                    height: 11,
                    border: '2px solid #3b6bf0',
                    borderRadius: '50%',
                    boxShadow: '0 0 8px rgba(59,107,240,0.7)',
                  }}
                />
              )}

              {/* body */}
              {cz.behavior === 'sit' ? (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 3,
                    left: 4,
                    width: 22,
                    height: 30,
                    animation: 'vs-bob 2.4s ease-in-out infinite',
                    animationPlayState: moving ? 'running' : 'paused',
                  }}
                >
                  <div style={{ position: 'absolute', bottom: 0, left: 2, width: 18, height: 8, background: cz.palette.bottom, borderRadius: 3 }} />
                  <div style={{ position: 'absolute', bottom: 6, left: 3, width: 16, height: 14, background: cz.palette.top, borderRadius: 5 }} />
                  <div style={{ position: 'absolute', bottom: 18, left: 4, width: 13, height: 13, background: cz.palette.skin, borderRadius: 5 }} />
                  <div style={{ position: 'absolute', bottom: 27, left: 3, width: 15, height: 6, background: cz.palette.hair, borderRadius: '6px 6px 3px 3px' }} />
                </div>
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 3,
                    left: 3,
                    width: 24,
                    height: 40,
                    animation: 'vs-bob 0.9s ease-in-out infinite',
                    animationPlayState: moving ? 'running' : 'paused',
                  }}
                >
                  {/* legs */}
                  <div style={{ position: 'absolute', bottom: 0, left: 4, width: 6, height: 12, background: cz.palette.bottom, borderRadius: 2 }} />
                  <div style={{ position: 'absolute', bottom: 0, right: 4, width: 6, height: 12, background: cz.palette.bottom, borderRadius: 2 }} />
                  {/* torso */}
                  <div style={{ position: 'absolute', bottom: 10, left: 2, width: 20, height: 16, background: cz.palette.top, borderRadius: 5 }} />
                  {/* head */}
                  <div style={{ position: 'absolute', bottom: 22, left: 5, width: 14, height: 14, background: cz.palette.skin, borderRadius: 5 }} />
                  {/* hair */}
                  <div style={{ position: 'absolute', bottom: 31, left: 4, width: 16, height: 7, background: cz.palette.hair, borderRadius: '6px 6px 3px 3px' }} />
                </div>
              )}

              {/* hover name */}
              <div
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-card px-2 py-1 text-[10px] font-semibold text-card-foreground opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
                style={{ bottom: 50, zIndex: 20 }}
              >
                {cz.name}, {cz.age}
                <span className="block text-[9px] font-normal text-muted-foreground">{cz.job}</span>
                <span className="block text-[9px] font-normal text-muted-foreground">{cz.moodEmoji} {cz.mood}</span>
              </div>

              {/* thought bubble */}
              {th && (
                <div
                  key={th.key}
                  className="pointer-events-none absolute left-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-md"
                  style={{
                    bottom: 48,
                    zIndex: 25,
                    animation: 'vs-float-up 3.4s ease-out forwards',
                    background:
                      th.tone === 'pos' ? '#e6f7ee' : th.tone === 'neg' ? '#fdecec' : '#eef2fb',
                    color:
                      th.tone === 'pos' ? '#0f7a44' : th.tone === 'neg' ? '#b42318' : '#2547a8',
                    border: '1px solid rgba(0,0,0,0.05)',
                  }}
                >
                  {th.text}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* EXPERIMENT LIVE badge */}
      {experimentLive && (
        <div className="pointer-events-none absolute left-1/2 top-16 z-30 -translate-x-1/2 sm:top-20">
          <div
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-primary/30 bg-card/90 px-3.5 py-1.5 shadow-lg backdrop-blur"
            style={{ animation: 'vs-live-pulse 2s ease-out infinite' }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
            <span className="font-display text-xs font-700 tracking-wide text-primary">EXPERIMENT LIVE</span>
          </div>
        </div>
      )}

      {/* live reaction overlay */}
      {experimentLive && liveStats && (
        <div className="pointer-events-none absolute left-3 top-1/2 z-30 hidden -translate-y-1/2 sm:block">
          <div className="pointer-events-auto w-44 rounded-2xl border border-border bg-card/90 p-3 shadow-lg backdrop-blur">
            <div className="mb-2 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="font-display text-[11px] font-700 tracking-wide text-foreground">LIVE REACTIONS</span>
            </div>
            <div className="space-y-1.5">
              <LiveRow emoji="❤️" label="Positive" value={liveStats.positive} color="var(--positive)" />
              <LiveRow emoji="🤔" label="Considering" value={liveStats.considering} color="var(--considering)" />
              <LiveRow emoji="😐" label="Neutral" value={liveStats.neutral} color="var(--muted-foreground)" />
              <LiveRow emoji="👎" label="Negative" value={liveStats.negative} color="var(--negative)" />
            </div>
            <div className="mt-2.5 space-y-1 border-t border-border pt-2 text-[10px] text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Exposed</span>
                <span className="font-bold tabular-nums text-foreground" key={liveStats.exposed}>{liveStats.exposed.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Conversations</span>
                <span className="font-bold tabular-nums text-foreground" key={`c${liveStats.conversations}`}>{liveStats.conversations.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Opinions changed</span>
                <span className="font-bold tabular-nums text-foreground" key={`o${liveStats.changed}`}>{liveStats.changed.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* zoom controls */}
      {interactive && (
        <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-1.5">
          <button
            onClick={() => zoomBy(1.2)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card/90 text-card-foreground shadow-md backdrop-blur transition hover:bg-card hover:scale-105"
            aria-label="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => zoomBy(0.83)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card/90 text-card-foreground shadow-md backdrop-blur transition hover:bg-card hover:scale-105"
            aria-label="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            onClick={recenter}
            className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card/90 text-card-foreground shadow-md backdrop-blur transition hover:bg-card hover:scale-105"
            aria-label="Recenter"
          >
            <Locate className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}

function LiveRow({ emoji, label, value, color }: { emoji: string; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[11px]">
      <span>{emoji}</span>
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto font-bold tabular-nums" style={{ color }} key={value}>
        {value}%
      </span>
    </div>
  )
}
