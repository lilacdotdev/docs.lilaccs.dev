'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from '@/components/sidebar/sidebar'

interface RootLayoutProps {
  children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex">
      <Sidebar />
      <AnimatePresence mode="wait">
        <motion.main
          key={window.location.pathname + window.location.search}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex-1"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  )
} 