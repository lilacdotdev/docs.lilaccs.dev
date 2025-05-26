import { 
  getPostsCollection, 
  getImagesCollection, 
  initializeDatabase 
} from './mongodb'
import { 
  PostDocument, 
  ImageDocument, 
  CreatePostInput, 
  UpdatePostInput, 
  QueryOptions, 
  PostsQueryResult,
  DatabaseResult 
} from './types/database'
import { PostFrontmatter } from './types/post'

/**
 * Generate URL-friendly post ID from title
 */
export function generatePostId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and dashes
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-') // Replace multiple dashes with single dash
    .replace(/^-+|-+$/g, '') // Remove leading and trailing dashes
    .trim()
}

/**
 * Generate slug from tag
 */
export function generateSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

// ==================== POST OPERATIONS ====================

/**
 * Initialize database and ensure indexes exist
 */
export async function initializeDatabaseOperations(): Promise<void> {
  await initializeDatabase()
}

/**
 * Create a new post
 */
export async function createPost(input: CreatePostInput): Promise<DatabaseResult<PostDocument>> {
  try {
    const collection = await getPostsCollection()
    
    const postId = generatePostId(input.title)
    const slug = generateSlug(input.tags[0] || '')
    
    // Check if post with this ID already exists
    const existingPost = await collection.findOne({ id: postId })
    if (existingPost) {
      return {
        success: false,
        error: `Post with ID "${postId}" already exists`
      }
    }
    
    const now = new Date()
    const postDocument: PostDocument = {
      id: postId,
      title: input.title,
      description: input.description,
      content: input.content,
      date: input.date,
      tags: input.tags,
      image: input.image || '',
      slug,
      published: input.published ?? true,
      createdAt: now,
      updatedAt: now
    }
    
    const result = await collection.insertOne(postDocument)
    
    if (result.acknowledged) {
      return {
        success: true,
        data: { ...postDocument, _id: result.insertedId }
      }
    } else {
      return {
        success: false,
        error: 'Failed to create post'
      }
    }
  } catch (error) {
    console.error('Error creating post:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Get post by ID
 */
export async function getPostById(id: string): Promise<DatabaseResult<PostDocument>> {
  try {
    const collection = await getPostsCollection()
    const post = await collection.findOne({ id }) as PostDocument | null
    
    if (post) {
      return {
        success: true,
        data: post
      }
    } else {
      return {
        success: false,
        error: `Post with ID "${id}" not found`
      }
    }
  } catch (error) {
    console.error('Error getting post:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Update post by ID
 */
export async function updatePost(id: string, input: UpdatePostInput): Promise<DatabaseResult<PostDocument>> {
  try {
    const collection = await getPostsCollection()
    
    const updateData: Partial<PostDocument> = {
      ...input,
      updatedAt: new Date()
    }
    
    // Update slug if tags changed
    if (input.tags && input.tags.length > 0) {
      updateData.slug = generateSlug(input.tags[0])
    }
    
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    
    if (result) {
      return {
        success: true,
        data: result as PostDocument
      }
    } else {
      return {
        success: false,
        error: `Post with ID "${id}" not found`
      }
    }
  } catch (error) {
    console.error('Error updating post:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Delete post by ID
 */
export async function deletePost(id: string): Promise<DatabaseResult<boolean>> {
  try {
    const collection = await getPostsCollection()
    const result = await collection.deleteOne({ id })
    
    if (result.deletedCount > 0) {
      return {
        success: true,
        data: true
      }
    } else {
      return {
        success: false,
        error: `Post with ID "${id}" not found`
      }
    }
  } catch (error) {
    console.error('Error deleting post:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Get all posts with pagination and filtering
 */
export async function getPosts(options: QueryOptions = {}): Promise<DatabaseResult<PostsQueryResult>> {
  try {
    const collection = await getPostsCollection()
    
    const {
      page = 1,
      limit = 12,
      tag,
      published = true,
      sortBy = 'date',
      sortOrder = 'desc'
    } = options
    
    // Build query filter
    const filter: any = { published }
    if (tag) {
      filter.tags = { $in: [tag] }
    }
    
    // Build sort options
    const sort: any = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1
    
    // Calculate pagination
    const skip = (page - 1) * limit
    
    // Execute queries
    const [posts, total] = await Promise.all([
      collection
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray() as Promise<PostDocument[]>,
      collection.countDocuments(filter)
    ])
    
    const hasMore = skip + posts.length < total
    
    return {
      success: true,
      data: {
        posts,
        total,
        page,
        limit,
        hasMore
      }
    }
  } catch (error) {
    console.error('Error getting posts:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Get all unique tags
 */
export async function getAllTags(): Promise<DatabaseResult<string[]>> {
  try {
    const collection = await getPostsCollection()
    const tags = await collection.distinct('tags', { published: true })
    
    return {
      success: true,
      data: tags.sort()
    }
  } catch (error) {
    console.error('Error getting tags:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Search posts by title, description, or tags
 */
export async function searchPosts(query: string, options: QueryOptions = {}): Promise<DatabaseResult<PostDocument[]>> {
  try {
    if (!query.trim()) {
      return { success: true, data: [] }
    }
    
    const collection = await getPostsCollection()
    const searchRegex = new RegExp(query, 'i')
    
    const filter = {
      published: options.published ?? true,
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } }
      ]
    }
    
    const posts = await collection
      .find(filter)
      .sort({ date: -1 })
      .limit(options.limit || 50)
      .toArray() as PostDocument[]
    
    return {
      success: true,
      data: posts
    }
  } catch (error) {
    console.error('Error searching posts:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// ==================== IMAGE OPERATIONS ====================

/**
 * Save image to database
 */
export async function saveImage(file: File): Promise<DatabaseResult<string>> {
  try {
    // Validate file
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'Image size must be less than 5MB'
      }
    }
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Only JPEG, PNG, WebP, and GIF images are allowed'
      }
    }
    
    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `image-${timestamp}-${randomString}.${extension}`
    
    // Convert to base64
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    
    const collection = await getImagesCollection()
    const imageDocument: ImageDocument = {
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      data: base64,
      uploadedAt: new Date()
    }
    
    const result = await collection.insertOne(imageDocument)
    
    if (result.acknowledged) {
      return {
        success: true,
        data: `/api/images/${filename}`
      }
    } else {
      return {
        success: false,
        error: 'Failed to save image'
      }
    }
  } catch (error) {
    console.error('Error saving image:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Get image by filename
 */
export async function getImage(filename: string): Promise<DatabaseResult<ImageDocument>> {
  try {
    const collection = await getImagesCollection()
    const image = await collection.findOne({ filename }) as ImageDocument | null
    
    if (image) {
      return {
        success: true,
        data: image
      }
    } else {
      return {
        success: false,
        error: `Image "${filename}" not found`
      }
    }
  } catch (error) {
    console.error('Error getting image:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Delete image by filename
 */
export async function deleteImage(filename: string): Promise<DatabaseResult<boolean>> {
  try {
    const collection = await getImagesCollection()
    const result = await collection.deleteOne({ filename })
    
    return {
      success: true,
      data: result.deletedCount > 0
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// ==================== VALIDATION FUNCTIONS ====================

/**
 * Validate post data
 */
export function validatePostData(data: Partial<CreatePostInput>): string[] {
  const errors: string[] = []
  
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required')
  }
  
  if (!data.description || data.description.trim().length === 0) {
    errors.push('Description is required')
  }
  
  if (!data.content || data.content.trim().length === 0) {
    errors.push('Content is required')
  }
  
  if (!data.date) {
    errors.push('Date is required')
  } else if (isNaN(Date.parse(data.date))) {
    errors.push('Invalid date format')
  }
  
  if (!data.tags || data.tags.length === 0) {
    errors.push('At least one tag is required')
  }
  
  return errors
}

/**
 * Sanitize content
 */
export function sanitizeContent(content: string): string {
  return content
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\r/g, '\n')   // Handle old Mac line endings
    .trim()
} 