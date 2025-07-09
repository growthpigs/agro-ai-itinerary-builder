#!/usr/bin/env node

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SIZES = {
  full: { width: 800, height: 800 },
  medium: { width: 400, height: 400 },
  thumb: { width: 200, height: 200 }
};

const INPUT_DIR = path.join(__dirname, '../src/assets/images/producers/original');
const OUTPUT_DIR = path.join(__dirname, '../src/assets/images/producers');

async function ensureDirectories() {
  const dirs = [
    INPUT_DIR,
    path.join(OUTPUT_DIR, 'webp/full'),
    path.join(OUTPUT_DIR, 'webp/medium'),
    path.join(OUTPUT_DIR, 'webp/thumb'),
    path.join(OUTPUT_DIR, 'jpg/full'),
    path.join(OUTPUT_DIR, 'jpg/medium'),
    path.join(OUTPUT_DIR, 'jpg/thumb')
  ];

  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function processImage(inputPath, filename) {
  const name = path.basename(filename, path.extname(filename));
  
  console.log(`Processing ${filename}...`);

  for (const [sizeName, dimensions] of Object.entries(SIZES)) {
    // WebP version
    await sharp(inputPath)
      .resize(dimensions.width, dimensions.height, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(path.join(OUTPUT_DIR, 'webp', sizeName, `${name}.webp`));
    
    // JPEG fallback
    await sharp(inputPath)
      .resize(dimensions.width, dimensions.height, { fit: 'cover' })
      .jpeg({ quality: 90 })
      .toFile(path.join(OUTPUT_DIR, 'jpg', sizeName, `${name}.jpg`));
  }
  
  console.log(`✓ Processed ${filename}`);
}

async function processAllImages() {
  try {
    await ensureDirectories();
    
    const files = await fs.readdir(INPUT_DIR);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png)$/i.test(file)
    );
    
    if (imageFiles.length === 0) {
      console.log('No images found in', INPUT_DIR);
      return;
    }
    
    console.log(`Found ${imageFiles.length} images to process`);
    
    for (const file of imageFiles) {
      const inputPath = path.join(INPUT_DIR, file);
      await processImage(inputPath, file);
    }
    
    console.log('\n✨ All images processed successfully!');
    
  } catch (error) {
    console.error('Error processing images:', error);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] === __filename) {
  processAllImages();
}

export { processImage, processAllImages };