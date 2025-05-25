import React from 'react'

interface MDXProps {
  children: React.ReactNode
  className?: string
  [key: string]: any
}

export const mdxComponents = {
  h1: ({ children, ...props }: MDXProps) => (
    <h1 className="text-4xl font-bold mt-8 mb-4 text-foreground" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: MDXProps) => (
    <h2 className="text-3xl font-semibold mt-6 mb-4 text-foreground" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: MDXProps) => (
    <h3 className="text-2xl font-semibold mt-4 mb-3 text-foreground" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: MDXProps) => (
    <h4 className="text-xl font-semibold mt-4 mb-2 text-foreground" {...props}>
      {children}
    </h4>
  ),
  p: ({ children, ...props }: MDXProps) => (
    <p className="text-lg leading-relaxed mb-4 text-foreground/80" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: MDXProps) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-foreground/80" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: MDXProps) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-foreground/80" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: MDXProps) => (
    <li className="text-lg leading-relaxed ml-4" {...props}>
      {children}
    </li>
  ),
  pre: ({ children, ...props }: MDXProps) => (
    <pre className="bg-foreground/5 p-4 rounded-lg overflow-x-auto my-4 text-sm" {...props}>
      {children}
    </pre>
  ),
  code: ({ children, ...props }: MDXProps) => (
    <code className="bg-foreground/5 px-1.5 py-0.5 rounded font-mono text-sm" {...props}>
      {children}
    </code>
  ),
  blockquote: ({ children, ...props }: MDXProps) => (
    <blockquote className="border-l-4 border-foreground/20 pl-4 my-4 italic text-foreground/70" {...props}>
      {children}
    </blockquote>
  ),
  a: ({ children, ...props }: MDXProps) => (
    <a className="text-primary hover:underline" {...props}>
      {children}
    </a>
  ),
  hr: (props: MDXProps) => (
    <hr className="my-8 border-foreground/20" {...props} />
  ),
  table: ({ children, ...props }: MDXProps) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full divide-y divide-foreground/20" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: MDXProps) => (
    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground bg-foreground/5" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: MDXProps) => (
    <td className="px-4 py-3 text-sm text-foreground/80 border-t border-foreground/10" {...props}>
      {children}
    </td>
  ),
  img: ({ alt, ...props }: MDXProps & { alt?: string }) => (
    <div className="my-6">
      <img alt={alt} className="rounded-lg max-w-full h-auto" {...props} />
    </div>
  ),
} 