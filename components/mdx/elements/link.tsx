import { ReactNode } from 'react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MDXLinkProps {
  href: string
  children: ReactNode
  className?: string
}

export function MDXLink({ href, children, className, ...props }: MDXLinkProps) {
  const isExternal = href.startsWith('http') || href.startsWith('mailto:')
  const isAnchor = href.startsWith('#')

  const linkClasses = cn(
    'text-primary underline underline-offset-4 decoration-primary/30',
    'hover:decoration-primary/60 transition-colors',
    'inline-flex items-center gap-1',
    className
  )

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
        {...props}
      >
        {children}
        <ExternalLink className="h-3 w-3 opacity-60" />
      </a>
    )
  }

  if (isAnchor) {
    return (
      <a href={href} className={linkClasses} {...props}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={linkClasses} {...props}>
      {children}
    </Link>
  )
} 