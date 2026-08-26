import type { GridPoint } from './vs-types'

// 2:1 isometric projection constants
export const TILE_W = 36 // half tile width
export const TILE_H = 18 // half tile height
export const UNIT_H = 26 // pixels per height tile

export const GRID = 14
export const ROAD_LINES = [2, 7, 12]

// world pixel size + origin offset so all coords are positive
export const WORLD_W = (GRID + 1) * 2 * TILE_W
export const ORIGIN_X = WORLD_W / 2
export const ORIGIN_Y = 5 * UNIT_H
export const WORLD_H = (GRID + 1) * 2 * TILE_H + ORIGIN_Y + 2 * UNIT_H

export function isoX(gx: number, gy: number) {
  return ORIGIN_X + (gx - gy) * TILE_W
}
export function isoY(gx: number, gy: number) {
  return ORIGIN_Y + (gx + gy) * TILE_H
}
export function depth(gx: number, gy: number) {
  return gx + gy
}

// total length of a closed polyline route (in grid units)
export function routeLength(pts: GridPoint[]) {
  let len = 0
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]
    const b = pts[(i + 1) % pts.length]
    len += Math.hypot(b.gx - a.gx, b.gy - a.gy)
  }
  return len
}

// position along a closed route given a distance d (grid units)
export function pointAt(pts: GridPoint[], d: number): GridPoint {
  const total = routeLength(pts)
  let dist = ((d % total) + total) % total
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]
    const b = pts[(i + 1) % pts.length]
    const seg = Math.hypot(b.gx - a.gx, b.gy - a.gy)
    if (dist <= seg) {
      const t = seg === 0 ? 0 : dist / seg
      return { gx: a.gx + (b.gx - a.gx) * t, gy: a.gy + (b.gy - a.gy) * t }
    }
    dist -= seg
  }
  return pts[0]
}
