// Serves the production build (dist/client) the way a static host would:
//   /path → /path/index.html (prerendered), unknown → /404.html (app shell, status 404),
//   gzip for text, long-lived cache headers for hashed /assets.
// Usage: npm run build && npm run preview   (optional: PORT=4180)
import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { gzipSync } from 'node:zlib'

const dir = join(import.meta.dirname, '..', 'dist', 'client')
const port = Number(process.env.PORT ?? 4180)
if (!existsSync(dir)) {
  console.error('dist/client not found — run `npm run build` first.')
  process.exit(1)
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml',
}

createServer((req, res) => {
  const url = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname)
  let file = normalize(join(dir, url))
  if (!file.startsWith(normalize(dir))) return res.writeHead(403).end()
  let status = 200
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')
  if (!existsSync(file)) {
    file = join(dir, '404.html')
    status = 404
  }
  const type = TYPES[extname(file)] ?? 'application/octet-stream'
  let body = readFileSync(file)
  const headers = { 'Content-Type': type }
  if (url.startsWith('/assets/')) headers['Cache-Control'] = 'public, max-age=31536000, immutable'
  if (/text|javascript|json|svg|xml/.test(type) && /gzip/.test(req.headers['accept-encoding'] ?? '')) {
    body = gzipSync(body)
    headers['Content-Encoding'] = 'gzip'
  }
  res.writeHead(status, headers).end(body)
}).listen(port, () => console.log(`Production build: http://localhost:${port}`))
