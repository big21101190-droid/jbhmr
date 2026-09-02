import { notFound, permanentRedirect } from 'next/navigation';
import { regions } from '@/data/regions';
import { findArea } from '@/lib/site-data';

export default async function LegacyAreaPage({params}:{params:Promise<{slug:string}>}) {
  const area = findArea((await params).slug);
  if (!area) notFound();
  const region = regions.find((item) => item.parentId === area.region.slug && item.name.endsWith(area.place));
  if (!region) notFound();
  permanentRedirect(`/regions/${region.slug}`);
}
