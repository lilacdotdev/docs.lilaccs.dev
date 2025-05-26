'use client'

import { Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useSearchParams } from 'next/navigation'
import { Sidebar } from '@/components/sidebar/sidebar'
import { useSidebarStore } from '@/lib/store/sidebar'

interface RootLayoutProps {
  children: React.ReactNode
}

function RootLayoutContent({ children }: RootLayoutProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const key = pathname + searchParams.toString()
  const { isCollapsed } = useSidebarStore()

  return (
    <div className="flex min-h-screen">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-screen z-40">
        <Suspense fallback={<div className="w-16 h-screen bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800" />}>
          <Sidebar />
        </Suspense>
      </div>
      
      {/* Main Content with dynamic left margin based on sidebar state */}
      <motion.div 
        className="flex-1"
        animate={{ 
          marginLeft: isCollapsed ? '4rem' : '16rem' 
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <AnimatePresence mode="wait">
          <motion.main
            key={key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen">
        <div className="w-16 h-screen bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800" />
        <div className="flex-1 ml-16">
          {children}
        </div>
      </div>
    }>
      <RootLayoutContent>{children}</RootLayoutContent>
    </Suspense>
  )
} 