import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import sharp from 'sharp'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// Aspect ratio for post images (16:9)
const TARGET_ASPECT_RATIO = 16 / 9
const TARGET_WIDTH = 1200
const TARGET_HEIGHT = Math.round(TARGET_WIDTH / TARGET_ASPECT_RATIO)

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) {
      return new NextResponse('No file uploaded', { status: 400 })
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Process image with Sharp
    const image = sharp(buffer)
    const metadata = await image.metadata()

    if (!metadata.width || !metadata.height) {
      return new NextResponse('Invalid image', { status: 400 })
    }

    // Calculate dimensions to maintain aspect ratio
    const currentAspectRatio = metadata.width / metadata.height

    let resizeOptions = {
      width: TARGET_WIDTH,
      height: TARGET_HEIGHT,
      fit: sharp.fit.cover,
      position: sharp.strategy.attention
    }

    // Process the image
    const processedImageBuffer = await image
      .resize(resizeOptions)
      .jpeg({ quality: 80 })
      .toBuffer()

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    // Generate unique filename
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
    const filepath = path.join(uploadDir, filename)

    // Save the processed image
    await writeFile(filepath, processedImageBuffer)

    // Return the public URL
    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (error) {
    console.error('Error uploading file:', error)
    return new NextResponse('Error uploading file', { status: 500 })
  }
} 