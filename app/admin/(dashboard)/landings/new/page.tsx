import { LandingEditor } from '@/components/landing-editor';
import { regions } from '@/data/regions';
import { services } from '@/data/services';
import { createLandingDefaults } from '@/lib/landing-defaults';
export default function NewLandingPage(){const region=regions.find(r=>r.parentId)!;const service=services[0];return <LandingEditor initial={createLandingDefaults(region.id,service.id)}/>}
