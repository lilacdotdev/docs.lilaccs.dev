"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { LogOut, Edit2, Plus } from "lucide-react"
import { AdminPostEditor } from "./admin-post-editor"
import { AdminPostCreator } from "./admin-post-creator"
import type { Post, PostMeta } from "@/lib/posts"

interface AdminDashboardProps {
  initialPosts: PostMeta[]
}

export function AdminDashboard({ initialPosts = [] }: AdminDashboardProps) {
  const [posts, setPosts] = useState<PostMeta[]>(initialPosts)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleEditPost = async (post: PostMeta) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/posts/${post.slug}`)
      const fullPost = await response.json()
      // Extract the raw content from the serialized MDX
      setSelectedPost({
        ...fullPost,
        content: fullPost.content.raw || fullPost.content
      })
    } catch (error) {
      console.error("Error fetching post:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePost = async (updatedPost: Post) => {
    try {
      const response = await fetch(`/api/posts/${updatedPost.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
      })

      if (!response.ok) throw new Error('Failed to update post')

      // Update the posts list with the new data
      setPosts(posts.map(post => 
        post.slug === updatedPost.slug 
          ? {
              id: updatedPost.id,
              title: updatedPost.title,
              subtitle: updatedPost.subtitle,
              date: updatedPost.date,
              tags: updatedPost.tags,
              image: updatedPost.image,
              slug: updatedPost.slug
            }
          : post
      ))
    } catch (error) {
      console.error("Error saving post:", error)
      throw error
    }
  }

  const handleCreatePost = async (newPost: Post) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      })

      if (!response.ok) throw new Error('Failed to create post')

      const { slug } = await response.json()
      
      // Add the new post to the list
      setPosts([{
        id: slug,
        title: newPost.title,
        subtitle: newPost.subtitle,
        date: newPost.date,
        tags: newPost.tags,
        image: newPost.image,
        slug
      }, ...posts])
      setIsCreating(false)
    } catch (error) {
      console.error("Error creating post:", error)
      throw error
    }
  }

  const handleDeletePost = async (slug: string) => {
    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete post')

      // Remove the post from the list
      setPosts(posts.filter(post => post.slug !== slug))
    } catch (error) {
      console.error("Error deleting post:", error)
      throw error
    }
  }

        return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
            New Post
              </button>
            <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
              >
            <LogOut className="w-4 h-4" />
            Sign Out
              </button>
            </div>
          </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts?.length === 0 ? (
          <div className="text-center py-8 text-foreground/60">
            No posts found. Create your first post!
          </div>
        ) : (
          posts?.map((post) => (
            <div
              key={post.slug}
              className="flex items-center justify-between p-4 bg-background border border-foreground/20 rounded-lg hover:border-foreground/40 transition-colors"
            >
              <div>
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <p className="text-sm text-foreground/60">{post.subtitle}</p>
                <div className="flex items-center gap-2 mt-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-foreground/10 text-foreground/60 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
                    <button
                onClick={() => handleEditPost(post)}
                className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
                disabled={isLoading}
                  >
                <Edit2 className="w-5 h-5" />
                  </button>
            </div>
          ))
        )}
              </div>

      {/* Post Editor Modal */}
      {selectedPost && (
        <AdminPostEditor
          post={selectedPost}
          onSave={handleSavePost}
          onClose={() => setSelectedPost(null)}
          onDelete={() => handleDeletePost(selectedPost.slug)}
        />
      )}

      {/* Post Creator Modal */}
      {isCreating && (
        <AdminPostCreator
          onSave={handleCreatePost}
          onClose={() => setIsCreating(false)}
        />
      )}
    </div>
  )
}
