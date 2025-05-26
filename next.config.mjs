import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure pageExtensions to include md and mdx
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  // Make builds more lenient
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  // Configure output for standalone deployment
  output: 'standalone',
  // Add webpack configuration for path aliases
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(process.cwd()),
      '@/components': path.resolve(process.cwd(), 'components'),
      '@/lib': path.resolve(process.cwd(), 'lib'),
      '@/app': path.resolve(process.cwd(), 'app'),
    }
    return config
  },
  // Optionally, add any other Next.js config below
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  },
})

// Merge MDX config with Next.js config
export default withMDX(nextConfig) 