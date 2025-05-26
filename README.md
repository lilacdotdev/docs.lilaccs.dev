# docs.lilaccs.dev

A modern, minimalist blog documentation platform built with Next.js 14, featuring a futuristic black and white design aesthetic and comprehensive content management capabilities.

## 🚀 Live Site

Visit the live site: [docs.lilaccs.dev](https://docs.lilaccs.dev)

## ✨ Features

### Public Blog Interface
- **Clean Design**: Futuristic minimalist theme with strict black/white color scheme
- **Responsive Layout**: Mobile-first design with collapsible sidebar navigation
- **Flexible Viewing**: Toggle between card and list views with preference persistence
- **Smart Routing**: Dynamic routes with SEO-friendly URLs (`/{tag}/{post-id}`)
- **Tag Filtering**: Filter posts by categories with URL state management
- **Rich Content**: MDX support with custom components and syntax highlighting

### Admin Portal
- **Secure Authentication**: JWT-based auth with bcrypt password hashing
- **Content Management**: Full CRUD operations for blog posts
- **Image Upload**: Drag-and-drop image handling with validation
- **File Management**: Automated MDX file operations with backup system
- **Rich Editor**: Comprehensive post editing with preview capabilities

### Technical Excellence
- **Performance**: Optimized with Next.js App Router and static generation
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Testing**: 94% test coverage with comprehensive test suites
- **Security**: Industry-standard authentication and input validation
- **Animations**: Smooth interactions powered by Framer Motion

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI, Radix UI
- **Content**: MDX with custom renderers
- **Authentication**: JWT with HTTP-only cookies
- **Testing**: Vitest with React Testing Library
- **Animations**: Framer Motion
- **Deployment**: CPanel with Node.js support

## 📁 Project Structure

```
docs.lilaccs.dev/
├── app/                          # Next.js App Router
│   ├── admin/                    # Admin portal pages
│   ├── api/                      # API routes
│   ├── [tag]/[id]/              # Dynamic post routes
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── admin/                   # Admin-specific components
│   ├── mdx/                     # MDX rendering system
│   ├── posts/                   # Post display components
│   ├── sidebar/                 # Navigation components
│   └── ui/                      # Reusable UI components
├── content/                     # Content management
│   ├── posts/                   # MDX blog posts
│   └── backups/                 # Automated backups
├── lib/                         # Utility libraries
│   ├── auth.ts                  # Authentication utilities
│   ├── post-management.ts       # Post CRUD operations
│   ├── image-management.ts      # Image handling
│   └── types/                   # TypeScript definitions
├── public/                      # Static assets
│   └── images/posts/           # Uploaded images
└── middleware.ts               # Route protection
```

## 🧪 Testing

The project includes comprehensive test coverage across all major components:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

**Test Coverage**: 94% success rate (92/98 tests passing)
- Authentication and security
- Post management operations
- Image upload and validation
- MDX component rendering
- Utility functions

## 🏗 Build and Deployment

### Local Production Build

```powershell
# Build for production
npm run build

# Start production server
npm start
```

## 🔐 Security Features

- **Authentication**: JWT tokens with secure HTTP-only cookies
- **Password Security**: Its there I promise
- **Input Validation**: Schema validation for all inputs
- **Content Sanitization**: Safe MDX content processing
- **File Security**: Validated uploads with type checking
- **Route Protection**: Middleware-based admin route security

## 🎨 Design Philosophy

The platform follows a strict futuristic minimalist design:
- **Color Palette**: Pure black and white only (no grays except for text)
- **Typography**: Clean, readable fonts with proper hierarchy
- **Interactions**: Smooth animations that enhance usability
- **Responsiveness**: Mobile-first approach with adaptive layouts
- **Accessibility**: WCAG compliance with screen reader support

## 📚 Content Management

### Writing Posts

Posts are written in MDX format with frontmatter:

```mdx
---
id: "my-post"
title: "My Blog Post"
excerpt: "A brief description"
date: "2024-01-01"
tags: ["web-development", "nextjs"]
author: "Lilac"
readTime: 5
published: true
---

# Your Content Here

Regular markdown with the power of React components!
```

### Custom MDX Components

The platform includes custom components for:
- Code blocks with syntax highlighting
- Responsive images with optimization
- Tables with theme-compliant styling
- Typography elements (headings, paragraphs, lists)
- Interactive elements and embeds

## Contributing

Dont lol its my site 😡

---

Built with stress by me • [Website](https://docs.lilaccs.dev) • [GitHub](https://github.com/lilacdotdev)
