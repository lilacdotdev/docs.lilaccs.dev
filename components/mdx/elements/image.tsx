'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface MDXImageProps {
  src: string
  alt: string
  caption?: string
  priority?: boolean
}

export function MDXImage({ src, alt, caption, priority = false }: MDXImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Theme-aware placeholder gradients
  const placeholderClasses = {
    light: 'from-zinc-100 to-zinc-200',
    dark: 'from-zinc-800 to-zinc-900',
  }

  // Error state gradients
  const errorClasses = {
    light: 'from-red-50 to-red-100',
    dark: 'from-red-950 to-red-900',
  }

  const gradientClass = hasError
    ? errorClasses[isDark ? 'dark' : 'light']
    : placeholderClasses[isDark ? 'dark' : 'light']

  return (
    <figure className="w-full">
      <motion.div
        className="relative aspect-video w-full overflow-hidden rounded-lg"
        initial={false}
        animate={{
          opacity: isLoading ? 0.5 : 1,
        }}
      >
        {/* Placeholder/Error Background */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br',
            gradientClass
          )}
        />

        {/* Image */}
        {!hasError && (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(min-width: 1280px) 80vw, 100vw"
            priority={priority}
            onLoadingComplete={() => setIsLoading(false)}
            onError={() => {
              setHasError(true)
              setIsLoading(false)
            }}
          />
        )}

        {/* Error Overlay */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Image Not Available
            </p>
          </div>
        )}
      </motion.div>

      {/* Caption */}
      {(caption || hasError) && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {hasError ? 'Image Not Found' : caption}
        </figcaption>
      )}
    </figure>
  )
} 