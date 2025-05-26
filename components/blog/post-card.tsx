'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { PostImage } from './post-image'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface PostCardProps {
  post: {
    id: string
    title: string
    description: string
    image?: string
    date: string
    tags: string[]
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md"
    >
      <Link href={`/${post.tags[0]}/${post.id}`} className="flex-1">
        <PostImage src={post.image} alt={post.title} />
        <div className="flex flex-col space-y-1.5 p-4">
          <h3 className="line-clamp-2 text-lg font-semibold">{post.title}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {post.description}
          </p>
          <time
            dateTime={post.date}
            className="text-sm text-muted-foreground"
          >
            {format(new Date(post.date), 'MMMM d, yyyy')}
          </time>
        </div>
      </Link>
      <div className="flex flex-wrap gap-2 p-4 pt-0">
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
    </motion.div>
  )
} 