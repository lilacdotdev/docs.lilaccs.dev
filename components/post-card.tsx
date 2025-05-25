"use client"

import Image from "next/image"
import { Calendar } from "lucide-react"

interface Post {
  id: string
  title: string
  subtitle: string
  date: string
  tags: string[]
  image: string
}

interface PostCardProps {
  post: Post
  onClick?: () => void
}

export function PostCard({ post, onClick }: PostCardProps) {
  return (
    <article
      className="post-card p-6 border border-foreground/20 rounded-xl bg-background/50 backdrop-blur-sm cursor-pointer"
      onClick={onClick}
    >
      <div className="flex gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-2 text-foreground">{post.title}</h2>
          <p className="text-foreground/70 mb-4 leading-relaxed">{post.subtitle}</p>

          <div className="flex items-center gap-2 mb-4 text-sm text-foreground/60">
            <Calendar className="w-4 h-4" />
            {post.date}
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-foreground/10 text-foreground/80 rounded-full text-xs font-medium border border-foreground/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0">
          <div className="w-32 h-24 relative rounded-lg overflow-hidden border border-foreground/20">
            <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
          </div>
        </div>
      </div>
    </article>
  )
}
