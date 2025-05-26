import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Post, PostMetadata } from '@/types/post'

const postsDirectory = path.join(process.cwd(), 'posts')

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      id: slug,
      title: data.title,
      description: data.description,
      date: data.date,
      tags: data.tags || [],
      content,
    }
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error)
    return null
  }
}

export async function getAllPosts(): Promise<PostMetadata[]> {
  try {
    const slugs = fs.readdirSync(postsDirectory)
      .filter((slug) => slug.endsWith('.mdx'))
      .map((slug) => slug.replace(/\.mdx$/, ''))

    const posts = await Promise.all(
      slugs.map(async (slug) => {
        const post = await getPostBySlug(slug)
        if (!post) return null

        return {
          id: post.id,
          title: post.title,
          description: post.description,
          date: post.date,
          tags: post.tags,
        }
      })
    )

    return posts
      .filter((post): post is PostMetadata => post !== null)
      .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()))
  } catch (error) {
    console.error('Error loading posts:', error)
    return []
  }
}

export async function getPostsByTag(tag: string): Promise<PostMetadata[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter((post) => post.tags.includes(tag))
} 