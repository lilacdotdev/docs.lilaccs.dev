import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    // Log the incoming request
    console.log('Debug endpoint called')

    const body = await request.json()
    console.log('Request body received:', { username: body.username ? '✓' : '✗', password: body.password ? '✓' : '✗' })

    const { username, password } = body

    if (!username || !password) {
      console.log('Missing credentials:', { hasUsername: !!username, hasPassword: !!password })
      return NextResponse.json({ 
        error: 'Missing username or password',
        received: { hasUsername: !!username, hasPassword: !!password }
      }, { status: 400 })
    }

    const adminUsername = process.env.ADMIN_USERNAME
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

    // Test password verification
    const salt = '$2b$10$abcdefghijklmnopqrstuv' // Using a fixed salt for testing
    const testHash = bcrypt.hashSync('test', salt)
    const testVerify = bcrypt.compareSync('test', testHash)
    console.log('Bcrypt test:', { testHash, testVerify })

    console.log('Environment variables:', {
      hasAdminUsername: !!adminUsername,
      hasAdminPasswordHash: !!adminPasswordHash,
      hashValid: adminPasswordHash?.startsWith('$2'),
      providedPassword: password,
      storedHash: adminPasswordHash
    })

    const usernameMatch = username === adminUsername
    const passwordMatch = adminPasswordHash ? bcrypt.compareSync(password, adminPasswordHash) : false

    const response = {
      envCheck: {
        hasUsername: !!adminUsername,
        hasHash: !!adminPasswordHash,
        hashStartsWith$2b: adminPasswordHash?.startsWith('$2b'),
        hashLength: adminPasswordHash?.length || 0,
        bcryptTest: testVerify
      },
      auth: {
        usernameMatch,
        passwordMatch,
        providedUsername: username,
        expectedUsername: adminUsername,
        hashInfo: {
          storedHashStart: adminPasswordHash?.substring(0, 7),
          providedPassword: password
        }
      }
    }

    console.log('Auth check results:', {
      usernameMatch,
      passwordMatch,
      bcryptTest: testVerify
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json({ 
      error: 'Failed to process request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 })
  }
} 