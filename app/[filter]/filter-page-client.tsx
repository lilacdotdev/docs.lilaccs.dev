"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PostCard } from "@/components/post-card"
import { ThemeToggle } from "@/components/theme-toggle"
import { PostDetail } from "@/components/post-detail"
import { validFilters } from "./layout"

type Post = {
  id: string
  title: string
  subtitle: string
  date: string
  tags: string[]
  image: string
  content: string
}

type FilterPageClientProps = {
  filterTag: string
  filteredPosts: Post[]
  filter: string
}

export function FilterPageClient({ filterTag, filteredPosts, filter }: FilterPageClientProps) {
  const router = useRouter()
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  useEffect(() => {
    // Double-check filter validity on client-side
    if (!validFilters.includes(filter)) {
      router.push("/")
      return
    }
  }, [filter, router])

  const handlePostClick = (post: Post) => {
    setSelectedPost(post)
  }

  const handleBackToList = () => {
    setSelectedPost(null)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <main className="flex-1 p-8 transition-all duration-300 ease-in-out">
        {selectedPost ? (
          <PostDetail post={selectedPost} onBack={handleBackToList} />
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Header with theme toggle */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">{filterTag} Posts</h1>
                <p className="text-foreground/60">
                  {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"} found
                </p>
              </div>
              <ThemeToggle />
            </div>

            {/* Posts */}
            <div className="space-y-6">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} onClick={() => handlePostClick(post)} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-foreground/60 text-lg">No posts found for {filterTag}.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
} 