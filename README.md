# Apex Aora Web

Apex Aora Real Estate — Dubai. React 18 + TanStack Start (static prerendering) + Vite + TypeScript + Tailwind CSS.

## Getting started

```bash
npm install
npm run dev        # dev server with SSR — open the URL it prints
```

## Production

```bash
npm run build      # type-check, build, prerender every page → dist/client
npm run preview    # serve dist/client locally like a static host → http://localhost:4180
```

**Deploy:** upload the contents of `dist/client` to any static host (Netlify, Cloudflare Pages, Vercel,
S3 + CloudFront, Nginx…). Configure unknown paths to serve `/404.html` (most hosts do this automatically)
— it boots the app, which then shows the right page or the branded 404.

## Images

Put original photos in `assets-src/photos/<camelName>.jpg` and run `npm run images` to generate the
optimised WebP versions, then register them in `src/assets/images/index.ts`.
