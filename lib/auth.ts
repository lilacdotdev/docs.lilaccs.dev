import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// In a real app, these would be environment variables
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin123'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null

        const { username, password } = credentials

        // Simple username/password check
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          return {
            id: '1',
            name: 'Admin',
            email: 'admin@example.com'
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/adminedit'
  }
} 