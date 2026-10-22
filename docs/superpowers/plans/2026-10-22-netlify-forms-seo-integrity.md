# Netlify Forms and SEO Integrity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore a customer Reply-To address for Netlify inquiry notifications and correct observed SEO hygiene defects without reducing indexable sitemap URLs.

**Architecture:** The existing `inquiry` form remains a browser-rendered Next.js component that submits its URL-encoded payload to the static Netlify skeleton. Browser tests drive the real component with an intercepted local request. Sitemap production keeps the existing URL assembly and eligibility logic, but stops inventing static-route modification times; legacy `/area` redirects remain stable while new links point directly to region canonicals.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Playwright, Netlify Forms.

**Spec:** `docs/superpowers/specs/2026-10-22-netlify-forms-seo-integrity-design.md`

## Global Constraints

- Preserve form name `inquiry`, POST target `/__forms.html`, honeypot `bot-field`, existing public URL paths, canonical destinations, and legacy `/area/[slug]` permanent redirects.
- Customer email is a required `type="email" name="email"` value and never appears in analytics.
- Analytics fires one `generate_lead` only after a successful response, with `form_name`, `source_page`, and `success` only.
- Do not reduce indexable or sitemap URL counts; static entries retain their current URLs and eligibility, while CMS landing entries keep their persisted `updatedAt` timestamp.
- Do not submit to Netlify Forms, modify notifications, change primary-domain configuration, push, or deploy during implementation.

## Review Focus

- Required-email browser validation must stop a network request before submission.
- A failed Netlify response must not show success or emit a lead event.
- An event payload must not contain email, phone, name, origin, destination, or message.
- Sitemap URL count and all current static URL entries must be unchanged after omitting static `lastModified`.
- Existing `/area/...` URLs must keep their permanent redirect while all rendered new links use `/regions/...`.

---

### Task 1: Lock and implement the inquiry form contract

**Files:**
- Modify: `components/contact-form.tsx`
- Modify: `public/__forms.html`
- Modify: `tests/browser/release.spec.ts`
- Create: `tests/netlify-form-contract.test.ts`

**Interfaces:**
- Consumes: existing `ContactForm`, the `inquiry` form name, and static `/__forms.html` target.
- Produces: a required customer `email` field in both form definitions and a successful `generate_lead` event containing only `{ form_name: 'inquiry', source_page: '/contact', success: true }`.

- [ ] **Step 1: Write failing field-contract tests**

Add tests that parse `components/contact-form.tsx` and `public/__forms.html`, asserting identical ordered field names, a required `type="email" name="email"` field in each, and no additional public form definition.

- [ ] **Step 2: Run the field-contract test to verify it fails**

Run: `npm test -- tests/netlify-form-contract.test.ts`
Expected: FAIL because `email` is missing from the rendered and static definitions.

- [ ] **Step 3: Write failing browser submission tests**

Add local-fixture Playwright tests that: leave email empty and verify the POST count is zero; submit a valid form and assert one URL-encoded POST containing `form-name=inquiry` and `email`; fulfill a non-OK POST and assert failure text with no `generate_lead`; fulfill one OK POST and assert success text plus exactly one non-PII lead event.

- [ ] **Step 4: Run the browser tests to verify they fail**

Run: `npm run test:browser -- --grep "inquiry email|inquiry lead"`
Expected: FAIL because the email field and `generate_lead` event do not exist.

- [ ] **Step 5: Implement the minimal form change**

Add the required email field beside the contact fields in `components/contact-form.tsx`, mirror it in `public/__forms.html`, and replace the post-success analytics call with one PII-free `generate_lead` event. Do not alter the submission endpoint or form name.

- [ ] **Step 6: Run focused tests to verify they pass**

Run: `npm test -- tests/netlify-form-contract.test.ts && npm run test:browser -- --grep "inquiry email|inquiry lead"`
Expected: PASS.

- [ ] **Step 7: Commit**

Run: `git add components/contact-form.tsx public/__forms.html tests/netlify-form-contract.test.ts tests/browser/release.spec.ts && git commit -m "fix: add inquiry reply-to email field"`

### Task 2: Preserve sitemap inventory while correcting static metadata and links

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `lib/site-data.ts`
- Modify: `tests/seo-policy.test.ts`
- Modify: `tests/client-revision.test.ts`
- Create: `tests/sitemap-inventory.test.ts`

**Interfaces:**
- Consumes: `sitemap()` route metadata, `areaHref(region, place)`, `regions` source data, and existing `/area/[slug]` redirect route.
- Produces: identical static sitemap URLs without synthetic static timestamps, persisted timestamps for landing URLs, and direct region links for `areaHref`.

- [ ] **Step 1: Write failing sitemap inventory tests**

Mock catalog and landing stores, call `sitemap()`, and assert the exact static URL set and count match the pre-change expected set; assert static entries omit `lastModified` while a published landing has `lastModified` equal to its persisted `updatedAt`.

- [ ] **Step 2: Run the sitemap inventory test to verify it fails**

Run: `npm test -- tests/sitemap-inventory.test.ts`
Expected: FAIL because static sitemap entries include a fresh runtime `lastModified`.

- [ ] **Step 3: Write failing link and redirect-preservation tests**

Assert `areaHref(region, place)` returns the matching `/regions/<slug>` path for every supported place, and retain the existing legacy route test proving `/area/<slug>` calls `permanentRedirect` to that same region path.

- [ ] **Step 4: Run link tests to verify they fail**

Run: `npm test -- tests/client-revision.test.ts tests/sitemap-inventory.test.ts`
Expected: FAIL because `areaHref` emits `/area/...`.

- [ ] **Step 5: Implement the minimal SEO changes**

Remove only static `lastModified` assignments in `app/sitemap.ts`; retain every map/filter and all emitted URLs. Change `areaHref` to resolve the supported place to its existing region slug and return `/regions/<slug>`; do not alter `app/area/[slug]/page.tsx`.

- [ ] **Step 6: Run focused tests to verify they pass**

Run: `npm test -- tests/seo-policy.test.ts tests/sitemap-inventory.test.ts tests/client-revision.test.ts`
Expected: PASS with an unchanged sitemap URL inventory.

- [ ] **Step 7: Commit**

Run: `git add app/sitemap.ts lib/site-data.ts tests/seo-policy.test.ts tests/client-revision.test.ts tests/sitemap-inventory.test.ts && git commit -m "fix: preserve sitemap inventory and direct region links"`

### Task 3: Validate the branch and prepare external verification

**Files:**
- Modify: `docs/superpowers/specs/2026-10-22-netlify-forms-seo-integrity-design.md` only if a validation result requires an evidence correction.
- Test: all project checks.

**Interfaces:**
- Consumes: Task 1 form contract and Task 2 sitemap/link behavior.
- Produces: a verified branch ready for preview deployment, with external Netlify and Search Console checks explicitly separated.

- [ ] **Step 1: Install pinned dependencies and read the installed Next.js guidance**

Run: `npm ci`, then read the relevant installed Next.js metadata/sitemap and client-form guidance before final code verification.
Expected: dependencies install without lockfile changes.

- [ ] **Step 2: Run all repository validation**

Run: `npm test && npm run typecheck && npm run lint && npm run validate:landings && npm run build && npm run test:browser`
Expected: every command passes.

- [ ] **Step 3: Run local production-like SEO checks**

Start the built app with `NEXT_PUBLIC_ROBOTS_INDEX=true` and the configured canonical base, then run `npm run qa:links -- http://127.0.0.1:<port> --indexing=true --canonical-base=https://1661-0122.com`.
Expected: sitemap has the existing URL inventory; all crawlable internal links are 200; no dead `/area` links appear.

- [ ] **Step 4: Commit validation-only documentation if needed**

If no evidence correction is needed, do not create a commit. If required, commit only the documented evidence correction.

## External verification after branch validation

1. Identify the exact Netlify project by custom domain and confirm its connected repository and production deploy commit.
2. Confirm Forms is enabled and that `inquiry` is detected after a preview deployment.
3. Set the public form notification recipient to `iaanis@naver.com` only after the project identity is confirmed.
4. Set the canonical apex domain as the primary host so each alternate host redirects directly to `https://1661-0122.com/`.
5. Submit no test form without explicit, contemporaneous approval. Check the actual recipient mailbox to validate Reply-To.
6. Obtain Search Console Performance and Page Indexing exports before assigning a ranking-drop cause or submitting URLs/sitemaps.
