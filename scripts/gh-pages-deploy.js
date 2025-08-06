const fs = require('fs');
const path = require('path');

// Create the out directory if it doesn't exist
const outDir = path.join(process.cwd(), 'out');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Create .nojekyll file to prevent GitHub Pages from using Jekyll
const nojekyllPath = path.join(outDir, '.nojekyll');
fs.writeFileSync(nojekyllPath, '');

console.log('Created .nojekyll file in the out directory');
