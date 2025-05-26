# Storage System for Vercel Deployment

## Overview

This application now uses an in-memory storage system that's compatible with Vercel's serverless environment. The previous file-system based approach doesn't work on Vercel because:

1. **Read-only file system**: Vercel functions run in a read-only environment
2. **Stateless functions**: Each function invocation starts fresh
3. **No persistent storage**: Files written during execution are lost

## Current Implementation

### In-Memory Storage (`lib/storage.ts`)

- **Posts**: Stored in a `Map<string, StoredPost>`
- **Images**: Stored as base64 data URLs in a `Map<string, string>`
- **Initialization**: Loads existing posts from file system in development
- **API Integration**: All admin operations use the storage system

### Key Features

- ✅ **Create Posts**: Add new posts to storage
- ✅ **Update Posts**: Modify existing posts
- ✅ **Delete Posts**: Remove posts from storage
- ✅ **Image Upload**: Store images as base64 data
- ✅ **Image Serving**: API endpoint to serve stored images
- ✅ **Development Support**: Loads existing MDX files on startup

## API Endpoints

### Posts Management
- `POST /api/admin/posts` - Create new post
- `GET /api/admin/posts/[id]` - Get post by ID
- `PUT /api/admin/posts/[id]` - Update post
- `DELETE /api/admin/posts/[id]` - Delete post

### Image Management
- `POST /api/admin/upload` - Upload image (stores as base64)
- `GET /api/images/[filename]` - Serve stored image

### Public API
- `GET /api/posts` - Get posts with pagination and filtering

## Limitations & Production Considerations

### Current Limitations
- **Data Persistence**: Data is lost when function restarts
- **Memory Usage**: Large images consume significant memory
- **Scalability**: Not suitable for high-traffic production use

### Production Recommendations

For production deployment, replace the in-memory storage with:

1. **Database Storage** (Recommended)
   ```typescript
   // Example with Vercel Postgres
   import { sql } from '@vercel/postgres'
   
   export async function createPost(postData, content) {
     const result = await sql`
       INSERT INTO posts (id, title, description, content, date, tags, image)
       VALUES (${postData.id}, ${postData.title}, ${postData.description}, 
               ${content}, ${postData.date}, ${JSON.stringify(postData.tags)}, 
               ${postData.image})
       RETURNING *
     `
     return result.rows[0]
   }
   ```

2. **External Image Storage**
   ```typescript
   // Example with Vercel Blob
   import { put } from '@vercel/blob'
   
   export async function saveImage(file) {
     const blob = await put(file.name, file, {
       access: 'public',
     })
     return blob.url
   }
   ```

3. **Content Management System**
   - Sanity.io
   - Contentful
   - Strapi
   - Ghost

## Migration Path

### Step 1: Database Setup
```sql
CREATE TABLE posts (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  content TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  tags JSON NOT NULL,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 2: Update Storage Functions
Replace the in-memory maps with database queries in `lib/storage.ts`.

### Step 3: Environment Variables
```env
DATABASE_URL=your_database_connection_string
BLOB_READ_WRITE_TOKEN=your_blob_storage_token
```

### Step 4: Deploy and Test
Ensure all CRUD operations work with the new storage backend.

## Development Usage

### Initialize Storage
The storage system automatically loads existing MDX files from `content/posts/` during development.

### Test Storage
```bash
# Run the initialization script
node scripts/init-storage.js

# Start development server
npm run dev
```

### Admin Operations
1. Login to admin panel: `/admin/login`
2. Create/edit/delete posts through the UI
3. Upload images through the post editor
4. All changes are stored in memory during the session

## Troubleshooting

### Common Issues

1. **Posts not appearing**: Check if `initializeStorage()` is called in API routes
2. **Images not loading**: Verify the image API endpoint is working
3. **Data loss**: Expected behavior - restart server to reload from files
4. **Memory errors**: Reduce image sizes or implement external storage

### Debug Mode
Add logging to see storage operations:
```typescript
console.log('Storage state:', {
  posts: postsStorage.size,
  images: imageStorage.size
})
```

## Next Steps

1. **Immediate**: Current system works for development and testing
2. **Short-term**: Add data export/import functionality
3. **Long-term**: Migrate to database storage for production use

This storage system provides a working solution for Vercel deployment while maintaining all admin functionality. 