import sharp from "sharp";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = join(__dirname, "../public/icons/icon-source.svg");
const svgBuffer = readFileSync(svgPath);

const sizes = [
  { size: 192, out: join(__dirname, "../public/icons/icon-192.png") },
  { size: 512, out: join(__dirname, "../public/icons/icon-512.png") },
];

for (const { size, out } of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(out);
  console.log(`✓ ${size}x${size} → ${out}`);
}
