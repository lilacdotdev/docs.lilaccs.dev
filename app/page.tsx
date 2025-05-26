import { Suspense } from 'react'
import { PostsContainer } from '@/components/posts/posts-container'
import { LoadingDots } from '@/components/ui/loading-dots'

interface HomePageProps {
  searchParams: Promise<{ filter?: string }>
}

function PostsLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <LoadingDots />
        <p className="mt-4 text-sm text-muted-foreground">
          Loading posts...
        </p>
      </div>
    </div>
  )
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { filter } = await searchParams

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<PostsLoading />}>
        <PostsContainer filter={filter} />
      </Suspense>
    </div>
  )
}
