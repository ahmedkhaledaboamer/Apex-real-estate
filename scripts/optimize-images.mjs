// Turns source photos into responsive WebP variants for the site.
//
//   assets-src/photos/<name>.(jpg|jpeg|png|webp)  →  src/assets/images/photos/<name>-<width>.webp
//
// Widths: 480, 960, 1600 (capped at the original width). Run with `npm run images`,
// then reference the photo as IMG.<name> after adding `<name>: pick('<name>')` in
// src/assets/images/index.ts. Existing outputs are skipped unless the source is newer.
import { mkdirSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, parse } from 'node:path'
import sharp from 'sharp'

const root = join(import.meta.dirname, '..')
const srcDir = join(root, 'assets-src/photos')
const outDir = join(root, 'src/assets/images/photos')
const WIDTHS = [480, 960, 1600]
const QUALITY = 72

mkdirSync(outDir, { recursive: true })
const sources = readdirSync(srcDir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
let made = 0

for (const file of sources) {
  const { name } = parse(file)
  if (!/^[A-Za-z]+$/.test(name)) {
    console.warn(`skip ${file}: name must be letters only (camelCase), e.g. "palmVilla.jpg"`)
    continue
  }
  const input = join(srcDir, file)
  const srcTime = statSync(input).mtimeMs
  const { width = 0 } = await sharp(input).metadata()
  const targets = [...new Set(WIDTHS.map((w) => Math.min(w, width)))]
  for (const w of targets) {
    const out = join(outDir, `${name}-${w}.webp`)
    if (existsSync(out) && statSync(out).mtimeMs >= srcTime) continue
    await sharp(input).resize({ width: w }).webp({ quality: QUALITY, effort: 5 }).toFile(out)
    made++
    console.log(`${name}-${w}.webp  ${(statSync(out).size / 1024).toFixed(0)} KB`)
  }
}
console.log(made ? `\n${made} file(s) written to src/assets/images/photos` : 'All photos up to date.')
