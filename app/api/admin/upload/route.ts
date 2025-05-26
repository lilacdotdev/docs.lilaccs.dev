import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { saveImage } from '@/lib/image-management'

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth()

    // Get form data
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Save image
    const imageUrl = await saveImage(file)

    return NextResponse.json({
      success: true,
      imageUrl,
    })
  } catch (err) {
    console.error('Image upload error:', err)
    
    if (err instanceof Error) {
      if (err.message === 'Unauthorized') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: err.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 