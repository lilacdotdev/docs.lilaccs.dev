'use client'

import { useTheme } from 'next-themes'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface CodePenProps {
  id: string
  height?: number
  defaultTab?: 'html' | 'css' | 'js' | 'result'
}

export function CodePen({
  id,
  height = 400,
  defaultTab = 'result',
}: CodePenProps) {
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Theme-aware placeholder gradients
  const placeholderClasses = {
    light: 'from-zinc-100 to-zinc-200',
    dark: 'from-zinc-800 to-zinc-900',
  }

  const currentTheme = theme === 'dark' ? 'dark' : 'light'

  return (
    <div className="my-8">
      <motion.div
        className="relative overflow-hidden rounded-lg"
        style={{ height }}
        initial={false}
        animate={{
          opacity: isLoading ? 0.5 : 1,
        }}
      >
        {/* Loading/Error State */}
        {(isLoading || hasError) && (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${
              placeholderClasses[currentTheme]
            }`}
          >
            <p className="text-sm text-muted-foreground">
              {hasError ? 'CodePen Embed Not Available' : 'Loading CodePen...'}
            </p>
          </div>
        )}

        {/* CodePen Embed */}
        <iframe
          height={height}
          style={{ width: '100%' }}
          scrolling="no"
          title={`CodePen Embed ${id}`}
          src={`https://codepen.io/embed/${id}?default-tab=${defaultTab}&theme-id=${currentTheme}`}
          frameBorder="no"
          loading="lazy"
          allowTransparency={true}
          allowFullScreen={true}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true)
            setIsLoading(false)
          }}
        >
          See the Pen on{' '}
          <a href={`https://codepen.io/pen/${id}`}>CodePen</a>.
        </iframe>
      </motion.div>
    </div>
  )
} 