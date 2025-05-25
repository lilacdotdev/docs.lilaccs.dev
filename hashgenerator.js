
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import bcrypt from 'bcryptjs'

// Test with your current credentials
const testUsername = 'admin'
const testPassword = 'ShiftCat@6' // Your original password

// Generate hash for '123'
const hash = bcrypt.hashSync(testPassword, 12)
console.log('=== PASSWORD HASH GENERATOR ===')
console.log('Password:', testPassword)
console.log('Generated hash:', hash)
console.log()

// Test verification
const isValid = bcrypt.compareSync(testPassword, hash)
console.log('=== VERIFICATION TEST ===')
console.log('Hash verification:', isValid ? '✅ SUCCESS' : '❌ FAILED')
console.log()

// Test with your current env hash (if you have one)
const currentEnvHash = process.env.ADMIN_PASSWORD_HASH
if (currentEnvHash) {
  console.log('=== CURRENT ENV HASH TEST ===')
  console.log('Current env hash:', currentEnvHash)
  const envHashValid = bcrypt.compareSync(testPassword, currentEnvHash)
  console.log('Current env hash works:', envHashValid ? '✅ SUCCESS' : '❌ FAILED')
} else {
  console.log('⚠️ No ADMIN_PASSWORD_HASH found in environment')
}

console.log()
console.log('Add this to your .env.local:')
console.log(`ADMIN_PASSWORD_HASH=${hash}`)