#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple SVG icon for AGRO AI
const svgIcon = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#16a34a"/>
  <circle cx="256" cy="180" r="60" fill="#fff"/>
  <path d="M256 250 L200 350 L312 350 Z" fill="#fff"/>
  <rect x="246" y="350" width="20" height="50" fill="#fff"/>
  <text x="256" y="440" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#fff">AGRO AI</text>
</svg>`;

// Ensure icons directory exists
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Save SVG
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgIcon);

console.log('Icons generated successfully!');
console.log('Note: For production, you should convert these to PNG format using a proper image editor or online tool.');