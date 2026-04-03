'use client'
import { useRef } from 'react'
import { useMotionValue } from 'framer-motion'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props { isVisible: boolean }

const LINKS = [
  { label: 'The Collection', href: '#gallery' },
  { label: 'Specifications',  href: '#specs'   },
  { label: 'Provenance',      href: '#contact' },
]

export default function Navigation({ isVisible }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed top-0 left-0 right-0 z-50"
          style={{
            background: scrolled
              ? 'rgba(8,8,10,0.82)'
              : 'transparent',
            backdropFilter: scrolled ? 'blur(22px)' : 'none',
            borderBottom: scrolled ? '1px solid rgba(201,185,154,0.08)' : 'none',
            transition: 'background 0.5s, backdrop-filter 0.5s, border 0.5s',
          }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">

            {/* Wordmark */}
            <a href="#" className="flex flex-col leading-none group" data-cursor>
              <span style={{
                fontFamily: 'var(--font-cormorant)',
                fontSize: '18px',
                fontWeight: 400,
                letterSpacing: '0.12em',
                color: '#C9B99A',
              }}>
                The Collection
              </span>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: '8.5px',
                letterSpacing: '0.48em',
                color: 'rgba(201,185,154,0.45)',
                textTransform: 'uppercase',
                marginTop: '1px',
              }}>
                Islamabad
              </span>
            </a>

            {/* Desktop links */}
            <nav className="hidden md:flex items-center gap-10">
              {LINKS.map(link => (
                
                  key={link.href}
                  href={link.href}
                  data-cursor
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    letterSpacing: '0.32em',
                    textTransform: 'uppercase',
                    color: 'rgba(201,185,154,0.55)',
                    transition: 'color 0.3s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#E0D0B8')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(201,185,154,0.55)')}
                >
                  {link.label}
                </a>
              ))}

              {/* CTA */}
              <MagneticButton
                label="Request Access"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              />
            </nav>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-[5px] p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              data-cursor
              aria-label="Toggle menu"
            >
              {[0,1,2].map(i => (
                <motion.span
                  key={i}
                  className="block h-[1px] bg-white-gold"
                  style={{ width: i === 1 ? 18 : 24, background: '#C9B99A' }}
                  animate={menuOpen
                    ? { rotate: i===0 ? 45 : i===2 ? -45 : 0, y: i===0 ? 6 : i===2 ? -6 : 0, opacity: i===1 ? 0 : 1 }
                    : { rotate: 0, y: 0, opacity: 1 }
                  }
                />
              ))}
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="md:hidden overflow-hidden"
                style={{ background: 'rgba(8,8,10,0.96)', borderTop: '1px solid rgba(201,185,154,0.08)' }}
              >
                <div className="px-6 py-6 flex flex-col gap-6">
                  {LINKS.map(link => (
                    
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '12px',
                        letterSpacing: '0.38em',
                        textTransform: 'uppercase',
                        color: 'rgba(201,185,154,0.7)',
                        textDecoration: 'none',
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.header>
      )}
    </AnimatePresence>
  )
}

/* ── Magnetic Button ───────────────────────── */
function MagneticButton({ label, onClick }: { label: string; onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null!)
  const x   = useMotionValue(0)
  const y   = useMotionValue(0)

  const handleMove = (e: React.MouseEvent) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width  / 2) * 0.35)
    y.set((e.clientY - r.top  - r.height / 2) * 0.35)
  }
  const handleLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      data-cursor
      className="px-5 py-2 text-[10px] uppercase tracking-[0.32em]"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '10px',
        letterSpacing: '0.32em',
        color: '#08080A',
        background: 'linear-gradient(135deg,#C9B99A,#E0D0B8)',
        border: 'none',
        padding: '9px 22px',
        cursor: 'none',
        x, y,
      }}
    >
      {label}
    </motion.button>
  )
}


