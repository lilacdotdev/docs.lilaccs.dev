# docs.lilaccs.dev Development Documentation

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
