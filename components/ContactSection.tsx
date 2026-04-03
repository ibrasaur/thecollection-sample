'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Phone, Instagram, MapPin, ArrowUpRight } from 'lucide-react'

export default function ContactSection() {
  const ref    = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  const links = [
    { id:'ig',    Icon: Instagram, label: 'Instagram',    sub: '@thecollectionisb',        href: 'https://www.instagram.com/thecollectionisb/' },
    { id:'phone', Icon: Phone,     label: 'Private Line', sub: 'By appointment only',      href: 'tel:+92300000000' },
    { id:'loc',   Icon: MapPin,    label: 'Islamabad',    sub: 'F-7 / F-8 · By Request',   href: '#'               },
  ]

  return (
    <section
      ref={ref}
      id="contact"
      className="relative py-36 px-6 overflow-hidden"
      style={{ borderTop: '1px solid rgba(201,185,154,0.06)' }}
    >
      {/* Background number watermark */}
      <div className="absolute right-[-4%] bottom-[-8%] pointer-events-none select-none leading-none"
        style={{ fontFamily:'var(--font-cormorant)', fontSize:'clamp(160px,22vw,340px)', fontWeight:300, color:'rgba(201,185,154,0.02)', lineHeight:1 }}>
        TC
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-12 items-start">

          {/* Left — Copy */}
          <div>
            <motion.p
              initial={{ opacity:0, y:16 }} animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.9, delay:0.0, ease:[0.25,0.4,0.25,1] }}
              style={{ fontFamily:'var(--font-body)', fontSize:'9px', letterSpacing:'0.6em', textTransform:'uppercase', color:'rgba(201,185,154,0.4)', marginBottom:'20px' }}
            >
              Private Enquiry
            </motion.p>

            <motion.h2
              initial={{ opacity:0, filter:'blur(14px)', y:18 }} animate={inView ? { opacity:1, filter:'blur(0px)', y:0 } : {}}
              transition={{ duration:1.1, delay:0.1, ease:[0.25,0.4,0.25,1] }}
              style={{ fontFamily:'var(--font-cormorant)', fontSize:'clamp(40px,5vw,64px)', fontWeight:300, color:'#E2E2E8', lineHeight:1.05, marginBottom:'28px' }}
            >
              Acquire <em style={{ color:'#C9B99A', fontStyle:'italic' }}>Something</em><br />
              Remarkable.
            </motion.h2>

            <motion.p
              initial={{ opacity:0, y:14 }} animate={inView ? { opacity:1, y:0 } : {}}
              transition={{ duration:0.9, delay:0.22, ease:[0.25,0.4,0.25,1] }}
              style={{ fontFamily:'var(--font-cormorant)', fontSize:'17px', fontStyle:'italic', color:'rgba(226,226,232,0.45)', lineHeight:1.75, maxWidth:'400px', marginBottom:'44px' }}
            >
              Each vehicle is available exclusively through direct introduction.
              We do not advertise. We curate. Reach out to begin.
            </motion.p>

            {/* Rule */}
            <motion.div
              initial={{ scaleX:0 }} animate={inView ? { scaleX:1 } : {}}
              transition={{ duration:0.8, delay:0.32, ease:[0.25,0.4,0.25,1] }}
              style={{ width:56, height:1, background:'linear-gradient(90deg,#C9B99A,transparent)', originX:0 }}
            />
          </div>

          {/* Right — Contact links */}
          <div className="flex flex-col gap-1">
            {links.map((link, i) => (
              <motion.a
                key={link.id}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity:0, x:20 }}
                animate={inView ? { opacity:1, x:0 } : {}}
                transition={{ duration:0.7, delay: 0.15 + i * 0.1, ease:[0.25,0.4,0.25,1] }}
                onMouseEnter={() => setHoveredLink(link.id)}
                onMouseLeave={() => setHoveredLink(null)}
                data-cursor
                className="group flex items-center justify-between py-6 px-0"
                style={{
                  borderBottom: '1px solid rgba(201,185,154,0.07)',
                  textDecoration: 'none',
                  transition: 'background 0.3s',
                  background: hoveredLink === link.id ? 'rgba(201,185,154,0.025)' : 'transparent',
                  paddingLeft: hoveredLink === link.id ? '16px' : '0px',
                  paddingRight: hoveredLink === link.id ? '16px' : '0px',
                }}
              >
                <div className="flex items-center gap-5">
                  <div className="w-9 h-9 flex items-center justify-center rounded-full"
                    style={{
                      border: '1px solid rgba(201,185,154,0.15)',
                      background: hoveredLink === link.id ? 'rgba(201,185,154,0.07)' : 'transparent',
                      transition: 'background 0.3s, border-color 0.3s',
                    }}>
                    <link.Icon size={14} color={hoveredLink === link.id ? '#C9B99A' : 'rgba(201,185,154,0.45)'} strokeWidth={1.25} />
                  </div>
                  <div>
                    <p style={{ fontFamily:'var(--font-body)', fontSize:'10px', letterSpacing:'0.32em', textTransform:'uppercase', color: hoveredLink === link.id ? '#E0D0B8' : 'rgba(226,226,232,0.65)', transition:'color 0.3s' }}>
                      {link.label}
                    </p>
                    <p style={{ fontFamily:'var(--font-cormorant)', fontSize:'14px', fontStyle:'italic', color:'rgba(201,185,154,0.4)', marginTop:'2px' }}>
                      {link.sub}
                    </p>
                  </div>
                </div>
                <ArrowUpRight size={14} color="rgba(201,185,154,0.25)"
                  style={{ transition:'transform 0.3s, opacity 0.3s', transform: hoveredLink === link.id ? 'translate(3px,-3px)' : 'none', opacity: hoveredLink === link.id ? 0.75 : 0.2 }}
                />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Footer strip */}
        <motion.div
          initial={{ opacity:0 }} animate={inView ? { opacity:1 } : {}}
          transition={{ duration:1.2, delay:0.55 }}
          className="mt-24 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderTop:'1px solid rgba(201,185,154,0.06)' }}
        >
          <p style={{ fontFamily:'var(--font-cormorant)', fontSize:'12px', fontStyle:'italic', color:'rgba(201,185,154,0.25)', letterSpacing:'0.08em' }}>
            © {new Date().getFullYear()} The Collection Islamabad. All rights reserved.
          </p>
          <p style={{ fontFamily:'var(--font-body)', fontSize:'9px', letterSpacing:'0.5em', textTransform:'uppercase', color:'rgba(201,185,154,0.18)' }}>
            By Appointment Only
          </p>
        </motion.div>
      </div>
    </section>
  )
}
