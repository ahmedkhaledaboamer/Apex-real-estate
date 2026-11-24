import { createFileRoute } from '@tanstack/react-router'

import { PageHero } from '@/components/layout/PageHero'
import { SearchResults } from '@/features/search/components/SearchResults'
import { validateSearchParams } from '@/features/search/schemas'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/buy/')({
  head: () => seo({ title: "Properties for sale in Dubai", description: "Apartments, villas and off-plan homes for sale in Dubai, each with a Trakheesi permit and a verified agent." }),
  validateSearch: validateSearchParams,
  component: Page,
})

function Page() {
  return (
    <>
      <PageHero
        title="Properties for sale in Dubai"
        sub="Ready and off-plan homes with a valid Trakheesi permit and a verified agent. Filter by community, budget and size."
        crumbs={[{ label: 'Buy' }]}
      />
      <SearchResults scope="buy" />
    </>
  )
}
