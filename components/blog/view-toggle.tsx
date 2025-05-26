'use client'

import { LayoutGrid, LayoutList } from 'lucide-react'
import { motion } from 'framer-motion'
import { useViewPreferenceStore } from '@/lib/store/view-preference'
import { Button } from '@/components/ui/button'

export function ViewToggle() {
  const { viewMode, toggleViewMode } = useViewPreferenceStore()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleViewMode}
      className="relative h-9 w-9 rounded-lg"
    >
      <motion.div
        initial={false}
        animate={{ opacity: viewMode === 'card' ? 1 : 0 }}
        className="absolute"
      >
        <LayoutGrid className="h-5 w-5" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{ opacity: viewMode === 'list' ? 1 : 0 }}
        className="absolute"
      >
        <LayoutList className="h-5 w-5" />
      </motion.div>
      <span className="sr-only">Toggle view mode</span>
    </Button>
  )
} 