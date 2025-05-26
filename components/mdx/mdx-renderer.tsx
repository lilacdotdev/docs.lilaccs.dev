'use client'

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { ErrorBoundary } from 'react-error-boundary'
import { ContentLayout } from './layout/content-layout'
import { mdxComponents } from './mdx-components'
import { LoadingDots } from '../ui/loading-dots'

interface MDXRendererProps {
  source: MDXRemoteSerializeResult
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

export function MDXRenderer({ source, isLoading = false }: MDXRendererProps) {
  if (isLoading) {
    return <LoadingState />
  }

  return (
    <ErrorBoundary FallbackComponent={MDXErrorFallback}>
      <ContentLayout>
        <MDXRemote {...source} components={mdxComponents} />
      </ContentLayout>
    </ErrorBoundary>
  )
} 