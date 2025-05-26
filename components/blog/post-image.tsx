'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'

interface PostImageProps {
  src?: string
  alt: string
  priority?: boolean
}

export function PostImage({ src, alt, priority = false }: PostImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // Placeholder gradients
  const lightPlaceholder = 'bg-gradient-to-br from-zinc-100 to-zinc-200'
  const darkPlaceholder = 'bg-gradient-to-br from-zinc-800 to-zinc-900'

  return (
    <motion.div
      className="relative aspect-video w-full overflow-hidden rounded-lg"
      initial={false}
      animate={{
        opacity: isLoading ? 0.5 : 1,
      }}
    >
      <div
        className={`absolute inset-0 ${
          isDark ? darkPlaceholder : lightPlaceholder
        }`}
      />
      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          priority={priority}
          onLoadingComplete={() => setIsLoading(false)}
        />
      )}
    </motion.div>
  )
} 