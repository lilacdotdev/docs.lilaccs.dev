import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import slugify from 'slugify'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { title, subtitle, content, tags, image, url } = await request.json()

    // Validate required fields
    if (!title || !content || !tags || !url) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    // Generate slug from title
    const slug = slugify(title, { lower: true, strict: true })

    // Check if post with slug already exists
    const filePath = path.join(postsDirectory, `${slug}.mdx`)
    if (fs.existsSync(filePath)) {
      return new NextResponse('Post with this title already exists', { status: 409 })
    }

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

    return NextResponse.json({ slug })
  } catch (error) {
    console.error('Error creating post:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 