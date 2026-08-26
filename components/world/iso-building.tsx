'use client'

import type { Building } from '@/lib/vs-types'
import { isoX, isoY, UNIT_H, depth } from '@/lib/vs-iso'

type Pt = { x: number; y: number }

const COLORS: Record<
  Building['type'],
  { top: string; left: string; right: string; win?: string; accent?: string }
> = {
  house: { top: '#e0684a', left: '#f0dcb8', right: '#d9c199', accent: '#c14f36' },
  apartment: { top: '#8aa0c8', left: '#dfe7f2', right: '#c2cee2', win: '#8fd3ff' },
  office: { top: '#7d93b8', left: '#cad7ea', right: '#adbdd6', win: '#7fbff5' },
  cafe: { top: '#b5744a', left: '#f6d9b0', right: '#e6c393', accent: '#e05b5b' },
  supermarket: { top: '#c9d3dd', left: '#eef1f4', right: '#d6dde4', accent: '#3bb273', win: '#bfe6ff' },
  park: { top: '#7cc36a', left: '#63aa54', right: '#5aa04d' },
  tree: { top: '#5bb85b', left: '#4fa84f', right: '#469646' },
}

function lerp(a: Pt, b: Pt, t: number): Pt {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }
}
function poly(pts: Pt[], ox: number, oy: number) {
  return pts.map((p) => `${(p.x - ox).toFixed(1)},${(p.y - oy).toFixed(1)}`).join(' ')
}

export function IsoBuilding({
  b,
  selected,
  onSelect,
  onHover,
}: {
  b: Building
  selected?: boolean
  onSelect?: (b: Building) => void
  onHover?: (b: Building | null) => void
}) {
  const c = COLORS[b.type]
  const hpx = b.h * UNIT_H

  // footprint corners (buildings sit between road tiles; -0.5 to align to cell edges)
  const gx = b.gx - 0.5
  const gy = b.gy - 0.5
  const gx2 = b.gx + b.w - 0.5
  const gy2 = b.gy + b.d - 0.5

  const A: Pt = { x: isoX(gx, gy), y: isoY(gx, gy) } // back
  const B: Pt = { x: isoX(gx2, gy), y: isoY(gx2, gy) } // right
  const C: Pt = { x: isoX(gx2, gy2), y: isoY(gx2, gy2) } // front
  const D: Pt = { x: isoX(gx, gy2), y: isoY(gx, gy2) } // left

  const At = { x: A.x, y: A.y - hpx }
  const Bt = { x: B.x, y: B.y - hpx }
  const Ct = { x: C.x, y: C.y - hpx }
  const Dt = { x: D.x, y: D.y - hpx }

  const allPts = [A, B, C, D, At, Bt, Ct, Dt]
  const ox = Math.min(...allPts.map((p) => p.x)) - 6
  const oy = Math.min(...allPts.map((p) => p.y)) - 6
  const w = Math.max(...allPts.map((p) => p.x)) - ox + 6
  const h = Math.max(...allPts.map((p) => p.y)) - oy + 6

  // ---- trees are drawn specially ----
  if (b.type === 'tree') {
    const base: Pt = { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 }
    const th = hpx
    return (
      <div
        style={{
          position: 'absolute',
          left: base.x - 26,
          top: base.y - th - 22,
          width: 52,
          height: th + 44,
          zIndex: Math.round(depth(b.gx, b.gy) * 10) + 2,
          pointerEvents: 'none',
        }}
        aria-hidden
      >
        <div
          style={{
            position: 'absolute',
            left: 23,
            bottom: 12,
            width: 6,
            height: th,
            background: '#8a5a2b',
            borderRadius: 3,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 6,
            bottom: 12 + th - 14,
            width: 40,
            height: 40,
            background: 'radial-gradient(circle at 35% 30%, #7ed07e, #49a349)',
            borderRadius: '46% 54% 50% 50% / 55% 55% 45% 45%',
            boxShadow: '0 6px 10px rgba(30,60,20,0.18)',
            transformOrigin: 'bottom center',
            animation: `vs-tree-sway ${3 + (b.gx + b.gy) % 3 * 0.5}s ease-in-out infinite`,
          }}
        />
      </div>
    )
  }

  // ---- windows on office / apartment walls ----
  const windows: { pts: Pt[]; face: 'l' | 'r' }[] = []
  if ((b.type === 'office' || b.type === 'apartment') && c.win) {
    const rows = Math.max(1, Math.round(b.h * 1.1))
    const makeFace = (
      bl: Pt,
      br: Pt,
      tl: Pt,
      tr: Pt,
      cols: number,
      face: 'l' | 'r',
    ) => {
      for (let r = 0; r < rows; r++) {
        for (let col = 0; col < cols; col++) {
          const u0 = (col + 0.28) / cols
          const u1 = (col + 0.72) / cols
          const v0 = (r + 0.32) / rows
          const v1 = (r + 0.74) / rows
          const p = (u: number, v: number) =>
            lerp(lerp(bl, br, u), lerp(tl, tr, u), v)
          windows.push({
            pts: [p(u0, v0), p(u1, v0), p(u1, v1), p(u0, v1)],
            face,
          })
        }
      }
    }
    // left face: D(bl)->C(br), tops Dt(tl)->Ct(tr)
    makeFace(D, C, Dt, Ct, Math.max(1, Math.round(b.w + b.d)), 'l')
    // right face: C(bl)->B(br), tops Ct(tl)->Bt(tr)
    makeFace(C, B, Ct, Bt, Math.max(1, Math.round(b.w + b.d)), 'r')
  }

  const strokeSel = selected ? '#3b6bf0' : 'none'

  return (
    <div
      style={{
        position: 'absolute',
        left: ox,
        top: oy,
        width: w,
        height: h,
        zIndex: Math.round(depth(b.gx + b.w, b.gy + b.d) * 10) + 1,
        cursor: b.label ? 'pointer' : 'default',
        filter: selected
          ? 'drop-shadow(0 0 6px rgba(59,107,240,0.7))'
          : 'drop-shadow(0 8px 8px rgba(30,40,70,0.14))',
        transition: 'filter 0.2s',
      }}
      onClick={() => b.label && onSelect?.(b)}
      onMouseEnter={() => b.label && onHover?.(b)}
      onMouseLeave={() => b.label && onHover?.(null)}
      role={b.label ? 'button' : undefined}
      aria-label={b.label}
    >
      <svg width={w} height={h} style={{ overflow: 'visible' }}>
        {/* left / south wall */}
        <polygon points={poly([D, C, Ct, Dt], ox, oy)} fill={c.left} />
        {/* right / east wall */}
        <polygon points={poly([C, B, Bt, Ct], ox, oy)} fill={c.right} />
        {/* windows */}
        {windows.map((win, i) => (
          <polygon
            key={i}
            points={poly(win.pts, ox, oy)}
            fill={c.win}
            opacity={win.face === 'r' ? 0.78 : 0.95}
          />
        ))}
        {/* storefront band */}
        {c.accent && (b.type === 'cafe' || b.type === 'supermarket') && (
          <polygon
            points={poly(
              [D, C, lerp(C, Ct, 0.32), lerp(D, Dt, 0.32)],
              ox,
              oy,
            )}
            fill={c.accent}
            opacity={0.9}
          />
        )}
        {/* house door + window on left wall */}
        {b.type === 'house' && (
          <>
            <polygon
              points={poly(
                [
                  lerp(lerp(D, C, 0.3), lerp(Dt, Ct, 0.3), 0),
                  lerp(lerp(D, C, 0.55), lerp(Dt, Ct, 0.55), 0),
                  lerp(lerp(D, C, 0.55), lerp(Dt, Ct, 0.55), 0.55),
                  lerp(lerp(D, C, 0.3), lerp(Dt, Ct, 0.3), 0.55),
                ],
                ox,
                oy,
              )}
              fill={c.accent}
            />
          </>
        )}
        {/* top / roof */}
        <polygon
          points={poly([At, Bt, Ct, Dt], ox, oy)}
          fill={c.top}
          stroke={strokeSel}
          strokeWidth={selected ? 2 : 0}
        />
      </svg>
    </div>
  )
}
