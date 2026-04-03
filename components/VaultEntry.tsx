'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'

interface VaultEntryProps { onComplete: () => void }

const TARGET_DEG = 540
const CIRC      = 2 * Math.PI * 138

/* ── Precomputed geometry (module-level, never recalculated) ── */
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

  const getAngle = useCallback((cx: number, cy: number) => {
    if (!dialRef.current) return 0
    const r   = dialRef.current.getBoundingClientRect()
    const ocx = r.left + r.width  / 2
    const ocy = r.top  + r.height / 2
    return Math.atan2(cy - ocy, cx - ocx) * (180 / Math.PI)
  }, [])

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
    // Throttled update: only re-render if progress moves by more than ~0.4%
    setProgress(prev => Math.abs(prev - p) > 0.004 ? p : prev)

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

  const DOOR_BG_TOP    = 'linear-gradient(180deg,#050507 0%,#0D0D14 88%,#141420 100%)'
  const DOOR_BG_BOTTOM = 'linear-gradient(0deg,#050507 0%,#0D0D14 88%,#141420 100%)'

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <motion.div
        className="vault-ribbing absolute top-0 left-0 w-full overflow-hidden"
        style={{ height: '50vh', background: DOOR_BG_TOP }}
        animate={isOpening ? { y: '-100%' } : { y: '0%' }}
        transition={{ type: 'spring', stiffness: 48, damping: 15, delay: 0.18 }}
      >
        <div className="absolute top-5 left-8 right-8 flex justify-between">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-[7px] h-[7px] rounded-full" style={{
              background: 'radial-gradient(circle at 35% 30%,#C9B99A 0%,#6B5840 55%,#1E140A 100%)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.7)',
            }} />
          ))}
        </div>
        <div className="absolute bottom-14 left-14 right-14 h-16 rounded-sm"
          style={{ border: '1px solid rgba(201,185,154,0.05)', background: 'rgba(0,0,0,0.12)' }} />
        <div className="absolute bottom-[72px] left-1/2 -translate-x-1/2">
          <p style={{ fontFamily:'var(--font-cormorant)', letterSpacing:'0.45em', fontSize:'11px', color:'rgba(201,185,154,0.3)' }} className="uppercase">
            The Collection
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{
          background: `linear-gradient(90deg,transparent,rgba(201,185,154,${isOpening ? 1 : 0.3}) 30%,rgba(255,255,255,${isOpening ? 0.7 : 0.12}) 50%,rgba(201,185,154,${isOpening ? 1 : 0.3}) 70%,transparent)`,
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background:'linear-gradient(0deg,rgba(0,0,0,0.5),transparent)' }} />
      </motion.div>

      <motion.div
        className="vault-ribbing absolute bottom-0 left-0 w-full overflow-hidden"
        style={{ height: '50vh', background: DOOR_BG_BOTTOM }}
        animate={isOpening ? { y: '100%' } : { y: '0%' }}
        transition={{ type: 'spring', stiffness: 48, damping: 15, delay: 0.18 }}
      >
        <div className="absolute bottom-5 left-8 right-8 flex justify-between">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-[7px] h-[7px] rounded-full" style={{
              background: 'radial-gradient(circle at 35% 30%,#C9B99A 0%,#6B5840 55%,#1E140A 100%)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.7)',
            }} />
          ))}
        </div>
        <div className="absolute top-14 left-14 right-14 h-16 rounded-sm"
          style={{ border:'1px solid rgba(201,185,154,0.05)', background:'rgba(0,0,0,0.12)' }} />
        <div className="absolute top-[74px] left-1/2 -translate-x-1/2">
          <p style={{ fontFamily:'var(--font-body)', letterSpacing:'0.55em', fontSize:'9px', color:'rgba(201,185,154,0.2)' }} className="uppercase">
            Islamabad · Est. 2019
          </p>
        </div>
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{
          background: `linear-gradient(90deg,transparent,rgba(201,185,154,${isOpening ? 1 : 0.3}) 30%,rgba(255,255,255,${isOpening ? 0.7 : 0.12}) 50%,rgba(201,185,154,${isOpening ? 1 : 0.3}) 70%,transparent)`,
        }} />
        <div className="absolute top-0 left-0 right-0 h-8" style={{ background:'linear-gradient(180deg,rgba(0,0,0,0.5),transparent)' }} />
      </motion.div>

      <motion.div
        className="absolute left-0 right-0 pointer-events-none z-10"
        style={{ top:'50vh', translateY:'-50%' }}
        animate={isOpening
          ? { scaleY:[1,8,0], opacity:[0.6,1,0] }
          : { scaleY:1, opacity: progress > 0 ? 0.15 + progress * 0.7 : 0.06 }
        }
        transition={isOpening ? { duration:0.7, ease:'easeOut' } : { duration:0.15 }}
      >
        <div className="h-[1px] w-full" style={{
          background:'linear-gradient(90deg,transparent,rgba(201,185,154,0.5) 20%,rgba(255,255,255,0.85) 50%,rgba(201,185,154,0.5) 80%,transparent)',
        }} />
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center z-20">
        <motion.div
          className="relative w-[300px] h-[300px]"
          animate={isOpening   ? { opacity:0, scale:0.82, filter:'blur(10px)' }
                 : isUnlocking  ? { scale:1.03 }
                 : { opacity:1, scale:1, filter:'blur(0px)' }}
          transition={isOpening ? { duration:0.5 } : isUnlocking ? { duration:0.25 } : {}}
        >
          <div className="absolute inset-0 rounded-full pointer-events-none" style={{
            boxShadow:`0 0 ${28 + progress * 90}px rgba(201,185,154,${glowAlpha}), 0 0 ${60 + progress * 120}px rgba(201,185,154,${glowAlpha * 0.4})`,
          }} />

          <svg width="300" height="300" viewBox="0 0 300 300"
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{ transform:'rotate(-90deg)' }}>
            <defs>
              <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#7A6848" />
                <stop offset="45%"  stopColor="#E0D0B8" />
                <stop offset="100%" stopColor="#C9B99A" />
              </linearGradient>
            </defs>
            <circle cx="150" cy="150" r="138" fill="none"
              stroke="rgba(201,185,154,0.07)" strokeWidth="1" />
            <circle cx="150" cy="150" r="138" fill="none"
              stroke="url(#pg)" strokeWidth="2.5"
              strokeDasharray={CIRC}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transition:'stroke-dashoffset 0.07s linear' }}
            />
          </svg>

          <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 z-[3] pointer-events-none">
            <svg width="10" height="13" viewBox="0 0 10 13">
              <polygon points="5,0 0,11 10,11" fill="#C9B99A" opacity="0.92" />
            </svg>
          </div>

          <div className="absolute top-[10px] left-[10px] w-[280px] h-[280px] rounded-full z-[2]"
            style={{
              background:'radial-gradient(ellipse at 32% 26%,#26263A 0%,#131320 40%,#090910 100%)',
              boxShadow:[
                'inset 0 2px 5px rgba(255,255,255,0.055)',
                'inset 0 -3px 7px rgba(0,0,0,0.65)',
                '0 0 0 1px rgba(201,185,154,0.14)',
                '0 22px 70px rgba(0,0,0,0.85)',
              ].join(','),
            }}>

            <motion.div
              ref={dialRef}
              className="absolute inset-[10px] rounded-full select-none"
              style={{
                rotate: dialRotation,
                background:'radial-gradient(ellipse at 38% 33%,#1E1E2C 0%,#10101A 50%,#07070C 100%)',
                boxShadow:'inset 0 2px 6px rgba(255,255,255,0.038), inset 0 -2px 5px rgba(0,0,0,0.7)',
                cursor: phase === 'locked' ? 'grab' : 'default',
              }}
              onMouseDown={e => { e.preventDefault(); startDrag(e.clientX, e.clientY) }}
              onTouchStart={e => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
            >
              <svg viewBox="0 0 300 300" className="w-full h-full">
                {ticks.map((t,i) => (
                  <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
                    stroke={t.isMaj ? '#C9B99A' : t.isMid ? 'rgba(201,185,154,0.42)' : 'rgba(201,185,154,0.16)'}
                    strokeWidth={t.isMaj ? 1.5 : t.isMid ? 1 : 0.5}
                  />
                ))}
                {grips.map((g,i) => (
                  <line key={`g${i}`} x1={g.x1} y1={g.y1} x2={g.x2} y2={g.y2}
                    stroke="rgba(201,185,154,0.1)" strokeWidth="1" />
                ))}
                {nums.map((n,i) => (
                  <text key={i} x={n.x} y={n.y}
                    textAnchor="middle" dominantBaseline="middle"
                    fill="rgba(201,185,154,0.62)" fontSize="9.5"
                    fontFamily="'Jost',sans-serif" fontWeight="400" letterSpacing="1">
                    {n.label}
                  </text>
                ))}
                <circle cx="150" cy="150" r="76" fill="none" stroke="rgba(201,185,154,0.09)" strokeWidth="0.75" />
                <circle cx="150" cy="150" r="65" fill="none" stroke="rgba(201,185,154,0.07)" strokeWidth="0.5" strokeDasharray="2 4" />
                <polygon points="150,77 147,87 153,87" fill="rgba(201,185,154,0.55)" />
                <defs>
                  <radialGradient id="cg" cx="38%" cy="32%">
                    <stop offset="0%"   stopColor="#1C1C2A" />
                    <stop offset="100%" stopColor="#09090E" />
                  </radialGradient>
                </defs>
                <circle cx="150" cy="150" r="58" fill="url(#cg)"
                  stroke="rgba(201,185,154,0.16)" strokeWidth="1" />
                <text x="150" y="148" textAnchor="middle" dominantBaseline="middle"
                  fill="#C9B99A" fontSize="30"
                  fontFamily="'Cormorant Garamond',Georgia,serif"
                  fontWeight="400" letterSpacing="4">
                  TC
                </text>
                <text x="150" y="165" textAnchor="middle" dominantBaseline="middle"
                  fill="rgba(201,185,154,0.4)" fontSize="5.8"
                  fontFamily="'Jost',sans-serif" fontWeight="300" letterSpacing="4.5">
                  THE COLLECTION
                </text>
              </svg>
            </motion.div>
          </div>

          <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap text-center">
            {showHint ? (
              <motion.p
                animate={{ opacity:[0.35,0.85,0.35] }}
                transition={{ duration:2.6, repeat:Infinity }}
                style={{ fontFamily:'var(--font-body)', letterSpacing:'0.4em', fontSize:'10px', color:'rgba(201,185,154,0.6)', textTransform:'uppercase' }}>
                ← Rotate to Enter →
              </motion.p>
            ) : (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
                <span style={{ fontFamily:'var(--font-cormorant)', fontSize:'22px', color:'rgba(201,185,154,0.88)' }}>
                  {Math.round(progress * 100)}
                </span>
                <span style={{ fontFamily:'var(--font-body)', fontSize:'10px', color:'rgba(201,185,154,0.38)', marginLeft:'2px', letterSpacing:'0.1em' }}>
                  %
                </span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {(['top-5 left-5','top-5 right-5','bottom-5 left-5','bottom-5 right-5'] as const).map((pos,i) => (
        <div key={i} className={`absolute ${pos} w-7 h-7 pointer-events-none z-10`}>
          <svg viewBox="0 0 28 28" fill="none">
            <path d={['M0 14 L0 0 L14 0','M14 0 L28 0 L28 14','M0 14 L0 28 L14 28','M14 28 L28 28 L28 14'][i]}
              stroke="rgba(201,185,154,0.3)" strokeWidth="1" />
          </svg>
        </div>
      ))}
    </div>
  )
}
