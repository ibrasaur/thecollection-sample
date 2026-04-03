'use client'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

/* ─── Replace with your real image URLs ──────── */
const CARS = [
  {
    id:    'CAR_1',
    slug:  'range-rover',
    make:  'Land Rover',
    model: 'Range Rover',
    year:  '2023',
    badge: 'Autobiography',
    spec:  '4.4L V8 · 530 bhp',
    price: 'POA',
    src:   'https://www.instagram.com/thecollectionisb/p/DWmJnLGDIme/',
    accent:'#8B9E7A',
  },
  {
    id:    'CAR_2',
    slug:  's63-amg',
    make:  'Mercedes-AMG',
    model: 'S 63 L',
    year:  '2018',
    badge: 'AMG Executive',
    spec:  '5.5L V8 Biturbo · 577 bhp',
    price: 'POA',
    src:   'https://www.instagram.com/thecollectionisb/p/DWWA2puDCFa/',
    accent:'#8E8E7A',
  },
  {
    id:    'CAR_3',
    slug:  'etron-gt',
    make:  'Audi',
    model: 'e-tron GT',
    year:  '2022',
    badge: 'RS Quattro',
    spec:  'Dual Motor · 598 bhp',
    price: 'POA',
    src:   'https://www.instagram.com/thecollectionisb/p/DVqUPU9DFRC/',
    accent:'#7A8E9E',
  },
]

export default function InventoryGallery() {
  const stickyRef = useRef<HTMLDivElement>(null)
  const trackRef  = useRef<HTMLDivElement>(null)
  const x         = useMotionValue(0)
  const [active, setActive]   = useState(0)
  const [canvasW, setCanvasW] = useState(0)

  /* total horizontal travel = (cards − 1) × 100vw */
  const CARD_W = typeof window !== 'undefined' ? window.innerWidth : 1440
  const totalScroll = (CARS.length - 1) * CARD_W

  useEffect(() => {
    setCanvasW(window.innerWidth)
    const onResize = () => setCanvasW(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const sticky = stickyRef.current
    if (!sticky) return

    const onScroll = () => {
      const rect = sticky.getBoundingClientRect()
      const parent = sticky.parentElement!
      const parentRect = parent.getBoundingClientRect()

      /* progress 0→1 through the sticky zone */
      const raw = -parentRect.top
      const max = parent.offsetHeight - window.innerHeight
      const progress = Math.max(0, Math.min(1, raw / max))

      x.set(-progress * totalScroll)
      setActive(Math.round(progress * (CARS.length - 1)))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [x, totalScroll])

  return (
    /* outer container height = viewport + total horizontal scroll distance */
    <section
      id="gallery"
      style={{ height: `calc(100vh + ${totalScroll}px)` }}
      className="relative"
    >
      {/* Section label (above sticky zone) */}
      <div className="absolute top-0 left-0 right-0 flex flex-col items-center pt-24 pointer-events-none z-10">
        <BlurInText delay={0}>
          <p style={{ fontFamily:'var(--font-body)', fontSize:'9px', letterSpacing:'0.6em', textTransform:'uppercase', color:'rgba(201,185,154,0.4)' }}>
            Selected Inventory
          </p>
        </BlurInText>
        <BlurInText delay={0.15}>
          <h2 style={{ fontFamily:'var(--font-cormorant)', fontSize:'clamp(38px,5.5vw,72px)', fontWeight:300, color:'#E2E2E8', textAlign:'center', marginTop:'12px' }}>
            The Machines
          </h2>
        </BlurInText>
      </div>

      {/* Sticky horizontal scroll viewport */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen overflow-hidden"
      >
        {/* Horizontal track */}
        <motion.div
          ref={trackRef}
          style={{ x, display: 'flex', width: `${CARS.length * 100}vw`, height: '100%' }}
        >
          {CARS.map((car, i) => (
            <CarCard key={car.id} car={car} index={i} isActive={active === i} canvasW={canvasW} />
          ))}
        </motion.div>

        {/* Dot progress indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {CARS.map((_, i) => (
            <motion.div
              key={i}
              animate={{ width: active === i ? 24 : 6, background: active === i ? '#C9B99A' : 'rgba(201,185,154,0.25)' }}
              transition={{ duration: 0.35 }}
              style={{ height: 2, borderRadius: 2 }}
            />
          ))}
        </div>

        {/* Edge fade — right */}
        <div className="absolute top-0 right-0 w-24 h-full pointer-events-none z-10"
          style={{ background: 'linear-gradient(270deg,rgba(8,8,10,0.7),transparent)' }} />
        {/* Edge fade — left */}
        <div className="absolute top-0 left-0 w-24 h-full pointer-events-none z-10"
          style={{ background: 'linear-gradient(90deg,rgba(8,8,10,0.7),transparent)' }} />
      </div>
    </section>
  )
}

/* ─── Individual Car Card ─────────────────────── */
function CarCard({ car, index, isActive, canvasW }: {
  car: typeof CARS[0]; index: number; isActive: boolean; canvasW: number
}) {
  const hasImage = !car.src.includes('_URL_HERE')

  return (
    <div
      className="relative flex-shrink-0 h-full flex items-center justify-center"
      style={{ width: `${canvasW}px` }}
    >
      {/* Car image / placeholder */}
      <div className="absolute inset-16 rounded-sm overflow-hidden"
        style={{ border: '1px solid rgba(201,185,154,0.07)' }}
      >
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={car.src} alt={`${car.year} ${car.make} ${car.model}`}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.72) contrast(1.05) saturate(0.88)' }}
          />
        ) : (
          /* Placeholder when URL not set */
          <div className="w-full h-full flex flex-col items-center justify-center gap-3"
            style={{ background: 'linear-gradient(135deg,#0D0D14,#1A1A24)' }}>
            <span style={{ fontFamily:'var(--font-cormorant)', fontSize:'13px', letterSpacing:'0.4em', color:'rgba(201,185,154,0.2)', textTransform:'uppercase' }}>
              {car.make}
            </span>
            <div style={{ width:48, height:1, background:'rgba(201,185,154,0.12)' }} />
            <span style={{ fontFamily:'var(--font-cormorant)', fontSize:'32px', color:'rgba(201,185,154,0.1)' }}>
              {car.model}
            </span>
          </div>
        )}
        {/* Colour cast overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 30% 60%,${car.accent}14,transparent 65%)`, mixBlendMode:'screen' }} />
        {/* Bottom info gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{ background: 'linear-gradient(0deg,rgba(8,8,10,0.96) 0%,rgba(8,8,10,0.5) 55%,transparent 100%)' }} />
      </div>

      {/* Card info */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10"
        style={{ minWidth: '320px' }}>
        <motion.div
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 14, filter: isActive ? 'blur(0px)' : 'blur(6px)' }}
          transition={{ duration: 0.65, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <p style={{ fontFamily:'var(--font-body)', fontSize:'9px', letterSpacing:'0.55em', textTransform:'uppercase', color:'rgba(201,185,154,0.45)', marginBottom:'10px' }}>
            {car.year} · {car.badge}
          </p>
          <h3 style={{ fontFamily:'var(--font-cormorant)', fontSize:'clamp(36px,4.5vw,58px)', fontWeight:300, color:'#E2E2E8', lineHeight:1.0 }}>
            {car.make}<br />
            <em style={{ color:'#C9B99A', fontStyle:'italic' }}>{car.model}</em>
          </h3>
          <p style={{ fontFamily:'var(--font-body)', fontSize:'11px', letterSpacing:'0.2em', color:'rgba(201,185,154,0.5)', marginTop:'12px' }}>
            {car.spec}
          </p>
          <div style={{ width:32, height:1, background:'rgba(201,185,154,0.25)', margin:'18px auto' }} />
          <p style={{ fontFamily:'var(--font-cormorant)', fontSize:'13px', letterSpacing:'0.35em', color:'rgba(201,185,154,0.7)', textTransform:'uppercase' }}>
            {car.price}
          </p>
        </motion.div>
      </div>

      {/* Index marker */}
      <div className="absolute top-24 right-20 pointer-events-none"
        style={{ fontFamily:'var(--font-cormorant)', fontSize:'96px', fontWeight:300, color:'rgba(201,185,154,0.04)', lineHeight:1, userSelect:'none' }}>
        0{index + 1}
      </div>
    </div>
  )
}

/* ─── Blur-in wrapper for headings ────────────── */
function BlurInText({ children, delay }: { children: React.ReactNode; delay: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: 'blur(14px)', y: 16 }}
      animate={inView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
      transition={{ duration: 1.1, delay, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

