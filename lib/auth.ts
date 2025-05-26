import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

// Environment variables for security
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH

export interface AuthUser {
  username: string
  isAdmin: boolean
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Create a JWT token for authenticated user
 */
export async function createToken(user: AuthUser): Promise<string> {
  const token = await new SignJWT({ 
    username: user.username, 
    isAdmin: user.isAdmin 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('10m') // 10 minutes as requested
    .sign(JWT_SECRET)

  return token
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return {
      username: payload.username as string,
      isAdmin: payload.isAdmin as boolean,
    }
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

/**
 * Authenticate user credentials
 */
export async function authenticateUser(username: string, password: string): Promise<AuthUser | null> {
  // Check username
  if (username !== ADMIN_USERNAME) {
    return null
  }

  // Verify password
  const isValidPassword = await verifyPassword(password, ADMIN_PASSWORD_HASH)
  if (!isValidPassword) {
    return null
  }

  return {
    username: ADMIN_USERNAME,
    isAdmin: true,
  }
}

/**
 * Set authentication cookie
 */
export async function setAuthCookie(user: AuthUser): Promise<void> {
  const token = await createToken(user)
  const cookieStore = await cookies()
  
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 10 * 60, // 10 minutes
    path: '/',
  })
}

/**
 * Get current authenticated user from cookies
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    return await verifyToken(token)
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Clear authentication cookie
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}

/**
 * Check if user is authenticated and is admin
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser()
  
  if (!user || !user.isAdmin) {
    throw new Error('Unauthorized')
  }
  
  return user
} 