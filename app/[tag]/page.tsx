import { getPostsByTag } from "@/lib/posts"
import { PostsContent } from "@/components/posts-content"
import { notFound } from "next/navigation"

interface PageProps {
  params: Promise<{ tag: string }> | { tag: string }
}

export default async function TagPage({ params }: PageProps) {
  // Await the params
  const resolvedParams = await params
  const { tag } = resolvedParams
  
  // Convert hyphenated tag back to space-separated for matching
  const normalizedTag = tag.replace(/-/g, ' ')
  
  // Get posts for this tag
  const posts = await getPostsByTag(normalizedTag)
  
  if (!posts.length) {
    notFound()
  }

  return <PostsContent initialPosts={posts} />
} 