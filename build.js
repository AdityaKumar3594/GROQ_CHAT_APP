#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 Building chat app...');

// Build the client
console.log('📦 Building client...');
execSync('cd packages/client && npm run build', { stdio: 'inherit' });

// Create dist directory in root
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy client build to dist
const clientDistDir = path.join(__dirname, 'packages', 'client', 'dist');
if (fs.existsSync(clientDistDir)) {
  console.log('📁 Copying client files to dist...');

  function copyRecursive(src, dest) {
    const items = fs.readdirSync(src);

    for (const item of items) {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);

      if (fs.statSync(srcPath).isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  copyRecursive(clientDistDir, distDir);
  console.log('✅ Build completed! Files are in ./dist');
} else {
  console.error('❌ Client build failed - no dist directory found');
  process.exit(1);
}
