'use client'

import { useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'
import { useViewPreferenceStore } from '@/lib/store/view-preference'
import { PostCard } from './post-card'
import { PostRow } from './post-row'
import { LoadingDots } from '../ui/loading-dots'

interface Post {
  id: string
  title: string
  description: string
  image?: string
  date: string
  tags: string[]
}

interface PostListProps {
  initialPosts: Post[]
  hasMore: boolean
  onLoadMore: () => Promise<void>
  isLoading?: boolean
}

export function PostList({
  initialPosts,
  hasMore,
  onLoadMore,
  isLoading = false,
}: PostListProps) {
  const { viewMode } = useViewPreferenceStore()
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(loadMoreRef)

  useEffect(() => {
    if (isInView && hasMore && !isLoading) {
      onLoadMore()
    }
  }, [isInView, hasMore, isLoading, onLoadMore])

  return (
    <div className="relative">
      <div
        className={
          viewMode === 'card'
            ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'
            : 'flex flex-col gap-4'
        }
      >
        {initialPosts.map((post) =>
          viewMode === 'card' ? (
            <PostCard key={post.id} post={post} />
          ) : (
            <PostRow key={post.id} post={post} />
          )
        )}
      </div>
      {(hasMore || isLoading) && (
        <div
          ref={loadMoreRef}
          className="mt-8 flex justify-center pb-8"
        >
          <LoadingDots />
        </div>
      )}
    </div>
  )
} 