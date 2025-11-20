// Generate PWA icons for iOS compatibility
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputIcon = path.join(__dirname, 'public', 'pwa', 'icon-512x512.png');
const outputDir = path.join(__dirname, 'public', 'pwa');

// Required icon sizes for iOS PWA
const sizes = [72, 96, 128, 144, 152, 167, 180, 192, 384, 512];

async function generateIcons() {
    console.log('Generating PWA icons from:', inputIcon);

    // Check if source exists
    if (!fs.existsSync(inputIcon)) {
        console.error('Source icon not found:', inputIcon);
        process.exit(1);
    }

    for (const size of sizes) {
        const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);

        try {
            await sharp(inputIcon)
                .resize(size, size, {
                    fit: 'cover',
                    position: 'center'
                })
                .toFile(outputPath);

            console.log(`✓ Generated: icon-${size}x${size}.png`);
        } catch (error) {
            console.error(`✗ Failed to generate icon-${size}x${size}.png:`, error.message);
        }
    }

    // Also create apple-touch-icon.png (180x180 is standard)
    const appleTouchIcon = path.join(outputDir, 'apple-touch-icon.png');
    await sharp(inputIcon)
        .resize(180, 180, { fit: 'cover', position: 'center' })
        .toFile(appleTouchIcon);
    console.log('✓ Generated: apple-touch-icon.png');

    console.log('\n✅ All icons generated successfully!');
}

generateIcons().catch(console.error);
