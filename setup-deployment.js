#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 TeamSpace Deployment Setup\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  fs.copyFileSync(path.join(process.cwd(), 'env.local'), envPath);
  console.log('✅ Created .env.local file');
  console.log('⚠️  Please update the Supabase credentials in .env.local\n');
} else {
  console.log('✅ .env.local file already exists\n');
}

// Check if vercel is installed
console.log('📦 To install Vercel CLI:');
console.log('Run: npm install -g vercel');
console.log('Then run: vercel login\n');

console.log('📋 Next steps:');
console.log('1. Set up your Supabase project (see DEPLOYMENT.md)');
console.log('2. Update .env.local with your Supabase credentials');
console.log('3. Run: npm run deploy');
console.log('4. Follow the Vercel deployment prompts\n');

console.log('🔗 Useful links:');
console.log('- Supabase: https://supabase.com');
console.log('- Vercel: https://vercel.com');
console.log('- Deployment Guide: ./DEPLOYMENT.md\n');

console.log('✨ Happy deploying!');
