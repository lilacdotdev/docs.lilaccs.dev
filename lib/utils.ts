import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes with proper order and conflict resolution
 * @param inputs - Class values to merge (strings, objects, arrays, or falsy values)
 * @returns Merged and optimized class string
 * @example
 * ```tsx
 * // Basic usage
 * cn('text-red-500', 'bg-blue-500')
 * 
 * // With conditions
 * cn('base-class', isActive && 'active-class')
 * 
 * // With Tailwind conflicts
 * cn('px-2 py-1', 'p-4') // p-4 will take precedence
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
