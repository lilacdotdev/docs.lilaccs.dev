import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, setAuthCookie } from '@/lib/auth'
import { z } from 'zod'

// Input validation schema
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required').max(50),
  password: z.string().min(1, 'Password is required').max(100),
})

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    // Authenticate user
    const user = await authenticateUser(validatedData.username, validatedData.password)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Set authentication cookie
    await setAuthCookie(user)

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        isAdmin: user.isAdmin,
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: err.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 