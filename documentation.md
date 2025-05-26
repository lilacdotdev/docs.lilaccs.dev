# docs.lilaccs.dev Development Documentation

## Development Phases Overview

### Phase 1 - Foundation Setup (Current)
✅ Next.js 14 project initialization
✅ TypeScript configuration
✅ Tailwind CSS setup
✅ ESLint configuration
✅ Basic project structure
✅ Shadcn UI integration
✅ Theme configuration
✅ MDX support with syntax highlighting
✅ Post type definitions
✅ Testing infrastructure
✅ Utility functions

### Phase 2 - Core Components (In Progress)
✅ Responsive sidebar
✅ Post components (Card/List views)
✅ View preference management
✅ Image handling with placeholders
⏳ Post content rendering
⏳ Tag filtering system
⏳ Search functionality
⏳ Navigation system

### Phase 3 - Content Management
🔲 MDX post loading
🔲 Post metadata handling
🔲 Tag system implementation
🔲 Dynamic routing setup
🔲 Content validation
🔲 Error boundaries

### Phase 4 - User Experience
🔲 Loading states
🔲 Error handling
🔲 Animations and transitions
🔲 Responsive optimizations
🔲 Accessibility improvements
🔲 Performance optimizations

### Phase 5 - Deployment
🔲 Build optimization
🔲 CPanel configuration
🔲 Environment setup
🔲 CI/CD pipeline
🔲 Analytics integration
🔲 Monitoring setup

Legend:
✅ Completed
⏳ In Progress
🔲 Planned

## Phase 1 - Foundation Setup (In Progress)

### Completed Actions
- Initialized Next.js 14 project with TypeScript support
- Basic Tailwind CSS configuration included
- ESLint setup completed
- Basic project structure created
- Shadcn UI setup completed
- Theme configuration implemented with next-themes
- Created theme toggle component
- MDX support configured with syntax highlighting
- Created post type definitions and utilities
- Added sample blog post
- Implemented post layout component with:
  - Responsive design
  - Dark mode support
  - Metadata display
  - Tag navigation
  - Dynamic routing

### Current Implementation: Responsive Sidebar
#### Design Specifications
- Title Element:
  - "docs." follows theme colors
  - "lilaccs" features animated gradient (purple, blue, red, pink)
  - Hover animation: 110% scale, 8° rotation, 1s sway duration
- Filters Section:
  - Default filters: All Posts, Projects, Personal, AI/ML, Web Dev, Hardware, Software
  - URL pattern: /?filter={tag}
  - Fade transition for content pane on filter change
  - Theme-adherent styling (no background changes)
- Links Section:
  - Home (lilaccs.dev)
  - Contact (card.lilaccs.dev)
  - Resume (resume.lilaccs.dev)
- Collapsible Functionality:
  - Animated expand/collapse with persistent state
  - Collapsed state shows only icons with tooltips
  - Maintains vertical spacing in both states
- Theme Integration:
  - Dark mode: black background, white elements
  - Light mode: white background, black elements
  - Theme toggle in lower right of sidebar

### Next Steps
1. Create sidebar component structure
2. Implement gradient and hover animations
3. Set up filter system with URL integration
4. Add collapsible functionality with state persistence
5. Integrate theme toggle and responsive design

### Technical Approach
- Using Framer Motion for smooth animations
- LocalStorage for sidebar state persistence
- CSS variables for theme colors
- Tailwind for responsive design
- Lucide React for icons

### Dependencies Needed
- framer-motion for animations
- @radix-ui/react-tooltip for tooltips
- Additional Lucide icons

### Technical Decisions
- Using Next.js 14 with App Router for optimal performance and SSR capabilities
- TypeScript for type safety and better developer experience
- Tailwind CSS for utility-first styling approach
- Shadcn UI for consistent, accessible components
- MDX for content management with remark-gfm and rehype-highlight
- Dark/light mode implementation using next-themes
- next-mdx-remote for server component rendering
- date-fns for consistent date formatting

### Dependencies Added
✅ next-themes
✅ shadcn/ui components
✅ clsx & tailwind-merge
✅ @mdx-js/react & @mdx-js/loader
✅ remark-gfm & rehype-highlight
✅ gray-matter for frontmatter parsing
✅ next-mdx-remote for RSC support
✅ date-fns for date formatting

### Expected Outcomes
- A fully configured Next.js project ready for development
- Working development environment with hot reload
- Basic layout structure with theme switching capability
- Type-safe development environment

### Current Progress
✅ Base Next.js project setup
✅ Component library setup
✅ Theme configuration
✅ MDX support
✅ Post layout implementation
⏳ Post listing
⏳ Tag filtering
⏳ Sidebar navigation

### Next Implementation Steps
1. Implement responsive sidebar for navigation
2. Create post listing and filtering components
3. Set up tag-based routing system
4. Add error handling and loading states

### MDX Features Implemented
- Custom component styling for headings, paragraphs, and lists
- Syntax highlighting for code blocks
- Image optimization with next/image
- GitHub Flavored Markdown support
- Frontmatter parsing for post metadata
- Server-side MDX rendering
- Dynamic routing based on post tags

## Current Implementation: Post Listing Component

### Design Specifications
#### Layout Structure
- Header Section:
  - Current filter display
  - View toggle button (Card/List)
  - Horizontal divider
- Content Views:
  1. Card View:
     - Image (16:9 aspect ratio, cropped as needed)
     - Header below image
     - Description and date at bottom
     - Responsive grid layout (max 3 cards per row)
     - Lazy loading for images
     - Placeholder for missing images
  2. List View:
     - Left-aligned image (16:9)
     - Right side content (header, description, date, tags)
     - Full-width rows
     - Same image handling as card view

#### Interactive Elements
- View Toggle:
  - Simple button toggle (layout-grid/layout-list icons)
  - Persistent preference across sessions
  - Clear visual indication of current view
- Post Hover Effects:
  - Subtle upward translation
  - Theme-appropriate shadow
  - Smooth transitions
- Post Click:
  - Navigate to /{post.tags[0]}/{post.id}
  - Follows routing structure from mission statement
- Tag Click:
  - Filter posts by clicked tag
  - URL updates to /?filter={tag}

#### Loading & Pagination
- Infinite scroll implementation
- Loading animation with dots
- Lazy loading for images
- Smooth transitions between filters
- Date-based sorting (newest first)

#### Responsive Design
- Desktop:
  - Card View: Dynamic grid (1-3 cards per row)
  - List View: Comfortable horizontal layout
- Mobile:
  - Card View: Single column, full-width cards
  - List View: Stacked layout with preserved hierarchy
- Breakpoints:
  - sm: 1 card per row
  - md: 2 cards per row
  - lg: 3 cards per row

#### Theme Integration
- Light Mode:
  - White background
  - Black text and elements
  - Light shadows and transitions
  - Light mode placeholder image
- Dark Mode:
  - Black background
  - White text and elements
  - Dark shadows and transitions
  - Dark mode placeholder image

### Technical Approach
1. Component Structure:
   - PostList (container + infinite scroll)
   - PostCard (card view)
   - PostRow (list view)
   - ViewToggle (view switcher + persistence)
   - FilterHeader (current filter display)
   - LoadingDots (loading animation)
   - PostImage (image handling + placeholder)

2. State Management:
   - View preference (persisted)
   - Current filter
   - Post data fetching and caching
   - Infinite scroll state

3. Animation Implementation:
   - Framer Motion for hover effects
   - Loading dots animation
   - View transition animations
   - Scroll-based loading

4. Responsive Strategy:
   - Mobile-first approach
   - Dynamic grid system
   - Responsive image handling
   - Flexible layout transitions

### Implementation Steps
1. Create view preference store with persistence
2. Implement base components (PostCard, PostRow)
3. Add image handling with placeholders
4. Set up infinite scroll
5. Implement loading states
6. Add hover animations
7. Configure routing and navigation
8. Test responsive layouts
9. Optimize performance

Let me know if you'd like me to proceed with the implementation.

### Utility Functions Implementation
#### Tailwind Class Merging Utility
- Purpose: Provide a type-safe way to merge Tailwind CSS classes
- Features:
  - Combines multiple class strings
  - Handles conditional classes
  - Resolves class conflicts
  - Maintains type safety
- Dependencies:
  - clsx: For conditional class name construction
  - tailwind-merge: For handling Tailwind-specific class conflicts
- Usage:
  ```typescript
  // Example usage
  cn('base-class', condition && 'conditional-class', 'override-class')
  ```
- Benefits:
  - Prevents class conflicts
  - Improves code readability
  - Ensures type safety
  - Optimizes class output

### Utility Functions Testing Strategy
#### Unit Tests for Class Name Utility
- Test Categories:
  1. Basic Functionality
     - Single class merging
     - Multiple class merging
     - Empty input handling
  2. Conditional Classes
     - Boolean conditions
     - Undefined/null handling
     - Falsy value handling
  3. Tailwind-Specific
     - Variant conflicts
     - Responsive classes
     - State variants
     - Color schemes
  4. Edge Cases
     - Invalid inputs
     - Special characters
     - Duplicate classes
     - Order preservation

- Testing Tools:
  - Vitest for test runner
  - @testing-library/jest-dom for DOM assertions
  - TypeScript for type checking

- Test Structure:
  ```typescript
  // Example test structure
  describe('cn utility', () => {
    describe('basic functionality', () => {
      // Basic tests
    })
    describe('conditional classes', () => {
      // Conditional tests
    })
    describe('tailwind conflicts', () => {
      // Conflict resolution tests
    })
  })
  ```

- Coverage Goals:
  - 100% function coverage
  - Edge case handling
  - Type safety verification
  - Documentation examples validation

### Next Implementation Steps
1. Create test directory structure
2. Implement basic functionality tests
3. Add conditional class tests
4. Create Tailwind-specific tests
5. Add edge case handling
6. Verify documentation examples

### Test Configuration
#### Vitest Setup
- Dependencies Installed:
  - vitest: Test runner
  - @vitest/coverage-v8: Coverage reporting
  - @testing-library/jest-dom: DOM testing utilities
  - @testing-library/react: React testing utilities

- Configuration Goals:
  1. Fast test execution
  2. Accurate coverage reporting
  3. TypeScript support
  4. React component testing support
  5. Watch mode for development

- Test File Structure:
  ```
  lib/
  ├── __tests__/
  │   └── utils.test.ts
  ├── utils.ts
  └── vitest.config.ts
  ```

- Coverage Configuration:
  - Threshold: 95% for all metrics
  - Included: All utility functions
  - Excluded: Generated files, test files

- Test Commands:
  ```bash
  # Run tests
  npm test
  
  # Run tests with coverage
  npm run test:coverage
  
  # Run tests in watch mode
  npm run test:watch
  ```

### Next Steps
1. Create Vitest configuration file
2. Add test scripts to package.json
3. Configure coverage thresholds
4. Add test documentation to README

## Post Content Rendering System - COMPLETED ✅

### Implementation Summary
Successfully implemented a comprehensive MDX content rendering system with:

1. **Core Components**:
   ✅ MDXImage: 16:9 aspect ratio, error handling, captions
   ✅ CodeBlock: Language display, copy functionality
   ✅ CodePen: Theme-aware embeds with fallbacks

2. **Typography Components**:
   ✅ Headings (H1-H6): Responsive sizing, consistent spacing
   ✅ MDXLink: External link detection with security
   ✅ Paragraph: Optimal spacing and typography

3. **List Components**:
   ✅ UnorderedList/OrderedList: Custom styling
   ✅ ListItem: Proper nesting and spacing

4. **Text Formatting**:
   ✅ Strong/Emphasis: Enhanced styling
   ✅ InlineCode: Distinct background
   ✅ Blockquote: Left border accent
   ✅ HorizontalRule: Theme-aware dividers

5. **Table Components**:
   ✅ Complete table system with responsive design
   ✅ Hover effects and proper borders

6. **Layout & Processing**:
   ✅ ContentLayout: Responsive wrapper with prose styling
   ✅ MDXRenderer: Error boundaries and loading states
   ✅ Component mapping for seamless MDX processing

### Testing Coverage
✅ MDXRenderer: 4 tests covering loading, content, errors, components
✅ ContentLayout: 4 tests covering rendering, classes, responsiveness
✅ Utils: 18 tests with 100% coverage
✅ Total: 26 tests passing

### Features Implemented
- Theme-aware styling throughout all components
- Responsive design with mobile-first approach
- Error handling with graceful fallbacks
- Loading states and smooth animations
- Accessibility compliance
- Clean, minimal aesthetic matching site theme
- External link security (noopener, noreferrer)
- CodePen theme synchronization
- Image optimization with Next.js
- Copy-to-clipboard functionality for code blocks

### Next Phase Ready
The MDX content rendering system is complete and ready for integration with:
- Post loading and routing system
- Tag filtering functionality
- Search implementation
- Content management features

## Content Layout Wrapper & MDX Processing Pipeline

### Content Layout Component
- Purpose: Provides consistent layout for MDX content
- Features:
  - Responsive typography scaling
  - Consistent spacing and margins
  - Theme-aware styling
  - Error boundary integration
  - Loading states

### MDX Processing Pipeline
1. **Component Mapping**:
   - Maps standard HTML elements to custom MDX components
   - Provides consistent styling across all content
   - Enables theme-aware rendering

2. **Processing Flow**:
   ```
   MDX File → Frontmatter Parse → MDX Compile → 
   Component Mapping → Layout Wrapper → Render
   ```

3. **Component Mapping**:
   ```typescript
   const components = {
     // Typography
     h1: H1, h2: H2, h3: H3, h4: H4, h5: H5, h6: H6,
     p: Paragraph,
     a: MDXLink,
     
     // Lists
     ul: UnorderedList,
     ol: OrderedList,
     li: ListItem,
     
     // Text formatting
     strong: Strong,
     em: Emphasis,
     code: InlineCode,
     blockquote: Blockquote,
     hr: HorizontalRule,
     
     // Tables
     table: Table,
     thead: TableHeader,
     tbody: TableBody,
     tr: TableRow,
     th: TableHead,
     td: TableCell,
     
     // Media
     img: MDXImage,
     
     // Custom components
     CodeBlock,
     CodePen,
   }
   ```

4. **Error Handling**:
   - Component-level error boundaries
   - Graceful fallbacks for missing content
   - Loading state management

### Testing Strategy
1. **Component Tests**:
   - Individual component rendering
   - Props validation
   - Theme switching
   - Error states

2. **Integration Tests**:
   - MDX processing pipeline
   - Component mapping
   - Layout rendering
   - Error boundaries

3. **Visual Tests**:
   - Typography consistency
   - Responsive behavior
   - Theme compliance

## Phase 2 Implementation Plan - COMPLETED ✅

### 1. Fix Current Error ✅
- Issue: `window is not defined` in server-side rendering
- Solution: Used Next.js router for pathname detection
- Impact: Enabled proper page rendering

### 2. Route Conflict Resolution ✅
- Issue: Conflicting dynamic routes `[slug]` vs `[id]`
- Solution: Removed old `/[tag]/[slug]/page.tsx` file
- Impact: Eliminated route naming conflicts, uses consistent `[id]` parameter
- Reasoning: Our routing structure uses post IDs, not slugs, as defined in mission statement

### 3. Async Params Error Fix ✅
- Issue: Next.js 15 requires `params` to be awaited before accessing properties
- Error: `Route "/[tag]/[id]" used params.id. params should be awaited before using its properties`
- Solution: Updated dynamic route to await params in both generateMetadata and PostPage
- Impact: Ensures compatibility with Next.js 15 async dynamic APIs

### 4. Filter Transition Flicker Fix ✅
- Issue: Elements appear before fade animation starts when filtering
- Cause: Content renders immediately before animation begins
- Solution: Implemented AnimatePresence with smooth fade transitions and loading states
- Impact: Improved user experience with seamless filter transitions
- Features:
  - Fade out old content before loading new
  - Smooth fade in with subtle upward motion
  - Proper loading states during transitions
  - Unique keys for proper animation triggers

### 5. Post View 404 Error Fix ✅
- Issue: Individual post pages return 404 errors when accessed
- Cause: Tag matching logic didn't account for URL formatting (spaces → dashes)
- Solution: Updated tag matching to convert spaces to dashes for comparison
- Features Implemented:
  - "Go Back" button with ArrowLeft icon
  - Responsive grid layout (3-column on desktop, stacked on mobile)
  - Post header, description, date, and tags on left
  - Featured image on right with elegant placeholder fallback
  - Responsive typography scaling
  - Proper image optimization with Next.js Image
- Impact: Individual post viewing now works correctly with beautiful layout

### 6. Async SearchParams Error Fix ✅
- Issue: Next.js 15 requires `searchParams` to be awaited before accessing properties
- Error: `Route "/" used searchParams.filter. searchParams should be awaited before using its properties`
- Solution: Updated home page interface and function to await searchParams
- Changes:
  - Updated `HomePageProps` interface to use `Promise<{ filter?: string }>`
  - Changed function to async and await searchParams
- Impact: Ensures compatibility with Next.js 15 async dynamic APIs

### 7. AI/ML Tag URL Fix ✅
- Issue: Tags with forward slashes (AI/ML) cause 404 errors in URLs
- Cause: Forward slashes are URL path separators, breaking routing
- Solution: Created comprehensive tag-to-slug conversion utilities
- Implementation:
  - Added `tagToSlug()` function to convert tags to URL-safe slugs
  - Added `tagMatchesSlug()` function for proper tag matching
  - Updated all URL generation to use consistent slug conversion
  - Handles spaces, slashes, and special characters properly
- Examples:
  - "AI/ML" → "ai-ml"
  - "Getting Started" → "getting-started"
  - "Web Dev" → "web-dev"
- Impact: All tags now work correctly in URLs regardless of special characters

### 8. Post Loading System ✅
- **Data Source**: MDX files in `/content/posts/` directory
- **Post Structure**: Complete with frontmatter parsing
- **File Structure**: Implemented with example posts
- **API Route**: Created `/api/posts` for fetching posts

### 9. Post Display Integration ✅
- Replaced Next.js default content with post listing
- Integrated existing PostCard/PostRow components
- Connected with ViewToggle and filtering
- Implemented infinite scroll with loading states

### 10. Routing System ✅
- Dynamic routes: `/[tag]/[id]/page.tsx` implemented
- Post listing: `/page.tsx` updated
- Filter handling: `/?filter={tag}` working
- Navigation links updated with proper URL formatting

### 11. Example Posts Created ✅
- Getting Started guide
- Web Development Tips
- AI/ML Fundamentals
- All with proper frontmatter and content

### Implementation Completed:
1. Fixed window error ✅
2. Created post utilities and types ✅
3. Implemented post loading from MDX files ✅
4. Created example posts ✅
5. Updated main page to display posts ✅
6. Implemented dynamic routing ✅
7. Added proper navigation links ✅

### Next Phase Ready:
- Tag filtering functionality
- Search implementation
- Enhanced navigation features
