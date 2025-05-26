import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn utility', () => {
  describe('basic functionality', () => {
    it('should merge single classes', () => {
      expect(cn('text-red-500')).toBe('text-red-500')
    })

    it('should merge multiple classes', () => {
      expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500')
    })

    it('should handle empty input', () => {
      expect(cn()).toBe('')
      expect(cn('')).toBe('')
    })

    it('should handle whitespace', () => {
      expect(cn('  text-red-500  ', ' bg-blue-500 ')).toBe('text-red-500 bg-blue-500')
    })
  })

  describe('conditional classes', () => {
    it('should handle boolean conditions', () => {
      expect(cn('base', true && 'included', false && 'excluded')).toBe('base included')
    })

    it('should handle undefined and null', () => {
      expect(cn('base', undefined, null)).toBe('base')
    })

    it('should handle falsy values', () => {
      expect(cn('base', 0, '', false, null, undefined)).toBe('base')
    })

    it('should handle object syntax', () => {
      expect(cn('base', { 'text-red-500': true, 'bg-blue-500': false })).toBe('base text-red-500')
    })
  })

  describe('tailwind conflicts', () => {
    it('should resolve padding conflicts', () => {
      expect(cn('p-4', 'px-2')).toBe('p-4 px-2')
      expect(cn('px-2 py-1', 'p-4')).toBe('p-4')
    })

    it('should resolve responsive classes', () => {
      expect(cn('p-2', 'sm:p-4', 'lg:p-8')).toBe('p-2 sm:p-4 lg:p-8')
    })

    it('should resolve state variants', () => {
      expect(cn('hover:bg-blue-500', 'hover:bg-red-500')).toBe('hover:bg-red-500')
    })

    it('should handle color schemes', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    })
  })

  describe('edge cases', () => {
    it('should handle special characters', () => {
      expect(cn('class!', '[&>*]:text-red-500')).toBe('class! [&>*]:text-red-500')
    })

    it('should remove duplicate classes', () => {
      expect(cn('text-red-500', 'text-red-500')).toBe('text-red-500')
    })

    it('should preserve arbitrary values', () => {
      expect(cn('[&>*]:text-red-500', 'text-[#custom]')).toBe('[&>*]:text-red-500 text-[#custom]')
    })
  })

  describe('documentation examples', () => {
    it('should validate basic usage example', () => {
      expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500')
    })

    it('should validate conditional example', () => {
      const isActive = true
      expect(cn('base-class', isActive && 'active-class')).toBe('base-class active-class')
    })

    it('should validate conflict resolution example', () => {
      expect(cn('px-2 py-1', 'p-4')).toBe('p-4')
    })
  })
}) 