import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TableProps {
  children: ReactNode
  className?: string
}

export function Table({ children, className, ...props }: TableProps) {
  return (
    <div className="my-6 w-full overflow-auto">
      <table
        className={cn(
          'w-full border-collapse border border-border',
          className
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, className, ...props }: TableProps) {
  return (
    <thead
      className={cn('bg-muted/50', className)}
      {...props}
    >
      {children}
    </thead>
  )
}

export function TableBody({ children, className, ...props }: TableProps) {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  )
}

export function TableRow({ children, className, ...props }: TableProps) {
  return (
    <tr
      className={cn(
        'border-b border-border',
        'hover:bg-muted/30 transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
}

export function TableHead({ children, className, ...props }: TableProps) {
  return (
    <th
      className={cn(
        'border border-border px-4 py-2 text-left font-semibold',
        'text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </th>
  )
}

export function TableCell({ children, className, ...props }: TableProps) {
  return (
    <td
      className={cn(
        'border border-border px-4 py-2',
        'text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </td>
  )
} 