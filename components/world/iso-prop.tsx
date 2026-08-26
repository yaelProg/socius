'use client'

import type { Prop } from '@/lib/vs-types'
import { isoX, isoY, depth } from '@/lib/vs-iso'

export function IsoProp({ p }: { p: Prop }) {
  const x = isoX(p.gx, p.gy)
  const y = isoY(p.gx, p.gy)
  const z = Math.round(depth(p.gx, p.gy) * 10) + 3

  if (p.type === 'bench') {
    return (
      <div
        style={{ position: 'absolute', left: x - 18, top: y - 10, width: 36, height: 20, zIndex: z, pointerEvents: 'none' }}
        aria-hidden
      >
        <div style={{ position: 'absolute', bottom: 4, left: 2, width: 32, height: 5, background: '#a0673a', borderRadius: 2, transform: `rotate(${p.rot ?? 0}deg)`, transformOrigin: 'center' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 4, width: 4, height: 6, background: '#8a5a2b', borderRadius: 1 }} />
        <div style={{ position: 'absolute', bottom: 0, right: 4, width: 4, height: 6, background: '#8a5a2b', borderRadius: 1 }} />
        <div style={{ position: 'absolute', bottom: 9, left: 3, width: 30, height: 3, background: '#b07d4a', borderRadius: 2, transform: `rotate(${p.rot ?? 0}deg)`, transformOrigin: 'center' }} />
      </div>
    )
  }

  if (p.type === 'streetlight') {
    return (
      <div
        style={{ position: 'absolute', left: x - 3, top: y - 58, width: 6, height: 62, zIndex: z, pointerEvents: 'none' }}
        aria-hidden
      >
        <div style={{ position: 'absolute', bottom: 0, left: 1, width: 4, height: 52, background: '#5a6472', borderRadius: 2 }} />
        <div style={{ position: 'absolute', top: 0, left: -4, width: 14, height: 8, background: '#6e7b8a', borderRadius: '6px 6px 3px 3px' }} />
        <div
          style={{
            position: 'absolute',
            top: 3,
            left: -2,
            width: 10,
            height: 5,
            background: 'radial-gradient(circle, #fff3a0, #f5c842)',
            borderRadius: 3,
            animation: 'vs-lamp-glow 3s ease-in-out infinite',
          }}
        />
      </div>
    )
  }

  if (p.type === 'flower') {
    return (
      <div
        style={{ position: 'absolute', left: x - 8, top: y - 16, width: 16, height: 18, zIndex: z, pointerEvents: 'none' }}
        aria-hidden
      >
        <div style={{ position: 'absolute', bottom: 0, left: 7, width: 2, height: 12, background: '#3a8a3a', borderRadius: 1 }} />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 2,
            width: 12,
            height: 12,
            background: 'radial-gradient(circle at 40% 40%, #ff7eb6, #e05b9c)',
            borderRadius: '50%',
            animation: `vs-flower ${3 + (p.gx + p.gy) % 2}s ease-in-out infinite`,
          }}
        />
      </div>
    )
  }

  if (p.type === 'parkedcar') {
    return (
      <div
        style={{ position: 'absolute', left: x - 15, top: y - 12, width: 30, height: 18, zIndex: z, pointerEvents: 'none' }}
        aria-hidden
      >
        <div style={{ width: 26, height: 13, background: p.color ?? '#3b6bf0', borderRadius: '6px 6px 4px 4px', boxShadow: '0 3px 4px rgba(20,30,60,0.2)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: -5, left: 5, width: 14, height: 8, background: 'rgba(255,255,255,0.8)', borderRadius: 3 }} />
        </div>
      </div>
    )
  }

  if (p.type === 'bicycle') {
    return (
      <div
        style={{ position: 'absolute', left: x - 10, top: y - 14, width: 20, height: 16, zIndex: z, pointerEvents: 'none' }}
        aria-hidden
      >
        <div style={{ position: 'absolute', bottom: 0, left: 1, width: 8, height: 8, border: '2px solid #4a4a4a', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 1, width: 8, height: 8, border: '2px solid #4a4a4a', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: 4, left: 8, width: 2, height: 8, background: '#6b7280', transform: 'rotate(20deg)' }} />
        <div style={{ position: 'absolute', bottom: 10, left: 7, width: 6, height: 3, background: '#ef4444', borderRadius: 2 }} />
      </div>
    )
  }

  return null
}
