import fs from 'fs';
import path from 'path';

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  if (fs.existsSync('lib/generated')) {
    copyDir('lib/generated', 'dist/lib/generated');
    console.log('Successfully copied generated Prisma client to dist.');
  } else {
    console.log('No generated client in lib/generated to copy.');
  }
} catch (err) {
  console.error('Failed to copy generated Prisma client:', err);
  process.exit(1);
}
