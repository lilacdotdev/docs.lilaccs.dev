'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ContentLayoutProps {
  children: ReactNode
  className?: string
}

export function ContentLayout({ children, className }: ContentLayoutProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        // Base layout
        'mx-auto max-w-4xl px-4 py-8',
        
        // Typography
        'prose prose-zinc dark:prose-invert',
        'prose-headings:scroll-mt-20',
        
        // Links
        'prose-a:text-primary prose-a:no-underline',
        'hover:prose-a:underline',
        
        // Code
        'prose-code:text-foreground prose-code:bg-muted',
        'prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
        'prose-code:before:content-none prose-code:after:content-none',
        
        // Pre/Code blocks
        'prose-pre:bg-muted prose-pre:border',
        'prose-pre:border-border prose-pre:rounded-lg',
        
        // Blockquotes
        'prose-blockquote:border-l-primary/30',
        'prose-blockquote:text-muted-foreground',
        
        // Tables
        'prose-table:border-border',
        'prose-th:border-border prose-td:border-border',
        
        // Images
        'prose-img:rounded-lg prose-img:border',
        'prose-img:border-border',
        
        // Lists
        'prose-li:marker:text-muted-foreground',
        
        // Responsive sizing
        'sm:px-6 lg:px-8',
        'prose-sm sm:prose-base lg:prose-lg',
        
        className
      )}
    >
      {children}
    </motion.article>
  )
} 