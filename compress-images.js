<<<<<<< HEAD
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, 'public/images');
const outputDir = path.join(__dirname, 'public/images');

// Get all image files
const files = fs.readdirSync(imageDir).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.png', '.jpg', '.jpeg'].includes(ext);
});

console.log(`Found ${files.length} images to convert...`);

let processed = 0;
let errors = 0;

files.forEach(async (file) => {
  const inputPath = path.join(imageDir, file);
  const filename = path.parse(file).name;
  const outputPath = path.join(outputDir, `${filename}.webp`);

  try {
    // Get original file size
    const originalSize = fs.statSync(inputPath).size;

    // Process based on file type
    let pipeline = sharp(inputPath);

    // For PNGs - preserve transparency, compress
    if (file.toLowerCase().endsWith('.png')) {
      pipeline = pipeline
        .webp({ quality: 80, alphaQuality: 100 });
    } else {
      // For JPGs - compress more aggressively
      pipeline = pipeline
        .webp({ quality: 75 });
    }

    await pipeline.toFile(outputPath);

    const newSize = fs.statSync(outputPath).size;
    const reduction = (((originalSize - newSize) / originalSize) * 100).toFixed(2);

    console.log(`✓ ${file} → ${filename}.webp (${(originalSize / 1024).toFixed(2)}KB → ${(newSize / 1024).toFixed(2)}KB, -${reduction}%)`);
    processed++;
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error.message);
    errors++;
  }

  if (processed + errors === files.length) {
    console.log(`\n✓ Conversion complete! Processed: ${processed}, Errors: ${errors}`);
    console.log('\nNext steps:');
    console.log('1. Update image imports in your components');
    console.log('2. Replace .png, .jpg with .webp in src attributes');
    console.log('3. Delete original image files if you want');
  }
});
=======
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, 'public/images');
const outputDir = path.join(__dirname, 'public/images');

// Get all image files
const files = fs.readdirSync(imageDir).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.png', '.jpg', '.jpeg'].includes(ext);
});

console.log(`Found ${files.length} images to convert...`);

let processed = 0;
let errors = 0;

files.forEach(async (file) => {
  const inputPath = path.join(imageDir, file);
  const filename = path.parse(file).name;
  const outputPath = path.join(outputDir, `${filename}.webp`);

  try {
    // Get original file size
    const originalSize = fs.statSync(inputPath).size;

    // Process based on file type
    let pipeline = sharp(inputPath);

    // For PNGs - preserve transparency, compress
    if (file.toLowerCase().endsWith('.png')) {
      pipeline = pipeline
        .webp({ quality: 80, alphaQuality: 100 });
    } else {
      // For JPGs - compress more aggressively
      pipeline = pipeline
        .webp({ quality: 75 });
    }

    await pipeline.toFile(outputPath);

    const newSize = fs.statSync(outputPath).size;
    const reduction = (((originalSize - newSize) / originalSize) * 100).toFixed(2);

    console.log(`✓ ${file} → ${filename}.webp (${(originalSize / 1024).toFixed(2)}KB → ${(newSize / 1024).toFixed(2)}KB, -${reduction}%)`);
    processed++;
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error.message);
    errors++;
  }

  if (processed + errors === files.length) {
    console.log(`\n✓ Conversion complete! Processed: ${processed}, Errors: ${errors}`);
    console.log('\nNext steps:');
    console.log('1. Update image imports in your components');
    console.log('2. Replace .png, .jpg with .webp in src attributes');
    console.log('3. Delete original image files if you want');
  }
});
>>>>>>> c898dac (first commit)
