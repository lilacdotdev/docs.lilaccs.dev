'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Tag, 
  FileText,
  LogOut,
  User,
  Clock
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Post } from '@/lib/types/post'
import { formatDate, tagToSlug } from '@/lib/utils'

interface DashboardStats {
  totalPosts: number
  recentPosts: number
  totalTags: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    recentPosts: 0,
    totalTags: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ username: string } | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load posts
      const postsResponse = await fetch('/api/posts')
      if (postsResponse.ok) {
        const postsData = await postsResponse.json()
        setPosts(postsData.posts)
        
        // Calculate stats
        const allTags = new Set(postsData.posts.flatMap((post: Post) => post.tags))
        const recentPosts = postsData.posts.filter((post: Post) => {
          const postDate = new Date(post.date)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return postDate > weekAgo
        })

        setStats({
          totalPosts: postsData.posts.length,
          recentPosts: recentPosts.length,
          totalTags: allTags.size
        })
      }

      // Get current user info
      const userResponse = await fetch('/api/admin/me')
      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData.user)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId))
        setStats(prev => ({ ...prev, totalPosts: prev.totalPosts - 1 }))
      } else {
        alert('Failed to delete post')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Error deleting post')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-black dark:text-white">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-baseline">
              <span className="text-xl font-bold text-black dark:text-white">
                docs.
              </span>
              <motion.span
                className="bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 bg-clip-text text-xl font-bold text-transparent"
                style={{ backgroundSize: '300% 300%' }}
                animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
              >
                lilaccs
              </motion.span>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Admin Dashboard
              </span>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-2 text-sm text-black dark:text-white">
                  <User size={16} />
                  <span>{user.username}</span>
                </div>
              )}
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Posts</p>
                <p className="text-2xl font-bold text-black dark:text-white">{stats.totalPosts}</p>
              </div>
              <FileText className="text-black dark:text-white" size={24} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Recent Posts</p>
                <p className="text-2xl font-bold text-black dark:text-white">{stats.recentPosts}</p>
              </div>
              <Clock className="text-black dark:text-white" size={24} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tags</p>
                <p className="text-2xl font-bold text-black dark:text-white">{stats.totalTags}</p>
              </div>
              <Tag className="text-black dark:text-white" size={24} />
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-black dark:text-white">Posts Management</h1>
          <motion.button
            onClick={() => router.push('/admin/posts/new')}
            className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={16} />
            New Post
          </motion.button>
        </div>

        {/* Posts Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {posts.map((post, index) => (
                  <motion.tr
                    key={post.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-black dark:text-white">
                          {post.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {post.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(post.date)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag: string) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 3 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{post.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/${tagToSlug(post.tags[0])}/${post.id}`)}
                          className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                          title="View Post"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/posts/edit/${post.id}`)}
                          className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                          title="Edit Post"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          title="Delete Post"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No posts</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating a new post.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/admin/posts/new')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white dark:text-black bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  New Post
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 