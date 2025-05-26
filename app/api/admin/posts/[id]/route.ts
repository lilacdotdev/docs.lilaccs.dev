import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { 
  getPostById, 
  updatePost, 
  deletePost, 
  validatePostData, 
  sanitizeContent,
  initializeDatabaseOperations
} from '@/lib/database'
import { z } from 'zod'

// Validation schema for updating posts
const updatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200).optional(),
  description: z.string().min(1, 'Description is required').max(500).optional(),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date').optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).min(1, 'At least one tag is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
})

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Initialize database
    await initializeDatabaseOperations()
    
    // Require authentication
    await requireAuth()

    const { id } = await params
    const result = await getPostById(id)

    if (result.success) {
      return NextResponse.json({
        success: true,
        post: result.data,
      })
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      )
    }
  } catch (err) {
    console.error('Get post error:', err)
    
    if (err instanceof Error && err.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Initialize database
    await initializeDatabaseOperations()
    
    // Require authentication
    await requireAuth()

    const { id } = await params
    
    // Parse and validate request body
    const body = await request.json()
    const validatedData = updatePostSchema.parse(body)

    // Additional validation if data is provided
    if (Object.keys(validatedData).length > 0) {
      const validationErrors = validatePostData(validatedData)
      if (validationErrors.length > 0) {
        return NextResponse.json(
          { error: 'Validation failed', details: validationErrors },
          { status: 400 }
        )
      }
    }

    // Sanitize content if provided
    if (validatedData.content) {
      validatedData.content = sanitizeContent(validatedData.content)
    }

    // Update post
    const result = await updatePost(id, validatedData)

    if (result.success) {
      return NextResponse.json({
        success: true,
        post: result.data,
      })
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: result.error?.includes('not found') ? 404 : 400 }
      )
    }
  } catch (err) {
    console.error('Update post error:', err)
    
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: err.errors },
        { status: 400 }
      )
    }

    if (err instanceof Error) {
      if (err.message === 'Unauthorized') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
      
      if (err.message.includes('not found')) {
        return NextResponse.json(
          { error: err.message },
          { status: 404 }
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

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Initialize database
    await initializeDatabaseOperations()
    
    // Require authentication
    await requireAuth()

    const { id } = await params
    
    // Delete post
    const result = await deletePost(id)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Post deleted successfully',
      })
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      )
    }
  } catch (err) {
    console.error('Delete post error:', err)
    
    if (err instanceof Error) {
      if (err.message === 'Unauthorized') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
      
      if (err.message.includes('not found')) {
        return NextResponse.json(
          { error: err.message },
          { status: 404 }
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