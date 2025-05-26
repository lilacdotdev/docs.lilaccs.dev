import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { PostFrontmatter, PostMetadata } from '@/lib/types/post'
import { tagToSlug } from '@/lib/utils'

const POSTS_DIRECTORY = path.join(process.cwd(), 'content', 'posts')

// Interface for raw post data (before MDX processing)
export interface RawPost extends PostFrontmatter {
  content: string
  slug: string
}

/**
 * Ensure posts directory exists
 */
async function ensurePostsDirectory(): Promise<void> {
  try {
    await fs.access(POSTS_DIRECTORY)
  } catch {
    await fs.mkdir(POSTS_DIRECTORY, { recursive: true })
  }
}

/**
 * Generate a unique post ID from title
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
 * Get post file path
 */
function getPostFilePath(postId: string): string {
  return path.join(POSTS_DIRECTORY, `${postId}.mdx`)
}

/**
 * Create a new post
 */
export async function createPost(postData: PostFrontmatter, content: string): Promise<RawPost> {
  await ensurePostsDirectory()

  const postId = generatePostId(postData.title)
  const filePath = getPostFilePath(postId)

  // Check if post already exists
  try {
    await fs.access(filePath)
    throw new Error(`Post with ID "${postId}" already exists`)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error
    }
  }

  // Create frontmatter
  const frontmatter = {
    title: postData.title,
    description: postData.description,
    date: postData.date,
    image: postData.image || '',
    tags: postData.tags,
    id: postId,
  }

  // Create MDX content with frontmatter
  const mdxContent = matter.stringify(content, frontmatter)

  // Write file
  await fs.writeFile(filePath, mdxContent, 'utf-8')

  return {
    ...frontmatter,
    content,
    slug: tagToSlug(postData.tags[0]),
  }
}

/**
 * Update an existing post
 */
export async function updatePost(
  postId: string, 
  postData: Partial<PostFrontmatter>, 
  content?: string
): Promise<RawPost> {
  const filePath = getPostFilePath(postId)

  // Check if post exists
  try {
    await fs.access(filePath)
  } catch {
    throw new Error(`Post with ID "${postId}" not found`)
  }

  // Read existing post
  const fileContent = await fs.readFile(filePath, 'utf-8')
  const { data: existingFrontmatter, content: existingContent } = matter(fileContent)

  // Merge frontmatter
  const updatedFrontmatter = {
    ...existingFrontmatter,
    ...postData,
    id: postId, // Ensure ID doesn't change
  }

  // Use provided content or keep existing
  const updatedContent = content !== undefined ? content : existingContent

  // Create updated MDX content
  const mdxContent = matter.stringify(updatedContent, updatedFrontmatter)

  // Write file
  await fs.writeFile(filePath, mdxContent, 'utf-8')

  return {
    ...updatedFrontmatter,
    content: updatedContent,
    slug: tagToSlug(updatedFrontmatter.tags?.[0] || ''),
  } as RawPost
}

/**
 * Delete a post
 */
export async function deletePost(postId: string): Promise<void> {
  const filePath = getPostFilePath(postId)

  // Check if post exists
  try {
    await fs.access(filePath)
  } catch {
    throw new Error(`Post with ID "${postId}" not found`)
  }

  // Create backup before deletion
  const backupDir = path.join(process.cwd(), 'content', 'backups')
  await fs.mkdir(backupDir, { recursive: true })
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = path.join(backupDir, `${postId}-${timestamp}.mdx`)
  
  // Copy to backup
  await fs.copyFile(filePath, backupPath)

  // Delete original file
  await fs.unlink(filePath)
}

/**
 * Get a single post by ID
 */
export async function getPostById(postId: string): Promise<RawPost | null> {
  const filePath = getPostFilePath(postId)

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const { data: frontmatter, content } = matter(fileContent)

    return {
      ...frontmatter,
      content,
      slug: tagToSlug(frontmatter.tags?.[0] || ''),
    } as RawPost
  } catch {
    return null
  }
}

/**
 * Check if post ID is available
 */
export async function isPostIdAvailable(postId: string): Promise<boolean> {
  const filePath = getPostFilePath(postId)
  
  try {
    await fs.access(filePath)
    return false // File exists, ID not available
  } catch {
    return true // File doesn't exist, ID available
  }
}

/**
 * Get all post IDs
 */
export async function getAllPostIds(): Promise<string[]> {
  try {
    await ensurePostsDirectory()
    const files = await fs.readdir(POSTS_DIRECTORY)
    return files
      .filter(file => file.endsWith('.mdx'))
      .map(file => file.replace('.mdx', ''))
  } catch {
    return []
  }
}

/**
 * Validate post data
 */
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
  } else {
    const date = new Date(postData.date)
    if (isNaN(date.getTime())) {
      errors.push('Invalid date format')
    }
  }

  if (!postData.tags || !Array.isArray(postData.tags) || postData.tags.length === 0) {
    errors.push('At least one tag is required')
  }

  return errors
}

/**
 * Sanitize post content for security
 */
export function sanitizeContent(content: string): string {
  // Basic sanitization - remove potentially dangerous script tags
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
}

/**
 * Generate post preview
 */
export function generatePreview(content: string, maxLength: number = 200): string {
  // Remove MDX/markdown syntax for preview
  const plainText = content
    .replace(/^---[\s\S]*?---/, '') // Remove frontmatter
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Convert links to text
    .replace(/[#*_~`]/g, '') // Remove markdown formatting
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim()

  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength) + '...'
    : plainText
} 