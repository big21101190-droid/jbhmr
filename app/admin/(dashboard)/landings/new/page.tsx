import { LandingEditor } from '@/components/landing-editor';
import { listRegions, listServices } from '@/lib/catalog-store';
import { createLandingDefaultsFor } from '@/lib/landing-defaults';

export default async function NewLandingPage() {
  const [regions, services] = await Promise.all([
    listRegions(),
    listServices(),
  ]);
  const region = regions.find((r) => r.parentId && r.active && !r.archived)!;
  const service = services.find((s) => s.active && !s.archived)!;
  const initial = createLandingDefaultsFor(region, service);
  initial.slug = '';
  return (
    <LandingEditor initial={initial} regions={regions} services={services} />
  );
}
