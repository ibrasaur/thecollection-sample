import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets:  ['latin'],
  weight:   ['300','400','500','600'],
  style:    ['normal','italic'],
  variable: '--font-cormorant',
  display:  'swap',
})

const jost = Jost({
  subsets:  ['latin'],
  weight:   ['300','400','500','600'],
  variable: '--font-jost',
  display:  'swap',
})

export const metadata: Metadata = {
  title:       'The Collection Islamabad — Rare Automobiles',
  description: "Pakistan's most curated private automotive gallery. Selected for rarity, provenance, and character.",
  keywords:    ['luxury cars Islamabad','Range Rover','Mercedes S63','Audi e-tron GT','premium automobiles Pakistan'],
  openGraph: {
    title:       'The Collection Islamabad',
    description: 'Where rare machines find distinguished owners.',
    type:        'website',
    locale:      'en_PK',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  )
}
