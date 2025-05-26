import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/posts'
import { PostLayout } from '@/components/blog/post-layout'
import { MDXRemote } from 'next-mdx-remote/rsc'

interface PostPageProps {
  params: {
    tag: string
    slug: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post || !post.tags.includes(params.tag)) {
    notFound()
  }

  return (
    <PostLayout post={post}>
      <MDXRemote source={post.content} />
    </PostLayout>
  )
} 