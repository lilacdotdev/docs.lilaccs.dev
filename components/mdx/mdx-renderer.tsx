'use client'

import { ErrorBoundary } from 'react-error-boundary'
import { ContentLayout } from './layout/content-layout'
import { LoadingDots } from '../ui/loading-dots'

interface MDXRendererProps {
  source: {
    compiledSource: string
    frontmatter?: Record<string, any>
  }
  isLoading?: boolean
}

function MDXErrorFallback({ error }: { error: Error }) {
  return (
    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
      <h2 className="text-lg font-semibold text-destructive">
        Content Error
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        There was an error rendering this content. Please try refreshing the page.
      </p>
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-muted-foreground">
          Error Details
        </summary>
        <pre className="mt-2 text-xs text-muted-foreground">
          {error.message}
        </pre>
      </details>
    </div>
  )
}

function LoadingState() {
  return (
    <ContentLayout>
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <LoadingDots />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading content...
          </p>
        </div>
      </div>
    </ContentLayout>
  )
}

// Simple markdown renderer for React 19 compatibility
function SimpleMDXContent({ source }: { source: string }) {
  // Parse simple markdown patterns
  const parseMarkdown = (content: string) => {
    // Split into lines and process
    const lines = content.split('\n')
    const elements: React.ReactElement[] = []
    let currentIndex = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // Headers
      if (line.startsWith('# ')) {
        elements.push(<h1 key={currentIndex++} className="mb-6 text-3xl font-bold tracking-tight">{line.slice(2)}</h1>)
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={currentIndex++} className="mb-4 mt-8 text-2xl font-semibold tracking-tight">{line.slice(3)}</h2>)
      } else if (line.startsWith('### ')) {
        elements.push(<h3 key={currentIndex++} className="mb-4 mt-6 text-xl font-semibold tracking-tight">{line.slice(4)}</h3>)
      } else if (line.startsWith('#### ')) {
        elements.push(<h4 key={currentIndex++} className="mb-3 mt-5 text-lg font-semibold tracking-tight">{line.slice(5)}</h4>)
      } else if (line.startsWith('##### ')) {
        elements.push(<h5 key={currentIndex++} className="mb-3 mt-4 text-base font-semibold tracking-tight">{line.slice(6)}</h5>)
      } else if (line.startsWith('###### ')) {
        elements.push(<h6 key={currentIndex++} className="mb-2 mt-4 text-sm font-semibold tracking-tight">{line.slice(7)}</h6>)
      } 
      // Code blocks
      else if (line.startsWith('```')) {
        const language = line.slice(3)
        const codeLines = []
        i++ // Skip the opening ```
        
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i])
          i++
        }
        
        elements.push(
          <pre key={currentIndex++} className="mb-4 mt-4 overflow-x-auto rounded-lg bg-black p-4 dark:bg-zinc-900">
            <code className={`language-${language}`}>
              {codeLines.join('\n')}
            </code>
          </pre>
        )
      }
      // Paragraphs
      else if (line.trim() && !line.startsWith('---')) {
        elements.push(<p key={currentIndex++} className="mb-4 leading-7 [&:not(:first-child)]:mt-4">{line}</p>)
      }
      // Empty lines create spacing
      else if (!line.trim()) {
        elements.push(<div key={currentIndex++} className="h-4" />)
      }
    }

    return elements
  }

  try {
    return <div>{parseMarkdown(source)}</div>
  } catch (error) {
    console.error('Error parsing markdown:', error)
    return <div>Error rendering content</div>
  }
}

export function MDXRenderer({ source, isLoading = false }: MDXRendererProps) {
  if (isLoading) {
    return <LoadingState />
  }

  return (
    <ErrorBoundary FallbackComponent={MDXErrorFallback}>
      <ContentLayout>
        <SimpleMDXContent source={source.compiledSource} />
      </ContentLayout>
    </ErrorBoundary>
  )
} 