import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Post, PostMetadata, PostFrontmatter, PostsResponse } from './types/post'
import { tagMatchesSlug } from './utils'

const postsDirectory = path.join(process.cwd(), 'content/posts')

/**
 * Get all post metadata sorted by date (newest first)
 */
export async function getAllPosts(): Promise<PostMetadata[]> {
  // Ensure posts directory exists
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter((name) => name.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)

      return {
        slug,
        ...(data as PostFrontmatter),
      }
    })

  // Sort posts by date (newest first)
  return allPostsData.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

/**
 * Get posts with pagination and filtering
 */
export async function getPosts(
  page: number = 1,
  limit: number = 12,
  tag?: string
): Promise<PostsResponse> {
  const allPosts = await getAllPosts()
  
  // Filter by tag if provided
  const filteredPosts = tag
    ? allPosts.filter((post) =>
        post.tags.some((postTag) => 
          postTag.toLowerCase() === tag.toLowerCase()
        )
      )
    : allPosts

  const total = filteredPosts.length
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const posts = filteredPosts.slice(startIndex, endIndex)
  const hasMore = endIndex < total

  return {
    posts,
    hasMore,
    total,
  }
}

/**
 * Get a single post by tag and id
 */
export async function getPost(tag: string, id: string): Promise<Post | null> {
  try {
    const allPosts = await getAllPosts()
    const postMetadata = allPosts.find(
      (post) => 
        post.id === id && 
        post.tags.some((postTag) => tagMatchesSlug(postTag, tag))
    )

    if (!postMetadata) {
      return null
    }

    const fullPath = path.join(postsDirectory, `${postMetadata.slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    // Simple content structure for React 19 compatibility
    const mdxSource = {
      compiledSource: content,
      frontmatter: data,
    }

    return {
      ...(data as PostFrontmatter),
      slug: postMetadata.slug,
      content: mdxSource,
    }
  } catch (error) {
    console.error('Error loading post:', error)
    return null
  }
}

/**
 * Get all unique tags from all posts
 */
export async function getAllTags(): Promise<string[]> {
  const allPosts = await getAllPosts()
  const tagSet = new Set<string>()
  
  allPosts.forEach((post) => {
    post.tags.forEach((tag) => tagSet.add(tag))
  })
  
  return Array.from(tagSet).sort()
}

/**
 * Search posts by title, description, or content
 */
export async function searchPosts(query: string): Promise<PostMetadata[]> {
  if (!query.trim()) {
    return []
  }

  const allPosts = await getAllPosts()
  const searchTerm = query.toLowerCase()

  return allPosts.filter((post) => {
    return (
      post.title.toLowerCase().includes(searchTerm) ||
      post.description.toLowerCase().includes(searchTerm) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
    )
  })
} 