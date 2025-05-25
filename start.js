const { spawn } = require('child_process');
const path = require('path');

// Get the port from environment or use 3000 as default
const PORT = process.env.PORT || 3000;

// Set environment variables
process.env.NODE_ENV = 'production';
process.env.PORT = PORT;

// Start the Next.js application
const nextApp = spawn('npm', ['run', 'start-prod'], {
  stdio: 'inherit',
  env: process.env
});

nextApp.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGTERM', () => {
  nextApp.kill();
  process.exit(0);
});

process.on('SIGINT', () => {
  nextApp.kill();
  process.exit(0);
}); 