import { MongoClient, Db, Collection } from 'mongodb'

// Global connection cache for Vercel serverless functions
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getMongoUri(): string {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to .env.local')
  }
  return process.env.MONGODB_URI
}
const options = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  family: 4, // Use IPv4, skip trying IPv6
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

function getClientPromise(): Promise<MongoClient> {
  const uri = getMongoUri()
  
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    return global._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    if (!client) {
      client = new MongoClient(uri, options)
    }
    return client.connect()
  }
}

/**
 * Get MongoDB database instance
 */
export async function getDatabase(): Promise<Db> {
  const clientPromise = getClientPromise()
  const client = await clientPromise
  return client.db('docs-lilaccs')
}

/**
 * Get posts collection
 */
export async function getPostsCollection(): Promise<Collection> {
  const db = await getDatabase()
  return db.collection('posts')
}

/**
 * Get images collection
 */
export async function getImagesCollection(): Promise<Collection> {
  const db = await getDatabase()
  return db.collection('images')
}

/**
 * Initialize database indexes for optimal performance
 */
export async function initializeDatabase(): Promise<void> {
  try {
    const db = await getDatabase()
    
    // Create indexes for posts collection
    const postsCollection = db.collection('posts')
    
    // Create indexes with error handling for each one
    try {
      await postsCollection.createIndex({ id: 1 }, { unique: true })
    } catch (indexError) {
      if (indexError instanceof Error && !indexError.message.includes('already exists')) {
        console.warn('Warning creating posts id index:', indexError.message)
      }
    }
    
    try {
      await postsCollection.createIndex({ date: -1 })
    } catch (indexError) {
      if (indexError instanceof Error && !indexError.message.includes('already exists')) {
        console.warn('Warning creating posts date index:', indexError.message)
      }
    }
    
    try {
      await postsCollection.createIndex({ tags: 1 })
    } catch (indexError) {
      if (indexError instanceof Error && !indexError.message.includes('already exists')) {
        console.warn('Warning creating posts tags index:', indexError.message)
      }
    }
    
    try {
      await postsCollection.createIndex({ published: 1 })
    } catch (indexError) {
      if (indexError instanceof Error && !indexError.message.includes('already exists')) {
        console.warn('Warning creating posts published index:', indexError.message)
      }
    }
    
    // Create indexes for images collection
    const imagesCollection = db.collection('images')
    
    try {
      await imagesCollection.createIndex({ filename: 1 }, { unique: true })
    } catch (indexError) {
      if (indexError instanceof Error && !indexError.message.includes('already exists')) {
        console.warn('Warning creating images filename index:', indexError.message)
      }
    }
    
    try {
      await imagesCollection.createIndex({ uploadedAt: -1 })
    } catch (indexError) {
      if (indexError instanceof Error && !indexError.message.includes('already exists')) {
        console.warn('Warning creating images uploadedAt index:', indexError.message)
      }
    }
    
    console.log('Database indexes initialized successfully')
  } catch (error) {
    console.error('Error initializing database indexes:', error)
    // Don't throw error - this shouldn't prevent the app from working
  }
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    const clientPromise = getClientPromise()
    const client = await clientPromise
    await client.db('admin').command({ ping: 1 })
    console.log('MongoDB connection successful')
    return true
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    return false
  }
}

// Export the client promise for advanced use cases
export default getClientPromise 