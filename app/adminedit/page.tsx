import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AdminLogin } from "@/components/admin-login"
import { AdminDashboard } from "@/components/admin-dashboard"
import { getAllPosts } from "@/lib/posts"

export default async function AdminEditPage() {
  const session = await getServerSession(authOptions)

  // If not authenticated, show login
  if (!session) {
    return <AdminLogin />
  }

  // Get all posts for the admin dashboard
  const posts = await getAllPosts()

  // Show admin dashboard if authenticated
  return <AdminDashboard initialPosts={posts} />
}
