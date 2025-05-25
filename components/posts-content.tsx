"use client"

import { useState, useEffect, Suspense } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { PostCard } from "@/components/post-card"
import { PostDetail } from "@/components/post-detail"
import { ThemeToggle } from "@/components/theme-toggle"
import { type Post, type PostMeta } from "@/lib/posts"
import { FileX, ArrowLeft, LayoutGrid, LayoutList } from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"

interface PostsContentProps {
  initialPosts: PostMeta[]
}

const LAYOUT_KEY = 'postsLayout'

function PostsContentInner({ initialPosts }: PostsContentProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGridLayout, setIsGridLayout] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize layout from localStorage and handle mounting
  useEffect(() => {
    const saved = localStorage.getItem(LAYOUT_KEY)
    if (saved) {
      setIsGridLayout(saved === 'grid')
    }
    setMounted(true)
  }, [])

  // Save layout preference whenever it changes
  const toggleLayout = () => {
    const newLayout = !isGridLayout
    setIsGridLayout(newLayout)
    localStorage.setItem(LAYOUT_KEY, newLayout ? 'grid' : 'list')
  }

  const handleFilterChange = (filter: string | null) => {
    setIsLoading(true)
    setSelectedPost(null)
    if (filter) {
      const urlFilter = filter.toLowerCase().replace(/\s+/g, '-')
      router.push(`/?filter=${urlFilter}`)
    } else {
      router.push("/")
    }
    setIsLoading(false)
  }

  // Get current filter from search params and pathname
  const currentFilter = searchParams.get('filter')?.replace(/-/g, ' ')
  const isAllPostsActive = !currentFilter && pathname === "/"
  const normalizedFilter = currentFilter ? currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1) : null

  const handlePostClick = async (post: PostMeta) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/posts/${post.slug}`)
      const fullPost = await response.json()
      if (fullPost) {
        setSelectedPost(fullPost)
        const tag = post.tags[0].toLowerCase().replace(/\s+/g, '-')
        router.push(`/${tag}/${post.url || post.slug}`)
      }
    } catch (error) {
      console.error("Error loading post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToList = () => {
    setSelectedPost(null)
    if (currentFilter) {
      router.push(`/?filter=${currentFilter.toLowerCase().replace(/\s+/g, '-')}`)
    } else {
      router.push("/")
    }
  }

  const handleBackToAll = () => {
    router.push("/")
  }

  // Clear loading state when posts change
  useEffect(() => {
    setIsLoading(false)
  }, [initialPosts])

  // Restore layout preference when pathname changes
  useEffect(() => {
    const saved = localStorage.getItem(LAYOUT_KEY)
    if (saved) {
      setIsGridLayout(saved === 'grid')
    }
  }, [pathname])

  // If no posts are found
  if (initialPosts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <FileX className="w-16 h-16 text-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Posts Found</h2>
        <p className="text-foreground/60 mb-6">
          {normalizedFilter
            ? `No posts found in the "${normalizedFilter}" category.`
            : "No posts found."}
        </p>
        {normalizedFilter && (
          <button
            onClick={handleBackToAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-foreground/5 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all posts
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="p-8 pt-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-background/80 backdrop-blur-sm z-10 -mx-8 px-8 py-4">
          <h1 className="text-3xl font-bold animate-fade-in">
            {normalizedFilter ? `${normalizedFilter} Posts` : "All Posts"}
          </h1>
          <div className="flex items-center gap-4">
            {mounted && (
              <button
                onClick={toggleLayout}
                className="p-2 rounded-lg hover:bg-foreground/10 transition-all duration-200"
                title={isGridLayout ? "Switch to list view" : "Switch to grid view"}
              >
                {isGridLayout ? (
                  <LayoutList className="w-5 h-5" />
                ) : (
                  <LayoutGrid className="w-5 h-5" />
                )}
              </button>
            )}
            <ThemeToggle />
          </div>
        </div>

        {/* Posts Grid/List */}
        <div className={`animate-fade-in ${
          isGridLayout 
            ? "grid grid-cols-1 md:grid-cols-2 gap-6" 
            : "flex flex-col gap-6"
        }`}>
          {initialPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onClick={handlePostClick}
              layout={isGridLayout ? "grid" : "list"}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function PostsContent(props: PostsContentProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PostsContentInner {...props} />
    </Suspense>
  )
} 