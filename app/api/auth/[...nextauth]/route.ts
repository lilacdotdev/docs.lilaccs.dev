import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Missing username or password')
        }

        // Get admin credentials from environment variables
        const adminUsername = process.env.ADMIN_USERNAME
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

        if (!adminUsername || !adminPasswordHash) {
          console.error('Admin credentials not configured')
          throw new Error('Admin credentials not configured')
        }

        // Verify username and password
        if (
          credentials.username === adminUsername &&
          bcrypt.compareSync(credentials.password, adminPasswordHash)
        ) {
          return {
            id: '1',
            name: credentials.username,
            email: `${credentials.username}@admin.local`,
            role: 'admin'
          }
        }

        throw new Error('Invalid credentials')
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 60, // 30 minutes
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/adminedit',
    error: '/adminedit'
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }