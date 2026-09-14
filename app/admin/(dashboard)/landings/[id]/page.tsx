import { notFound } from 'next/navigation';
import { LandingEditor } from '@/components/landing-editor';
import { listRegions, listServices } from '@/lib/catalog-store';
import { getLandingById, listLandings } from '@/lib/landing-store';
import { toLandingIdentity } from '@/lib/landing-url';
export default async function EditLandingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [landing, regions, services, landings] = await Promise.all([
    getLandingById((await params).id),
    listRegions({ includeArchived: true }),
    listServices({ includeArchived: true }),
    listLandings({ includeArchived: true }),
  ]);
  if (!landing) notFound();
  return (
    <LandingEditor
      initial={landing}
      regions={regions}
      services={services}
      existingLandings={landings.map(toLandingIdentity)}
    />
  );
}
