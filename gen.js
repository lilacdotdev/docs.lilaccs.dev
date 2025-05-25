// hash-generator.js - Run this once to generate your password hash

const bcrypt = require('bcryptjs')

// Replace 'your-secure-password' with your actual admin password
const password = 'ShiftCat@6'
const saltRounds = 12

const hash = bcrypt.hashSync(password, saltRounds)
console.log('Generated hash:', hash)
console.log('Add this to your .env.local file as ADMIN_PASSWORD_HASH')

// To verify the hash works:
const isValid = bcrypt.compareSync(password, hash)
console.log('Hash verification:', isValid ? 'SUCCESS' : 'FAILED')