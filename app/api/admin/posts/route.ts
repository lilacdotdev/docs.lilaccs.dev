import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { 
  createPost, 
  initializeDatabaseOperations, 
  validatePostData, 
  sanitizeContent 
} from '@/lib/database'
import { z } from 'zod'

// Validation schema for creating posts
const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(500),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), 'Invalid date'),
  image: z.string().optional(),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  content: z.string().min(1, 'Content is required'),
})

export async function POST(request: NextRequest) {
  try {
    // Initialize database
    await initializeDatabaseOperations()
    
    // Require authentication
    await requireAuth()

    // Parse and validate request body
    const body = await request.json()
    const validatedData = createPostSchema.parse(body)

    // Additional validation
    const validationErrors = validatePostData(validatedData)
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      )
    }

    // Sanitize content
    const sanitizedContent = sanitizeContent(validatedData.content)

    // Create post
    const result = await createPost({
      title: validatedData.title,
      description: validatedData.description,
      date: validatedData.date,
      image: validatedData.image || '',
      tags: validatedData.tags,
      content: sanitizedContent,
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        post: result.data,
      })
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }
  } catch (err) {
    console.error('Create post error:', err)
    
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid input data', 
          details: err.errors,
          message: 'Request body validation failed'
        },
        { status: 400 }
      )
    }

    if (err instanceof Error) {
      // Check for specific MongoDB errors
      if (err.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: 'A post with this title already exists' },
          { status: 409 }
        )
      }
      
      if (err.message.includes('connection')) {
        return NextResponse.json(
          { error: 'Database connection error' },
          { status: 503 }
        )
      }
      
      return NextResponse.json(
        { 
          error: err.message,
          type: 'application_error'
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        type: 'unknown_error'
      },
      { status: 500 }
    )
  }
} 