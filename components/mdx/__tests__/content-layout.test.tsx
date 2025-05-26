import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ContentLayout } from '../layout/content-layout'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
  },
}))

describe('ContentLayout', () => {
  it('should render children', () => {
    render(
      <ContentLayout>
        <h1>Test Content</h1>
        <p>This is test content.</p>
      </ContentLayout>
    )
    
    expect(screen.getByText('Test Content')).toBeDefined()
    expect(screen.getByText('This is test content.')).toBeDefined()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <ContentLayout className="custom-class">
        <p>Content</p>
      </ContentLayout>
    )
    
    const article = container.querySelector('article')
    expect(article?.className).toContain('custom-class')
  })

  it('should have proper prose classes', () => {
    const { container } = render(
      <ContentLayout>
        <p>Content</p>
      </ContentLayout>
    )
    
    const article = container.querySelector('article')
    expect(article?.className).toContain('prose')
    expect(article?.className).toContain('prose-zinc')
    expect(article?.className).toContain('dark:prose-invert')
  })

  it('should have responsive classes', () => {
    const { container } = render(
      <ContentLayout>
        <p>Content</p>
      </ContentLayout>
    )
    
    const article = container.querySelector('article')
    expect(article?.className).toContain('max-w-4xl')
    expect(article?.className).toContain('mx-auto')
    expect(article?.className).toContain('px-4')
  })
}) 