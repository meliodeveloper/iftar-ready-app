import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const src = join(root, "public/icons/1024.png");
const dest = join(root, "ios/App/App/Assets.xcassets/AppIcon.appiconset");

const sizes = [20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024];

for (const size of sizes) {
  await sharp(src)
    .resize(size, size)
    .png()
    .toFile(join(dest, `Icon-${size}.png`));
  console.log(`  ✓ Icon-${size}.png`);
}

const contents = {
  images: [
    { idiom: "universal", platform: "ios", size: "20x20",   scale: "1x", filename: "Icon-20.png" },
    { idiom: "universal", platform: "ios", size: "20x20",   scale: "2x", filename: "Icon-40.png" },
    { idiom: "universal", platform: "ios", size: "20x20",   scale: "3x", filename: "Icon-60.png" },
    { idiom: "universal", platform: "ios", size: "29x29",   scale: "1x", filename: "Icon-29.png" },
    { idiom: "universal", platform: "ios", size: "29x29",   scale: "2x", filename: "Icon-58.png" },
    { idiom: "universal", platform: "ios", size: "29x29",   scale: "3x", filename: "Icon-87.png" },
    { idiom: "universal", platform: "ios", size: "38x38",   scale: "2x", filename: "Icon-76.png" },
    { idiom: "universal", platform: "ios", size: "40x40",   scale: "1x", filename: "Icon-40.png" },
    { idiom: "universal", platform: "ios", size: "40x40",   scale: "2x", filename: "Icon-80.png" },
    { idiom: "universal", platform: "ios", size: "60x60",   scale: "2x", filename: "Icon-120.png" },
    { idiom: "universal", platform: "ios", size: "60x60",   scale: "3x", filename: "Icon-180.png" },
    { idiom: "universal", platform: "ios", size: "76x76",   scale: "1x", filename: "Icon-76.png" },
    { idiom: "universal", platform: "ios", size: "76x76",   scale: "2x", filename: "Icon-152.png" },
    { idiom: "universal", platform: "ios", size: "83.5x83.5", scale: "2x", filename: "Icon-167.png" },
    { idiom: "universal", platform: "ios", size: "1024x1024", scale: "1x", filename: "Icon-1024.png" },
  ],
  info: { author: "xcode", version: 1 },
};

writeFileSync(join(dest, "Contents.json"), JSON.stringify(contents, null, 2) + "\n");
console.log("  ✓ Contents.json");
console.log("Done.");
