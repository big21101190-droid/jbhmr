import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const path = resolve(process.cwd(), 'data/initial-landings.json');
const landings = JSON.parse(await readFile(path, 'utf8'));
const required = ['id', 'regionId', 'serviceId', 'primaryKeyword', 'slug', 'title', 'h1', 'metaTitle', 'metaDescription', 'summary', 'sections', 'faq', 'ctaLabel', 'ctaLink', 'status', 'indexPolicy'];
const validStatuses = new Set(['DRAFT', 'PUBLISHED', 'ARCHIVED']);
const validIndexPolicies = new Set(['INDEX', 'NOINDEX']);
const errors = [];

if (landings.length < 50) errors.push(`Expected at least 50 records, found ${landings.length}.`);

for (const [index, landing] of landings.entries()) {
  for (const field of required) {
    const value = landing[field];
    if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
      errors.push(`#${index + 1} ${landing.id ?? 'unknown'}: missing ${field}`);
    }
  }
  if (!validStatuses.has(landing.status)) errors.push(`${landing.id}: invalid status ${landing.status}`);
  if (!validIndexPolicies.has(landing.indexPolicy)) errors.push(`${landing.id}: invalid indexPolicy ${landing.indexPolicy}`);
  if (!/^[a-z0-9-]+$/.test(landing.slug)) errors.push(`${landing.id}: invalid slug ${landing.slug}`);
}

for (const field of ['slug', 'title', 'h1', 'metaTitle', 'primaryKeyword']) {
  const seen = new Map();
  for (const landing of landings) {
    const key = String(landing[field]).trim().toLowerCase();
    if (seen.has(key)) errors.push(`duplicate ${field}: ${landing[field]} (${seen.get(key)}, ${landing.id})`);
    else seen.set(key, landing.id);
  }
}

const tuples = new Map();
for (const landing of landings) {
  const key = `${landing.regionId}:${landing.serviceId}`;
  if (tuples.has(key)) errors.push(`duplicate region+service: ${key}`);
  else tuples.set(key, landing.id);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`PASS: ${landings.length} landings validated with unique URLs, titles, H1s, keywords and region/service pairs.`);
