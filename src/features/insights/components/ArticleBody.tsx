import type { ArticleBlock } from '@/types'

/** Renders editorial blocks in a readable column. */
export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="max-w-[68ch] text-[17px] leading-[1.75] text-ink/85">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'h2':
            return (
              <h2 key={i} className="mt-12 mb-4 font-display text-[30px] leading-tight font-semibold text-plum md:text-[34px]">
                {b.text}
              </h2>
            )
          case 'list':
            return (
              <ul key={i} className="my-6 space-y-3">
                {b.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span aria-hidden="true" className="bg-aura-gradient mt-[0.7em] size-2 shrink-0 rounded-full" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )
          case 'quote':
            return (
              <figure key={i} className="my-10 border-s-4 border-plum ps-6">
                <blockquote className="font-display text-[26px] leading-[1.3] font-medium text-plum md:text-[30px]">“{b.text}”</blockquote>
                {b.cite && <figcaption className="mt-3 text-[14px] font-semibold text-muted">— {b.cite}</figcaption>}
              </figure>
            )
          default:
            return (
              <p key={i} className="mt-5 first:mt-0">
                {b.text}
              </p>
            )
        }
      })}
    </div>
  )
}
