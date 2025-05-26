import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
)

// Protected admin routes
const ADMIN_ROUTES = ['/admin/dashboard', '/admin/posts']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if this is an admin route
  if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    try {
      // Get auth token from cookies
      const token = request.cookies.get('auth-token')?.value

      if (!token) {
        // Redirect to login if no token
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      // Verify the token
      const { payload } = await jwtVerify(token, JWT_SECRET)
      
      // Check if user is admin
      if (!payload.isAdmin) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }

      // Token is valid, allow access
      return NextResponse.next()
    } catch (error) {
      console.error('Middleware auth error:', error)
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // For non-admin routes, continue normally
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 