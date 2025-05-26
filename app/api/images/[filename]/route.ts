import { NextRequest, NextResponse } from 'next/server'
import { getImage } from '@/lib/storage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params
    const imageData = await getImage(filename)
    
    if (!imageData) {
      return new NextResponse('Image not found', { status: 404 })
    }
    
    // Parse the data URL
    const [header, base64Data] = imageData.split(',')
    const mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/jpeg'
    
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Data, 'base64')
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 