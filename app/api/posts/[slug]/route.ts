import { getPostBySlug } from '@/lib/posts'
import { NextResponse } from 'next/server'
import { serialize } from 'next-mdx-remote/serialize'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    // Await the params object
    const resolvedParams = await params
    const post = await getPostBySlug(resolvedParams.slug)
    
    if (!post) {
      return new NextResponse('Post not found', { status: 404 })
    }

    // Serialize the MDX content
    const serializedContent = await serialize(post.content.toString())
    
    return NextResponse.json({
      ...post,
      content: {
        raw: post.content,
        ...serializedContent
      }
    })
  } catch (error) {
    console.error('Error fetching post:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const resolvedParams = await params
    const { title, subtitle, content, tags, image, url } = await request.json()

    // Validate required fields
    if (!title || !content || !tags || !url) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const filePath = path.join(postsDirectory, `${resolvedParams.slug}.mdx`)
    
    // Create frontmatter
    const frontmatter = {
      title,
      subtitle: subtitle || '',
      date: new Date().toISOString(),
      tags,
      image: image || '/placeholder.svg?height=400&width=600',
      url
    }

    // Create MDX content with frontmatter
    const mdxContent = matter.stringify(content, frontmatter)

    // Write to file
    fs.writeFileSync(filePath, mdxContent)

    return new NextResponse('Post updated successfully', { status: 200 })
  } catch (error) {
    console.error('Error updating post:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const resolvedParams = await params
    const filePath = path.join(postsDirectory, `${resolvedParams.slug}.mdx`)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return new NextResponse('Post not found', { status: 404 })
    }

    // Delete the file
    fs.unlinkSync(filePath)

    return new NextResponse('Post deleted successfully', { status: 200 })
  } catch (error) {
    console.error('Error deleting post:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 