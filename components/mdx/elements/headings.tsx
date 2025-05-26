import { ReactNode, createElement } from 'react'
import { cn } from '@/lib/utils'

interface HeadingProps {
  children: ReactNode
  id?: string
  className?: string
}

const createHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
  const Component = ({ children, id, className, ...props }: HeadingProps) => {
    const tag = `h${level}`

    const baseClasses = 'font-semibold tracking-tight text-foreground'
    
    const sizeClasses = {
      1: 'text-4xl lg:text-5xl mb-8 mt-12 first:mt-0',
      2: 'text-3xl lg:text-4xl mb-6 mt-10 first:mt-0',
      3: 'text-2xl lg:text-3xl mb-4 mt-8 first:mt-0',
      4: 'text-xl lg:text-2xl mb-3 mt-6 first:mt-0',
      5: 'text-lg lg:text-xl mb-2 mt-4 first:mt-0',
      6: 'text-base lg:text-lg mb-2 mt-4 first:mt-0',
    }

    return createElement(
      tag,
      {
        id,
        className: cn(baseClasses, sizeClasses[level], className),
        ...props,
      },
      children
    )
  }

  Component.displayName = `H${level}`
  return Component
}

export const H1 = createHeading(1)
export const H2 = createHeading(2)
export const H3 = createHeading(3)
export const H4 = createHeading(4)
export const H5 = createHeading(5)
export const H6 = createHeading(6) 