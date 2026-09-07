import { notFound } from 'next/navigation';
import { LandingEditor } from '@/components/landing-editor';
import { listRegions, listServices } from '@/lib/catalog-store';
import { getLandingById } from '@/lib/landing-store';
export default async function EditLandingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [landing, regions, services] = await Promise.all([
    getLandingById((await params).id),
    listRegions({ includeArchived: true }),
    listServices({ includeArchived: true }),
  ]);
  if (!landing) notFound();
  return (
    <LandingEditor initial={landing} regions={regions} services={services} />
  );
}
