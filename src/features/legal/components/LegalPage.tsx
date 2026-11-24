import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronDown, FileText, Mail } from 'lucide-react'

import { PageHero } from '@/components/layout/PageHero'
import { ButtonAnchor } from '@/components/ui/Button'
import { Container } from '@/components/ui/misc'
import { CONTACT_EMAIL } from '@/lib/constants'
import { cn } from '@/lib/cn'

export type LegalSection = { id: string; title: string; content: React.ReactNode }

export const LEGAL_UPDATED = '24 Nov 2026'

const LEGAL_LINKS = [
  { to: '/legal/privacy', label: 'Privacy policy' },
  { to: '/legal/terms', label: 'Terms of use' },
  { to: '/legal/cookies', label: 'Cookie policy' },
] as const

/** Typography for long-form legal copy (token colours only). */
const prose = cn(
  'text-[15.5px] leading-relaxed text-ink/80',
  // Direct children only, so embedded widgets (cookie table, preference centre) keep their own styling.
  '[&>p]:mt-4 [&>p:first-child]:mt-0',
  '[&>h3]:mt-7 [&>h3]:text-[17px] [&>h3]:font-semibold [&>h3]:text-plum',
  '[&>ul]:mt-4 [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:ps-5 [&>ol]:mt-4 [&>ol]:list-decimal [&>ol]:space-y-2 [&>ol]:ps-5',
  '[&>ul>li]:ps-1 [&>ol>li]:ps-1 [&>ul>li::marker]:text-aura [&>ol>li::marker]:text-aura',
  '[&_strong]:font-semibold [&_strong]:text-ink',
  '[&_a]:font-semibold [&_a]:text-aura [&_a]:underline-offset-2 hover:[&_a]:underline',
)

/** Shared layout for /legal/* pages: hero, sticky table of contents, readable content column. */
export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string
  intro: React.ReactNode
  sections: LegalSection[]
}) {
  const [active, setActive] = useState(sections[0]?.id)

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((e): e is HTMLElement => e !== null)
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-140px 0px -55% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [sections])

  const toc = (
    <ol className="space-y-1">
      {sections.map((s, i) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            aria-current={active === s.id ? 'location' : undefined}
            className={cn(
              'flex gap-2.5 rounded-lg border-s-2 py-1.5 ps-3 pe-2 text-[13.5px] leading-snug transition-colors duration-150',
              active === s.id ? 'border-aura bg-mist font-semibold text-plum' : 'border-transparent text-muted hover:text-plum',
            )}
          >
            <span className="tabular-nums opacity-60">{i + 1}.</span>
            <span>{s.title}</span>
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    <>
      <PageHero title={title} sub={`Last updated ${LEGAL_UPDATED}`} crumbs={[{ label: 'Legal' }, { label: title }]} />

      <Container className="py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr] lg:gap-16">
          <aside className="lg:sticky lg:top-[132px] lg:self-start">
            {/* Mobile / tablet: collapsible */}
            <details className="group rounded-[16px] bg-white p-5 shadow-soft lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold text-plum">
                On this page
                <ChevronDown className="size-4 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <nav aria-label="Table of contents" className="mt-4">
                {toc}
              </nav>
            </details>
            {/* Desktop: sticky list */}
            <nav aria-label="Table of contents" className="hidden lg:block">
              <p className="mb-3 text-[12px] font-semibold tracking-wide text-muted uppercase">On this page</p>
              {toc}
              <div className="mt-8 border-t border-line/70 pt-6">
                <p className="mb-2 text-[12px] font-semibold tracking-wide text-muted uppercase">Legal</p>
                <ul className="space-y-1.5">
                  {LEGAL_LINKS.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="text-[13.5px] text-muted hover:text-aura" activeProps={{ className: 'font-semibold text-plum' }}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </aside>

          <article className="min-w-0 max-w-[72ch]">
            <div role="note" className="flex items-start gap-3 rounded-[16px] border border-line bg-mist p-5 text-[14px] text-plum">
              <FileText className="mt-0.5 size-5 shrink-0 text-aura" />
              <p>
                <strong className="font-semibold">Template — to be reviewed by legal counsel before launch.</strong> Bracketed items such as [Trade Licence No.] are placeholders.
              </p>
            </div>

            <div className={cn(prose, 'mt-8')}>{intro}</div>

            {sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-[140px] border-t border-line/70 pt-10 mt-10">
                <h2 id={`${s.id}-h`} className="font-display text-[28px] leading-tight font-semibold text-plum md:text-[32px]">
                  <span className="me-2 text-aura">{i + 1}.</span>
                  {s.title}
                </h2>
                <div className={cn(prose, 'mt-4')}>{s.content}</div>
              </section>
            ))}

            <div className="mt-14 flex flex-col gap-4 rounded-[16px] bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[16px] font-semibold text-plum">Questions about this policy?</p>
                <p className="mt-1 text-[14px] text-muted">Our data protection contact replies within five working days.</p>
              </div>
              <ButtonAnchor variant="outline" className="shrink-0" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`${title} enquiry`)}`}>
                <Mail className="size-4" /> {CONTACT_EMAIL}
              </ButtonAnchor>
            </div>

            <nav aria-label="Other legal pages" className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[14px] lg:hidden">
              {LEGAL_LINKS.map((l) => (
                <Link key={l.to} to={l.to} className="font-semibold text-aura hover:underline">
                  {l.label}
                </Link>
              ))}
            </nav>
          </article>
        </div>
      </Container>
    </>
  )
}
