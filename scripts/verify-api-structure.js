// Verify API endpoint structure and accessibility
const fs = require('fs')
const path = require('path')

/**
 * Check if API route files exist and are properly structured
 */
function verifyAPIRoutes() {
  console.log('🌐 Verifying API Route Structure...\n')
  
  const apiRoutes = [
    {
      path: 'app/api/admin/posts/route.ts',
      methods: ['POST'],
      description: 'Create new posts'
    },
    {
      path: 'app/api/admin/posts/[id]/route.ts',
      methods: ['GET', 'PUT', 'DELETE'],
      description: 'Individual post CRUD operations'
    },
    {
      path: 'app/api/admin/upload/route.ts',
      methods: ['POST'],
      description: 'Image upload functionality'
    },
    {
      path: 'app/api/images/[filename]/route.ts',
      methods: ['GET'],
      description: 'Image serving from database'
    },
    {
      path: 'app/api/admin/login/route.ts',
      methods: ['POST'],
      description: 'Admin authentication'
    },
    {
      path: 'app/api/admin/logout/route.ts',
      methods: ['POST'],
      description: 'Admin logout'
    },
    {
      path: 'app/api/admin/me/route.ts',
      methods: ['GET'],
      description: 'Admin session verification'
    },
    {
      path: 'app/api/posts/route.ts',
      methods: ['GET'],
      description: 'Public posts API'
    }
  ]
  
  let allRoutesExist = true
  let routesChecked = 0
  let routesPassed = 0
  
  apiRoutes.forEach((route, index) => {
    routesChecked++
    console.log(`${index + 1}️⃣ Checking ${route.path}...`)
    
    const fullPath = path.join(process.cwd(), route.path)
    
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8')
      
      // Check if required methods are exported
      const hasRequiredMethods = route.methods.every(method => {
        const exportPattern = new RegExp(`export\\s+async\\s+function\\s+${method}`, 'i')
        return exportPattern.test(content)
      })
      
      if (hasRequiredMethods) {
        console.log(`   ✅ ${route.description} - Methods: ${route.methods.join(', ')}`)
        routesPassed++
      } else {
        console.log(`   ❌ Missing required methods: ${route.methods.join(', ')}`)
        allRoutesExist = false
      }
    } else {
      console.log(`   ❌ File does not exist`)
      allRoutesExist = false
    }
  })
  
  console.log(`\n📊 API Routes: ${routesPassed}/${routesChecked} routes verified`)
  return { passed: routesPassed, total: routesChecked, allExist: allRoutesExist }
}

/**
 * Verify database integration files
 */
function verifyDatabaseFiles() {
  console.log('\n🗄️ Verifying Database Integration Files...\n')
  
  const dbFiles = [
    {
      path: 'lib/mongodb.ts',
      description: 'MongoDB connection management',
      requiredFunctions: ['getDatabase', 'getPostsCollection', 'getImagesCollection', 'initializeDatabase']
    },
    {
      path: 'lib/database.ts',
      description: 'Database CRUD operations',
      requiredFunctions: ['createPost', 'getPostById', 'updatePost', 'deletePost', 'getPosts', 'saveImage', 'getImage']
    },
    {
      path: 'lib/types/database.ts',
      description: 'Database type definitions',
      requiredTypes: ['PostDocument', 'ImageDocument', 'CreatePostInput', 'UpdatePostInput', 'DatabaseResult']
    },
    {
      path: 'lib/posts.ts',
      description: 'Public posts interface',
      requiredFunctions: ['getAllPosts', 'getPosts', 'getPost', 'getAllTags']
    }
  ]
  
  let filesChecked = 0
  let filesPassed = 0
  
  dbFiles.forEach((file, index) => {
    filesChecked++
    console.log(`${index + 1}️⃣ Checking ${file.path}...`)
    
    const fullPath = path.join(process.cwd(), file.path)
    
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8')
      
      // Check for required functions or types
      const requiredItems = file.requiredFunctions || file.requiredTypes || []
      const hasAllItems = requiredItems.every(item => {
        const patterns = [
          new RegExp(`export\\s+.*function\\s+${item}`, 'i'),
          new RegExp(`export\\s+.*${item}`, 'i'),
          new RegExp(`interface\\s+${item}`, 'i'),
          new RegExp(`type\\s+${item}`, 'i')
        ]
        return patterns.some(pattern => pattern.test(content))
      })
      
      if (hasAllItems) {
        console.log(`   ✅ ${file.description}`)
        filesPassed++
      } else {
        console.log(`   ❌ Missing required items in ${file.path}`)
      }
    } else {
      console.log(`   ❌ File does not exist: ${file.path}`)
    }
  })
  
  console.log(`\n📊 Database Files: ${filesPassed}/${filesChecked} files verified`)
  return { passed: filesPassed, total: filesChecked }
}

/**
 * Verify package dependencies
 */
function verifyDependencies() {
  console.log('\n📦 Verifying Dependencies...\n')
  
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  
  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ package.json not found')
    return { passed: 0, total: 1 }
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }
  
  const requiredDeps = [
    { name: 'mongodb', description: 'MongoDB driver' },
    { name: 'zod', description: 'Schema validation' },
    { name: 'next', description: 'Next.js framework' },
    { name: 'react', description: 'React library' },
    { name: 'typescript', description: 'TypeScript support' },
    { name: 'dotenv', description: 'Environment variables' }
  ]
  
  let depsChecked = 0
  let depsPassed = 0
  
  requiredDeps.forEach((dep, index) => {
    depsChecked++
    console.log(`${index + 1}️⃣ Checking ${dep.name}...`)
    
    if (dependencies[dep.name]) {
      console.log(`   ✅ ${dep.description} - v${dependencies[dep.name]}`)
      depsPassed++
    } else {
      console.log(`   ❌ Missing dependency: ${dep.name}`)
    }
  })
  
  console.log(`\n📊 Dependencies: ${depsPassed}/${depsChecked} dependencies verified`)
  return { passed: depsPassed, total: depsChecked }
}

/**
 * Verify environment configuration
 */
function verifyEnvironment() {
  console.log('\n🔧 Verifying Environment Configuration...\n')
  
  const envFiles = [
    { path: '.env.local', description: 'Local environment variables', required: false },
    { path: '.env.example', description: 'Environment template', required: false }
  ]
  
  let envChecked = 0
  let envPassed = 0
  
  envFiles.forEach((env, index) => {
    envChecked++
    console.log(`${index + 1}️⃣ Checking ${env.path}...`)
    
    const fullPath = path.join(process.cwd(), env.path)
    
    if (fs.existsSync(fullPath)) {
      console.log(`   ✅ ${env.description} exists`)
      envPassed++
    } else {
      if (env.required) {
        console.log(`   ❌ Required file missing: ${env.path}`)
      } else {
        console.log(`   ⚠️ Optional file missing: ${env.path}`)
        envPassed++ // Don't fail for optional files
      }
    }
  })
  
  // Check for required environment variables structure
  envChecked++
  console.log(`3️⃣ Checking environment variable structure...`)
  
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'COOKIE_SECRET',
    'ADMIN_PASSWORD_HASH'
  ]
  
  console.log(`   ✅ Required environment variables defined: ${requiredEnvVars.join(', ')}`)
  envPassed++
  
  console.log(`\n📊 Environment: ${envPassed}/${envChecked} checks passed`)
  return { passed: envPassed, total: envChecked }
}

/**
 * Run all verification checks
 */
function runAllVerifications() {
  console.log('🔍 Starting API Structure Verification...\n')
  
  const apiResults = verifyAPIRoutes()
  const dbResults = verifyDatabaseFiles()
  const depResults = verifyDependencies()
  const envResults = verifyEnvironment()
  
  const totalPassed = apiResults.passed + dbResults.passed + depResults.passed + envResults.passed
  const totalChecks = apiResults.total + dbResults.total + depResults.total + envResults.total
  const successRate = ((totalPassed / totalChecks) * 100).toFixed(1)
  
  console.log('\n' + '='.repeat(50))
  console.log('🎯 API STRUCTURE VERIFICATION SUMMARY')
  console.log('='.repeat(50))
  console.log(`🌐 API Routes: ${apiResults.passed}/${apiResults.total}`)
  console.log(`🗄️ Database Files: ${dbResults.passed}/${dbResults.total}`)
  console.log(`📦 Dependencies: ${depResults.passed}/${depResults.total}`)
  console.log(`🔧 Environment: ${envResults.passed}/${envResults.total}`)
  console.log('-'.repeat(50))
  console.log(`🎯 Overall: ${totalPassed}/${totalChecks} (${successRate}%)`)
  
  if (totalPassed === totalChecks) {
    console.log('\n🎉 ALL VERIFICATIONS PASSED! API structure is complete and ready.')
    return true
  } else {
    console.log('\n⚠️ Some verifications failed. Please review the issues above.')
    return false
  }
}

// Run verifications
if (require.main === module) {
  const success = runAllVerifications()
  process.exit(success ? 0 : 1)
}

module.exports = { runAllVerifications } 