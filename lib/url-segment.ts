// Accept one raw or percent-encoded path segment. Never decode repeatedly:
// residual '%' and path delimiters are invalid, not another lookup candidate.
export function decodeUrlSegment(value: string): string | null {
  try {
    const decoded = value.includes('%') ? decodeURIComponent(value) : value;
    if (/[\\/%?#]/u.test(decoded)) return null;
    for (const char of decoded) {
      if (char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127) return null;
    }
    return decoded.normalize('NFC');
  } catch {
    return null;
  }
}
