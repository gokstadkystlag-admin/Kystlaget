// Lager ett delingsbilde (og:image) per fast side, 1200x630 JPG, med Chrome i bakgrunnen.
// Ferdige bilder: node scripts/lag-delingsbilder.mjs
//   Lager komposisjon B i public/images/og/ og lista src/data/delingsbilder.json som Layout.astro leser.
// Forhåndsvisning: node scripts/lag-delingsbilder.mjs alle
//   Lager A, B og C i docs/og-forhandsvisning/ (gitignored), sammen med index.html der.
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const rot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const mal = resolve(rot, 'scripts', 'og-mal.html');
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

// navn = filnavn og adressen bildet hører til
export const sider = [
  { navn: 'hjem', adresse: '/', tittel: 'Gokstad Kystlag', bilde: 'kystlaget-havn.webp' },
  { navn: 'om', adresse: '/om', tittel: 'Om oss', bilde: 'bathavn.webp' },
  { navn: 'lag', adresse: '/lag', tittel: 'Arbeidslagene', bilde: 'albatross-ii.webp' },
  { navn: 'lag-fartoy-og-kulturlaget', adresse: '/lag/fartoy-og-kulturlaget', tittel: 'Fartøy- og kulturlaget', bilde: 'fartoy-og-kulturlaget.webp' },
  { navn: 'lag-gk-ung', adresse: '/lag/gk-ung', tittel: 'GK Ung', bilde: 'gk-ung.webp' },
  { navn: 'lag-gokstadveverne', adresse: '/lag/gokstadveverne', tittel: 'Gokstadveverne', bilde: 'gokstadveverne.webp' },
  { navn: 'lag-hus-og-havnelaget', adresse: '/lag/hus-og-havnelaget', tittel: 'Hus- og havnelaget', bilde: 'hus-og-havnelaget.webp' },
  { navn: 'lag-infolaget', adresse: '/lag/infolaget', tittel: 'Infolaget', bilde: 'infolaget.webp' },
  { navn: 'lag-kystledlaget', adresse: '/lag/kystledlaget', tittel: 'Kystledlaget', bilde: 'kystledlaget.webp' },
  { navn: 'lag-modellbatlaget', adresse: '/lag/modellbatlaget', tittel: 'Modellbåtlaget', bilde: 'modellbatlaget.webp', helt: true },
  { navn: 'lag-motorsamlingen', adresse: '/lag/motorsamlingen', tittel: 'Motorsamlingen', bilde: 'motorsamlingen.webp' },
  { navn: 'lag-nordre-skur-og-ballast', adresse: '/lag/nordre-skur-og-ballast', tittel: 'Nordre Skur og Ballast', bilde: 'nordre-skur-og-ballast.webp' },
  { navn: 'lag-stiftelsen', adresse: '/lag/stiftelsen', tittel: 'Stiftelsen Sandefjord Kystkultursenter', bilde: 'stiftelsen.webp' },
  { navn: 'lag-verkstedlaget', adresse: '/lag/verkstedlaget', tittel: 'Verkstedlaget', bilde: 'verkstedlaget.webp' },
  { navn: 'gjestebrygge', adresse: '/gjestebrygge', tittel: 'Gjestebrygge', bilde: 'gjestebrygge.webp' },
  { navn: 'utleie', adresse: '/utleie', tittel: 'Selskapslokaler', bilde: 'utleie-03.webp' },
  { navn: 'kontakt', adresse: '/kontakt', tittel: 'Kontakt oss', bilde: 'kystlaget-havn.webp' },
  { navn: 'aktuelt', adresse: '/aktuelt', tittel: 'Aktuelt', bilde: 'infolaget.webp' },
  { navn: 'arrangementer', adresse: '/arrangementer', tittel: 'Arrangementer', bilde: 'utleie-05.webp' },
];

async function lagBilde(side, variant, ut, filnavn) {
  const q = new URLSearchParams({ variant, tittel: side.tittel, bilde: side.bilde, pos: side.pos || 'center', ...(side.helt && { helt: '1' }) });
  const url = `${pathToFileURL(mal).href}?${q}`;
  const png = resolve(ut, `${filnavn}.png`);
  execFileSync(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
    '--window-size=1200,630', '--virtual-time-budget=8000',
    `--screenshot=${png}`, url,
  ], { stdio: 'ignore' });
  const jpg = png.replace(/\.png$/, '.jpg');
  await sharp(png).resize(1200, 630).jpeg({ quality: 85, mozjpeg: true }).toFile(jpg);
  rmSync(png);
  return jpg;
}

const forhandsvisning = process.argv[2] === 'alle';
const ut = resolve(rot, forhandsvisning ? 'docs/og-forhandsvisning' : 'public/images/og');
const bare = process.env.BARE; // f.eks. BARE=hjem for å teste én side
mkdirSync(ut, { recursive: true });

for (const side of sider.filter((s) => !bare || s.navn === bare)) {
  for (const v of forhandsvisning ? ['a', 'b', 'c'] : ['b']) {
    const filnavn = forhandsvisning ? `${side.navn}-${v}` : side.navn;
    await lagBilde(side, v, ut, filnavn);
    console.log(`${filnavn}.jpg`);
  }
}

if (!forhandsvisning && !bare) {
  const liste = Object.fromEntries(sider.map((s) => [s.adresse, { bilde: `/images/og/${s.navn}.jpg`, tittel: s.tittel }]));
  mkdirSync(resolve(rot, 'src', 'data'), { recursive: true });
  writeFileSync(resolve(rot, 'src', 'data', 'delingsbilder.json'), `${JSON.stringify(liste, null, 2)}\n`);
  console.log('src/data/delingsbilder.json');
}
