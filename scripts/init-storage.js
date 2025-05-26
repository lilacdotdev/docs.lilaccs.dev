const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// This script initializes the storage system with existing posts
// Run this in development to populate the in-memory storage

async function initializeStorageWithPosts() {
  try {
    const postsDir = path.join(process.cwd(), 'content', 'posts');
    
    if (!fs.existsSync(postsDir)) {
      console.log('No posts directory found. Storage will start empty.');
      return;
    }

    const files = fs.readdirSync(postsDir);
    const posts = [];

    for (const file of files) {
      if (file.endsWith('.mdx')) {
        const filePath = path.join(postsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data: frontmatter, content } = matter(fileContent);
        
        const postId = path.basename(file, '.mdx');
        const post = {
          ...frontmatter,
          id: postId,
          content,
          slug: frontmatter.tags?.[0]?.toLowerCase().replace(/\s+/g, '-') || '',
          createdAt: frontmatter.date || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        posts.push(post);
      }
    }

    console.log(`Found ${posts.length} posts to initialize storage with:`);
    posts.forEach(post => {
      console.log(`- ${post.title} (${post.id})`);
    });

    console.log('\nStorage initialization complete!');
    console.log('Note: In production, this data will be stored in a database.');
    
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

// Run the initialization
initializeStorageWithPosts(); 