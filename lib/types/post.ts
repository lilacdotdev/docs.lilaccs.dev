import { MDXRemoteSerializeResult } from 'next-mdx-remote'

export interface PostFrontmatter {
  title: string
  description: string
  image?: string
  date: string
  tags: string[]
  id: string
}

export interface Post extends PostFrontmatter {
  content: MDXRemoteSerializeResult
  slug: string
}

export interface PostMetadata extends PostFrontmatter {
  slug: string
}

export interface PostsResponse {
  posts: PostMetadata[]
  hasMore: boolean
  total: number
} 