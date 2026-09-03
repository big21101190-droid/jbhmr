export function isIndexingEnabled(
  value = process.env.NEXT_PUBLIC_ROBOTS_INDEX,
) {
  return value === 'true';
}
