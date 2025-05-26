import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Use custom Image component for optimized images
    img: (props) => (
      <div className="relative my-6 h-64 w-full overflow-hidden rounded-lg">
        <Image
          alt={props.alt || 'Blog image'}
          className="object-cover"
          fill
          {...props}
        />
      </div>
    ),
    // Override default heading styles
    h1: (props) => (
      <h1 className="mb-6 text-3xl font-bold tracking-tight" {...props} />
    ),
    h2: (props) => (
      <h2 className="mb-4 mt-8 text-2xl font-semibold tracking-tight" {...props} />
    ),
    h3: (props) => (
      <h3 className="mb-4 mt-6 text-xl font-semibold tracking-tight" {...props} />
    ),
    // Style paragraphs
    p: (props) => (
      <p className="mb-4 leading-7 [&:not(:first-child)]:mt-4" {...props} />
    ),
    // Style code blocks
    pre: (props) => (
      <pre className="mb-4 mt-4 overflow-x-auto rounded-lg bg-black p-4 dark:bg-zinc-900" {...props} />
    ),
    code: (props) => (
      <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-sm dark:bg-zinc-700" {...props} />
    ),
    // Style lists
    ul: (props) => (
      <ul className="mb-4 ml-6 list-disc [&>li]:mt-2" {...props} />
    ),
    ol: (props) => (
      <ol className="mb-4 ml-6 list-decimal [&>li]:mt-2" {...props} />
    ),
    // Merge custom components
    ...components,
  }
} 