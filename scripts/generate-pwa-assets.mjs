import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const svgPath = path.join(publicDir, 'icons', 'app-icon.svg');

async function pngFromSvg(size, outPath, padding = 0) {
  const svg = await readFile(svgPath);
  await sharp(svg)
    .resize(size - padding * 2, size - padding * 2, { fit: 'contain', background: '#FAF8F5' })
    .extend({
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
      background: '#FAF8F5',
    })
    .png()
    .toFile(outPath);
}

async function main() {
  await mkdir(path.join(publicDir, 'icons'), { recursive: true });
  await mkdir(path.join(publicDir, 'splash'), { recursive: true });

  await pngFromSvg(512, path.join(publicDir, 'icons', 'icon-512.png'));
  await pngFromSvg(512, path.join(publicDir, 'icons', 'maskable-icon.png'), 64);
  await pngFromSvg(32, path.join(publicDir, 'favicon.png'));

  const splashSizes = [
    [640, 1136],
    [750, 1334],
    [828, 1792],
    [1125, 2436],
    [1242, 2688],
    [1536, 2048],
  ];

  const svg = await readFile(svgPath);

  for (const [w, h] of splashSizes) {
    const iconSize = Math.round(Math.min(w, h) * 0.28);
    const iconBuffer = await sharp(svg).resize(iconSize, iconSize).png().toBuffer();
    await sharp({
      create: {
        width: w,
        height: h,
        channels: 4,
        background: '#FAF8F5',
      },
    })
      .composite([{ input: iconBuffer, gravity: 'center' }])
      .png()
      .toFile(path.join(publicDir, 'splash', `splash-${w}x${h}.png`));
  }

  console.log('PWA assets generated.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
