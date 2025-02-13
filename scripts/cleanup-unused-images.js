import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicFolderPath = path.join(__dirname, '../static');
const srcFolderPath = path.join(__dirname, '../');

const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
const srcExtensions = ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.html', '.md', '.toml', '.json'];

/**
 * Recursively get all files with specified extensions from a directory.
 */
function getAllFiles(dirPath, extensions, excludeDirs = []) {
  let arrayOfFiles = [];
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);

    if (fs.statSync(filePath).isDirectory()) {
      if (!excludeDirs.includes(file)) {
        arrayOfFiles = arrayOfFiles.concat(getAllFiles(filePath, extensions, excludeDirs));
      }
    } else {
      if (!extensions || extensions.includes(path.extname(file).toLowerCase())) {
        arrayOfFiles.push(filePath);
      }
    }
  });

  return arrayOfFiles;
}

/**
 * Escape special characters for use in a regular expression.
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Step 1: Get all image files in the public folder.
const imageFiles = getAllFiles(publicFolderPath, imageExtensions);

// Step 2: Get all source files in the project folder, excluding 'out' and 'node_modules'.
const srcFiles = getAllFiles(srcFolderPath, srcExtensions, ['out', 'node_modules']);

// Step 3: Check if each image is used in the source files.
const usedImages = new Set();

imageFiles.forEach((imageFile) => {
  // Get the filename with extension.
  const imageFileName = path.basename(imageFile);
  console.log('adding image', imageFileName);
  // Create a regex pattern to search for the filename.
  const regexPattern = new RegExp(escapeRegExp(imageFileName), 'g');
  let imageUsed = false;

  for (const srcFile of srcFiles) {
    const content = fs.readFileSync(srcFile, 'utf8');
    console.log('checking', srcFile);
    if (regexPattern.test(content)) {
      imageUsed = true;
      usedImages.add(imageFile);
      console.log('image used', imageFile);
      break;
    }
  }
});

// Step 4: Delete unused images and write to deleted_files.js.
const unusedImages = imageFiles.filter((imageFile) => !usedImages.has(imageFile));

// Array to store deleted file paths
const deletedFiles = [];

unusedImages.forEach((unusedImage) => {
  console.log('Deleting unused image:', unusedImage);
  fs.unlinkSync(unusedImage);
  deletedFiles.push(unusedImage);
});

// Write the array of deleted files to deleted_files.js
fs.writeFileSync(path.join(__dirname, 'deleted_files.js'), `export const deletedFiles = ${JSON.stringify(deletedFiles, null, 2)};`);

console.log('Cleanup complete. Total unused images deleted:', unusedImages.length);