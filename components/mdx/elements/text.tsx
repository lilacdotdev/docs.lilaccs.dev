import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TextProps {
  children: ReactNode
  className?: string
}

export function Strong({ children, className, ...props }: TextProps) {
  return (
    <strong
      className={cn('font-semibold text-foreground', className)}
      {...props}
    >
      {children}
    </strong>
  )
}

export function Emphasis({ children, className, ...props }: TextProps) {
  return (
    <em
      className={cn('italic text-foreground/90', className)}
      {...props}
    >
      {children}
    </em>
  )
}

export function InlineCode({ children, className, ...props }: TextProps) {
  return (
    <code
      className={cn(
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem]',
        'text-sm font-mono text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </code>
  )
}

export function Blockquote({ children, className, ...props }: TextProps) {
  return (
    <blockquote
      className={cn(
        'my-6 border-l-4 border-primary/30 pl-6 italic',
        'text-muted-foreground',
        '[&>p]:my-2',
        className
      )}
      {...props}
    >
      {children}
    </blockquote>
  )
}

export function Paragraph({ children, className, ...props }: TextProps) {
  return (
    <p
      className={cn(
        'leading-7 text-foreground',
        '[&:not(:first-child)]:mt-6',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export function HorizontalRule({ className, ...props }: Omit<TextProps, 'children'>) {
  return (
    <hr
      className={cn(
        'my-8 border-t border-gray-200 dark:border-gray-800',
        className
      )}
      {...props}
    />
  )
} 