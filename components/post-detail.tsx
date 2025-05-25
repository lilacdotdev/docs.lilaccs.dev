"use client"

import Image from "next/image"
import { Calendar, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

interface Post {
  id: string
  title: string
  subtitle: string
  date: string
  tags: string[]
  image: string
  content: string
}

interface PostDetailProps {
  post: Post
  onBack: () => void
}

export function PostDetail({ post, onBack }: PostDetailProps) {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with back button and theme toggle */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-foreground/5 transition-all duration-200 hover-glow"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to posts
        </button>
        <ThemeToggle />
      </div>

      {/* Post header section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left column - Post info */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-4xl font-bold text-foreground leading-tight">{post.title}</h1>

          <p className="text-xl text-foreground/70 leading-relaxed">{post.subtitle}</p>

          <div className="flex items-center gap-2 text-foreground/60">
            <Calendar className="w-5 h-5" />
            <span className="text-lg">{post.date}</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-foreground/10 text-foreground/80 rounded-full text-sm font-medium border border-foreground/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right column - Main image */}
        <div className="lg:col-span-1">
          <div className="w-full h-full min-h-[300px] relative rounded-xl overflow-hidden border border-foreground/20">
            <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
          </div>
        </div>
      </div>

      {/* Horizontal divider */}
      <div className="w-full h-px bg-foreground/20 mb-8"></div>

      {/* Main content with proper heading and strong styling */}
      <div className="prose prose-lg max-w-none">
        <div
          className="text-foreground/80 leading-relaxed space-y-6 [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_h4]:text-foreground [&_h5]:text-foreground [&_h6]:text-foreground [&_strong]:text-foreground [&_b]:text-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  )
}
