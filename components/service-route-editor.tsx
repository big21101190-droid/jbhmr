'use client';

import { useState } from 'react';
import type { ServiceRouteIntent } from '@/lib/domain';
import {
  IMAGE_UPLOAD_ACCEPT,
  IMAGE_UPLOAD_SIZE_ERROR,
  IMAGE_UPLOAD_TYPE_ERROR,
  validateImageUpload,
} from '@/lib/image-upload-policy';
import type { ServiceRoute } from '@/lib/service-routes';

const fieldClass =
  'w-full min-w-0 rounded-xl border border-[#cfd9e6] bg-white px-4 py-3 outline-none focus:border-[#1b4dff] focus:ring-2 focus:ring-[#1b4dff]/15';
const labelClass = 'grid gap-2 text-sm font-bold';

export function ServiceRouteEditor({ initial }: { initial: ServiceRoute }) {
  const [form, setForm] = useState<ServiceRouteIntent>(initial);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const set = <K extends keyof ServiceRouteIntent>(
    key: K,
    value: ServiceRouteIntent[K],
  ) => setForm((current) => ({ ...current, [key]: value }));
  const showSessionExpired = () => {
    setSessionExpired(true);
    setMessage(
      '로그인 세션이 만료되었거나 관리자 인증이 필요합니다. 작성 내용은 현재 탭에 유지됩니다.',
    );
  };
  const save = async () => {
    if (saving || uploading) return;
    setSaving(true);
    setMessage('저장 중…');
    try {
      const response = await fetch(
        `/api/admin/routes/${initial.serviceId}/${initial.slug}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        },
      );
      if (response.status === 401) {
        showSessionExpired();
        return;
      }
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setMessage(data?.error || '주요 노선을 저장하지 못했습니다.');
        return;
      }
      setForm(data.route);
      setSessionExpired(false);
      setMessage('저장했습니다. 기존 URL은 유지되었습니다.');
    } catch {
      setMessage(
        '저장 결과를 확인하지 못했습니다. 작성 내용은 유지됩니다. 목록에서 저장 여부를 확인해주세요.',
      );
    } finally {
      setSaving(false);
    }
  };
  const upload = async (file: File) => {
    if (saving || uploading) return;
    const invalid = validateImageUpload(file);
    if (invalid) {
      setMessage(invalid.error);
      return;
    }
    setUploading(true);
    setMessage('이미지 업로드 중…');
    try {
      const body = new FormData();
      body.append('file', file);
      if (form.image?.name?.trim()) body.append('filename', form.image.name);
      const response = await fetch('/api/admin/uploads', {
        method: 'POST',
        body,
      });
      if (response.status === 401) {
        showSessionExpired();
        return;
      }
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setMessage(
          response.status === 413
            ? IMAGE_UPLOAD_SIZE_ERROR
            : response.status === 415
              ? IMAGE_UPLOAD_TYPE_ERROR
              : data?.error || '이미지 업로드에 실패했습니다.',
        );
        return;
      }
      if (typeof data?.url !== 'string' || !data.url.trim()) {
        setMessage(
          '업로드 응답을 확인하지 못했습니다. 기존 이미지는 유지됩니다.',
        );
        return;
      }
      setForm((current) => ({
        ...current,
        image: {
          url: data.url,
          alt:
            current.image?.alt ||
            `${initial.origin} ${initial.destination} ${initial.serviceName} 안내`,
          name:
            current.image?.name ||
            String(data.originalFilename || file.name).replace(/\.[^.]+$/, ''),
          caption: current.image?.caption,
          storageKey: data.storageKey,
        },
      }));
      setSessionExpired(false);
      setMessage(
        '이미지를 업로드했습니다. 저장 버튼을 눌러 페이지에 반영하세요.',
      );
    } catch {
      setMessage(
        '이미지 업로드에 실패했습니다. 기존 이미지와 작성 내용은 유지됩니다.',
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-4 border-b border-[#dce5f0] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black tracking-[.15em] text-[#1b4dff]">
            ROUTE SEO EDITOR
          </p>
          <h1 className="mt-2 text-2xl font-black">주요 노선 페이지 수정</h1>
          <p className="mt-2 text-sm text-[#667085]">/routes/{initial.slug}</p>
        </div>
        <div className="flex gap-2">
          {form.active !== false ? (
            <a
              href={`/routes/${initial.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-[#cfd9e6] px-4 py-3 text-sm font-black"
            >
              사이트 보기
            </a>
          ) : null}
          <button
            type="button"
            onClick={save}
            disabled={saving || uploading}
            className="rounded-xl bg-[#1b4dff] px-5 py-3 text-sm font-black text-white disabled:opacity-50"
          >
            저장
          </button>
        </div>
      </div>
      <p
        aria-live="polite"
        className="mt-4 min-h-6 text-sm font-bold text-[#1b4dff]"
      >
        {message}
      </p>
      {sessionExpired ? (
        <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm">
          새로고침하지 말고 새 탭에서 다시 로그인한 뒤 저장을 다시 시도하세요.{' '}
          <a
            href="/admin/login"
            target="_blank"
            className="font-black underline"
          >
            다시 로그인
          </a>
        </div>
      ) : null}
      <div className="mt-5 grid gap-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            출발지
            <input
              value={initial.origin}
              readOnly
              className={`${fieldClass} bg-[#f4f7fb]`}
            />
          </label>
          <label className={labelClass}>
            도착지
            <input
              value={initial.destination}
              readOnly
              className={`${fieldClass} bg-[#f4f7fb]`}
            />
          </label>
        </div>
        <label className={labelClass}>
          페이지 제목
          <input
            value={form.label}
            onChange={(event) => set('label', event.target.value)}
            maxLength={160}
            className={fieldClass}
          />
        </label>
        <label className={labelClass}>
          소개 문구
          <textarea
            value={form.description || ''}
            onChange={(event) => set('description', event.target.value)}
            rows={4}
            maxLength={700}
            className={fieldClass}
          />
        </label>
        <label className={labelClass}>
          본문
          <textarea
            value={form.body || ''}
            onChange={(event) => set('body', event.target.value)}
            rows={12}
            className={fieldClass}
            placeholder={
              '빈 줄로 문단을 나누면 실제 페이지에서도 그대로 표시됩니다.\n\n긴 글을 붙여넣어도 줄바꿈이 유지됩니다.'
            }
          />
        </label>
        <fieldset className="rounded-2xl border border-[#dce5f0] p-5">
          <legend className="px-2 font-black">이미지와 SEO 정보</legend>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              value={form.image?.url || ''}
              onChange={(event) =>
                set('image', {
                  ...(form.image || { alt: '' }),
                  url: event.target.value,
                })
              }
              placeholder="이미지 URL"
              className={fieldClass}
            />
            <label className="cursor-pointer rounded-xl bg-[#10243e] px-5 py-3 text-center font-black text-white">
              이미지 업로드
              <input
                type="file"
                accept={IMAGE_UPLOAD_ACCEPT}
                disabled={saving || uploading}
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.currentTarget.value = '';
                  if (file) void upload(file);
                }}
              />
            </label>
          </div>
          {form.image?.url ? (
            <img
              src={form.image.url}
              alt={form.image.alt || '노선 이미지 미리보기'}
              className="mt-4 aspect-[16/7] w-full rounded-xl bg-[#edf3fb] object-contain"
            />
          ) : null}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className={labelClass}>
              ALT 텍스트
              <input
                value={form.image?.alt || ''}
                onChange={(event) =>
                  set('image', {
                    ...(form.image || { url: '' }),
                    alt: event.target.value,
                  })
                }
                className={fieldClass}
              />
            </label>
            <label className={labelClass}>
              관리용 이름 · 새 업로드 파일명
              <input
                value={form.image?.name || ''}
                onChange={(event) =>
                  set('image', {
                    ...(form.image || { url: '' }),
                    name: event.target.value,
                  })
                }
                className={fieldClass}
              />
            </label>
          </div>
          <label className={`${labelClass} mt-3`}>
            캡션 (선택)
            <textarea
              value={form.image?.caption || ''}
              onChange={(event) =>
                set('image', {
                  ...(form.image || { url: '' }),
                  caption: event.target.value,
                })
              }
              rows={2}
              className={fieldClass}
            />
          </label>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs leading-5 text-[#667085]">
              ALT·관리용 이름·캡션은 구분 저장합니다. EXIF는 변경하지 않습니다.
            </p>
            {form.image?.url ? (
              <button
                type="button"
                onClick={() => set('image', { url: '' })}
                className="text-sm font-black text-red-600"
              >
                페이지에서 이미지 제거
              </button>
            ) : null}
          </div>
        </fieldset>
        <details className="rounded-2xl border border-[#dce5f0] p-5" open>
          <summary className="cursor-pointer font-black">공개·SEO 설정</summary>
          <div className="mt-5 grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className={labelClass}>
                공개 상태
                <select
                  value={form.active === false ? 'INACTIVE' : 'ACTIVE'}
                  onChange={(event) =>
                    set('active', event.target.value === 'ACTIVE')
                  }
                  className={fieldClass}
                >
                  <option value="ACTIVE">공개</option>
                  <option value="INACTIVE">비공개</option>
                </select>
              </label>
              <label className={labelClass}>
                검색 색인
                <select
                  value={form.indexPolicy || 'INDEX'}
                  onChange={(event) =>
                    set(
                      'indexPolicy',
                      event.target.value as 'INDEX' | 'NOINDEX',
                    )
                  }
                  className={fieldClass}
                >
                  <option value="INDEX">검색 허용 (INDEX)</option>
                  <option value="NOINDEX">검색 제외 (NOINDEX)</option>
                </select>
                <span className="text-xs font-medium text-[#667085]">
                  검색 제외여도 공개 상태라면 웹사이트에서는 접속할 수 있습니다.
                </span>
              </label>
            </div>
            <label className={labelClass}>
              SEO 제목
              <input
                value={form.metaTitle || ''}
                onChange={(event) => set('metaTitle', event.target.value)}
                maxLength={70}
                className={fieldClass}
              />
            </label>
            <label className={labelClass}>
              메타 설명
              <textarea
                value={form.metaDescription || ''}
                onChange={(event) => set('metaDescription', event.target.value)}
                maxLength={170}
                rows={3}
                className={fieldClass}
              />
            </label>
            <p className="text-xs leading-5 text-[#667085]">
              URL과 canonical은 기존 /routes/{initial.slug}로 고정되어 이
              화면에서 변경되지 않습니다.
            </p>
          </div>
        </details>
      </div>
    </section>
  );
}
