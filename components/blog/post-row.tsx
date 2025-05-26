'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { PostImage } from './post-image'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { tagToSlug } from '@/lib/utils'

interface PostRowProps {
  post: {
    id: string
    title: string
    description: string
    image?: string
    date: string
    tags: string[]
  }
}

export function PostRow({ post }: PostRowProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group relative flex overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md"
    >
      <Link
        href={`/${tagToSlug(post.tags[0])}/${post.id}`}
        className="flex flex-1 items-center gap-4 p-4 sm:gap-6"
      >
        <div className="w-24 flex-none sm:w-36 md:w-48">
          <PostImage src={post.image} alt={post.title} />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div>
            <h3 className="line-clamp-1 text-lg font-semibold">
              {post.title}
            </h3>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {post.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <time
              dateTime={post.date}
              className="text-sm text-muted-foreground"
            >
              {format(new Date(post.date), 'MMMM d, yyyy')}
            </time>
            <span className="text-muted-foreground">•</span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/?filter=${tag}`}
                  className="no-underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Badge
                    variant="secondary"
                    className="transition-colors hover:bg-secondary/80"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
} 