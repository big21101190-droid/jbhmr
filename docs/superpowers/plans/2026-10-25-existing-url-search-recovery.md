# Existing URL Search Recovery Implementation Plan

**Goal:** Improve useful answers and discovery on the existing jbhmr site, preserve public paths, and verify the sitemap remains at or below 250 URLs.

**Scope:** Only big21101190-droid/jbhmr and https://1661-0122.com. The user's direct existing-URLs/250 limit supersedes the attached generic 500-page expansion objective. Commit and push are authorized. Search Console submission needs the designated 대준 browser; do not substitute another profile.

**Architecture:** Keep the current Region and CMS stores. Resolve regional service/route cards from the active service catalog, add a server-rendered shipping decision guide using that same catalog, and preserve all current metadata except the missing Seoul H1 qualifier. Fix the production domain fallback without overriding an explicitly configured environment. No new public routes or sitemap truncation.

## Evidence and constraints

- 2026-10-25 live sitemap: 198 URLs, robots allow public pages, Seoul self-canonical and index/follow. Public HTTP checks are not Search Console indexing/ranking evidence.
- Existing regional profiles primarily vary names and short notes. Do not claim that the number of profiles establishes high content quality or ranking success.
- No invented delivery cases, operating branches, time guarantees, fees, customer reviews, or search demand figures.
- Preserve /area redirects, published landing URLs, CMS overrides, contact flow, production indexing switches and preview noindex.
- The full live audit and saved before/after URL sets are the regression baseline; keep runtime CMS and bundled local data distinct.

## Tasks

- [ ] Read-only full live audit: response, canonical, robots, title, H1, description, links, duplicate metadata and sitemap count. Save JSON evidence.
- [ ] RED: test the default domain and catalog-aware regional links (renamed/disabled services, inactive routes, unrelated city routes, explicit empty catalog).
- [ ] GREEN: correct domain fallback; resolve region cards from active catalog, with exact endpoint associations and real slugs.
- [ ] RED/GREEN: test and render shipment choice guidance with real service items, timing constraints, quote inputs, packaging and regional navigation. Preserve existing lead copy and user-entered landing content.
- [ ] Validate unit/type/lint, local production build using the real canonical host, <=250 sitemap entries, exact before/after bundled inventory and live inventory, redirects and responsive page output.
- [ ] Commit/push only after verification. Read production output after deploy if it occurs. Report Search Console submission as pending unless actually confirmed.

## Search intent ownership

- /regions/<slug>: selecting local transport and navigating to matching services/routes.
- /services/<slug>: transport method, supported goods and operating conditions.
- /routes/<slug>: a specific recorded origin/destination/service; never synthesize a reverse route.
- /delivery/<slug>: existing curated region/service or keyword page; preserve its original content and identity.

## Completion evidence

Record public technical failures separately from content opportunities and unverified ranking hypotheses. Successful HTTP requests, a submitted sitemap, and improved rankings are three different outcomes. Roll back code with a revert of this change, preserving new CMS inquiries and content.
