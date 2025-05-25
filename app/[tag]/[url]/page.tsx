import { getPostBySlug } from "@/lib/posts"
import { PostDetail } from "@/components/post-detail"
import { redirect } from "next/navigation"
import { serialize } from "next-mdx-remote/serialize"

interface PageProps {
  params: Promise<{ tag: string; url: string }> | { tag: string; url: string }
}

export default async function PostPage({ params }: PageProps) {
  // Await the params
  const resolvedParams = await params
  const { tag, url } = resolvedParams
  
  // Get the post by slug (url is the slug)
  const post = await getPostBySlug(url)
  
  if (!post || post.tags[0].toLowerCase().replace(/\s+/g, '-') !== tag) {
    redirect('/')
  }

  // Serialize the MDX content
  const serializedContent = await serialize(post.content.toString())

  return (
    <PostDetail
      post={{
        ...post,
        content: serializedContent
      }}
    />
  )
} 