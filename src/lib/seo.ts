/**
 * Per-page <head> tags for route `head()` options: title, description, Open Graph and Twitter card.
 * Every route should set at least a title and a description — they end up in the prerendered HTML.
 */
export const SITE_TITLE = 'Apex Aura Real Estate'

export function seo({ title, description, image }: { title: string; description: string; image?: string }) {
  const full = title === SITE_TITLE ? title : `${title} · ${SITE_TITLE}`
  return {
    meta: [
      { title: full },
      { name: 'description', content: description },
      { property: 'og:title', content: full },
      { property: 'og:description', content: description },
      ...(image ? [{ property: 'og:image', content: image }] : []),
      { name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' },
      { name: 'twitter:title', content: full },
      { name: 'twitter:description', content: description },
    ],
  }
}
