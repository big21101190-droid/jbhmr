# Region SEO Content Design

## Goal
Make region pages useful service-selection guides while preserving every existing indexable URL and legacy redirect.

## Approach
- Keep persisted `Region` records unchanged and add a pure `lib/region-seo.ts` content layer.
- Store focused editorial overrides for the seven Gyeongbuk priority regions and safe service-selection defaults for all active regions.
- Resolve direct service and route cards from active catalog records, never by inventing URLs.
- Render metadata, page hero, service guidance, pre-booking checklist, clarification about non-general-parcel service, and FAQ/FAQPage JSON-LD from the same content object.
- Keep `/area/[slug]` redirect code and sitemap generation unchanged.

## Constraints
- No page is removed, made noindex, or omitted from the sitemap.
- No claims about guaranteed delivery, prices, cutoffs, actual cases, or unsupported parcel-agency services.
- Direct internal links only use `/services/` and `/routes/` canonicals.
