// Domestic callback numbers: mobile, geographic (including 02), 070/080,
// and eight-digit 15xx/16xx/18xx representative numbers. Spaces/hyphens only.
const domesticDigits =
  /^(?:010\d{8}|01[16789]\d{7,8}|02\d{7,8}|0(?:3[1-3]|4[1-4]|5[1-5]|6[1-4])\d{7,8}|070\d{8}|080\d{7}|1[568]\d{6})$/;
export const phoneErrorMessage =
  '연락 가능한 국내 전화번호를 입력해주세요. 예: 010-1234-5678, 02-123-4567, 1661-0122';

export function normalizeContactPhone(value: string): string | null {
  if (!/^[0-9 -]+$/.test(value) || value.length > 30) return null;
  const digits = value.replace(/[ -]/g, '');
  return domesticDigits.test(digits) ? digits : null;
}

// Also validates before hydration. HTML pattern uses the Unicode 'v' flag.
export const contactPhonePattern = String.raw`[ \-]*(?:0[ \-]*1[ \-]*0(?:[ \-]*[0-9]){8}|0[ \-]*1[ \-]*[16789](?:[ \-]*[0-9]){7,8}|0[ \-]*2(?:[ \-]*[0-9]){7,8}|0[ \-]*(?:3[ \-]*[1-3]|4[ \-]*[1-4]|5[ \-]*[1-5]|6[ \-]*[1-4])(?:[ \-]*[0-9]){7,8}|0[ \-]*7[ \-]*0(?:[ \-]*[0-9]){8}|0[ \-]*8[ \-]*0(?:[ \-]*[0-9]){7}|1[ \-]*[568](?:[ \-]*[0-9]){6})[ \-]*`;
