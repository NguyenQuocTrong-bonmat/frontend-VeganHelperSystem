const sharp = require('sharp');

async function processFavicon() {
  const inputPath = 'C:\\Users\\ADMIN\\.gemini\\antigravity-ide\\brain\\ece3b7f2-31b4-4a87-9f1b-263774e9b0e2\\.user_uploaded\\media_1791271817121.png';
  const outputPath = 'd:\\HocTap\\Project\\VeganHelperFE\\project\\frontend-VeganHelperSystem-new\\public\\favicon-new.png';

  try {
    const size = 400; // Increase crop size a bit to ensure full leaf is captured
    const left = Math.floor((1024 - size) / 2);
    const top = Math.floor((512 - size) / 2);

    // 1. Crop the center
    const croppedBuffer = await sharp(inputPath)
      .extract({ left: left, top: top, width: size, height: size })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // 2. Manipulate pixels to make off-white transparent
    // The background is likely #FDFBF6 (253, 251, 246) or #FCFBF5 or #FFFFFF.
    // We'll treat anything where R>240, G>240, B>240 as transparent.
    const { data, info } = croppedBuffer;
    for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // If it's close to white/off-white background
      if (r > 240 && g > 240 && b > 230) {
        data[i + 3] = 0; // Set alpha to 0
      }
    }

    // 3. Save as PNG and trim the newly transparent background
    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: info.channels
      }
    })
    .trim({ threshold: 50 }) // Trim the new transparent area
    .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFormat('png', { quality: 100 })
    .toFile(outputPath);
      
    console.log('Favicon created successfully with transparency');
  } catch (error) {
    console.error('Error processing favicon:', error);
  }
}

processFavicon();
