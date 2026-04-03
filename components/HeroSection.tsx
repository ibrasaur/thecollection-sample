'use client'

import { useRef } from 'react'
import { motion, useInView, useMotionValue } from 'framer-motion'
import LiquidMetalCanvas from './LiquidMetalCanvas'

/* ─ Replace with your real video URL ─ */
const HERO_VIDEO = '<video src="public/videos/2.mp4" autoPlay loop />'

const blurIn = (delay: number) => ({
  initial:    { opacity: 0, filter: 'blur(18px)', y: 22 },
  animate:    { opacity: 1, filter: 'blur(0px)',  y: 0  },
  transition: { duration: 1.3, delay, ease: [0.25, 0.4, 0.25, 1] as const },
})

export default function HeroSection() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <section
      ref={ref}
      id="hero"
      className="relative w-full h-screen overflow-hidden flex items-center justify-center"
    >
      {/* WebGL layer */}
      <LiquidMetalCanvas />

      {/* Optional video blend */}
      {HERO_VIDEO !== 'HERO_VIDEO_URL_HERE' && (
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.28, mixBlendMode: 'luminosity' }}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      )}

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
