import { NextResponse } from 'next/server'

export async function GET() {
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH
  return NextResponse.json({
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasAdminUsername: !!process.env.ADMIN_USERNAME,
    hasAdminPasswordHash: !!adminPasswordHash,
    adminPasswordHashLength: adminPasswordHash?.length || 0,
    // Show first and last 4 chars of hash if it exists
    hashPreview: adminPasswordHash ? 
      `${adminPasswordHash.slice(0, 4)}...${adminPasswordHash.slice(-4)}` : 
      'not found'
  })
} 