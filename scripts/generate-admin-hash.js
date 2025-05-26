const bcrypt = require('bcryptjs');

async function generateAdminHash() {
  // Replace 'your-password-here' with your desired admin password
  const password = process.argv[2] || 'admin123';
  const saltRounds = 12; // Same as in lib/auth.ts
  
  try {
    console.log('Generating bcrypt hash...');
    console.log('Password:', password);
    console.log('Salt Rounds:', saltRounds);
    console.log('');
    
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('✅ Generated Hash:');
    console.log(hash);
    console.log('');
    console.log('🔧 Environment Variable:');
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log('');
    console.log('📝 Add this to your .env file or Vercel environment variables');
    
  } catch (error) {
    console.error('❌ Error generating hash:', error);
  }
}

// Usage: node scripts/generate-admin-hash.js [password]
// Example: node scripts/generate-admin-hash.js mySecurePassword123
generateAdminHash(); 