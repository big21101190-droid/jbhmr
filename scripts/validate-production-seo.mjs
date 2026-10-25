import { productionSeoErrors } from './production-seo-policy.mjs';

const errors = productionSeoErrors(process.env);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(
    'Production SEO configuration check passed (previews remain isolated).',
  );
}
