import { NextRequest, NextResponse } from 'next/server'
import { getImage, initializeDatabaseOperations } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    // Initialize database
    await initializeDatabaseOperations()
    
    const { filename } = await params
    const result = await getImage(filename)
    
    if (!result.success || !result.data) {
      return new NextResponse('Image not found', { status: 404 })
    }
    
    const imageDoc = result.data
    
    // Convert base64 to buffer
    const buffer = Buffer.from(imageDoc.data, 'base64')
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': imageDoc.mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 