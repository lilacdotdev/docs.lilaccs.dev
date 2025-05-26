const { MongoClient } = require('mongodb')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

if (!process.env.MONGODB_URI) {
  console.error('❌ Please add your MongoDB URI to .env.local')
  process.exit(1)
}

const uri = process.env.MONGODB_URI
const client = new MongoClient(uri)

// Test data
const testPost = {
  id: 'test-mongodb-integration',
  title: 'Test MongoDB Integration',
  description: 'This is a test post to verify MongoDB CRUD operations',
  content: '# Test Post\n\nThis is a test post created by the MongoDB integration test.\n\n## Features Tested\n\n- Create post\n- Read post\n- Update post\n- Delete post\n- Image upload\n- Image retrieval',
  date: new Date().toISOString(),
  tags: ['test', 'mongodb', 'integration'],
  image: '',
  slug: 'test',
  published: true,
  createdAt: new Date(),
  updatedAt: new Date()
}

const testImage = {
  filename: 'test-image.jpg',
  originalName: 'test-image.jpg',
  mimeType: 'image/jpeg',
  size: 1024,
  data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', // 1x1 transparent PNG
  uploadedAt: new Date()
}

/**
 * Test database connection
 */
async function testConnection() {
  console.log('🔌 Testing database connection...')
  try {
    await client.connect()
    await client.db('admin').command({ ping: 1 })
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    return false
  }
}

/**
 * Test post CRUD operations
 */
async function testPostCRUD() {
  console.log('\n📝 Testing Post CRUD Operations...')
  
  const db = client.db('docs-lilaccs')
  const postsCollection = db.collection('posts')
  
  let testsPassed = 0
  let testsTotal = 0
  
  try {
    // Test 1: Create Post
    testsTotal++
    console.log('1️⃣ Testing CREATE post...')
    
    // Clean up any existing test post
    await postsCollection.deleteOne({ id: testPost.id })
    
    const createResult = await postsCollection.insertOne(testPost)
    if (createResult.acknowledged) {
      console.log('   ✅ Post created successfully')
      testsPassed++
    } else {
      console.log('   ❌ Failed to create post')
    }
    
    // Test 2: Read Post
    testsTotal++
    console.log('2️⃣ Testing READ post...')
    
    const readResult = await postsCollection.findOne({ id: testPost.id })
    if (readResult && readResult.title === testPost.title) {
      console.log('   ✅ Post retrieved successfully')
      testsPassed++
    } else {
      console.log('   ❌ Failed to retrieve post')
    }
    
    // Test 3: Update Post
    testsTotal++
    console.log('3️⃣ Testing UPDATE post...')
    
    const updatedTitle = 'Updated Test MongoDB Integration'
    const updateResult = await postsCollection.updateOne(
      { id: testPost.id },
      { 
        $set: { 
          title: updatedTitle,
          updatedAt: new Date()
        }
      }
    )
    
    if (updateResult.modifiedCount === 1) {
      const updatedPost = await postsCollection.findOne({ id: testPost.id })
      if (updatedPost.title === updatedTitle) {
        console.log('   ✅ Post updated successfully')
        testsPassed++
      } else {
        console.log('   ❌ Post update verification failed')
      }
    } else {
      console.log('   ❌ Failed to update post')
    }
    
    // Test 4: List Posts with Pagination
    testsTotal++
    console.log('4️⃣ Testing LIST posts with pagination...')
    
    const listResult = await postsCollection
      .find({ published: true })
      .sort({ date: -1 })
      .limit(10)
      .toArray()
    
    if (Array.isArray(listResult) && listResult.length > 0) {
      console.log(`   ✅ Retrieved ${listResult.length} posts`)
      testsPassed++
    } else {
      console.log('   ❌ Failed to list posts')
    }
    
    // Test 5: Search Posts
    testsTotal++
    console.log('5️⃣ Testing SEARCH posts...')
    
    const searchResult = await postsCollection
      .find({
        published: true,
        $or: [
          { title: /mongodb/i },
          { description: /mongodb/i },
          { tags: { $in: [/mongodb/i] } }
        ]
      })
      .toArray()
    
    if (Array.isArray(searchResult) && searchResult.length > 0) {
      console.log(`   ✅ Found ${searchResult.length} posts matching search`)
      testsPassed++
    } else {
      console.log('   ❌ Search returned no results')
    }
    
    // Test 6: Get Tags
    testsTotal++
    console.log('6️⃣ Testing GET unique tags...')
    
    const tags = await postsCollection.distinct('tags', { published: true })
    if (Array.isArray(tags) && tags.length > 0) {
      console.log(`   ✅ Retrieved ${tags.length} unique tags`)
      testsPassed++
    } else {
      console.log('   ❌ Failed to retrieve tags')
    }
    
    // Test 7: Delete Post
    testsTotal++
    console.log('7️⃣ Testing DELETE post...')
    
    const deleteResult = await postsCollection.deleteOne({ id: testPost.id })
    if (deleteResult.deletedCount === 1) {
      console.log('   ✅ Post deleted successfully')
      testsPassed++
    } else {
      console.log('   ❌ Failed to delete post')
    }
    
  } catch (error) {
    console.error('❌ Post CRUD test error:', error.message)
  }
  
  console.log(`\n📊 Post CRUD Results: ${testsPassed}/${testsTotal} tests passed`)
  return { passed: testsPassed, total: testsTotal }
}

/**
 * Test image CRUD operations
 */
async function testImageCRUD() {
  console.log('\n🖼️ Testing Image CRUD Operations...')
  
  const db = client.db('docs-lilaccs')
  const imagesCollection = db.collection('images')
  
  let testsPassed = 0
  let testsTotal = 0
  
  try {
    // Test 1: Create Image
    testsTotal++
    console.log('1️⃣ Testing CREATE image...')
    
    // Clean up any existing test image
    await imagesCollection.deleteOne({ filename: testImage.filename })
    
    const createResult = await imagesCollection.insertOne(testImage)
    if (createResult.acknowledged) {
      console.log('   ✅ Image created successfully')
      testsPassed++
    } else {
      console.log('   ❌ Failed to create image')
    }
    
    // Test 2: Read Image
    testsTotal++
    console.log('2️⃣ Testing READ image...')
    
    const readResult = await imagesCollection.findOne({ filename: testImage.filename })
    if (readResult && readResult.data === testImage.data) {
      console.log('   ✅ Image retrieved successfully')
      testsPassed++
    } else {
      console.log('   ❌ Failed to retrieve image')
    }
    
    // Test 3: List Images
    testsTotal++
    console.log('3️⃣ Testing LIST images...')
    
    const listResult = await imagesCollection
      .find({})
      .sort({ uploadedAt: -1 })
      .limit(10)
      .toArray()
    
    if (Array.isArray(listResult) && listResult.length > 0) {
      console.log(`   ✅ Retrieved ${listResult.length} images`)
      testsPassed++
    } else {
      console.log('   ❌ Failed to list images')
    }
    
    // Test 4: Delete Image
    testsTotal++
    console.log('4️⃣ Testing DELETE image...')
    
    const deleteResult = await imagesCollection.deleteOne({ filename: testImage.filename })
    if (deleteResult.deletedCount === 1) {
      console.log('   ✅ Image deleted successfully')
      testsPassed++
    } else {
      console.log('   ❌ Failed to delete image')
    }
    
  } catch (error) {
    console.error('❌ Image CRUD test error:', error.message)
  }
  
  console.log(`\n📊 Image CRUD Results: ${testsPassed}/${testsTotal} tests passed`)
  return { passed: testsPassed, total: testsTotal }
}

/**
 * Test database indexes
 */
async function testIndexes() {
  console.log('\n🗂️ Testing Database Indexes...')
  
  const db = client.db('docs-lilaccs')
  
  let testsPassed = 0
  let testsTotal = 0
  
  try {
    // Test Posts Collection Indexes
    testsTotal++
    console.log('1️⃣ Testing posts collection indexes...')
    
    const postsIndexes = await db.collection('posts').indexes()
    const expectedPostsIndexes = ['_id_', 'id_1', 'date_-1', 'tags_1', 'published_1']
    const hasAllPostsIndexes = expectedPostsIndexes.every(indexName => 
      postsIndexes.some(index => index.name === indexName)
    )
    
    if (hasAllPostsIndexes) {
      console.log('   ✅ All posts indexes exist')
      testsPassed++
    } else {
      console.log('   ❌ Missing posts indexes')
      console.log('   Expected:', expectedPostsIndexes)
      console.log('   Found:', postsIndexes.map(i => i.name))
    }
    
    // Test Images Collection Indexes
    testsTotal++
    console.log('2️⃣ Testing images collection indexes...')
    
    const imagesIndexes = await db.collection('images').indexes()
    const expectedImagesIndexes = ['_id_', 'filename_1', 'uploadedAt_-1']
    const hasAllImagesIndexes = expectedImagesIndexes.every(indexName => 
      imagesIndexes.some(index => index.name === indexName)
    )
    
    if (hasAllImagesIndexes) {
      console.log('   ✅ All images indexes exist')
      testsPassed++
    } else {
      console.log('   ❌ Missing images indexes')
      console.log('   Expected:', expectedImagesIndexes)
      console.log('   Found:', imagesIndexes.map(i => i.name))
    }
    
  } catch (error) {
    console.error('❌ Index test error:', error.message)
  }
  
  console.log(`\n📊 Index Results: ${testsPassed}/${testsTotal} tests passed`)
  return { passed: testsPassed, total: testsTotal }
}

/**
 * Test performance with multiple operations
 */
async function testPerformance() {
  console.log('\n⚡ Testing Performance...')
  
  const db = client.db('docs-lilaccs')
  const postsCollection = db.collection('posts')
  
  let testsPassed = 0
  let testsTotal = 0
  
  try {
    // Test 1: Bulk Insert Performance
    testsTotal++
    console.log('1️⃣ Testing bulk insert performance...')
    
    const bulkPosts = []
    for (let i = 0; i < 10; i++) {
      bulkPosts.push({
        ...testPost,
        id: `performance-test-${i}`,
        title: `Performance Test Post ${i}`,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    
    const startTime = Date.now()
    const bulkResult = await postsCollection.insertMany(bulkPosts)
    const endTime = Date.now()
    
    if (bulkResult.acknowledged && bulkResult.insertedCount === 10) {
      console.log(`   ✅ Inserted 10 posts in ${endTime - startTime}ms`)
      testsPassed++
    } else {
      console.log('   ❌ Bulk insert failed')
    }
    
    // Test 2: Query Performance
    testsTotal++
    console.log('2️⃣ Testing query performance...')
    
    const queryStartTime = Date.now()
    const queryResult = await postsCollection
      .find({ published: true })
      .sort({ date: -1 })
      .limit(20)
      .toArray()
    const queryEndTime = Date.now()
    
    if (Array.isArray(queryResult)) {
      console.log(`   ✅ Queried ${queryResult.length} posts in ${queryEndTime - queryStartTime}ms`)
      testsPassed++
    } else {
      console.log('   ❌ Query performance test failed')
    }
    
    // Clean up performance test data
    await postsCollection.deleteMany({ id: /^performance-test-/ })
    
  } catch (error) {
    console.error('❌ Performance test error:', error.message)
  }
  
  console.log(`\n📊 Performance Results: ${testsPassed}/${testsTotal} tests passed`)
  return { passed: testsPassed, total: testsTotal }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('🧪 Starting MongoDB Integration Tests...\n')
  
  try {
    // Test connection
    const connectionOk = await testConnection()
    if (!connectionOk) {
      console.log('❌ Cannot proceed without database connection')
      process.exit(1)
    }
    
    // Run all test suites
    const postResults = await testPostCRUD()
    const imageResults = await testImageCRUD()
    const indexResults = await testIndexes()
    const performanceResults = await testPerformance()
    
    // Calculate overall results
    const totalPassed = postResults.passed + imageResults.passed + indexResults.passed + performanceResults.passed
    const totalTests = postResults.total + imageResults.total + indexResults.total + performanceResults.total
    const successRate = ((totalPassed / totalTests) * 100).toFixed(1)
    
    console.log('\n' + '='.repeat(50))
    console.log('🎯 MONGODB INTEGRATION TEST SUMMARY')
    console.log('='.repeat(50))
    console.log(`📝 Post CRUD: ${postResults.passed}/${postResults.total}`)
    console.log(`🖼️ Image CRUD: ${imageResults.passed}/${imageResults.total}`)
    console.log(`🗂️ Indexes: ${indexResults.passed}/${indexResults.total}`)
    console.log(`⚡ Performance: ${performanceResults.passed}/${performanceResults.total}`)
    console.log('-'.repeat(50))
    console.log(`🎯 Overall: ${totalPassed}/${totalTests} (${successRate}%)`)
    
    if (totalPassed === totalTests) {
      console.log('\n🎉 ALL TESTS PASSED! MongoDB integration is ready for deployment.')
      return true
    } else {
      console.log('\n⚠️ Some tests failed. Please review the issues above.')
      return false
    }
    
  } catch (error) {
    console.error('💥 Test suite failed:', error)
    return false
  } finally {
    await client.close()
    console.log('\n🔌 Disconnected from MongoDB')
  }
}

// Run tests if called directly
if (require.main === module) {
  runAllTests()
    .then((success) => {
      process.exit(success ? 0 : 1)
    })
    .catch((error) => {
      console.error('💥 Fatal error:', error)
      process.exit(1)
    })
}

module.exports = { runAllTests } 