# Region SEO Content Implementation Plan

1. Add a pure region SEO content model with priority regional overrides, generalized safe fallback copy, direct service/route selection, and FAQ data.
2. Add failing integrity tests for distinct Pohang/Gumi metadata and body, canonical internal links, and data-to-FAQ consistency.
3. Render the content model in the region route and expose matching FAQPage JSON-LD.
4. Run unit, type, lint, browser, sitemap, and production-build checks. Preserve all sitemap entries and `/area` redirects.
