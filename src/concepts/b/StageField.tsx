import { useEffect, useRef } from 'react'
import type { MotionValue } from 'motion/react'
import { NOTES } from '@/content'

/** Bar heights from the Lima Nada mark: five notes, five pillars. */
export const BAR_H = [0.8, 1, 0.86, 0.95, 0.82]

export type Geom = { x0: number; x1: number; base: number; maxH: number; waveY: number; amp: number }

export function geometry(w: number, h: number): Geom {
  if (w >= 900) return { x0: w * 0.5, x1: w * 0.95, base: h * 0.8, maxH: h * 0.56, waveY: h * 0.3, amp: h * 0.08 }
  return { x0: w * 0.06, x1: w * 0.94, base: h * 0.46, maxH: h * 0.3, waveY: h * 0.22, amp: h * 0.06 }
}

export function barRect(g: Geom, i: number) {
  const slot = (g.x1 - g.x0) / 5
  const bw = slot * 0.66
  const cx = g.x0 + slot * (i + 0.5)
  return { cx, left: cx - bw / 2, width: bw }
}

type P = { x: number; y: number; vx: number; vy: number; c: number; ax: number; ay: number; bx: number; seed: number }

/**
 * Canvas particle field: five equaliser columns that breathe like audio levels,
 * repel from the pointer, and melt into one sound wave as `progress` goes 0 → 1.
 */
export function StageField({ progress, reduce }: { progress: MotionValue<number>; reduce: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let w = 0, h = 0, dpr = 1, g: Geom
    let ps: P[] = []
    let raf = 0
    let visible = true
    const mouse = { x: -9999, y: -9999 }

    const build = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width; h = r.height
      dpr = Math.min(devicePixelRatio || 1, 2)
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      g = geometry(w, h)
      const n = w < 640 ? 1500 : 3800
      const old = ps
      ps = Array.from({ length: n }, (_, k) => {
        const c = k % 5
        const { left, width } = barRect(g, c)
        const ax = left + Math.random() * width
        const ay = Math.random() // fraction up the bar; the live height is applied per frame
        const bx = w * 0.04 + (k / n) * w * 0.92
        const prev = old[k]
        return { x: prev?.x ?? ax, y: prev?.y ?? g.base - ay * g.maxH * BAR_H[c], vx: 0, vy: 0, c, ax, ay, bx, seed: Math.random() * Math.PI * 2 }
      })
    }

    const draw = (t: number) => {
      const p = progress.get()
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2 // easeInOutCubic
      ctx.clearRect(0, 0, w, h)
      const buckets: number[][] = [[], [], [], [], []]
      const time = t / 1000
      for (const q of ps) {
        // Formation A: the five bars, each level breathing on its own rhythm.
        const level = BAR_H[q.c] * (0.9 + 0.1 * Math.sin(time * (1.1 + q.c * 0.23) + q.c * 1.7))
        const tyA = g.base - q.ay * g.maxH * level
        // Formation B: one wave made from all five voices.
        const xn = q.bx / w
        const tyB = g.waveY + Math.sin(xn * 8 + time * 1.3 + q.c * 0.6) * g.amp * (0.35 + 0.65 * Math.sin(xn * Math.PI)) + Math.sin(q.seed + time * 2) * 1.6
        const tx = q.ax + (q.bx - q.ax) * e
        const ty = tyA + (tyB - tyA) * e
        if (reduce) {
          q.x = tx; q.y = ty
        } else {
          q.vx += (tx - q.x) * 0.055
          q.vy += (ty - q.y) * 0.055
          const dx = q.x - mouse.x, dy = q.y - mouse.y
          const d2 = dx * dx + dy * dy
          if (d2 < 11000) {
            const f = (1 - d2 / 11000) * 2.4
            const d = Math.sqrt(d2) || 1
            q.vx += (dx / d) * f; q.vy += (dy / d) * f
          }
          q.vx *= 0.8; q.vy *= 0.8
          q.x += q.vx; q.y += q.vy
        }
        buckets[q.c].push(q.x, q.y)
      }
      const s = w < 640 ? 1.7 : 2.1
      buckets.forEach((b, c) => {
        ctx.fillStyle = NOTES[c]
        ctx.beginPath()
        for (let k = 0; k < b.length; k += 2) ctx.rect(b[k], b[k + 1], s, s)
        ctx.fill()
      })
    }

    const loop = (t: number) => {
      draw(t)
      if (visible && !reduce) raf = requestAnimationFrame(loop)
    }
    const start = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(loop)
    }

    build()
    start()

    const ro = new ResizeObserver(() => { build(); if (reduce) draw(0) })
    ro.observe(canvas)
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting && !document.hidden
      if (visible) start()
    })
    io.observe(canvas)
    const onVis = () => { visible = !document.hidden; if (visible) start() }
    document.addEventListener('visibilitychange', onVis)
    const onMove = (ev: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = ev.clientX - r.left; mouse.y = ev.clientY - r.top
    }
    const onLeave = () => { mouse.x = mouse.y = -9999 }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    const unsub = progress.on('change', () => { if (reduce) draw(0) })

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect(); io.disconnect(); unsub()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [progress, reduce])

  return <canvas ref={ref} className="absolute inset-0 size-full" aria-hidden />
}
