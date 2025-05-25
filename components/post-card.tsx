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
  slug: string
  url?: string
}

interface PostCardProps {
  post: Post
  onClick: (post: Post) => void
  layout: "grid" | "list"
}

export function PostCard({ post, onClick, layout }: PostCardProps) {
  const isGrid = layout === "grid"

  return (
    <div
      onClick={() => onClick(post)}
      className={`group relative bg-background border border-foreground/20 rounded-xl overflow-hidden hover:border-foreground/40 transition-all duration-200 cursor-pointer hover-glow ${
        isGrid ? "" : "flex"
      }`}
    >
      {/* Image */}
      <div className={`relative ${
        isGrid 
          ? "w-full aspect-video" 
          : "w-72 h-48 flex-shrink-0"
      }`}>
        <Image
          src={post.image || "/placeholder.svg"}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className={`${isGrid ? "p-6" : "flex-1 p-6"}`}>
        <h2 className="text-xl font-semibold mb-2 text-foreground">{post.title}</h2>
        <p className="text-foreground/60 mb-4">{post.subtitle}</p>

        {/* Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-foreground/60">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{post.date}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-foreground/10 text-foreground/60 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
