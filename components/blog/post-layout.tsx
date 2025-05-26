'use client'

import { format } from 'date-fns'
import { Post } from '@/types/post'
import { ThemeToggle } from '@/components/theme-toggle'

interface PostLayoutProps {
  post: Post
  children: React.ReactNode
}

export function PostLayout({ post, children }: PostLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/75 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/75">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <a href="/" className="text-lg font-semibold">
              Lilac Docs
            </a>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Post Header */}
        <div className="mb-8 border-b border-zinc-200 pb-8 dark:border-zinc-800">
          <h1 className="mb-2 text-4xl font-bold tracking-tight">
            {post.title}
          </h1>
          <p className="mb-4 text-lg text-zinc-600 dark:text-zinc-400">
            {post.description}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <time className="text-sm text-zinc-600 dark:text-zinc-400">
              {format(new Date(post.date), 'MMMM d, yyyy')}
            </time>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/?filter=${tag}`}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Post Content */}
        <article className="prose prose-zinc mx-auto dark:prose-invert">
          {children}
        </article>
      </main>
    </div>
  )
} 