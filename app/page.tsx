import { getPostsByTag, getAllPosts } from "@/lib/posts"
import { PostsContent } from "@/components/posts-content"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined }
}

export default async function Home({ searchParams }: PageProps) {
  // Await the searchParams
  const resolvedParams = await searchParams
  const filter = resolvedParams.filter as string | undefined
  
  // If filter is provided, get filtered posts, otherwise get all posts
  const posts = filter 
    ? await getPostsByTag(filter.replace(/-/g, ' '))
    : await getAllPosts()

  return <PostsContent initialPosts={posts} />
}
