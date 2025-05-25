import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if it's the admin edit route
  const isAdminRoute = path === '/adminedit'

  if (isAdminRoute) {
    // Get the token from the request
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // If no token or not admin role, allow access to login page
    // The page component will handle showing login vs dashboard
    if (!token || (token as any).role !== 'admin') {
      // Allow access to continue - the page component will show login form
      return NextResponse.next()
    }

    // User is authenticated as admin, allow access
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  // Only run middleware on the admin edit route
  matcher: ['/adminedit'],
}