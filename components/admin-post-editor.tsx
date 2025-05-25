"use client"

import { useState, useRef } from "react"
import { Save, X, Trash2, Upload, Image as ImageIcon } from "lucide-react"
import type { Post } from "@/lib/posts"

interface AdminPostEditorProps {
  post: Post
  onSave: (updatedPost: Post) => Promise<void>
  onClose: () => void
  onDelete?: () => Promise<void>
}

export function AdminPostEditor({ post, onSave, onClose, onDelete }: AdminPostEditorProps) {
  const [title, setTitle] = useState(post.title)
  const [subtitle, setSubtitle] = useState(post.subtitle)
  const [content, setContent] = useState(post.content)
  const [tags, setTags] = useState(post.tags.join(", "))
  const [image, setImage] = useState(post.image)
  const [url, setUrl] = useState(post.url)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Upload failed')

      const { url } = await response.json()
      setImage(url)
    } catch (error) {
      console.error('Error uploading image:', error)
      setError("Failed to upload image. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await onSave({
        ...post,
        title,
        subtitle,
        content,
        tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
        image,
        url
      })
      onClose()
    } catch (error) {
      console.error("Error saving post:", error)
      setError("Failed to save post. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) return

    setIsLoading(true)
    setError("")

    try {
      await onDelete()
      onClose()
    } catch (error) {
      console.error("Error deleting post:", error)
      setError("Failed to delete post. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-foreground/20 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-foreground/20">
          <h2 className="text-xl font-semibold">Edit Post</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-foreground/70">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-background/50 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              disabled={isLoading}
            />
          </div>

          {/* URL */}
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium text-foreground/70">
              URL Name
            </label>
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              className="w-full px-4 py-2 bg-background/50 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="your-post-url"
              required
              disabled={isLoading}
            />
            <p className="text-sm text-foreground/60">
              This will be used in the URL: /{tags.split(',')[0].trim()}/{url}
            </p>
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <label htmlFor="subtitle" className="text-sm font-medium text-foreground/70">
              Subtitle
            </label>
            <input
              id="subtitle"
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-4 py-2 bg-background/50 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label htmlFor="tags" className="text-sm font-medium text-foreground/70">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2 bg-background/50 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="tag1, tag2, tag3"
              required
              disabled={isLoading}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">
              Main Image
            </label>
            <div className="flex items-center gap-4">
              <div className="relative w-40 h-24 bg-foreground/5 rounded-lg overflow-hidden border border-foreground/20">
                {image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt="Post cover"
                    className="w-full h-full object-cover"
                  />
                )}
                {!image && (
                  <div className="flex items-center justify-center w-full h-full">
                    <ImageIcon className="w-8 h-8 text-foreground/40" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-foreground/5 hover:bg-foreground/10 rounded-lg transition-colors flex items-center gap-2"
                  disabled={isLoading}
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </button>
                <p className="mt-2 text-sm text-foreground/60">
                  Image will be automatically cropped to 16:9 aspect ratio
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-foreground/70">
              Content (MDX)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-96 px-4 py-2 bg-background/50 border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
              required
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-foreground/20">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
              disabled={isLoading || !onDelete}
            >
              <Trash2 className="w-4 h-4" />
              Delete Post
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 hover:bg-foreground/5 rounded-lg transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
} 