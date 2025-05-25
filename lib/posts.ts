'use server'

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export type Post = {
  id: string
  title: string
  subtitle: string
  date: string
  tags: string[]
  image: string
  content: string
  slug: string
  url?: string
}

export type PostMeta = Omit<Post, 'content'>

export async function getPostByUrl(url: string, tag: string): Promise<Post | null> {
  try {
    // Get all posts
    const posts = await getAllPosts()
    
    // Find the post that matches both the URL and has the tag as its first tag
    const post = posts.find(post => {
      const firstTag = post.tags[0]
      return (post.url === url || post.slug === url) && firstTag.toLowerCase() === tag.toLowerCase()
    })

    if (!post) return null

    // Get the full post with content
    return getPostBySlug(post.slug)
  } catch (error) {
    console.error(`Error finding post by URL ${url}:`, error)
    return null
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    // First try to find the exact file
    let fullPath = path.join(postsDirectory, `${slug}.mdx`)
    
    // If file doesn't exist, try to find it by listing directory
    if (!fs.existsSync(fullPath)) {
      const files = fs.readdirSync(postsDirectory)
      // Try to find a file that matches either the slug or has a matching url in its frontmatter
      for (const file of files) {
        const content = fs.readFileSync(path.join(postsDirectory, file), 'utf8')
        const { data } = matter(content)
        if (data.url === slug || file.replace(/\.mdx$/, '') === slug) {
          fullPath = path.join(postsDirectory, file)
          break
        }
      }
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Parse the frontmatter
    const { data, content } = matter(fileContents)

    // Validate required frontmatter
    if (!data.title || !data.date || !data.tags) {
      console.warn(`Missing required frontmatter in ${slug}.mdx`)
      return null
    }

    return {
      id: slug,
      title: data.title,
      subtitle: data.subtitle || '',
      date: new Date(data.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      tags: data.tags,
      image: data.image || '/placeholder.svg?height=400&width=600',
      content: content,
      slug: slug,
      url: data.url || slug // Default to slug if url not specified
    }
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error)
    return null
  }
}

export async function getAllPosts(): Promise<PostMeta[]> {
  // Get all .mdx files from the posts directory
  const filenames = fs.readdirSync(postsDirectory)
  const posts = await Promise.all(
    filenames
      .filter(filename => filename.endsWith('.mdx'))
      .map(async filename => {
        const slug = filename.replace(/\.mdx$/, '')
        const post = await getPostBySlug(slug)
        return post
      })
  )

  // Filter out any null posts and sort by date
  return posts
    .filter((post): post is Post => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  const allPosts = await getAllPosts()
  const normalizedTag = tag.toLowerCase()
  
  return allPosts.filter(post =>
    post.tags.some(postTag => {
      const normalizedPostTag = postTag.toLowerCase()
      return (
        normalizedPostTag === normalizedTag ||
        // Handle special cases
        (normalizedTag === "ai" && (
          normalizedPostTag === "ai" ||
          normalizedPostTag.includes("artificial intelligence")
        )) ||
        (normalizedTag === "web dev" && (
          normalizedPostTag === "web dev" ||
          normalizedPostTag.includes("web development")
        ))
      )
    })
  )
} 