import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ListProps {
  children: ReactNode
  className?: string
}

interface ListItemProps {
  children: ReactNode
  className?: string
}

export function UnorderedList({ children, className, ...props }: ListProps) {
  return (
    <ul
      className={cn(
        'my-6 ml-6 list-disc space-y-2 text-foreground',
        '[&>li]:pl-2',
        className
      )}
      {...props}
    >
      {children}
    </ul>
  )
}

export function OrderedList({ children, className, ...props }: ListProps) {
  return (
    <ol
      className={cn(
        'my-6 ml-6 list-decimal space-y-2 text-foreground',
        '[&>li]:pl-2',
        className
      )}
      {...props}
    >
      {children}
    </ol>
  )
}

export function ListItem({ children, className, ...props }: ListItemProps) {
  return (
    <li
      className={cn(
        'leading-7',
        '[&>ul]:my-3 [&>ol]:my-3',
        '[&>ul]:ml-4 [&>ol]:ml-4',
        className
      )}
      {...props}
    >
      {children}
    </li>
  )
} 