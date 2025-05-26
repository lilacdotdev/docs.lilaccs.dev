import { describe, it, expect, beforeEach, vi } from 'vitest'
import { 
  hashPassword, 
  verifyPassword, 
  createToken, 
  verifyToken, 
  authenticateUser 
} from '../auth'

// Mock environment variables
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    set: vi.fn(),
    get: vi.fn(),
    delete: vi.fn(),
  })),
}))



describe('Auth Utilities', () => {
  beforeEach(() => {
    // Set test environment variables
    process.env.JWT_SECRET = 'test-secret-key-for-testing-purposes-only'
    process.env.ADMIN_USERNAME = 'admin'
    process.env.ADMIN_PASSWORD_HASH = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.O' // 'admin123'
  })

  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testpassword123'
      const hash = await hashPassword(password)
      
      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash.length).toBeGreaterThan(50) // bcrypt hashes are typically 60 chars
    })

    it('should generate different hashes for the same password', async () => {
      const password = 'testpassword123'
      const hash1 = await hashPassword(password)
      const hash2 = await hashPassword(password)
      
      expect(hash1).not.toBe(hash2)
    })
  })

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'testpassword123'
      const hash = await hashPassword(password)
      
      const isValid = await verifyPassword(password, hash)
      expect(isValid).toBe(true)
    })

    it('should reject incorrect password', async () => {
      const password = 'testpassword123'
      const wrongPassword = 'wrongpassword'
      const hash = await hashPassword(password)
      
      const isValid = await verifyPassword(wrongPassword, hash)
      expect(isValid).toBe(false)
    })

    it('should reject empty password', async () => {
      const password = 'testpassword123'
      const hash = await hashPassword(password)
      
      const isValid = await verifyPassword('', hash)
      expect(isValid).toBe(false)
    })
  })

  describe('createToken', () => {
    it('should create a valid JWT token', async () => {
      const user = { username: 'testuser', isAdmin: true }
      const token = await createToken(user)
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
    })

    it('should create different tokens for same user', async () => {
      const user = { username: 'testuser', isAdmin: true }
      const token1 = await createToken(user)
      const token2 = await createToken(user)
      
      expect(token1).not.toBe(token2)
    })
  })

  describe('verifyToken', () => {
    it('should verify valid token', async () => {
      const user = { username: 'testuser', isAdmin: true }
      const token = await createToken(user)
      
      const verifiedUser = await verifyToken(token)
      expect(verifiedUser).toEqual(user)
    })

    it('should reject invalid token', async () => {
      const invalidToken = 'invalid.token.here'
      
      const verifiedUser = await verifyToken(invalidToken)
      expect(verifiedUser).toBeNull()
    })

    it('should reject empty token', async () => {
      const verifiedUser = await verifyToken('')
      expect(verifiedUser).toBeNull()
    })

    it('should reject malformed token', async () => {
      const malformedToken = 'not-a-jwt-token'
      
      const verifiedUser = await verifyToken(malformedToken)
      expect(verifiedUser).toBeNull()
    })
  })

  describe('authenticateUser', () => {

    it('should authenticate valid credentials', async () => {
      const user = await authenticateUser('admin', 'admin123')
      
      expect(user).toEqual({
        username: 'admin',
        isAdmin: true,
      })
    })

    it('should reject invalid username', async () => {
      const user = await authenticateUser('wronguser', 'admin123')
      expect(user).toBeNull()
    })

    it('should reject invalid password', async () => {
      const user = await authenticateUser('admin', 'wrongpassword')
      expect(user).toBeNull()
    })

    it('should reject empty credentials', async () => {
      const user1 = await authenticateUser('', 'admin123')
      const user2 = await authenticateUser('admin', '')
      const user3 = await authenticateUser('', '')
      
      expect(user1).toBeNull()
      expect(user2).toBeNull()
      expect(user3).toBeNull()
    })
  })

  describe('Token Expiration', () => {
    it('should create token with correct expiration', async () => {
      const user = { username: 'testuser', isAdmin: true }
      const token = await createToken(user)
      
      // Decode token to check expiration (basic check)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const now = Math.floor(Date.now() / 1000)
      const tenMinutes = 10 * 60
      
      expect(payload.exp).toBeGreaterThan(now)
      expect(payload.exp).toBeLessThanOrEqual(now + tenMinutes + 5) // Allow 5 second buffer
    })
  })

  describe('Security', () => {
    it('should not expose sensitive information in tokens', async () => {
      const user = { username: 'testuser', isAdmin: true }
      const token = await createToken(user)
      
      // Decode payload
      const payload = JSON.parse(atob(token.split('.')[1]))
      
      expect(payload.password).toBeUndefined()
      expect(payload.hash).toBeUndefined()
      expect(payload.secret).toBeUndefined()
    })

    it('should handle special characters in passwords', async () => {
      const specialPassword = 'p@ssw0rd!#$%^&*()'
      const hash = await hashPassword(specialPassword)
      
      const isValid = await verifyPassword(specialPassword, hash)
      expect(isValid).toBe(true)
    })

    it('should handle unicode characters in passwords', async () => {
      const unicodePassword = 'пароль123🔒'
      const hash = await hashPassword(unicodePassword)
      
      const isValid = await verifyPassword(unicodePassword, hash)
      expect(isValid).toBe(true)
    })
  })
}) 