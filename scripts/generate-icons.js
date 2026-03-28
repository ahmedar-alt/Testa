import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = join(__dirname, '../public/icons');
const screenshotsDir = join(__dirname, '../public/screenshots');

async function generateIcons() {
  try {
    await mkdir(iconsDir, { recursive: true });

    // Télécharger l'icone source si pas présente localement
    const sourcePath = join(__dirname, '../public/icon-source.png');
    let sourceBuffer;

    try {
      sourceBuffer = await readFile(sourcePath);
    } catch {
      // Si pas d'icone locale, on utilise une icone SVG de base
      console.log('⚠️  No local icon-source.png, using placeholder SVG');
      // On skip l'étape icon generation
      return;
    }

    for (const size of sizes) {
      const outputPath = join(iconsDir, `icon-${size}x${size}.png`);
      await sharp(sourceBuffer)
        .resize(size, size, { fit: 'cover' })
        .png({ quality: 90, compressionLevel: 9 })
        .toFile(outputPath);
      console.log(`✅ Generated ${outputPath}`);
    }

    console.log('🎉 All icons generated!');
  } catch (error) {
    console.error('❌ Icon generation failed:', error);
    process.exit(1);
  }
}

generateIcons();