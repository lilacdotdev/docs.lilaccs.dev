"use client"

import { useState } from "react"
import { Plus, Edit3, X, Check, ArrowLeft } from "lucide-react"
import { PostCard } from "./post-card"
import { ThemeToggle } from "./theme-toggle"

// Enhanced mock data for posts with editable content
const initialPosts = [
  {
    id: "1",
    title: "Building Scalable React Applications",
    subtitle: "Learn how to architect React applications that can grow with your team and user base.",
    date: "December 15, 2024",
    tags: ["Web Dev", "React", "Architecture"],
    image: "/placeholder.svg?height=400&width=600",
    content: `
      <p>Building scalable React applications is one of the most important skills for modern web developers. As applications grow in complexity and team size, the architecture decisions you make early on can significantly impact your project's long-term success.</p>
      
      <h2>Key Principles of Scalable Architecture</h2>
      <p>When designing a scalable React application, there are several fundamental principles to keep in mind:</p>
      
      <ul>
        <li><strong>Component Composition:</strong> Break down complex UIs into smaller, reusable components</li>
        <li><strong>State Management:</strong> Choose the right state management solution for your application's needs</li>
        <li><strong>Code Organization:</strong> Structure your codebase in a way that makes it easy to navigate and maintain</li>
        <li><strong>Performance Optimization:</strong> Implement lazy loading, memoization, and other performance techniques</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Building scalable React applications requires careful planning and adherence to best practices.</p>
    `,
  },
  {
    id: "2",
    title: "Introduction to Machine Learning",
    subtitle: "A comprehensive guide to getting started with machine learning concepts and implementations.",
    date: "December 10, 2024",
    tags: ["AI", "Machine Learning", "Python"],
    image: "/placeholder.svg?height=400&width=600",
    content: `
      <p>Machine Learning has revolutionized the way we approach problem-solving in technology.</p>
      
      <h2>What is Machine Learning?</h2>
      <p>Machine Learning is a subset of artificial intelligence that enables computers to learn and make decisions from data.</p>
      
      <h2>Types of Machine Learning</h2>
      <ol>
        <li><strong>Supervised Learning:</strong> Learning with labeled data</li>
        <li><strong>Unsupervised Learning:</strong> Finding patterns in unlabeled data</li>
        <li><strong>Reinforcement Learning:</strong> Learning through interaction and feedback</li>
      </ol>
    `,
  },
  {
    id: "3",
    title: "My Latest Hardware Project",
    subtitle: "Building a custom IoT device from scratch using Arduino and various sensors.",
    date: "December 5, 2024",
    tags: ["Hardware", "IoT", "Arduino"],
    image: "/placeholder.svg?height=400&width=600",
    content: `
      <p>Recently, I embarked on an exciting hardware project to build a custom IoT environmental monitoring device.</p>
      
      <h2>Project Overview</h2>
      <p>The goal was to create a device that could monitor temperature, humidity, air quality, and light levels.</p>
      
      <h2>Components Used</h2>
      <ul>
        <li>Arduino ESP32 microcontroller</li>
        <li>DHT22 temperature and humidity sensor</li>
        <li>MQ-135 air quality sensor</li>
      </ul>
    `,
  },
]

type ViewMode = "list" | "view" | "edit" | "add"

export function AdminDashboard() {
  const [posts, setPosts] = useState(initialPosts)
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedPost, setSelectedPost] = useState<(typeof initialPosts)[0] | null>(null)
  const [editContent, setEditContent] = useState("")
  const [editTags, setEditTags] = useState<string[]>([])
  const [showAddTag, setShowAddTag] = useState(false)
  const [newTagName, setNewTagName] = useState("")

  // Add mode form state
  const [addForm, setAddForm] = useState({
    title: "",
    subtitle: "",
    date: "",
    content: "",
  })
  const [addTags, setAddTags] = useState<string[]>([])
  const [showAddTagInAddMode, setShowAddTagInAddMode] = useState(false)
  const [newTagNameInAddMode, setNewTagNameInAddMode] = useState("")

  const handlePostClick = (post: (typeof initialPosts)[0]) => {
    setSelectedPost(post)
    setViewMode("view")
  }

  const handleEditPost = () => {
    if (selectedPost) {
      setEditContent(selectedPost.content)
      setEditTags([...selectedPost.tags])
      setViewMode("edit")
    }
  }

  const handleCancelEdit = () => {
    setViewMode("view")
    setEditContent("")
    setEditTags([])
    setShowAddTag(false)
    setNewTagName("")
  }

  const handleSubmitEdit = () => {
    if (selectedPost) {
      const updatedPosts = posts.map((post) =>
        post.id === selectedPost.id ? { ...post, content: editContent, tags: editTags } : post,
      )
      setPosts(updatedPosts)
      setSelectedPost({ ...selectedPost, content: editContent, tags: editTags })
      setViewMode("view")
      setEditContent("")
      setEditTags([])
      setShowAddTag(false)
      setNewTagName("")
    }
  }

  const handleBackToList = () => {
    setViewMode("list")
    setSelectedPost(null)
    setEditContent("")
    setEditTags([])
    setShowAddTag(false)
    setNewTagName("")
    // Reset add form
    setAddForm({ title: "", subtitle: "", date: "", content: "" })
    setAddTags([])
    setShowAddTagInAddMode(false)
    setNewTagNameInAddMode("")
  }

  const handleAddPost = () => {
    setViewMode("add")
    // Set default date to today
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    setAddForm({ ...addForm, date: today })
  }

  const handleCancelAdd = () => {
    setViewMode("list")
    setAddForm({ title: "", subtitle: "", date: "", content: "" })
    setAddTags([])
    setShowAddTagInAddMode(false)
    setNewTagNameInAddMode("")
  }

  const handleSubmitAdd = () => {
    if (addForm.title.trim() && addForm.subtitle.trim() && addForm.content.trim()) {
      const newPost = {
        id: (posts.length + 1).toString(),
        title: addForm.title.trim(),
        subtitle: addForm.subtitle.trim(),
        date:
          addForm.date ||
          new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        tags: addTags,
        image: "/placeholder.svg?height=400&width=600",
        content: addForm.content.trim(),
      }

      setPosts([newPost, ...posts]) // Add to beginning of array
      setViewMode("list")
      setAddForm({ title: "", subtitle: "", date: "", content: "" })
      setAddTags([])
      setShowAddTagInAddMode(false)
      setNewTagNameInAddMode("")
    }
  }

  const handleAddTag = () => {
    if (newTagName.trim() && !editTags.includes(newTagName.trim())) {
      setEditTags([...editTags, newTagName.trim()])
      setNewTagName("")
      setShowAddTag(false)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setEditTags(editTags.filter((tag) => tag !== tagToRemove))
  }

  const handleAddTagInAddMode = () => {
    if (newTagNameInAddMode.trim() && !addTags.includes(newTagNameInAddMode.trim())) {
      setAddTags([...addTags, newTagNameInAddMode.trim()])
      setNewTagNameInAddMode("")
      setShowAddTagInAddMode(false)
    }
  }

  const handleRemoveTagInAddMode = (tagToRemove: string) => {
    setAddTags(addTags.filter((tag) => tag !== tagToRemove))
  }

  const renderHeader = () => {
    switch (viewMode) {
      case "list":
        return (
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-foreground/60">Manage your blog posts</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleAddPost}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover-glow"
              >
                <Plus className="w-4 h-4" />
                Add Post
              </button>
              <ThemeToggle />
            </div>
          </div>
        )
      case "view":
        return (
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-foreground/5 transition-all duration-200 hover-glow"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to posts
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={handleEditPost}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover-glow"
              >
                <Edit3 className="w-4 h-4" />
                Edit Post
              </button>
              <ThemeToggle />
            </div>
          </div>
        )
      case "edit":
        return (
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-foreground/5 transition-all duration-200 hover-glow"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to posts
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 hover-glow"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSubmitEdit}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover-glow"
              >
                <Check className="w-4 h-4" />
                Submit
              </button>
              <ThemeToggle />
            </div>
          </div>
        )
      case "add":
        return (
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-foreground/5 transition-all duration-200 hover-glow"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to posts
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancelAdd}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 hover-glow"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSubmitAdd}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover-glow"
              >
                <Check className="w-4 h-4" />
                Submit
              </button>
              <ThemeToggle />
            </div>
          </div>
        )
    }
  }

  const renderContent = () => {
    switch (viewMode) {
      case "list":
        return (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} onClick={() => handlePostClick(post)} />
            ))}
          </div>
        )
      case "view":
        return selectedPost ? (
          <div className="max-w-6xl mx-auto">
            {/* Post header section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Left column - Post info */}
              <div className="lg:col-span-2 space-y-6">
                <h1 className="text-4xl font-bold text-foreground leading-tight">{selectedPost.title}</h1>
                <p className="text-xl text-foreground/70 leading-relaxed">{selectedPost.subtitle}</p>
                <div className="text-foreground/60 text-lg">{selectedPost.date}</div>
                <div className="flex flex-wrap gap-3">
                  {selectedPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-foreground/10 text-foreground/80 rounded-full text-sm font-medium border border-foreground/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {/* Right column - Main image */}
              <div className="lg:col-span-1">
                <div className="w-full h-full min-h-[300px] relative rounded-xl overflow-hidden border border-foreground/20 bg-foreground/5">
                  <div className="absolute inset-0 flex items-center justify-center text-foreground/40">
                    Image Placeholder
                  </div>
                </div>
              </div>
            </div>
            {/* Horizontal divider */}
            <div className="w-full h-px bg-foreground/20 mb-8"></div>
            {/* Main content */}
            <div className="prose prose-lg max-w-none">
              <div
                className="text-foreground/80 leading-relaxed space-y-6 [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_h4]:text-foreground [&_h5]:text-foreground [&_h6]:text-foreground [&_strong]:text-foreground [&_b]:text-foreground"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />
            </div>
          </div>
        ) : null
      case "edit":
        return selectedPost ? (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Editing: {selectedPost.title}</h2>

            {/* Tags Editor */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground/70 mb-3">Tags</label>
              <div className="flex flex-wrap gap-3 items-center">
                {editTags.map((tag) => (
                  <span
                    key={tag}
                    onClick={() => handleRemoveTag(tag)}
                    className="px-4 py-2 bg-foreground/10 text-foreground/80 rounded-full text-sm font-medium border border-foreground/20 cursor-pointer hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
                    title="Click to remove tag"
                  >
                    {tag}
                  </span>
                ))}

                {showAddTag ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                      className="px-3 py-1 bg-background border border-foreground/20 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Tag name"
                      autoFocus
                    />
                    <button
                      onClick={handleAddTag}
                      className="p-1 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-200"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        setShowAddTag(false)
                        setNewTagName("")
                      }}
                      className="p-1 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddTag(true)}
                    className="p-2 bg-foreground/10 text-foreground/60 rounded-full hover:bg-foreground/20 hover:text-foreground/80 transition-all duration-200"
                    title="Add new tag"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="text-sm text-foreground/60 mt-2">
                Click on tags to remove them, or click the + button to add new tags.
              </div>
            </div>

            {/* Content Editor */}
            <div className="space-y-4">
              <label htmlFor="content-editor" className="block text-sm font-medium text-foreground/70">
                Post Content (HTML)
              </label>
              <textarea
                id="content-editor"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-96 p-4 bg-background border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 font-mono text-sm"
                placeholder="Enter HTML content here..."
              />
              <div className="text-sm text-foreground/60">
                Edit the raw HTML content for this post. Use standard HTML tags for formatting.
              </div>
            </div>
          </div>
        ) : null
      case "add":
        return (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Add New Post</h2>

            <div className="space-y-6">
              {/* Title Input */}
              <div>
                <label htmlFor="add-title" className="block text-sm font-medium text-foreground/70 mb-2">
                  Title *
                </label>
                <input
                  id="add-title"
                  type="text"
                  value={addForm.title}
                  onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter post title"
                  required
                />
              </div>

              {/* Subtitle Input */}
              <div>
                <label htmlFor="add-subtitle" className="block text-sm font-medium text-foreground/70 mb-2">
                  Description *
                </label>
                <input
                  id="add-subtitle"
                  type="text"
                  value={addForm.subtitle}
                  onChange={(e) => setAddForm({ ...addForm, subtitle: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter post description"
                  required
                />
              </div>

              {/* Date Input */}
              <div>
                <label htmlFor="add-date" className="block text-sm font-medium text-foreground/70 mb-2">
                  Date
                </label>
                <input
                  id="add-date"
                  type="text"
                  value={addForm.date}
                  onChange={(e) => setAddForm({ ...addForm, date: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., December 25, 2024"
                />
              </div>

              {/* Tags Editor */}
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-3">Tags</label>
                <div className="flex flex-wrap gap-3 items-center">
                  {addTags.map((tag) => (
                    <span
                      key={tag}
                      onClick={() => handleRemoveTagInAddMode(tag)}
                      className="px-4 py-2 bg-foreground/10 text-foreground/80 rounded-full text-sm font-medium border border-foreground/20 cursor-pointer hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
                      title="Click to remove tag"
                    >
                      {tag}
                    </span>
                  ))}

                  {showAddTagInAddMode ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newTagNameInAddMode}
                        onChange={(e) => setNewTagNameInAddMode(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddTagInAddMode()}
                        className="px-3 py-1 bg-background border border-foreground/20 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Tag name"
                        autoFocus
                      />
                      <button
                        onClick={handleAddTagInAddMode}
                        className="p-1 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-200"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          setShowAddTagInAddMode(false)
                          setNewTagNameInAddMode("")
                        }}
                        className="p-1 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all duration-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddTagInAddMode(true)}
                      className="p-2 bg-foreground/10 text-foreground/60 rounded-full hover:bg-foreground/20 hover:text-foreground/80 transition-all duration-200"
                      title="Add new tag"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="text-sm text-foreground/60 mt-2">
                  Click on tags to remove them, or click the + button to add new tags.
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <label htmlFor="add-content" className="block text-sm font-medium text-foreground/70 mb-2">
                  Post Content (HTML) *
                </label>
                <textarea
                  id="add-content"
                  value={addForm.content}
                  onChange={(e) => setAddForm({ ...addForm, content: e.target.value })}
                  className="w-full h-96 p-4 bg-background border border-foreground/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 font-mono text-sm"
                  placeholder="Enter HTML content here..."
                  required
                />
                <div className="text-sm text-foreground/60 mt-2">
                  Enter the raw HTML content for this post. Use standard HTML tags for formatting.
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {renderHeader()}
        {renderContent()}
      </div>
    </div>
  )
}
