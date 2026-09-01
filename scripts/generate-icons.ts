import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');

const svgIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="96" fill="#0B0F17"/>
  <defs>
    <filter id="pwa-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <linearGradient id="neon-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#38E1FF" />
      <stop offset="50%" stopColor="#00F0FF" />
      <stop offset="100%" stopColor="#00C4EE" />
    </linearGradient>
  </defs>

  <g transform="translate(48, 48) scale(2.6)" filter="url(#pwa-glow)">
    <!-- Head & Jaw -->
    <path
      d="
        M 64 34
        C 70 32, 90 32, 96 34
        C 100 24, 114 24, 117 35
        C 119 43, 115 50, 110 54
        C 120 62, 122 75, 112 85
        C 96 95, 64 95, 48 85
        C 38 75, 40 62, 50 54
        C 45 50, 41 43, 43 35
        C 46 24, 60 24, 64 34
        Z
      "
      stroke="url(#neon-cyan)"
      stroke-width="6.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />

    <!-- Pupils -->
    <circle cx="53" cy="38" r="4.2" fill="#00F0FF" />
    <circle cx="107" cy="38" r="4.2" fill="#00F0FF" />

    <!-- Left Leg -->
    <path
      d="
        M 44 68
        C 32 68, 22 74, 23 88
        C 24 96, 20 102, 16 106
        C 14 108, 16 110, 20 110
        L 48 110
        C 56 110, 52 98, 43 90
        C 40 86, 38 80, 42 75
      "
      stroke="url(#neon-cyan)"
      stroke-width="6.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />

    <!-- Right Leg -->
    <path
      d="
        M 116 68
        C 128 68, 138 74, 137 88
        C 136 96, 140 102, 144 106
        C 146 108, 144 110, 140 110
        L 112 110
        C 104 110, 108 98, 117 90
        C 120 86, 122 80, 118 75
      "
      stroke="url(#neon-cyan)"
      stroke-width="6.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
  </g>
</svg>
`;

const svgMaskableIcon = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#0B0F17"/>
  <defs>
    <filter id="pwa-glow-mask" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <linearGradient id="neon-cyan-mask" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#38E1FF" />
      <stop offset="50%" stopColor="#00F0FF" />
      <stop offset="100%" stopColor="#00C4EE" />
    </linearGradient>
  </defs>

  <g transform="translate(80, 80) scale(2.2)" filter="url(#pwa-glow-mask)">
    <!-- Head & Jaw -->
    <path
      d="
        M 64 34
        C 70 32, 90 32, 96 34
        C 100 24, 114 24, 117 35
        C 119 43, 115 50, 110 54
        C 120 62, 122 75, 112 85
        C 96 95, 64 95, 48 85
        C 38 75, 40 62, 50 54
        C 45 50, 41 43, 43 35
        C 46 24, 60 24, 64 34
        Z
      "
      stroke="url(#neon-cyan-mask)"
      stroke-width="6.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />

    <!-- Pupils -->
    <circle cx="53" cy="38" r="4.2" fill="#00F0FF" />
    <circle cx="107" cy="38" r="4.2" fill="#00F0FF" />

    <!-- Left Leg -->
    <path
      d="
        M 44 68
        C 32 68, 22 74, 23 88
        C 24 96, 20 102, 16 106
        C 14 108, 16 110, 20 110
        L 48 110
        C 56 110, 52 98, 43 90
        C 40 86, 38 80, 42 75
      "
      stroke="url(#neon-cyan-mask)"
      stroke-width="6.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />

    <!-- Right Leg -->
    <path
      d="
        M 116 68
        C 128 68, 138 74, 137 88
        C 136 96, 140 102, 144 106
        C 146 108, 144 110, 140 110
        L 112 110
        C 104 110, 108 98, 117 90
        C 120 86, 122 80, 118 75
      "
      stroke="url(#neon-cyan-mask)"
      stroke-width="6.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
  </g>
</svg>
`;

async function generate() {
  console.log('Generating PWA icons...');
  const svgBuffer = Buffer.from(svgIcon);
  const maskableSvgBuffer = Buffer.from(svgMaskableIcon);

  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));

  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));

  await sharp(maskableSvgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512-maskable.png'));

  await sharp(maskableSvgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192-maskable.png'));

  console.log('Icons generated successfully in public/');
}

generate().catch(console.error);
