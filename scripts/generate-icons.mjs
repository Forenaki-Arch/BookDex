// Genera le icone PWA in PNG partendo dall'SVG.
// Uso: `node scripts/generate-icons.mjs` (richiede `sharp` installato come devDep opzionale).
// Per evitare dipendenze pesanti questo script è opzionale: in fallback usiamo
// le icone SVG direttamente tramite `public/icons/icon.svg`.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

async function main() {
  let sharp;
  try {
    sharp = (await import("sharp")).default;
  } catch {
    console.log(
      "[icons] 'sharp' non installato. Installa con `npm i -D sharp` per generare PNG automaticamente."
    );
    return;
  }

  const svg = await readFile(join(root, "public/icons/icon.svg"));
  const sizes = [
    { name: "icon-192.png", size: 192 },
    { name: "icon-512.png", size: 512 },
    { name: "icon-maskable.png", size: 512 },
    { name: "apple-touch-icon.png", size: 180 },
  ];
  for (const { name, size } of sizes) {
    const out = join(root, "public/icons", name);
    await sharp(svg).resize(size, size).png().toFile(out);
    console.log(`[icons] ${name} generato (${size}x${size})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
