import { ObjectId } from 'mongodb'
import { PostFrontmatter } from './post'

/**
 * MongoDB document interface for posts
 */
export interface PostDocument {
  _id?: ObjectId
  id: string              // URL-friendly identifier
  title: string
  description: string
  content: string         // MDX content
  date: string           // ISO date string
  tags: string[]
  image?: string         // Image URL or base64
  slug: string           // Generated from first tag
  published: boolean     // Draft/published status
  createdAt: Date
  updatedAt: Date
}

/**
 * MongoDB document interface for images
 */
export interface ImageDocument {
  _id?: ObjectId
  filename: string       // Unique filename
  originalName: string   // Original uploaded filename
  mimeType: string      // MIME type (image/jpeg, etc.)
  size: number          // File size in bytes
  data: string          // Base64 encoded image data
  uploadedAt: Date
}

/**
 * Post creation input (without generated fields)
 */
export interface CreatePostInput {
  title: string
  description: string
  content: string
  date: string
  tags: string[]
  image?: string
  published?: boolean
}

/**
 * Post update input (all fields optional except id)
 */
export interface UpdatePostInput {
  title?: string
  description?: string
  content?: string
  date?: string
  tags?: string[]
  image?: string
  published?: boolean
}

/**
 * Database query options
 */
export interface QueryOptions {
  page?: number
  limit?: number
  tag?: string
  published?: boolean
  sortBy?: 'date' | 'title' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

/**
 * Database operation result
 */
export interface DatabaseResult<T> {
  success: boolean
  data?: T
  error?: string
  count?: number
}

/**
 * Posts query result with pagination
 */
export interface PostsQueryResult {
  posts: PostDocument[]
  total: number
  page: number
  limit: number
  hasMore: boolean
} 