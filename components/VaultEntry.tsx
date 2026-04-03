'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'

interface VaultEntryProps { onComplete: () => void }

const TARGET_DEG = 540   // 1.5 full rotations to unlock
const CIRC      = 2 * Math.PI * 138  // SVG progress ring circumference ≈ 867

export default function VaultEntry({ onComplete }: VaultEntryProps) {
  const [phase,    setPhase]    = useState<'locked'|'unlocking'|'opening'|'done'>('locked')
  const [progress, setProgress] = useState(0)
  const [showHint, setShowHint] = useState(true)

  const dialRotation   = useMotionValue(0)
  const isDraggingRef  = useRef(false)
  const lastAngleRef   = useRef<number|null>(null)
  const accumulatedRef = useRef(0)
  const dialRef        = useRef<HTMLDivElement>(null)
  const phaseRef       = useRef(phase)

  useEffect(() => { phaseRef.current = phase }, [phase])

  /* ── angle helper ─────────────────────────── */
  const getAngle = useCallback((cx: number, cy: number) => {
    if (!dialRef.current) return 0
    const r   = dialRef.current.getBoundingClientRect()
    const ocx = r.left + r.width  / 2
    const ocy = r.top  + r.height / 2
    return Math.atan2(cy - ocy, cx - ocx) * (180 / Math.PI)
  }, [])

  /* ── unlock animation ─────────────────────── */
  const triggerUnlock = useCallback(() => {
    if (phaseRef.current !== 'locked') return
    setPhase('unlocking')
    animate(dialRotation, dialRotation.get() + 720, {
      duration: 1.1,
      ease: [0.2, 0, 0.8, 1],
      onComplete: () => {
        setPhase('opening')
        setTimeout(() => { setPhase('done'); onComplete() }, 1800)
      },
    })
  }, [dialRotation, onComplete])

  /* ── drag handlers ────────────────────────── */
  const startDrag = useCallback((cx: number, cy: number) => {
    if (phaseRef.current !== 'locked') return
    isDraggingRef.current = true
    lastAngleRef.current  = getAngle(cx, cy)
    setShowHint(false)
  }, [getAngle])

  const duringDrag = useCallback((cx: number, cy: number) => {
    if (!isDraggingRef.current || lastAngleRef.current === null || phaseRef.current !== 'locked') return
    const angle = getAngle(cx, cy)
    let delta = angle - lastAngleRef.current
    if (delta >  180) delta -= 360
    if (delta < -180) delta += 360

    dialRotation.set(dialRotation.get() + delta)
    accumulatedRef.current += Math.abs(delta)
    lastAngleRef.current = angle

    const p = Math.min(accumulatedRef.current / TARGET_DEG, 1)
    setProgress(p)
    if (accumulatedRef.current >= TARGET_DEG) {
      isDraggingRef.current = false
      triggerUnlock()
    }
  }, [getAngle, dialRotation, triggerUnlock])

  const endDrag = useCallback(() => {
    isDraggingRef.current = false
    lastAngleRef.current  = null
  }, [])

  useEffect(() => {
    const mm  = (e: MouseEvent)  => duringDrag(e.clientX, e.clientY)
    const tm  = (e: TouchEvent)  => { e.preventDefault(); duringDrag(e.touches[0].clientX, e.touches[0].clientY) }
    const mu  = ()               => endDrag()
    window.addEventListener('mousemove',  mm)
    window.addEventListener('mouseup',    mu)
    window.addEventListener('touchmove',  tm, { passive: false })
    window.addEventListener('touchend',   mu)
    return () => {
      window.removeEventListener('mousemove', mm)
      window.removeEventListener('mouseup',   mu)
      window.removeEventListener('touchmove', tm)
      window.removeEventListener('touchend',  mu)
    }
  }, [duringDrag, endDrag])

  if (phase === 'done') return null

  const isOpening   = phase === 'opening'
  const isUnlocking = phase === 'unlocking'
  const dashOffset  = CIRC * (1 - progress)
  const glowAlpha   = 0.05 + progress * 0.3

  /* ── tick marks ─────────────────────────────── */
  const ticks = Array.from({ length: 120 }, (_, i) => {
    const angle = (i / 120) * 360
    const rad   = (angle * Math.PI) / 180
    const isMaj = i % 10 === 0
    const isMid = i % 5  === 0
    const r1    = isMaj ? 104 : isMid ? 109 : 113
    return {
      x1: 150 + r1  * Math.sin(rad), y1: 150 - r1  * Math.cos(rad),
      x2: 150 + 118 * Math.sin(rad), y2: 150 - 118 * Math.cos(rad),
      isMaj, isMid,
    }
  })

  const nums = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * 360
    const rad   = (angle * Math.PI) / 180
    return {
      x: 150 + 92 * Math.sin(rad),
      y: 150 - 92 * Math.cos(rad),
      label: (i === 0 ? 60 : i * 5).toString().padStart(2,'0'),
    }
  })

  const grips = Array.from({ length: 60 }, (_, i) => {
    const rad = ((i / 60) * 360 * Math.PI) / 180
    return {
      x1: 150 + 121 * Math.sin(rad), y1: 150 - 121 * Math.cos(rad),
      x2: 150 + 127 * Math.sin(rad), y2: 150 - 127 * Math.cos(rad),
    }
  })

  const DOOR_BG_TOP    = 'linear-gradient(180deg,#050507 0%,#0D0D14 88%,#141420 100%)'
  const DOOR_BG_BOTTOM = 'linear-gradient(0deg,  #050507 0%,#0D0D14 88%,#141420 100%)'

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">

      {/* ─── TOP VAULT DOOR ──────────────────────── */}
      <motion.div
        className="vault-ribbing absolute top-0 left-0 w-full overflow-hidden"
        style={{ height: '50vh', background: DOOR_BG_TOP }}
        animate={isOpening ? { y: '-100%' } : { y: '0%' }}
        transition={{ type: 'spring', stiffness: 48, damping: 15, delay: 0.18 }}
      >
        {/* Rivet row */}
        <div className="absolute top-5 left-8 right-8 flex justify-between">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-[7px] h-[7px] rounded-full" style={{
              background: 'radial-gradient(circle at 35% 30%,#C9B99A 0%,#6B5840 55%,#1E140A 100%)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.7)',
            }} />
          ))}
        </div>
        {/* Decorative inset panel */}
        <div className="absolute bottom-14 left-14 right-14 h-16 rounded-sm"
          style={{ border: '1px solid rgba(201,185,154,0.05)', background: 'rgba(0,0,0,0.12)' }} />
        {/* Wordmark */}
        <div className="absolute bottom-[72px] left-1/2 -translate-x-1/2">
          <p style={{ fontFamily:'var(--font-cormorant)', letterSpacing:'0.45em', fontSize:'11px', color:'rgba(201,185,154,0.3)' }} className="uppercase">
            The Collection
          </p>
        </div>
        {/* Bottom edge glow */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{
          background: `linear-gradient(90deg,transparent,rgba(201,185,154,${isOpening ? 1 : 0.3}) 30%,rgba(255,255,255,${isOpening ? 0.7 : 0.12}) 50%,rgba(201,185,154,${isOpening ? 1 : 0.3}) 70%,transparent)`,
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background:'linear-gradient(0deg,rgba(0,0,0,0.5),transparent)' }} />
      </motion.div>

      {/* ─── BOTTOM VAULT DOOR ───────────────────── */}
      <motion.div
        className="vault-ribbing absolute bottom-0 left-0 w-full overflow-hidden"
        style={{ height: '50vh', background: DOOR_BG_BOTTOM }}
        animate={isOpening ? { y: '100%' } : { y: '0%' }}
        transition={{ type: 'spring', stiffness: 48, damping: 15, delay: 0.18 }}
      >
        {/* Rivet row */}
        <div className="absolute bottom-5 left-8 right-8 flex justify-between">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-[7px] h-[7px] rounded-full" style={{
              background: 'radial-gradient(circle at 35% 30%,#C9B99A 0%,#6B5840 55%,#1E140A 100%)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.7)',
            }} />
          ))}
        </div>
        {/* Decorative inset panel */}
        <div className="absolute top-14 left-14 right-14 h-16 rounded-sm"
          style={{ border:'1px solid rgba(201,185,154,0.05)', background:'rgba(0,0,0,0.12)' }} />
        {/* Wordmark */}
        <div className="absolute top-[74px] left-1/2 -translate-x-1/2">
          <p style={{ fontFamily:'var(--font-body)', letterSpacing:'0.55em', fontSize:'9px', color:'rgba(201,185,154,0.2)' }} className="uppercase">
            Islamabad · Est. 2019
          </p>
        </div>
        {/* Top edge glow */
