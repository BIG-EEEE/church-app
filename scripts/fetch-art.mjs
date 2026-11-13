// Downloads public-domain Gustave Dore engravings from Wikimedia Commons, verifies the licence flag,
// and writes compact WebP files to public/art plus public/art/credits.json.
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const ART = [
  ['deluge', 'Gustave Doré - The Holy Bible - Plate I, The Deluge.jpg'],
  ['jacob', '024.Jacob Wrestles with the Angel.jpg'],
  ['joseph', '028.Joseph Reveals Himself to His Brothers.jpg'],
  ['abraham', "016.The Testing of Abraham's Faith.jpg"],
  ['daniel', '130.Daniel Interprets the Writing on the Wall.jpg'],
  ['jonah', 'Dore jonah.jpg'],
  ['cana', 'Marriage at Cana engraving by Gustave Doré.jpg'],
  ['crucifixion', 'Gustave Doré - Crucifixion of Jesus.jpg'],
  ['judas', 'Gustave Doré - The Holy Bible - Plate CXLI, The Judas Kiss.jpg'],
  ['light', 'Dore light.jpg'],
];
const UA = { 'User-Agent': 'church-app-demo/0.1 (public-domain art fetch)' };
const api = 'https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1100&format=json&titles=';
const j = await (await fetch(api + encodeURIComponent(ART.map(([, t]) => 'File:' + t).join('|')), { headers: UA })).json();
const byTitle = Object.fromEntries(Object.values(j.query.pages).map((p) => [p.title, p]));
const credits = [];
for (const [slug, title] of ART) {
  const p = byTitle['File:' + title];
  const info = p?.imageinfo?.[0];
  if (!info || info.extmetadata?.LicenseShortName?.value !== 'Public domain') throw new Error(`Not verified public domain: ${title}`);
  const buf = Buffer.from(await (await fetch(info.thumburl, { headers: UA })).arrayBuffer());
  await sharp(buf).resize({ width: 960 }).webp({ quality: 74 }).toFile(`public/art/${slug}.webp`);
  credits.push({ slug, title: title.replace(/\.jpg$/, ''), source: info.descriptionurl, artist: 'Gustave Doré', license: 'Public domain' });
  console.log('ok', slug);
}
await writeFile('public/art/credits.json', JSON.stringify(credits, null, 1));
