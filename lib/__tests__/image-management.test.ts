import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import fs from 'fs/promises'
import path from 'path'
import { 
  generateImageFilename, 
  validateImageFile, 
  isLocalImage,
  saveImage,
  deleteImage,
  getUploadedImages
} from '../image-management'

// Mock fs module
vi.mock('fs/promises')
const mockFs = vi.mocked(fs)

// Mock File API for testing
class MockFile implements File {
  name: string
  size: number
  type: string
  lastModified: number
  webkitRelativePath: string = ''

  constructor(name: string, size: number, type: string) {
    this.name = name
    this.size = size
    this.type = type
    this.lastModified = Date.now()
  }

  arrayBuffer(): Promise<ArrayBuffer> {
    return Promise.resolve(new ArrayBuffer(this.size))
  }

  bytes(): Promise<Uint8Array> {
    return Promise.resolve(new Uint8Array(this.size))
  }

  slice(): Blob {
    return new Blob()
  }

  stream(): ReadableStream<Uint8Array> {
    return new ReadableStream()
  }

  text(): Promise<string> {
    return Promise.resolve('')
  }
}

describe('Image Management Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock process.cwd()
    vi.spyOn(process, 'cwd').mockReturnValue('/test')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('generateImageFilename', () => {
    it('should generate valid filename from image name', () => {
      const filename = generateImageFilename('test-image.jpg')
      
      expect(filename).toMatch(/^test-image-\d+-[a-z0-9]+\.jpg$/)
      expect(filename).not.toContain(' ')
      expect(filename).not.toContain('/')
    })

    it('should handle special characters in filename', () => {
      const filename = generateImageFilename('My Photo @#$%.png')
      
      expect(filename).toMatch(/^my-photo-\d+-[a-z0-9]+\.png$/)
      expect(filename).not.toContain('@')
      expect(filename).not.toContain('#')
      expect(filename).not.toContain('$')
      expect(filename).not.toContain('%')
    })

    it('should handle multiple spaces and dashes', () => {
      const filename = generateImageFilename('  multiple   spaces---.gif')
      
      expect(filename).toMatch(/^multiple-spaces-\d+-[a-z0-9]+\.gif$/)
      expect(filename).not.toContain('  ')
      expect(filename).not.toContain('---')
    })

    it('should preserve file extension', () => {
      expect(generateImageFilename('test.jpg')).toMatch(/\.jpg$/)
      expect(generateImageFilename('test.PNG')).toMatch(/\.png$/)
      expect(generateImageFilename('test.WebP')).toMatch(/\.webp$/)
    })

    it('should generate unique filenames', () => {
      const filename1 = generateImageFilename('test.jpg')
      const filename2 = generateImageFilename('test.jpg')
      
      expect(filename1).not.toBe(filename2)
    })
  })

  describe('validateImageFile', () => {
    it('should validate correct image files', () => {
      const validFile = new MockFile('test.jpg', 1024 * 1024, 'image/jpeg') // 1MB
      const errors = validateImageFile(validFile)
      
      expect(errors).toHaveLength(0)
    })

    it('should reject files that are too large', () => {
      const largeFile = new MockFile('large.jpg', 6 * 1024 * 1024, 'image/jpeg') // 6MB
      const errors = validateImageFile(largeFile)
      
      expect(errors).toContain('Image size must be less than 5MB')
    })

    it('should reject invalid file types', () => {
      const invalidFile = new MockFile('document.pdf', 1024, 'application/pdf')
      const errors = validateImageFile(invalidFile)
      
      expect(errors).toContain('Only JPEG, PNG, WebP, and GIF images are allowed')
    })

    it('should accept all valid image types', () => {
      const validTypes = [
        ['test.jpg', 'image/jpeg'],
        ['test.jpeg', 'image/jpeg'],
        ['test.png', 'image/png'],
        ['test.webp', 'image/webp'],
        ['test.gif', 'image/gif'],
      ]

      validTypes.forEach(([name, type]) => {
        const file = new MockFile(name, 1024, type)
        const errors = validateImageFile(file)
        expect(errors).toHaveLength(0)
      })
    })

    it('should accumulate multiple errors', () => {
      const invalidFile = new MockFile('large.pdf', 6 * 1024 * 1024, 'application/pdf')
      const errors = validateImageFile(invalidFile)
      
      expect(errors.length).toBeGreaterThan(1)
      expect(errors).toContain('Image size must be less than 5MB')
      expect(errors).toContain('Only JPEG, PNG, WebP, and GIF images are allowed')
    })
  })

  describe('isLocalImage', () => {
    it('should identify local images', () => {
      expect(isLocalImage('/images/posts/test.jpg')).toBe(true)
      expect(isLocalImage('/images/posts/subfolder/test.png')).toBe(true)
    })

    it('should identify external images', () => {
      expect(isLocalImage('https://example.com/image.jpg')).toBe(false)
      expect(isLocalImage('http://localhost/image.png')).toBe(false)
      expect(isLocalImage('/other/path/image.gif')).toBe(false)
      expect(isLocalImage('data:image/jpeg;base64,/9j/4AAQ')).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(isLocalImage('')).toBe(false)
      expect(isLocalImage('images/posts/test.jpg')).toBe(false) // Missing leading slash
      expect(isLocalImage('/images/posts/')).toBe(true) // Directory path
    })
  })

  describe('File Operations', () => {
    beforeEach(() => {
      mockFs.access.mockRejectedValue({ code: 'ENOENT' })
      mockFs.mkdir.mockResolvedValue(undefined)
      mockFs.writeFile.mockResolvedValue(undefined)
      mockFs.unlink.mockResolvedValue(undefined)
      mockFs.copyFile.mockResolvedValue(undefined)
      mockFs.readdir.mockResolvedValue([])
      mockFs.stat.mockResolvedValue({ size: 1024 } as any)
    })

    describe('saveImage', () => {
      it('should save valid image file', async () => {
        const validFile = new MockFile('test.jpg', 1024, 'image/jpeg')
        
        const imageUrl = await saveImage(validFile)
        
        expect(imageUrl).toMatch(/^\/images\/posts\/test-\d+-[a-z0-9]+\.jpg$/)
        expect(mockFs.mkdir).toHaveBeenCalled()
        expect(mockFs.writeFile).toHaveBeenCalled()
      })

      it('should reject invalid files', async () => {
        const invalidFile = new MockFile('large.pdf', 6 * 1024 * 1024, 'application/pdf')
        
        await expect(saveImage(invalidFile)).rejects.toThrow()
      })

      it('should create directory if it does not exist', async () => {
        const validFile = new MockFile('test.jpg', 1024, 'image/jpeg')
        
        await saveImage(validFile)
        
        expect(mockFs.mkdir).toHaveBeenCalledWith(
          expect.stringMatching(/public[\\\/]images[\\\/]posts/),
          { recursive: true }
        )
      })
    })

    describe('deleteImage', () => {
      it('should delete existing image', async () => {
        mockFs.access.mockResolvedValue(undefined)
        
        await deleteImage('/images/posts/test.jpg')
        
        expect(mockFs.access).toHaveBeenCalled()
        expect(mockFs.unlink).toHaveBeenCalled()
      })

      it('should handle non-existent files gracefully', async () => {
        mockFs.access.mockRejectedValue({ code: 'ENOENT' })
        
        // Should not throw
        await expect(deleteImage('/images/posts/nonexistent.jpg')).resolves.toBeUndefined()
      })

      it('should handle permission errors gracefully', async () => {
        mockFs.access.mockResolvedValue(undefined)
        mockFs.unlink.mockRejectedValue(new Error('Permission denied'))
        
        // Should not throw
        await expect(deleteImage('/images/posts/test.jpg')).resolves.toBeUndefined()
      })
    })

    describe('getUploadedImages', () => {
      it('should return list of uploaded images', async () => {
        mockFs.access.mockResolvedValue(undefined)
        mockFs.readdir.mockResolvedValue([
          'test1.jpg',
          'test2.png',
          'document.txt', // Should be filtered out
          'test3.gif',
          'test4.webp',
        ] as any)
        
        const images = await getUploadedImages()
        
        expect(images).toEqual([
          '/images/posts/test1.jpg',
          '/images/posts/test2.png',
          '/images/posts/test3.gif',
          '/images/posts/test4.webp',
        ])
      })

      it('should handle empty directory', async () => {
        mockFs.access.mockResolvedValue(undefined)
        mockFs.readdir.mockResolvedValue([] as any)
        
        const images = await getUploadedImages()
        
        expect(images).toEqual([])
      })

      it('should handle directory access errors', async () => {
        mockFs.access.mockRejectedValue({ code: 'ENOENT' })
        mockFs.mkdir.mockRejectedValue(new Error('Permission denied'))
        
        const images = await getUploadedImages()
        
        expect(images).toEqual([])
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle file system errors gracefully', async () => {
      const validFile = new MockFile('test.jpg', 1024, 'image/jpeg')
      mockFs.access.mockResolvedValue(undefined) // Directory exists
      mockFs.writeFile.mockRejectedValue(new Error('Permission denied'))
      
      await expect(saveImage(validFile)).rejects.toThrow('Permission denied')
    })

    it('should handle invalid file objects', () => {
      const invalidFile = {} as File
      
      expect(() => validateImageFile(invalidFile)).not.toThrow()
    })
  })
}) 