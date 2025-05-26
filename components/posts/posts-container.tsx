'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PostList } from '@/components/blog/post-list'
import { ViewToggle } from '@/components/blog/view-toggle'
import { getPosts } from '@/lib/posts'
import { PostMetadata } from '@/lib/types/post'
import { LoadingDots } from '@/components/ui/loading-dots'

interface PostsContainerProps {
  filter?: string
}

export function PostsContainer({ filter }: PostsContainerProps) {
  const [posts, setPosts] = useState<PostMetadata[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    async function loadPosts() {
      try {
        // Start transition for filter changes (only if we already have posts)
        const hasExistingPosts = posts.length > 0
        if (hasExistingPosts) {
          setIsTransitioning(true)
          // Small delay to allow fade out
          await new Promise(resolve => setTimeout(resolve, 150))
        }
        
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/posts?page=1&limit=12${filter ? `&tag=${filter}` : ''}`)
        
        if (!response.ok) {
          throw new Error('Failed to load posts')
        }
        
        const data = await response.json()
        setPosts(data.posts)
        setHasMore(data.hasMore)
        setPage(1)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts')
      } finally {
        setLoading(false)
        setIsTransitioning(false)
      }
    }

    loadPosts()
  }, [filter])

  const loadMorePosts = async () => {
    if (!hasMore || loading) return

    try {
      setLoading(true)
      const nextPage = page + 1
      
      const response = await fetch(`/api/posts?page=${nextPage}&limit=12${filter ? `&tag=${filter}` : ''}`)
      
      if (!response.ok) {
        throw new Error('Failed to load more posts')
      }
      
      const data = await response.json()
      setPosts(prev => [...prev, ...data.posts])
      setHasMore(data.hasMore)
      setPage(nextPage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more posts')
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-destructive mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with view toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {filter ? `Posts tagged with "${filter}"` : 'All Posts'}
          </h1>
          {!loading && (
            <p className="text-sm text-muted-foreground mt-1">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
            </p>
          )}
        </div>
        <ViewToggle />
      </div>

      {/* Posts list */}
      <AnimatePresence mode="wait">
        {(loading && posts.length === 0) || isTransitioning ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center py-12"
          >
            <div className="text-center">
              <LoadingDots />
              <p className="mt-4 text-sm text-muted-foreground">
                {isTransitioning ? 'Updating posts...' : 'Loading posts...'}
              </p>
            </div>
          </motion.div>
        ) : posts.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center py-12"
          >
            <div className="text-center">
              <p className="text-muted-foreground">
                {filter ? `No posts found with tag "${filter}"` : 'No posts found'}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`posts-${filter || 'all'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <PostList
              initialPosts={posts}
              onLoadMore={loadMorePosts}
              hasMore={hasMore}
              isLoading={loading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 