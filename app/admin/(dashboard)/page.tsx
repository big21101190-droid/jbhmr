import { RegionManager, ServiceManager } from '@/components/catalog-managers';
import { LandingAdminList } from '@/components/landing-admin-list';
import { ServiceRouteAdminList } from '@/components/service-route-admin-list';
import { listRegions, listServices } from '@/lib/catalog-store';
import { listLandings } from '@/lib/landing-store';
import { getAllServiceRoutes } from '@/lib/service-routes';

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
      <ServiceRouteAdminList
        initial={services.flatMap((service) => getAllServiceRoutes(service))}
      />
      <RegionManager initial={regions} />
      <ServiceManager initial={services} />
    </div>
  );
}
