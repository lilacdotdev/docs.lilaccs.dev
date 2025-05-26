'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string
  onChange: (imageUrl: string) => void
  onError?: (error: string) => void
  disabled?: boolean
}

export default function ImageUpload({ 
  value, 
  onChange, 
  onError, 
  disabled = false 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [imageError, setImageError] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Reset error when value changes
  useEffect(() => {
    setImageError(false)
  }, [value])

  const handleFileSelect = async (file: File) => {
    if (disabled || isUploading) return

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setImageError(false)
        onChange(data.imageUrl)
      } else {
        const error = data.error || 'Failed to upload image'
        onError?.(error)
      }
    } catch (err) {
      const error = 'Network error. Please try again.'
      onError?.(error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file)
    } else {
      onError?.('Please drop an image file')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleRemove = () => {
    setImageError(false)
    onChange('')
  }

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="space-y-4">
      {/* Current Image Preview */}
      {value && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group"
        >
          <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            {!imageError ? (
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized={value.startsWith('http') || value.startsWith('https')}
                onError={() => {
                  console.error('Image failed to load:', value)
                  setImageError(true)
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <div className="text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Failed to load image</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate max-w-[200px]">
                    {value}
                  </p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
            <button
              onClick={handleRemove}
              disabled={disabled || isUploading}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 disabled:opacity-50"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 truncate">
            {value}
          </p>
        </motion.div>
      )}

      {/* Upload Area */}
      <motion.div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${dragActive 
            ? 'border-black dark:border-white bg-gray-50 dark:bg-gray-900' 
            : 'border-gray-300 dark:border-gray-700'
          }
          ${disabled || isUploading 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:border-gray-400 dark:hover:border-gray-600 cursor-pointer'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        whileHover={disabled || isUploading ? {} : { scale: 1.01 }}
        whileTap={disabled || isUploading ? {} : { scale: 0.99 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled || isUploading}
        />

        <div className="flex flex-col items-center gap-3">
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          ) : (
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
              {value ? (
                <ImageIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              ) : (
                <Upload className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              )}
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-black dark:text-white">
              {isUploading 
                ? 'Uploading...' 
                : value 
                  ? 'Click or drag to replace image'
                  : 'Click or drag to upload image'
              }
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              PNG, JPG, WebP or GIF up to 5MB
            </p>
          </div>
        </div>
      </motion.div>

      {/* URL Input Alternative */}
      <div className="text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Or enter an image URL directly in the field above
        </p>
      </div>
    </div>
  )
} 