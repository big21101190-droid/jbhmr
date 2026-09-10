import { createRoot } from 'react-dom/client';
import { ContactForm } from '@/components/contact-form';
import { SiteHeader } from '@/components/site-header';
import { LandingAdminList } from '@/components/landing-admin-list';
import { LandingEditor } from '@/components/landing-editor';
import { LandingGallery } from '@/components/landing-gallery';
import { regions } from '@/data/regions';
import { services } from '@/data/services';
import seeds from '@/data/initial-landings.json';
import { createLandingDefaults } from '@/lib/landing-defaults';
import type { Landing } from '@/lib/domain';
import '@/app/globals.css';

const query = new URLSearchParams(location.search);
const view = query.get('view');
const images = [
  [1200, 600],
  [600, 1200],
  [800, 800],
].map(([width, height], i) => ({
  url: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#edf3fb"/><rect x="5" y="5" width="${width - 10}" height="${height - 10}" fill="none" stroke="#1b4dff" stroke-width="10"/><text x="50%" y="45" text-anchor="middle" font-size="32">TOP EDGE ${i + 1}</text><text x="50%" y="${height - 20}" text-anchor="middle" font-size="32">BOTTOM EDGE ${i + 1}</text><text x="50%" y="50%" text-anchor="middle" font-size="44">${width} x ${height}</text></svg>`)}`,
  alt: `QA 사진 ${i + 1}`,
}));
const existing = {
  ...seeds[0],
  id: 'qa-local-existing',
  slug: 'qa-stable-url',
  indexPolicy: 'NOINDEX',
  canonical: 'https://example.com/kept',
  relatedRegions: ['seoul'],
  heroImage: '/service-bus.png',
  ogImage: '/service-bus.png',
  bodyTopImages: [{ url: '/service-bus.png', alt: '기존 사진' }],
} as Landing;
const initial = query.get('saved')
  ? JSON.parse(sessionStorage.getItem('qa-last-saved') || '{}')
  : view === 'existing'
    ? existing
    : createLandingDefaults('seoul', 'express-bus', undefined, 'busan');
createRoot(document.getElementById('root')!).render(
  <>
    <p className="bg-amber-100 p-2 text-center text-sm">
      로컬 컴포넌트 검증 — 운영 사이트 / 실제 저장 검증 아님
    </p>
    {view === 'contact' ? (
      <div className="mx-auto max-w-[1000px] p-5">
        <ContactForm />
      </div>
    ) : view === 'gallery' ? (
      <LandingGallery
        images={
          query.get('broken')
            ? [{ url: '/qa-missing.png', alt: '로드 실패 사진' }]
            : images.slice(0, Number(query.get('count') || 3))
        }
        keyword="QA"
      />
    ) : view === 'list' ? (
      <LandingAdminList
        initial={seeds as Landing[]}
        regions={regions}
        services={services}
      />
    ) : view === 'editor' || view === 'existing' ? (
      <div className="mx-auto max-w-[1160px] p-5">
        <LandingEditor
          initial={initial}
          regions={regions}
          services={services}
        />
      </div>
    ) : (
      <SiteHeader />
    )}
  </>,
);
