// Renders PNG icons from public/icon.svg. Run: node scripts/build-icons.mjs
import sharp from 'sharp';
const svg = 'public/icon.svg';
for (const [name, size, pad] of [['icon-192', 192, 0], ['icon-512', 512, 0], ['apple-touch-icon', 180, 0], ['icon-maskable-512', 512, 0.2]]) {
  const inner = Math.round(size * (1 - pad * 2));
  const base = sharp({ create: { width: size, height: size, channels: 4, background: '#ccff00' } });
  const glyph = await sharp(svg, { density: 384 }).resize(inner, inner).png().toBuffer();
  await base.composite([{ input: glyph, gravity: 'center' }]).png().toFile(`public/${name}.png`);
}
console.log('icons ok');
