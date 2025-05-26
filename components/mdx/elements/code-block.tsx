'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CodeBlockProps {
  children: string
  language: string
  filename?: string
  showLineNumbers?: boolean
}

export function CodeBlock({
  children,
  language,
  filename,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [hasCopied, setHasCopied] = useState(false)

  async function copyToClipboard() {
    await navigator.clipboard.writeText(children)
    setHasCopied(true)
    setTimeout(() => setHasCopied(false), 2000)
  }

  return (
    <div className="group relative my-4 rounded-lg bg-muted">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          {filename && (
            <>
              <span className="text-sm text-muted-foreground">
                {filename}
              </span>
              <span className="text-muted-foreground/60">•</span>
            </>
          )}
          <span className="text-sm font-medium text-muted-foreground">
            {language}
          </span>
        </div>
        <button
          onClick={copyToClipboard}
          className="text-muted-foreground/60 hover:text-muted-foreground"
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={hasCopied ? 'check' : 'copy'}
              initial={{ opacity: 0, y: 2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -2 }}
              className="p-2"
            >
              {hasCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </motion.div>
          </AnimatePresence>
          <span className="sr-only">Copy code</span>
        </button>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto p-4 pt-0">
        <pre className={showLineNumbers ? 'line-numbers' : ''}>
          <code className={`language-${language}`}>{children}</code>
        </pre>
      </div>
    </div>
  )
} 