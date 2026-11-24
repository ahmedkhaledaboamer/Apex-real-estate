import { createFileRoute } from '@tanstack/react-router'

import { PageHero } from '@/components/layout/PageHero'
import { SearchResults } from '@/features/search/components/SearchResults'
import { validateSearchParams } from '@/features/search/schemas'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/rent/')({
  head: () => seo({ title: "Properties for rent in Dubai", description: "Apartments, villas and townhouses for rent in Dubai with transparent fees and fast viewings." }),
  validateSearch: validateSearchParams,
  component: Page,
})

function Page() {
  return (
    <>
      <PageHero
        title="Properties for rent in Dubai"
        sub="Annual rentals with transparent cheque options, deposits and fees. Every listing carries its Trakheesi permit."
        crumbs={[{ label: 'Rent' }]}
      />
      <SearchResults scope="rent" />
    </>
  )
}
