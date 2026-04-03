'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  life: number; maxLife: number
  size: number
}

export default function ParticleDust() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles: Particle[] = []
    let raf: number

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const spawn = () => {
      if (particles.length > 90) return
      const maxLife = 220 + Math.random() * 280
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 5,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(0.22 + Math.random() * 0.55),
        life: 0,
        maxLife,
        size: 0.6 + Math.random() * 1.4,
      })
    }

    let frame = 0
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++
      if (frame % 7 === 0) spawn()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx; p.y += p.vy; p.life++

        const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.45
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)

        /* white-gold shimmer with occasional brighter flare */
        const bright = Math.random() > 0.985
        ctx.fillStyle = bright
          ? `rgba(240,228,200,${alpha * 2.1})`
          : `rgba(201,185,154,${alpha})`
        ctx.fill()

        if (p.life >= p.maxLife) particles.splice(i, 1)
      }
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[1]"
      style={{ opacity: 0.65 }}
    />
  )
}
