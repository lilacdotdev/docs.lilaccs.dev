import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import fs from 'fs/promises'
import path from 'path'
import { 
  generatePostId, 
  validatePostData, 
  sanitizeContent, 
  generatePreview,
  createPost,
  updatePost,
  deletePost,
  getPostById,
  isPostIdAvailable
} from '../post-management'

// Mock fs module
vi.mock('fs/promises')
const mockFs = vi.mocked(fs)

// Mock path module for consistent testing
const mockPostsDir = '/test/content/posts'
vi.mock('path', async () => {
  const actual = await vi.importActual('path')
  return {
    ...actual,
    join: vi.fn((...args) => args.join('/')),
  }
})

describe('Post Management Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock process.cwd()
    vi.spyOn(process, 'cwd').mockReturnValue('/test')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('generatePostId', () => {
    it('should generate valid post ID from title', () => {
      expect(generatePostId('Hello World')).toBe('hello-world')
      expect(generatePostId('Getting Started with React')).toBe('getting-started-with-react')
      expect(generatePostId('AI/ML Fundamentals')).toBe('aiml-fundamentals')
    })

    it('should handle special characters', () => {
      expect(generatePostId('Post with @#$% symbols!')).toBe('post-with-symbols')
      expect(generatePostId('Multiple    spaces   here')).toBe('multiple-spaces-here')
      expect(generatePostId('---dashes---everywhere---')).toBe('dashes-everywhere')
    })

    it('should handle empty and edge cases', () => {
      expect(generatePostId('')).toBe('')
      expect(generatePostId('   ')).toBe('')
      expect(generatePostId('123')).toBe('123')
      expect(generatePostId('a')).toBe('a')
    })
  })

  describe('validatePostData', () => {
    const validPostData = {
      title: 'Test Post',
      description: 'Test description',
      date: '2024-01-01',
      tags: ['test'],
      id: 'test-post',
    }

    it('should validate correct post data', () => {
      const errors = validatePostData(validPostData)
      expect(errors).toHaveLength(0)
    })

    it('should require title', () => {
      const errors = validatePostData({ ...validPostData, title: '' })
      expect(errors).toContain('Title is required')
    })

    it('should require description', () => {
      const errors = validatePostData({ ...validPostData, description: '' })
      expect(errors).toContain('Description is required')
    })

    it('should require valid date', () => {
      const errors1 = validatePostData({ ...validPostData, date: '' })
      const errors2 = validatePostData({ ...validPostData, date: 'invalid-date' })
      
      expect(errors1).toContain('Date is required')
      expect(errors2).toContain('Invalid date format')
    })

    it('should require tags', () => {
      const errors1 = validatePostData({ ...validPostData, tags: [] })
      const errors2 = validatePostData({ ...validPostData, tags: undefined as any })
      
      expect(errors1).toContain('At least one tag is required')
      expect(errors2).toContain('At least one tag is required')
    })

    it('should accumulate multiple errors', () => {
      const errors = validatePostData({
        title: '',
        description: '',
        date: 'invalid',
        tags: [],
        id: '',
      })
      
      expect(errors.length).toBeGreaterThan(1)
    })
  })

  describe('sanitizeContent', () => {
    it('should remove script tags', () => {
      const maliciousContent = 'Hello <script>alert("xss")</script> World'
      const sanitized = sanitizeContent(maliciousContent)
      expect(sanitized).toBe('Hello  World')
    })

    it('should remove javascript: protocols', () => {
      const maliciousContent = 'Click <a href="javascript:alert()">here</a>'
      const sanitized = sanitizeContent(maliciousContent)
      expect(sanitized).not.toContain('javascript:')
    })

    it('should remove event handlers', () => {
      const maliciousContent = '<div onclick="alert()">Click me</div>'
      const sanitized = sanitizeContent(maliciousContent)
      expect(sanitized).not.toContain('onclick=')
    })

    it('should preserve safe content', () => {
      const safeContent = '# Hello\n\nThis is **safe** content with `code`'
      const sanitized = sanitizeContent(safeContent)
      expect(sanitized).toBe(safeContent)
    })
  })

  describe('generatePreview', () => {
    it('should generate preview from content', () => {
      const content = 'This is a long piece of content that should be truncated'
      const preview = generatePreview(content, 20)
      expect(preview).toBe('This is a long piece...')
    })

    it('should remove markdown syntax', () => {
      const content = '# Heading\n\n**Bold** text with `code` and [link](url)'
      const preview = generatePreview(content)
      expect(preview).not.toContain('#')
      expect(preview).not.toContain('**')
      expect(preview).not.toContain('`')
      expect(preview).not.toContain('[')
    })

    it('should remove frontmatter', () => {
      const content = '---\ntitle: Test\n---\n\nActual content here'
      const preview = generatePreview(content)
      expect(preview).toBe('Actual content here')
    })

    it('should handle short content', () => {
      const content = 'Short'
      const preview = generatePreview(content, 100)
      expect(preview).toBe('Short')
    })
  })

  describe('File Operations', () => {
    const mockPostData = {
      title: 'Test Post',
      description: 'Test description',
      date: '2024-01-01',
      image: '',
      tags: ['test'],
      id: 'test-post',
    }

    describe('createPost', () => {
      beforeEach(() => {
        mockFs.access.mockRejectedValue({ code: 'ENOENT' })
        mockFs.mkdir.mockResolvedValue(undefined)
        mockFs.writeFile.mockResolvedValue(undefined)
      })

      it('should create a new post', async () => {
        const content = 'Test content'
        const result = await createPost(mockPostData, content)

        expect(result.title).toBe(mockPostData.title)
        expect(result.content).toBe(content)
        expect(result.slug).toBeDefined()
        expect(mockFs.writeFile).toHaveBeenCalled()
      })

      it('should throw error if post already exists', async () => {
        mockFs.access.mockResolvedValue(undefined) // File exists

        await expect(createPost(mockPostData, 'content')).rejects.toThrow('already exists')
      })
    })

    describe('updatePost', () => {
      beforeEach(() => {
        mockFs.access.mockResolvedValue(undefined)
        mockFs.readFile.mockResolvedValue('---\ntitle: Old Title\n---\nOld content')
        mockFs.writeFile.mockResolvedValue(undefined)
      })

      it('should update existing post', async () => {
        const updates = { title: 'New Title' }
        const result = await updatePost('test-post', updates)

        expect(result.title).toBe('New Title')
        expect(mockFs.writeFile).toHaveBeenCalled()
      })

      it('should throw error if post not found', async () => {
        mockFs.access.mockRejectedValue({ code: 'ENOENT' })

        await expect(updatePost('nonexistent', {})).rejects.toThrow('not found')
      })
    })

    describe('deletePost', () => {
      beforeEach(() => {
        mockFs.access.mockResolvedValue(undefined)
        mockFs.mkdir.mockResolvedValue(undefined)
        mockFs.copyFile.mockResolvedValue(undefined)
        mockFs.unlink.mockResolvedValue(undefined)
      })

      it('should delete post with backup', async () => {
        await deletePost('test-post')

        expect(mockFs.copyFile).toHaveBeenCalled() // Backup created
        expect(mockFs.unlink).toHaveBeenCalled() // Original deleted
      })

      it('should throw error if post not found', async () => {
        mockFs.access.mockRejectedValue({ code: 'ENOENT' })

        await expect(deletePost('nonexistent')).rejects.toThrow('not found')
      })
    })

    describe('getPostById', () => {
      it('should return post if exists', async () => {
        const mockContent = '---\ntitle: Test\ntags: ["test"]\n---\nContent'
        mockFs.readFile.mockResolvedValue(mockContent)

        const result = await getPostById('test-post')

        expect(result).toBeDefined()
        expect(result?.title).toBe('Test')
        expect(result?.content).toBe('Content')
      })

      it('should return null if post not found', async () => {
        mockFs.readFile.mockRejectedValue({ code: 'ENOENT' })

        const result = await getPostById('nonexistent')
        expect(result).toBeNull()
      })
    })

    describe('isPostIdAvailable', () => {
      it('should return false if post exists', async () => {
        mockFs.access.mockResolvedValue(undefined)

        const available = await isPostIdAvailable('existing-post')
        expect(available).toBe(false)
      })

      it('should return true if post does not exist', async () => {
        mockFs.access.mockRejectedValue({ code: 'ENOENT' })

        const available = await isPostIdAvailable('new-post')
        expect(available).toBe(true)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle file system errors gracefully', async () => {
      mockFs.access.mockRejectedValue(new Error('Permission denied'))

      await expect(createPost({
        title: 'Test',
        description: 'Test',
        date: '2024-01-01',
        image: '',
        tags: ['test'],
        id: 'test',
      }, 'content')).rejects.toThrow('Permission denied')
    })

    it('should handle malformed frontmatter', async () => {
      mockFs.readFile.mockResolvedValue('invalid frontmatter content')

      // Should not throw, but handle gracefully
      const result = await getPostById('test-post')
      expect(result).toBeDefined()
    })
  })
}) 