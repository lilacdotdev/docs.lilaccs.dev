import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MDXRenderer } from '../mdx-renderer'
import { serialize } from 'next-mdx-remote/serialize'

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light' }),
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}))

describe('MDXRenderer', () => {
  it('should render loading state', () => {
    const mockSource = {} as any
    render(<MDXRenderer source={mockSource} isLoading={true} />)
    
    expect(screen.getByText('Loading content...')).toBeDefined()
  })

  it('should render MDX content', async () => {
    const mdxSource = await serialize('# Hello World\n\nThis is a test.')
    render(<MDXRenderer source={mdxSource} />)
    
    expect(screen.getByText('Hello World')).toBeDefined()
    expect(screen.getByText('This is a test.')).toBeDefined()
  })

  it('should handle errors gracefully', () => {
    // Mock console.error to avoid noise in tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    const invalidSource = { compiledSource: 'invalid code' } as any
    render(<MDXRenderer source={invalidSource} />)
    
    expect(screen.getByText('Content Error')).toBeDefined()
    expect(screen.getByText(/There was an error rendering this content/)).toBeDefined()
    
    consoleSpy.mockRestore()
  })

  it('should render with custom components', async () => {
    const mdxSource = await serialize('```javascript\nconsole.log("test")\n```')
    render(<MDXRenderer source={mdxSource} />)
    
    // Should render code content
    expect(screen.getByText('console.log("test")')).toBeDefined()
    // Check for language class
    const codeElement = screen.getByText('console.log("test")')
    expect(codeElement.className).toContain('language-javascript')
  })
})