import { promises as fs } from 'node:fs';
import path from 'node:path';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';

// Default file size threshold: 500KB (adjust as needed)
const DEFAULT_THRESHOLD = 500 * 1024;

/**
 * Optimize a single image file using lossy compression similar to TinyPNG.
 *
 * @param {string} filePath - Path to the image file.
 */
async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  let plugins = [];

  if (ext === '.jpg' || ext === '.jpeg') {
    // Use mozjpeg with a quality setting (adjust quality as needed).
    plugins.push(imageminMozjpeg({
      quality: 75,         // Adjust this value (e.g., 70-80) to balance quality & size
      progressive: true    // Enable progressive rendering
    }));
  } else if (ext === '.png') {
    // Use pngquant with a quality range. This reduces the color palette.
    plugins.push(imageminPngquant({
      quality: [0.6, 0.8]  // Adjust the range to get more aggressive compression
    }));
  } else {
    // Unsupported file type.
    return;
  }

  try {
    // Read the original file.
    const originalBuffer = await fs.readFile(filePath);
    
    // Optimize the image.
    const optimizedBuffer = await imagemin.buffer(originalBuffer, { plugins });
    
    // Write back if a smaller file is produced.
    if (optimizedBuffer.length < originalBuffer.length) {
      await fs.writeFile(filePath, optimizedBuffer);
      const sizeDecreasePercentage = ((originalBuffer.length - optimizedBuffer.length) / originalBuffer.length * 100).toFixed(2);
      console.log(`Optimized: ${filePath} (${originalBuffer.length} → ${optimizedBuffer.length} bytes, -${sizeDecreasePercentage}%)`);
    } else {
      console.log(`No size improvement for: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error optimizing ${filePath}: ${error}`);
  }
}

/**
 * Recursively process a directory.
 *
 * @param {string} directory - The directory to scan.
 * @param {number} threshold - File size threshold in bytes.
 */
async function processDirectory(directory, threshold) {
  let entries;
  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch (error) {
    console.error(`Error reading directory ${directory}: ${error}`);
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await processDirectory(fullPath, threshold);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        let stats;
        try {
          stats = await fs.stat(fullPath);
        } catch (err) {
          console.error(`Error getting stats for ${fullPath}: ${err}`);
          continue;
        }
        if (stats.size > threshold) {
          console.log(`Processing ${fullPath} (size: ${stats.size} bytes)`);
          await optimizeImage(fullPath);
        } else {
          console.log(`Skipping ${fullPath} (size: ${stats.size} bytes)`);
        }
      }
    }
  }
}

/**
 * Main function: Parses command-line arguments and starts the optimization process.
 */
async function main() {
  // Usage: node optimize-images.js [directory] [sizeThresholdInBytes]
  const args = process.argv.slice(2);
  const directory = args[0] || '.';
  const threshold = args[1] ? parseInt(args[1], 10) : DEFAULT_THRESHOLD;

  console.log(`Scanning directory: ${directory}`);
  console.log(`Size threshold: ${threshold} bytes`);

  await processDirectory(directory, threshold);
}

main().catch(err => console.error(err));
