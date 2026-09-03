const IDENTITY_CALLBACK_KEYS = [
  'invite_token',
  'recovery_token',
  'confirmation_token',
  'email_change_token',
  'access_token',
] as const;

export function isIdentityCallbackHash(hash: string) {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  return IDENTITY_CALLBACK_KEYS.some((key) => params.has(key));
}
