'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const SPECS = [
  {
    car:   'Range Rover Autobiography',
    year:  '2023',
    rows: [
      { label: 'Engine',        value: '4.4L Twin-Turbo V8'     },
      { label: 'Output',        value: '530 bhp / 750 Nm'       },
      { label: '0–100 km/h',    value: '4.6 seconds'            },
      { label: 'Transmission',  value: '8-Speed Automatic'      },
      { label: 'Drive',         value: 'All-Wheel Drive'        },
      { label: 'Exterior',      value: 'Santorini Black'        },
      { label: 'Interior',      value: 'Ebony Semi-Aniline'     },
      { label: 'Provenance',    value: 'Factory Order · UK'     },
    ],
  },
  {
    car:   'Mercedes-AMG S 63 L',
    year:  '2018',
    rows: [
      { label: 'Engine',        value: '5.5L Biturbo V8'        },
      { label: 'Output',        value: '577 bhp / 900 Nm'       },
      { label: '0–100 km/h',    value: '3.9 seconds'            },
      { label: 'Transmission',  value: '7G-Tronic Plus'         },
      { label: 'Drive',         value: '4MATIC+ AWD'           },
      { label: 'Exterior',      value: 'Obsidian Black Metallic'},
      { label: 'Interior',      value: 'Exclusive Nappa Leather'},
      { label: 'Options',       value: 'Burmester 3D · Magic Sky'},
    ],
  },
  {
    car:   'Audi RS e-tron GT',
    year:  '2022',
    rows: [
      { label: 'Drivetrain',    value: 'Dual Electric Motors'   },
      { label: 'Output',        value: '598 bhp / 830 Nm'       },
      { label: '0–100 km/h',    value: '3.3 seconds'            },
      { label: 'Battery',       value: '93.4 kWh Net'           },
      { label: 'Charge',        value: '270 kW DC Peak'         },
      { label: 'Exterior',      value: 'Tactical Green'         },
      { label: 'Interior',      value: 'Fine Nappa · Alcantara' },
      { label: 'Provenance',    value: 'European Delivery'      },
    ],
  },
]

export default function TechnicalSpecs() {
  return (
    <section id="specs" className="py-32 px-6 lg:px-20 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-20 flex flex-col items-start gap-4">
        <BlurIn delay={0}>
          <p style={{ fontFamily:'var(--font-body)', fontSize:'9px', letterSpacing:'0.6em', textTransform:'uppercase', color:'rgba(201,185,154,0.4)' }}>
            Technical Dossier
          </p>
        </BlurIn>
        <BlurIn delay={0.12}>
          <h2 style={{ fontFamily:'var(--font-cormorant)', fontSize:'clamp(38px,5vw,68px)', fontWeight:300, color:'#E2E2E8' }}>
            Specifications
          </h2>
        </BlurIn>
        <BlurIn delay={0.22}>
          <div style={{ width:48, height:1, background:'linear-gradient(90deg,#C9B99A,transparent)' }} />
        </BlurIn>
      </div>

      {/* Spec tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-px"
        style={{ background:'rgba(201,185,154,0.06)' }}>
        {SPECS.map((s, si) => <SpecTable key={si} data={s} index={si} />)}
      </div>
    </section>
  )
}

function SpecTable({ data, index }: { data: typeof SPECS[0]; index: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay: index * 0.12, ease: [0.25, 0.4, 0.25, 1] }}
      className="p-8 lg:p-10"
      style={{ background:'#08080A' }}
    >
      {/* Car name */}
      <div className="mb-8 pb-6" style={{ borderBottom:'1px solid rgba(201,185,154,0.08)' }}>
        <p style={{ fontFamily:'var(--font-body)', fontSize:'9px', letterSpacing:'0.5em', textTransform:'uppercase', color:'rgba(201,185,154,0.35)', marginBottom:'8px' }}>
          {data.year}
        </p>
        <h3 style={{ fontFamily:'var(--font-cormorant)', fontSize:'22px', fontWeight:400, color:'#C9B99A', lineHeight:1.2 }}>
          {data.car}
        </h3>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-0">
        {data.rows.map((row, ri) => (
          <motion.div
            key={ri}
            initial={{ opacity: 0, x: -10 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.12 + ri * 0.055, ease: 'easeOut' }}
            className="flex justify-between items-baseline py-3"
            style={{ borderBottom: ri < data.rows.length - 1 ? '1px solid rgba(201,185,154,0.05)' : 'none' }}
          >
            <span style={{ fontFamily:'var(--font-body)', fontSize:'10px', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(201,185,154,0.38)', flexShrink:0, marginRight:'16px' }}>
              {row.label}
            </span>
            <span style={{ fontFamily:'var(--font-cormorant)', fontSize:'15px', color:'rgba(226,226,232,0.78)', textAlign:'right' }}>
              {row.value}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function BlurIn({ children, delay }: { children: React.ReactNode; delay: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, filter: 'blur(12px)', y: 14 }}
      animate={inView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
      transition={{ duration: 1, delay, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}
