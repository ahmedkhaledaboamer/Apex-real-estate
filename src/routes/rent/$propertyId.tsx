import { createFileRoute, notFound } from '@tanstack/react-router'

import { PropertyDetail } from '@/features/property/components/PropertyDetail'
import { propertyById } from '@/mocks/properties'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/rent/$propertyId')({
  loader: ({ params }) => {
    const property = propertyById(params.propertyId)
    if (!property) throw notFound()
    return property
  },
  head: ({ loaderData: p }) => (p ? seo({ title: `${p.title}, ${p.community}`, description: `${p.beds === 0 ? 'Studio' : p.beds + '-bed'} ${p.type.toLowerCase()} for rent in ${p.community} · ${p.sqft.toLocaleString('en-US')} sq ft · permit ${p.permit}.`, image: p.images[0] }) : {}),
  component: Page,
})

function Page() {
  const property = Route.useLoaderData()
  return <PropertyDetail key={property.id} property={property} />
}
