'use client'

import { useRef, useState } from 'react'
import { motion, useInView, useMotionValue } from 'framer-motion'
import LiquidMetalCanvas from './LiquidMetalCanvas'

const HERO_VIDEO = 'https://res.cloudinary.com/dvn7e08ze/video/upload/q_auto/f_auto/v1775200537/This_isn_t_just_a_car_dealership.This_is_a_vision_built_brick_by_brick_this_is_an_entire_ecosy_amgbg4.mp4'

const blurIn = (delay: number) => ({
  initial:    { opacity: 0, filter: 'blur(18px)', y: 22 },
  animate:    { opacity: 1, filter: 'blur(0px)',  y: 0  },
  transition: { duration: 1.3, delay, ease: [0.25, 0.4, 0.25, 1] as const },
})

export default function HeroSection() {
  const ref      = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const inView   = useInView(ref, { once: true })
  const [muted, setMuted] = useState(true)

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !videoRef.current.muted
    setMuted(videoRef.current.muted)
  }

  return (
    <section
      ref={ref}
      id="hero"
      className="relative w-full h-screen overflow-hidden flex items-center justify-center"
    >
      {/* WebGL layer */}
      <LiquidMetalCanvas />

      {/* Video blend */}
      <video
        ref={videoRef}
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.28, mixBlendMode: 'luminosity' }}
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>

      {/* Mute / unmute button */}
      <button
        onClick={toggleMute}
        data-cursor
        className="absolute bottom-10 right-8 z-20 flex items-center gap-2"
        style={{ background: 'none', border: 'none', cursor: 'none', padding: '8px' }}
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.93 }}
          className="flex items-center gap-2"
          style={{
            fontFamily: 'var(--font-jost)',
            fontSize: '9px',
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            color: muted ? 'rgba(201,185,154,0.5)' : 'rgba(201,185,154,0.85)',
            transition: 'color 0.3s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            {muted ? (
              <>
                <path d="M8 3L4 6H1V10H4L8 13V3Z" stroke="rgba(201,185,154,0.6)" strokeWidth="1" fill="none" strokeLinejoin="round" />
                <line x1="11" y1="6" x2="15" y2="10" stroke="rgba(201,185,154,0.6)" strokeWidth="1" strokeLinecap="round" />
                <line x1="15" y1="6" x2="11" y2="10" stroke="rgba(201,185,154,0.6)" strokeWidth="1" strokeLinecap="round" />
              </>
            ) : (
              <>
                <path d="M8 3L4 6H1V10H4L8 13V3Z" stroke="#C9B99A" strokeWidth="1" fill="none" strokeLinejoin="round" />
                <path d="M11 5.5C12.2 6.4 13 7.1 13 8C13 8.9 12.2 9.6 11 10.5" stroke="#C9B99A" strokeWidth="1" strokeLinecap="round" fill="none" />
                <path d="M12.5 3.5C14.5 4.9 15.5 6.4 15.5 8C15.5 9.6 14.5 11.1 12.5 12.5" stroke="rgba(201,185,154,0.45)" strokeWidth="1" strokeLinecap="round" fill="none" />
              </>
            )}
          </svg>
          {muted ? 'Sound Off' : 'Sound On'}
        </motion.div>
      </button>

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 50%,transparent 20%,rgba(8,8,10,0.65) 80%,rgba(8,8,10,0.95) 100%)',
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none"
        style={{ background: 'linear-gradient(0deg,#08080A,transparent)' }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">

        <motion.p
          {...blurIn(0.2)}
          style={{
            fontFamily: 'var(--font-jost)',
            fontSize: '10px',
            letterSpacing: '0.6em',
            textTransform: 'uppercase',
            color: 'rgba(201,185,154,0.5)',
            marginBottom: '28px',
          }}
        >
          Private Automotive Gallery · Islamabad
        </motion.p>

        <motion.h1
          {...blurIn(0.5)}
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(52px,8vw,110px)',
            fontWeight: 300,
            lineHeight: 0.92,
            color: '#E2E2E8',
            marginBottom: '12px',
          }}
        >
          The<br />
          <em style={{ color: '#C9B99A', fontStyle: 'italic', fontWeight: 400 }}>
            Collection
          </em>
        </motion.h1>

        <motion.div
          {...blurIn(0.8)}
          className="flex items-center justify-center gap-4 my-8"
        >
          <div style={{ height: '1px', width: 64, background: 'linear-gradient(90deg,transparent,rgba(201,185,154,0.4))' }} />
          <span style={{ fontFamily: 'var(--font-jost)', fontSize: '9px', letterSpacing: '0.55em', color: 'rgba(201,185,154,0.4)', textTransform: 'uppercase' }}>
            Est. 2019
          </span>
          <div style={{ height: '1px', width: 64, background: 'linear-gradient(90deg,rgba(201,185,154,0.4),transparent)' }} />
        </motion.div>

        <motion.p
          {...blurIn(1.0)}
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(16px,2.2vw,22px)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'rgba(226,226,232,0.55)',
            maxWidth: '480px',
            margin: '0 auto 44px',
            lineHeight: 1.6,
          }}
        >
          Where rare machines find distinguished owners.
        </motion.p>

        <motion.div
          {...blurIn(1.2)}
          className="flex items-center justify-center gap-5 flex-wrap"
        >
          <HeroMagneticBtn
            primary
            label="View Inventory"
            onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
          />
          <HeroMagneticBtn
            label="Private Enquiry"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <span style={{ fontFamily: 'var(--font-jost)', fontSize: '9px', letterSpacing: '0.5em', color: 'rgba(201,185,154,0.4)', textTransform: 'uppercase' }}>
          Scroll
        </span>
        <motion.div
          style={{ width: '1px', height: 32, background: 'linear-gradient(180deg,rgba(201,185,154,0.5),transparent)' }}
          animate={{ scaleY: [0, 1, 0], originY: '0%' }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}

/* ── Magnetic CTA button ───────────────────────── */
function HeroMagneticBtn({
  label, onClick, primary,
}: {
  label: string; onClick: () => void; primary?: boolean
}) {
  const ref = useRef<HTMLButtonElement>(null!)
  const x   = useMotionValue(0)
  const y   = useMotionValue(0)

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      data-cursor
      onMouseMove={e => {
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width  / 2) * 0.4)
        y.set((e.clientY - r.top  - r.height / 2) * 0.4)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="px-8 py-3"
      style={{
        x, y,
        cursor: 'none',
        fontFamily: 'var(--font-jost)',
        fontSize: '10.5px',
        letterSpacing: '0.35em',
        textTransform: 'uppercase',
        background: primary
          ? 'linear-gradient(135deg,#C9B99A 0%,#E0D0B8 50%,#A89478 100%)'
          : 'transparent',
        color: primary ? '#08080A' : 'rgba(201,185,154,0.75)',
        border: primary ? 'none' : '1px solid rgba(201,185,154,0.28)',
      }}
    >
      {label}
    </motion.button>
  )
}
