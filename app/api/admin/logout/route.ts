import { NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/auth'

export async function POST() {
  try {
    await clearAuthCookie()
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (err) {
    console.error('Logout error:', err)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 