# Netlify Forms Reply-To and SEO Integrity Design

## Goal

Make every public inquiry submission provide a customer Reply-To address while preserving existing form identity and public URLs. Correct observed SEO hygiene defects without changing canonical URLs, deleting pages, or claiming a search-ranking cause that is not supported by Search Console data.

## Confirmed evidence

- `components/contact-form.tsx` submits form `inquiry` to `/__forms.html` using `POST` and `application/x-www-form-urlencoded`.
- Neither the rendered form nor `public/__forms.html` contains `type="email" name="email"`. Netlify therefore has no submitter email value for notification Reply-To.
- The production website returns indexable pages, a 198-URL sitemap, and self-canonicals on sampled home, contact, service, region, and route pages.
- `app/sitemap.ts` is dynamic and assigns `new Date()` to core, service, region, and route URLs on every request. Those sitemap `lastmod` values are not the actual change dates.
- Existing `/area/[slug]` routes permanently redirect to `/regions/[slug]`, while homepage/header helpers can still emit `/area/...` links.
- `http://www.1661-0122.com` redirects through `https://www.1661-0122.com` before the canonical apex host. This is external Netlify-domain configuration, not a repository routing rule.

## Scope

### Form contract

The public form and Netlify detection skeleton use the same field set:

`form-name`, `subject`, `bot-field`, `name`, `phone`, `email`, `origin`, `destination`, `service`, `message`, `privacy-consent`.

`email` is a required native email control with autocomplete metadata. The field is used only for form submission and Netlify notification Reply-To; it is never included in analytics.

The existing form name `inquiry`, submission target `/__forms.html`, honeypot, subject, and success/error behavior remain stable. The browser sends one URL-encoded request during a valid submission. A non-OK response produces the existing failure state and no lead event.

After a successful response, analytics emits exactly one `generate_lead` event with only non-PII values: `form_name: "inquiry"`, `source_page: "/contact"`, and `success: true`.

### SEO integrity

- Do not alter existing public URLs, canonical destinations, or the `/area/[slug]` permanent redirects.
- Direct newly rendered homepage/header region links to their canonical `/regions/[slug]` pages.
- Omit `lastModified` for static routes whose real content-change time is unavailable. Continue using each CMS landing's persisted `updatedAt` value.
- Add automated checks that prevent the form field definitions from drifting and prevent static sitemap entries from receiving a runtime-generated `lastmod`.

## Tests and validation

Before implementation, create regression tests that fail on the current code for:

1. A required `type="email" name="email"` field appears in both form definitions.
2. Rendered and static form field names match exactly.
3. Email validation blocks submission before a network request.
4. A valid submission sends the email field once and uses the `inquiry` form name.
5. A failed submission does not show success or emit analytics.
6. A successful submission emits one `generate_lead` event without email, phone, name, origin, destination, or message.
7. Static sitemap URLs do not have a synthetic runtime `lastModified`; CMS landing entries retain their persisted timestamp.
8. Homepage/header area links resolve to canonical region URLs while legacy area routes continue redirecting.

Run unit tests, typecheck, lint, build, landing validation, and browser tests. Verify the deploy preview has noindex, a blank sitemap, and a functional form UI. Do not submit the form to Netlify or production without a separate, explicit approval at the time of submission.

## External configuration and verification

The correct Netlify project must first be identified by its custom domain `1661-0122.com`, then confirmed against the connected repository and production deploy.

Once identified, confirm that Forms processing is enabled and that `inquiry` is detected. Configure exactly one public-form email notification to `iaanis@naver.com`; preserve no test or internal-form notifications unless a verified need exists. Confirm Netlify's recorded submission and notification configuration. Actual inbox delivery and Reply-To header inspection require an approved test submission plus access to the recipient mailbox.

Change the Netlify primary-domain/redirect configuration so all four host variants reach `https://1661-0122.com/` with one redirect. This must be verified on the exact production project.

Google Search Console data is required to attribute ranking decline. Without it, report technical findings only and request Performance and Page Indexing exports.

## Non-goals

No bulk noindex, deletion, canonical rewrite, redirect migration, sitemap resubmission, or ranking-recovery promise. No collection of PII in analytics. No production deployment before preview and the listed checks pass.
