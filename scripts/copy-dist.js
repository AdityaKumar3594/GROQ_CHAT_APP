const fs = require('fs');
const path = require('path');

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.log('Source directory does not exist:', src);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);

  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    if (fs.statSync(srcPath).isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy from packages/client/dist to root
const srcDir = path.join(__dirname, '..', 'packages', 'client', 'dist');
const destDir = path.join(__dirname, '..');

console.log('Copying from:', srcDir);
console.log('Copying to:', destDir);

copyRecursive(srcDir, destDir);
console.log('Copy completed!');
