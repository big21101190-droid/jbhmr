// Keep browser preflight and the upload API's validation in sync.
export const IMAGE_UPLOAD_MAX_BYTES = 5 * 1024 * 1024;
export const IMAGE_UPLOAD_TYPES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
]);
export const IMAGE_UPLOAD_ACCEPT = [...IMAGE_UPLOAD_TYPES.keys()].join(',');
export const IMAGE_UPLOAD_SIZE_ERROR =
  '이미지는 5MB 이하만 업로드할 수 있습니다.';
export const IMAGE_UPLOAD_TYPE_ERROR =
  'JPG, PNG, WEBP 이미지만 업로드할 수 있습니다.';

export function validateImageUpload(file: { type: string; size: number }) {
  if (!IMAGE_UPLOAD_TYPES.has(file.type))
    return { error: IMAGE_UPLOAD_TYPE_ERROR, status: 415 };
  if (file.size > IMAGE_UPLOAD_MAX_BYTES)
    return { error: IMAGE_UPLOAD_SIZE_ERROR, status: 413 };
  return null;
}
