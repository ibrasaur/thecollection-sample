'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ring = ringRef.current
    const dot  = dotRef.current
    if (!ring || !dot) return

    let mouseX = -100, mouseY = -100
    let ringX  = -100, ringY  = -100
    let rafId: number
    let isHover = false

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onOver = (e: MouseEvent) => {
      const t = e.target as Element
      isHover = !!(t.closest('button') || t.closest('a') || t.closest('[data-cursor]'))
    }

    const loop = () => {
      dot.style.transform = `translate(${mouseX - 2.5}px, ${mouseY - 2.5}px)`

      const ease = 0.12
      ringX += (mouseX - ringX) * ease
      ringY += (mouseY - ringY) * ease
      ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px) scale(${isHover ? 1.6 : 1})`

      rafId = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    rafId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <div
        ref={ringRef}
        className="custom-cursor"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 36, height: 36,
          borderRadius: '50%',
          border: '1px solid rgba(201,185,154,0.55)',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
          transition: 'scale 0.2s ease',
        }}
      />
      <div
        ref={dotRef}
        className="custom-cursor"
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: 5, height: 5,
          borderRadius: '50%',
          background: '#C9B99A',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
        }}
      />
    </>
  )
}
