import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createPost, validatePostData, sanitizeContent } from '@/lib/post-management'
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
    const post = await createPost(
      {
        title: validatedData.title,
        description: validatedData.description,
        date: validatedData.date,
        image: validatedData.image || '',
        tags: validatedData.tags,
        id: '', // Will be generated
      },
      sanitizedContent
    )

    return NextResponse.json({
      success: true,
      post,
    })
  } catch (err) {
    console.error('Create post error:', err)
    
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: err.errors },
        { status: 400 }
      )
    }

    if (err instanceof Error) {
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