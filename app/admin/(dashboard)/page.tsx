import { RegionManager, ServiceManager } from '@/components/catalog-managers';
import { LandingAdminList } from '@/components/landing-admin-list';
import { listRegions, listServices } from '@/lib/catalog-store';
import { listLandings } from '@/lib/landing-store';

export default async function AdminPage() {
  const [landings, regions, services] = await Promise.all([
    listLandings({ includeArchived: true }),
    listRegions({ includeArchived: true }),
    listServices({ includeArchived: true }),
  ]);
  return (
    <div className="space-y-6">
      <LandingAdminList
        initial={landings}
        regions={regions}
        services={services}
      />
      <RegionManager initial={regions} />
      <ServiceManager initial={services} />
    </div>
  );
}
