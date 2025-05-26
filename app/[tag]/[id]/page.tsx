import { notFound } from 'next/navigation'
import { getPost, getAllPosts } from '@/lib/posts'
import { MDXRenderer } from '@/components/mdx/mdx-renderer'
import { Badge } from '@/components/ui/badge'
import { formatDate, tagToSlug } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'

interface PostPageProps {
  params: Promise<{
    tag: string
    id: string
  }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  
  return posts.map((post) => ({
    tag: tagToSlug(post.tags[0]),
    id: post.id,
  }))
}

export async function generateMetadata({ params }: PostPageProps) {
  const { tag, id } = await params
  const post = await getPost(tag, id)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.image ? [{ url: post.image }] : [],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { tag, id } = await params
  const post = await getPost(tag, id)

  if (!post) {
    notFound()
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Go Back
      </Link>

      {/* Post header with image */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left side - Post info */}
        <div className="lg:col-span-2">
          <header className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              {post.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              {post.description}
            </p>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4">
              <time 
                dateTime={post.date}
                className="text-sm font-medium text-muted-foreground"
              >
                {formatDate(post.date)}
              </time>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/?filter=${encodeURIComponent(tag)}`}>
                    <Badge 
                      variant="secondary" 
                      className="hover:bg-accent cursor-pointer transition-colors"
                    >
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          </header>
        </div>

        {/* Right side - Featured image */}
        <div className="lg:col-span-1">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-muted">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                <div className="text-center text-muted-foreground">
                  <div className="mb-2 text-4xl">📄</div>
                  <p className="text-sm">No featured image</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post content */}
      <div className="prose prose-gray dark:prose-invert max-w-none lg:max-w-4xl">
        <MDXRenderer source={post.content} />
      </div>
    </article>
  )
} 