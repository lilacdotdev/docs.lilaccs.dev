import { PostFrontmatter } from './types/post'

// In-memory storage for posts (in production, this would be a database)
// For Vercel deployment, we'll use environment variables or external storage
export interface StoredPost extends PostFrontmatter {
  content: string
  slug: string
  createdAt: string
  updatedAt: string
}

// Simple in-memory storage (replace with database in production)
let postsStorage: Map<string, StoredPost> = new Map()

// Initialize with existing posts from content directory (for development)
export async function initializeStorage(): Promise<void> {
  if (typeof window !== 'undefined') return // Client-side guard
  
  try {
    // Try to load existing posts from file system (development only)
    const fs = await import('fs/promises')
    const path = await import('path')
    const matter = await import('gray-matter')
    
    const postsDir = path.join(process.cwd(), 'content', 'posts')
    
    try {
      const files = await fs.readdir(postsDir)
      
      for (const file of files) {
        if (file.endsWith('.mdx')) {
          const filePath = path.join(postsDir, file)
          const fileContent = await fs.readFile(filePath, 'utf-8')
          const { data: frontmatter, content } = matter.default(fileContent)
          
          const postId = path.basename(file, '.mdx')
          const post: StoredPost = {
            ...frontmatter as PostFrontmatter,
            content,
            slug: frontmatter.tags?.[0]?.toLowerCase().replace(/\s+/g, '-') || '',
            createdAt: frontmatter.date || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          
          postsStorage.set(postId, post)
        }
      }
    } catch (error) {
      console.log('No existing posts directory found, starting with empty storage')
    }
  } catch (error) {
    console.log('File system not available, using empty storage')
  }
}

// Storage operations
export async function createPost(postData: PostFrontmatter, content: string): Promise<StoredPost> {
  const postId = generatePostId(postData.title)
  
  if (postsStorage.has(postId)) {
    throw new Error(`Post with ID "${postId}" already exists`)
  }
  
  const post: StoredPost = {
    ...postData,
    id: postId,
    content,
    slug: postData.tags[0]?.toLowerCase().replace(/\s+/g, '-') || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  postsStorage.set(postId, post)
  return post
}

export async function updatePost(postId: string, postData: Partial<PostFrontmatter>, content?: string): Promise<StoredPost> {
  const existingPost = postsStorage.get(postId)
  
  if (!existingPost) {
    throw new Error(`Post with ID "${postId}" not found`)
  }
  
  const updatedPost: StoredPost = {
    ...existingPost,
    ...postData,
    id: postId, // Ensure ID doesn't change
    content: content !== undefined ? content : existingPost.content,
    updatedAt: new Date().toISOString(),
  }
  
  postsStorage.set(postId, updatedPost)
  return updatedPost
}

export async function deletePost(postId: string): Promise<void> {
  if (!postsStorage.has(postId)) {
    throw new Error(`Post with ID "${postId}" not found`)
  }
  
  postsStorage.delete(postId)
}

export async function getPostById(postId: string): Promise<StoredPost | null> {
  return postsStorage.get(postId) || null
}

export async function getAllPosts(): Promise<StoredPost[]> {
  return Array.from(postsStorage.values()).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}

export async function isPostIdAvailable(postId: string): Promise<boolean> {
  return !postsStorage.has(postId)
}

export function generatePostId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and dashes
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Replace multiple dashes with single dash
    .replace(/^-+|-+$/g, '') // Remove leading and trailing dashes
    .trim()
}

// Image storage (using base64 encoding for Vercel compatibility)
let imageStorage: Map<string, string> = new Map()

export async function saveImage(file: File): Promise<string> {
  // Validate file
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    throw new Error('Image size must be less than 5MB')
  }
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPEG, PNG, WebP, and GIF images are allowed')
  }
  
  // Generate filename
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filename = `image-${timestamp}-${randomString}.${extension}`
  
  // Convert to base64 for storage
  const arrayBuffer = await file.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString('base64')
  const dataUrl = `data:${file.type};base64,${base64}`
  
  imageStorage.set(filename, dataUrl)
  
  // Return a reference URL
  return `/api/images/${filename}`
}

export async function getImage(filename: string): Promise<string | null> {
  return imageStorage.get(filename) || null
}

export async function deleteImage(imageUrl: string): Promise<void> {
  const filename = imageUrl.split('/').pop()
  if (filename) {
    imageStorage.delete(filename)
  }
}

// Validation and sanitization functions
export function validatePostData(postData: Partial<PostFrontmatter>): string[] {
  const errors: string[] = []
  
  if (!postData.title || postData.title.trim().length === 0) {
    errors.push('Title is required')
  }
  
  if (!postData.description || postData.description.trim().length === 0) {
    errors.push('Description is required')
  }
  
  if (!postData.date) {
    errors.push('Date is required')
  }
  
  if (!postData.tags || postData.tags.length === 0) {
    errors.push('At least one tag is required')
  }
  
  return errors
}

export function sanitizeContent(content: string): string {
  // Basic content sanitization
  return content
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\r/g, '\n')   // Handle old Mac line endings
    .trim()
} 