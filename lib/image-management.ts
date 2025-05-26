import fs from 'fs/promises'
import path from 'path'
import { writeFile } from 'fs/promises'

const IMAGES_DIRECTORY = path.join(process.cwd(), 'public', 'images', 'posts')

/**
 * Ensure images directory exists
 */
async function ensureImagesDirectory(): Promise<void> {
  try {
    await fs.access(IMAGES_DIRECTORY)
  } catch {
    await fs.mkdir(IMAGES_DIRECTORY, { recursive: true })
  }
}

/**
 * Generate a unique filename for uploaded image
 */
export function generateImageFilename(originalName: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  const extension = path.extname(originalName).toLowerCase()
  const baseName = path.basename(originalName, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  
  return `${baseName}-${timestamp}-${randomString}${extension}`
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): string[] {
  const errors: string[] = []
  
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    errors.push('Image size must be less than 5MB')
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    errors.push('Only JPEG, PNG, WebP, and GIF images are allowed')
  }
  
  return errors
}

/**
 * Save uploaded image to file system
 */
export async function saveImage(file: File): Promise<string> {
  await ensureImagesDirectory()
  
  // Validate file
  const validationErrors = validateImageFile(file)
  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join(', '))
  }
  
  // Generate filename
  const filename = generateImageFilename(file.name)
  const filePath = path.join(IMAGES_DIRECTORY, filename)
  
  // Convert file to buffer and save
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  
  await writeFile(filePath, buffer)
  
  // Return public URL
  return `/images/posts/${filename}`
}

/**
 * Delete image file
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extract filename from URL
    const filename = path.basename(imageUrl)
    const filePath = path.join(IMAGES_DIRECTORY, filename)
    
    // Check if file exists and delete
    await fs.access(filePath)
    await fs.unlink(filePath)
  } catch (error) {
    // File doesn't exist or couldn't be deleted - log but don't throw
    console.warn('Could not delete image:', imageUrl, error)
  }
}

/**
 * Get all uploaded images
 */
export async function getUploadedImages(): Promise<string[]> {
  try {
    await ensureImagesDirectory()
    const files = await fs.readdir(IMAGES_DIRECTORY)
    
    return files
      .filter(file => {
        const ext = path.extname(file).toLowerCase()
        return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)
      })
      .map(file => `/images/posts/${file}`)
      .sort()
  } catch {
    return []
  }
}

/**
 * Check if image URL is a local upload
 */
export function isLocalImage(imageUrl: string): boolean {
  return imageUrl.startsWith('/images/posts/')
}

/**
 * Get image file size
 */
export async function getImageSize(imageUrl: string): Promise<number | null> {
  try {
    if (!isLocalImage(imageUrl)) {
      return null
    }
    
    const filename = path.basename(imageUrl)
    const filePath = path.join(IMAGES_DIRECTORY, filename)
    const stats = await fs.stat(filePath)
    
    return stats.size
  } catch {
    return null
  }
} 