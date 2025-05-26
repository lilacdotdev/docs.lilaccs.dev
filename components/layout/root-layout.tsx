'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useSearchParams } from 'next/navigation'
import { Sidebar } from '@/components/sidebar/sidebar'

interface RootLayoutProps {
  children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const key = pathname + searchParams.toString()

  return (
    <div className="flex">
      <Sidebar />
      <AnimatePresence mode="wait">
        <motion.main
          key={key}
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