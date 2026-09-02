export function hasAdminRole(appMetadata: unknown) {
  if (!appMetadata || typeof appMetadata !== 'object') return false;
  const roles = (appMetadata as { roles?: unknown }).roles;
  return Array.isArray(roles) && roles.includes('admin');
}
