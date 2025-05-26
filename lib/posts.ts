import { Post, PostMetadata, PostFrontmatter, PostsResponse } from './types/post'
import { PostDocument } from './types/database'
import { tagMatchesSlug } from './utils'
import { getPosts as getStoredPosts, getPostById, getAllTags as getStoredTags, initializeDatabaseOperations } from './database'

/**
 * Get all post metadata sorted by date (newest first)
 */
export async function getAllPosts(): Promise<PostMetadata[]> {
  await initializeDatabaseOperations()
  const result = await getStoredPosts()
  
  if (!result.success || !result.data) {
    return []
  }
  
  return result.data.posts.map(post => ({
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
  await initializeDatabaseOperations()
  const result = await getStoredPosts({ page, limit, tag })
  
  if (!result.success || !result.data) {
    return {
      posts: [],
      hasMore: false,
      total: 0,
    }
  }
  
  const posts = result.data.posts.map(post => ({
    slug: post.id,
    title: post.title,
    description: post.description,
    date: post.date,
    image: post.image,
    tags: post.tags,
    id: post.id,
  }))

  return {
    posts,
    hasMore: result.data.hasMore,
    total: result.data.total,
  }
}

/**
 * Get a single post by tag and id
 */
export async function getPost(tag: string, id: string): Promise<Post | null> {
  try {
    await initializeDatabaseOperations()
    const result = await getPostById(id)

    if (!result.success || !result.data) {
      return null
    }

    const storedPost = result.data

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
  await initializeDatabaseOperations()
  const result = await getStoredTags()
  
  if (!result.success || !result.data) {
    return []
  }
  
  return result.data
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