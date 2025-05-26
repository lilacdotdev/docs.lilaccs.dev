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

/**
 * Format a date string into a human-readable format
 * @param dateString - ISO date string or date string
 * @returns Formatted date string
 * @example
 * ```tsx
 * formatDate('2024-12-15') // "December 15, 2024"
 * formatDate('2024-01-01') // "January 1, 2024"
 * ```
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

/**
 * Convert a tag to a URL-safe slug
 * @param tag - The tag to convert
 * @returns URL-safe slug
 * @example
 * ```tsx
 * tagToSlug('AI/ML') // "ai-ml"
 * tagToSlug('Getting Started') // "getting-started"
 * tagToSlug('Web Dev') // "web-dev"
 * ```
 */
export function tagToSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[\/\\]/g, '-') // Replace forward/back slashes with dashes
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/[^a-z0-9-]/g, '') // Remove any other special characters
    .replace(/-+/g, '-') // Replace multiple dashes with single dash
    .replace(/^-|-$/g, '') // Remove leading/trailing dashes
}

/**
 * Check if a tag matches a slug
 * @param tag - The original tag
 * @param slug - The URL slug to match against
 * @returns Whether the tag matches the slug
 * @example
 * ```tsx
 * tagMatchesSlug('AI/ML', 'ai-ml') // true
 * tagMatchesSlug('Getting Started', 'getting-started') // true
 * ```
 */
export function tagMatchesSlug(tag: string, slug: string): boolean {
  return tagToSlug(tag) === slug.toLowerCase()
}
