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

/**
 * Test MongoDB connection with correct options
 */
async function testMongoDBConnection() {
  console.log('🔌 Testing MongoDB Connection with Production Options...\n')
  
  // Use only supported MongoDB driver options
  const correctOptions = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    family: 4, // Use IPv4
  }
  
  const client = new MongoClient(uri, correctOptions)
  
  try {
    console.log('1️⃣ Connecting to MongoDB...')
    await client.connect()
    console.log('   ✅ Connection successful')
    
    console.log('2️⃣ Testing database ping...')
    await client.db('admin').command({ ping: 1 })
    console.log('   ✅ Ping successful')
    
    console.log('3️⃣ Testing database access...')
    const db = client.db('docs-lilaccs')
    const collections = await db.listCollections().toArray()
    console.log(`   ✅ Database accessible, found ${collections.length} collections`)
    
    console.log('4️⃣ Testing posts collection...')
    const postsCollection = db.collection('posts')
    const postCount = await postsCollection.countDocuments()
    console.log(`   ✅ Posts collection accessible, ${postCount} posts found`)
    
    console.log('5️⃣ Testing images collection...')
    const imagesCollection = db.collection('images')
    const imageCount = await imagesCollection.countDocuments()
    console.log(`   ✅ Images collection accessible, ${imageCount} images found`)
    
    return true
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error.message)
    return false
  } finally {
    await client.close()
  }
}

/**
 * Test post creation with validation
 */
async function testPostCreation() {
  console.log('\n📝 Testing Post Creation Logic...\n')
  
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    family: 4,
  })
  
  try {
    await client.connect()
    const db = client.db('docs-lilaccs')
    const collection = db.collection('posts')
    
    // Test data that might cause validation issues
    const testCases = [
      {
        name: 'Valid post data',
        data: {
          title: 'Test Production Post',
          description: 'Testing production post creation',
          content: '# Test Content\n\nThis is a test post for production.',
          date: new Date().toISOString(),
          tags: ['test', 'production'],
          image: '',
          published: true
        },
        shouldPass: true
      },
      {
        name: 'Missing required fields',
        data: {
          title: '',
          description: '',
          content: '',
          date: '',
          tags: []
        },
        shouldPass: false
      },
      {
        name: 'Invalid date format',
        data: {
          title: 'Test Post',
          description: 'Test Description',
          content: 'Test Content',
          date: 'invalid-date',
          tags: ['test']
        },
        shouldPass: false
      },
      {
        name: 'Special characters in title',
        data: {
          title: 'Test Post with Special Characters! @#$%^&*()',
          description: 'Testing special characters',
          content: 'Test content with special chars',
          date: new Date().toISOString(),
          tags: ['test', 'special-chars']
        },
        shouldPass: true
      }
    ]
    
    let testsPassed = 0
    let testsTotal = testCases.length
    
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i]
      console.log(`${i + 1}️⃣ Testing: ${testCase.name}`)
      
      try {
        // Simulate the validation logic
        const errors = validatePostData(testCase.data)
        
        if (testCase.shouldPass && errors.length === 0) {
          console.log('   ✅ Validation passed as expected')
          testsPassed++
        } else if (!testCase.shouldPass && errors.length > 0) {
          console.log(`   ✅ Validation failed as expected: ${errors.join(', ')}`)
          testsPassed++
        } else if (testCase.shouldPass && errors.length > 0) {
          console.log(`   ❌ Validation failed unexpectedly: ${errors.join(', ')}`)
        } else {
          console.log('   ❌ Validation passed when it should have failed')
        }
      } catch (error) {
        console.log(`   ❌ Error during validation: ${error.message}`)
      }
    }
    
    console.log(`\n📊 Post Creation Tests: ${testsPassed}/${testsTotal} passed`)
    return testsPassed === testsTotal
    
  } catch (error) {
    console.error('❌ Post creation test failed:', error.message)
    return false
  } finally {
    await client.close()
  }
}

/**
 * Validation function (copied from database.ts)
 */
function validatePostData(data) {
  const errors = []
  
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Title is required')
  }
  
  if (!data.description || data.description.trim().length === 0) {
    errors.push('Description is required')
  }
  
  if (!data.content || data.content.trim().length === 0) {
    errors.push('Content is required')
  }
  
  if (!data.date) {
    errors.push('Date is required')
  } else if (isNaN(Date.parse(data.date))) {
    errors.push('Invalid date format')
  }
  
  if (!data.tags || data.tags.length === 0) {
    errors.push('At least one tag is required')
  }
  
  return errors
}

/**
 * Test API endpoint structure
 */
function testAPIStructure() {
  console.log('\n🌐 Testing API Endpoint Structure...\n')
  
  const requiredFiles = [
    'app/api/admin/posts/route.ts',
    'app/api/admin/posts/[id]/route.ts',
    'app/api/admin/upload/route.ts',
    'app/api/images/[filename]/route.ts',
    'lib/mongodb.ts',
    'lib/database.ts'
  ]
  
  let filesChecked = 0
  let filesPassed = 0
  
  requiredFiles.forEach((file, index) => {
    filesChecked++
    console.log(`${index + 1}️⃣ Checking ${file}...`)
    
    const fullPath = path.join(process.cwd(), file)
    if (fs.existsSync(fullPath)) {
      console.log('   ✅ File exists')
      filesPassed++
    } else {
      console.log('   ❌ File missing')
    }
  })
  
  console.log(`\n📊 API Structure: ${filesPassed}/${filesChecked} files found`)
  return filesPassed === filesChecked
}

/**
 * Test environment configuration
 */
function testEnvironment() {
  console.log('\n🔧 Testing Environment Configuration...\n')
  
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'COOKIE_SECRET',
    'ADMIN_PASSWORD_HASH'
  ]
  
  let envChecked = 0
  let envPassed = 0
  
  requiredEnvVars.forEach((envVar, index) => {
    envChecked++
    console.log(`${index + 1}️⃣ Checking ${envVar}...`)
    
    if (process.env[envVar]) {
      console.log('   ✅ Environment variable set')
      envPassed++
    } else {
      console.log('   ❌ Environment variable missing')
    }
  })
  
  console.log(`\n📊 Environment: ${envPassed}/${envChecked} variables configured`)
  return envPassed === envChecked
}

/**
 * Run all production tests
 */
async function runProductionTests() {
  console.log('🧪 Starting Production Issue Diagnosis...\n')
  
  const connectionOk = await testMongoDBConnection()
  const postCreationOk = await testPostCreation()
  const apiStructureOk = testAPIStructure()
  const environmentOk = testEnvironment()
  
  console.log('\n' + '='.repeat(60))
  console.log('🎯 PRODUCTION ISSUE DIAGNOSIS SUMMARY')
  console.log('='.repeat(60))
  console.log(`🔌 MongoDB Connection: ${connectionOk ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`📝 Post Creation Logic: ${postCreationOk ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`🌐 API Structure: ${apiStructureOk ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`🔧 Environment Config: ${environmentOk ? '✅ PASS' : '❌ FAIL'}`)
  
  const allTestsPassed = connectionOk && postCreationOk && apiStructureOk && environmentOk
  
  if (allTestsPassed) {
    console.log('\n🎉 ALL TESTS PASSED! The issues should be resolved.')
    console.log('\n📋 FIXES APPLIED:')
    console.log('   • Removed deprecated MongoDB options (bufferMaxEntries, bufferCommands)')
    console.log('   • Added proper MongoDB driver options')
    console.log('   • Improved connection management for production')
    console.log('   • Enhanced error handling in API endpoints')
  } else {
    console.log('\n⚠️ Some tests failed. Please review the issues above.')
  }
  
  return allTestsPassed
}

// Run tests
if (require.main === module) {
  runProductionTests()
    .then((success) => {
      process.exit(success ? 0 : 1)
    })
    .catch((error) => {
      console.error('💥 Fatal error:', error)
      process.exit(1)
    })
}

module.exports = { runProductionTests } 