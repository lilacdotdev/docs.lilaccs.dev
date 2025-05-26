import { Post, PostMetadata, PostFrontmatter, PostsResponse } from './types/post'
import { tagMatchesSlug } from './utils'
import { getAllPosts as getStoredPosts, getPostById, initializeStorage } from './storage'

/**
 * Get all post metadata sorted by date (newest first)
 */
export async function getAllPosts(): Promise<PostMetadata[]> {
  await initializeStorage()
  const storedPosts = await getStoredPosts()
  
  return storedPosts.map(post => ({
    slug: post.id,
    title: post.title,
    description: post.description,
    date: post.date,
    image: post.image,
    tags: post.tags,
    id: post.id,
  }))
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
    await initializeStorage()
    const storedPost = await getPostById(id)

    if (!storedPost) {
      return null
    }

    // Check if the post has the matching tag
    const hasMatchingTag = storedPost.tags.some((postTag) => tagMatchesSlug(postTag, tag))
    if (!hasMatchingTag) {
      return null
    }

    // Simple content structure for React 19 compatibility
    const mdxSource = {
      compiledSource: storedPost.content,
      frontmatter: {
        title: storedPost.title,
        description: storedPost.description,
        date: storedPost.date,
        image: storedPost.image,
        tags: storedPost.tags,
        id: storedPost.id,
      },
    }

    return {
      title: storedPost.title,
      description: storedPost.description,
      date: storedPost.date,
      image: storedPost.image,
      tags: storedPost.tags,
      id: storedPost.id,
      slug: storedPost.id,
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