'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  const trailX  = useSpring(mouseX, { stiffness: 80,  damping: 20 })
  const trailY  = useSpring(mouseY, { stiffness: 80,  damping: 20 })
  const dotX    = useSpring(mouseX, { stiffness: 300, damping: 28 })
  const dotY    = useSpring(mouseY, { stiffness: 300, damping: 28 })
  const isHover = useRef(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    const over = (e: MouseEvent) => {
      const t = e.target as Element
      isHover.current = !!(t.closest('button') || t.closest('a') || t.closest('[data-cursor]'))
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [mouseX, mouseY])

  return (
    <>
      {/* Outer ring — lags behind */}
      <motion.div
        className="custom-cursor fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: trailX, y: trailY,
          translateX: '-50%', translateY: '-50%',
          width: 36, height: 36,
          borderRadius: '50%',
          border: '1px solid rgba(201,185,154,0.5)',
          mixBlendMode: 'difference',
        }}
      />
      {/* Inner dot — snaps */}
      <motion.div
        className="custom-cursor fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: dotX, y: dotY,
          translateX: '-50%', translateY: '-50%',
          width: 5, height: 5,
          borderRadius: '50%',
          background: '#C9B99A',
        }}
      />
    </>
  )
}
