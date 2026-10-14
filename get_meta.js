const sharp = require('sharp');

async function getMetadata() {
  const inputPath = 'C:\\Users\\ADMIN\\.gemini\\antigravity-ide\\brain\\ece3b7f2-31b4-4a87-9f1b-263774e9b0e2\\.user_uploaded\\media_1791271817121.png';
  const meta = await sharp(inputPath).metadata();
  console.log('Size:', meta.width, 'x', meta.height);
}

getMetadata();
