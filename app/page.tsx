'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
//import VaultEntry     from '@/components/VaultEntry'
import Navigation     from '@/components/Navigation'
import HeroSection    from '@/components/HeroSection'
import InventoryGallery from '@/components/InventoryGallery'
import TechnicalSpecs from '@/components/TechnicalSpecs'
import ContactSection from '@/components/ContactSection'
import ParticleDust   from '@/components/ParticleDust'
import CustomCursor   from '@/components/CustomCursor'

export default function Home() {
  const [isVaultOpen, setIsVaultOpen] = useState(false)

  return (
    <>
      <CustomCursor />
      <ParticleDust />

      //{!isVaultOpen && (
      //  <VaultEntry onComplete={() => setIsVaultOpen(true)} />
      //)}

     // <motion.div
       // initial={{ opacity: 0 }}
      //  animate={{ opacity: isVaultOpen ? 1 : 0 }}
      //  transition={{ duration: 1.4, delay: 0.3 }}
     // >
        //<Navigation isVisible={isVaultOpen} />
        <main>
          <HeroSection />
          <InventoryGallery />
          <TechnicalSpecs />
          <ContactSection />
        </main>
      </motion.div>
    </>
  )
}
