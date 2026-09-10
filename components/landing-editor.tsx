'use client';

import { useState } from 'react';
import type {
  Landing,
  LandingInput,
  PublicationStatus,
  Region,
  Service,
} from '@/lib/domain';
import { createLandingDefaultsFor } from '@/lib/landing-defaults';
import { slugify } from '@/lib/seo';

const fieldClass =
  'w-full min-w-0 rounded-xl border border-[#cfd9e6] bg-white px-4 py-3 outline-none focus:border-[#1b4dff] focus:ring-2 focus:ring-[#1b4dff]/15';
const labelClass = 'grid gap-2 text-sm font-bold';

export function LandingEditor({
  initial,
  regions,
  services,
}: {
  initial: LandingInput;
  regions: Region[];
  services: Service[];
}) {
  const [form, setForm] = useState<LandingInput>(initial);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [record, setRecord] = useState<Landing | null>(null);
  const set = <K extends keyof LandingInput>(key: K, value: LandingInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  const suggest = () => {
    const region = regions.find((item) => item.id === form.regionId);
    const service = services.find((item) => item.id === form.serviceId);
    const destinationRegion = regions.find(
      (item) => item.id === form.destinationRegionId,
    );
    if (!region || !service) {
      setMessage('선택한 지역 또는 서비스를 찾을 수 없습니다.');
      return;
    }
    const defaults = createLandingDefaultsFor(
      region,
      service,
      form.primaryKeyword,
      destinationRegion,
    );
    setForm((current) => ({
      ...defaults,
      id: current.id,
      slug: current.slug,
      heroImage: current.heroImage || defaults.heroImage,
      ogImage: current.ogImage || defaults.ogImage,
      bodyTopImages: current.bodyTopImages || [],
    }));
    setMessage(
      '지역·서비스 기준 자동값을 채웠습니다. 모두 수정할 수 있습니다.',
    );
  };
  const save = async (status: PublicationStatus) => {
    setSaving(true);
    setMessage('저장 중…');
    const payload = { ...form, status };
    const url = form.id
      ? `/api/admin/landings/${form.id}`
      : '/api/admin/landings';
    const response = await fetch(url, {
      method: form.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(
        data.existing
          ? `${data.error} 기존 페이지: ${data.existing.title}`
          : data.error || '저장하지 못했습니다.',
      );
      setSaving(false);
      return;
    }
    setForm(data.landing);
    setRecord(data.landing);
    setMessage(
      status === 'PUBLISHED' ? '공개했습니다.' : '초안으로 저장했습니다.',
    );
    setSaving(false);
    if (!initial.id)
      window.history.replaceState({}, '', `/admin/landings/${data.landing.id}`);
  };
  const upload = async (file: File, bodyIndex?: number) => {
    setMessage('이미지 업로드 중…');
    const body = new FormData();
    body.append('file', file);
    const response = await fetch('/api/admin/uploads', {
      method: 'POST',
      body,
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || '이미지 업로드에 실패했습니다.');
      return;
    }
    setForm((current) => {
      if (bodyIndex === undefined)
        return { ...current, heroImage: data.url, ogImage: data.url };
      const images = [...(current.bodyTopImages || [])];
      images[bodyIndex] = {
        url: data.url,
        alt: `${current.primaryKeyword || current.title} 이미지 ${bodyIndex + 1}`,
      };
      return { ...current, bodyTopImages: images.filter(Boolean).slice(0, 3) };
    });
    setMessage('이미지를 업로드했습니다.');
  };
  const previewId = record?.id || form.id;
  const selectedRegion = regions.find((item) => item.id === form.regionId);
  const selectedDestination = regions.find(
    (item) => item.id === form.destinationRegionId,
  );
  const selectedService = services.find((item) => item.id === form.serviceId);
  const automaticSlug =
    selectedRegion && selectedService
      ? selectedDestination
        ? `${selectedRegion.slug}-${selectedDestination.slug}-${selectedService.slug}`
        : `${selectedRegion.slug}-${selectedService.slug}`
      : '';
  return (
    <section className="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4 border-b border-[#dce5f0] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black tracking-[.15em] text-[#1b4dff]">
            LANDING EDITOR
          </p>
          <h1 className="mt-2 text-2xl font-black">
            {form.id ? '랜딩페이지 수정' : '새 랜딩 만들기'}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            disabled={saving}
            onClick={() => save('DRAFT')}
            className="rounded-xl border border-[#cfd9e6] px-4 py-3 text-sm font-black"
          >
            초안 저장
          </button>
          {previewId ? (
            <a
              href={`/admin/preview/${previewId}`}
              target="_blank"
              className="rounded-xl border border-[#cfd9e6] px-4 py-3 text-sm font-black"
            >
              미리보기
            </a>
          ) : null}
          <button
            disabled={saving}
            onClick={() => save('PUBLISHED')}
            className="rounded-xl bg-[#1b4dff] px-5 py-3 text-sm font-black text-white"
          >
            공개
          </button>
        </div>
      </div>
      <p
        aria-live="polite"
        className="mt-4 min-h-6 text-sm font-bold text-[#1b4dff]"
      >
        {message}
      </p>
      <div className="mt-4 grid gap-6">
        <div className="grid gap-5 md:grid-cols-3">
          <label className={labelClass}>
            출발 지역
            <select
              value={form.regionId}
              onChange={(e) => set('regionId', e.target.value)}
              className={fieldClass}
            >
              {regions
                .filter(
                  (r) => (r.active && !r.archived) || r.id === form.regionId,
                )
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
            </select>
          </label>
          <label className={labelClass}>
            도착 지역 (노선형 선택사항)
            <select
              value={form.destinationRegionId || ''}
              onChange={(e) =>
                set('destinationRegionId', e.target.value || null)
              }
              className={fieldClass}
            >
              <option value="">지역 단일형 — 선택 안 함</option>
              {regions
                .filter(
                  (r) =>
                    ((r.active && !r.archived) ||
                      r.id === form.destinationRegionId) &&
                    r.id !== form.regionId,
                )
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
            </select>
          </label>
          <label className={labelClass}>
            서비스
            <select
              value={form.serviceId}
              onChange={(e) => set('serviceId', e.target.value)}
              className={fieldClass}
            >
              {services
                .filter(
                  (s) => (s.active && !s.archived) || s.id === form.serviceId,
                )
                .map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </label>
        </div>
        <label className={labelClass}>
          대표 키워드
          <input
            value={form.primaryKeyword}
            onChange={(e) => set('primaryKeyword', e.target.value)}
            maxLength={100}
            className={fieldClass}
          />
        </label>
        <button
          type="button"
          onClick={suggest}
          className="w-fit rounded-xl bg-[#e7eeff] px-4 py-3 text-sm font-black text-[#1b4dff]"
        >
          선택값으로 기본 문구 자동 채우기
        </button>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            페이지 제목
            <input
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              maxLength={100}
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            H1 제목
            <input
              value={form.h1}
              onChange={(e) => set('h1', e.target.value)}
              maxLength={120}
              className={fieldClass}
            />
          </label>
        </div>
        <label className={labelClass}>
          대표 이미지
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              value={form.heroImage}
              onChange={(e) => set('heroImage', e.target.value)}
              className={fieldClass}
            />
            <label className="cursor-pointer rounded-xl bg-[#10243e] px-5 py-3 text-center font-black text-white">
              이미지 업로드
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void upload(file);
                }}
              />
            </label>
          </div>
          {form.heroImage ? (
            <img
              src={form.heroImage}
              alt="대표 이미지 미리보기"
              className="mt-2 aspect-[16/7] w-full rounded-xl object-cover"
            />
          ) : null}
        </label>
        <fieldset className="rounded-2xl border border-[#dce5f0] p-5">
          <legend className="px-2 font-black">본문 상단 이미지</legend>
          <p className="mb-5 text-sm text-[#667085]">
            본문이 시작되기 전에 표시할 사진을 0~3장 등록할 수 있습니다.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((index) => {
              const image = form.bodyTopImages?.[index];
              return (
                <div
                  key={index}
                  className="rounded-xl border border-[#dce5f0] bg-[#f9fbfd] p-3"
                >
                  {image ? (
                    <img
                      src={image.url}
                      alt={
                        image.alt || `본문 상단 이미지 ${index + 1} 미리보기`
                      }
                      className="aspect-[4/3] w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="grid aspect-[4/3] place-items-center rounded-lg bg-[#edf3fb] text-sm font-bold text-[#667085]">
                      사진 {index + 1}
                    </div>
                  )}
                  <label className="mt-3 block cursor-pointer rounded-lg bg-[#10243e] px-3 py-2.5 text-center text-sm font-black text-white">
                    {image ? '교체' : `사진 ${index + 1} 업로드`}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void upload(file, index);
                        event.currentTarget.value = '';
                      }}
                    />
                  </label>
                  {image ? (
                    <>
                      <input
                        aria-label={`사진 ${index + 1} 대체 텍스트`}
                        value={image.alt || ''}
                        onChange={(event) =>
                          set(
                            'bodyTopImages',
                            (form.bodyTopImages || []).map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, alt: event.target.value }
                                : item,
                            ),
                          )
                        }
                        placeholder="대체 텍스트"
                        className={`${fieldClass} mt-2 w-full`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          set(
                            'bodyTopImages',
                            (form.bodyTopImages || []).filter(
                              (_, itemIndex) => itemIndex !== index,
                            ),
                          )
                        }
                        className="mt-2 w-full py-2 text-sm font-black text-red-600"
                      >
                        삭제
                      </button>
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
        </fieldset>
        <label className={labelClass}>
          요약
          <textarea
            value={form.summary}
            onChange={(e) => set('summary', e.target.value)}
            rows={4}
            maxLength={500}
            className={fieldClass}
          />
        </label>
        <fieldset className="rounded-2xl border border-[#dce5f0] p-5">
          <legend className="px-2 font-black">본문</legend>
          <p className="mb-5 text-sm text-[#667085]">
            마크다운이나 코드를 쓰지 않아도 됩니다. 소제목과 문단을 각각
            입력하세요.
          </p>
          {form.sections.map((section, index) => (
            <div key={index} className="mb-5 grid gap-3 last:mb-0">
              <input
                aria-label={`본문 ${index + 1} 소제목`}
                value={section.heading}
                onChange={(e) =>
                  set(
                    'sections',
                    form.sections.map((item, i) =>
                      i === index ? { ...item, heading: e.target.value } : item,
                    ),
                  )
                }
                placeholder="소제목"
                className={fieldClass}
              />
              <textarea
                aria-label={`본문 ${index + 1} 내용`}
                value={section.body}
                onChange={(e) =>
                  set(
                    'sections',
                    form.sections.map((item, i) =>
                      i === index ? { ...item, body: e.target.value } : item,
                    ),
                  )
                }
                rows={5}
                placeholder="본문 문단"
                className={fieldClass}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              set('sections', [...form.sections, { heading: '', body: '' }])
            }
            className="mt-3 text-sm font-black text-[#1b4dff]"
          >
            + 본문 영역 추가
          </button>
        </fieldset>
        <fieldset className="rounded-2xl border border-[#dce5f0] p-5">
          <legend className="px-2 font-black">FAQ</legend>
          {form.faq.map((item, index) => (
            <div key={index} className="mb-5 grid gap-3 last:mb-0">
              <input
                aria-label={`FAQ ${index + 1} 질문`}
                value={item.question}
                onChange={(e) =>
                  set(
                    'faq',
                    form.faq.map((faq, i) =>
                      i === index ? { ...faq, question: e.target.value } : faq,
                    ),
                  )
                }
                placeholder="질문"
                className={fieldClass}
              />
              <textarea
                aria-label={`FAQ ${index + 1} 답변`}
                value={item.answer}
                onChange={(e) =>
                  set(
                    'faq',
                    form.faq.map((faq, i) =>
                      i === index ? { ...faq, answer: e.target.value } : faq,
                    ),
                  )
                }
                rows={3}
                placeholder="답변"
                className={fieldClass}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              set('faq', [...form.faq, { question: '', answer: '' }])
            }
            className="mt-3 text-sm font-black text-[#1b4dff]"
          >
            + FAQ 추가
          </button>
        </fieldset>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            CTA 문구
            <input
              value={form.ctaLabel}
              onChange={(e) => set('ctaLabel', e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className={labelClass}>
            CTA 링크
            <input
              value={form.ctaLink}
              onChange={(e) => set('ctaLink', e.target.value)}
              className={fieldClass}
            />
          </label>
        </div>
        <details className="rounded-2xl border border-[#dce5f0] p-5">
          <summary className="cursor-pointer font-black">고급 SEO 설정</summary>
          <div className="mt-6 grid gap-5">
            <label className={labelClass}>
              URL slug
              <input
                value={form.slug}
                onChange={(e) => set('slug', e.target.value)}
                placeholder="비워두면 출발·도착·서비스 조합으로 자동 생성"
                className={fieldClass}
              />
              <span className="text-xs font-normal text-[#667085]">
                예상 공개 URL: /delivery/
                {slugify(form.slug) || automaticSlug || '자동-생성'}
              </span>
              <span className="text-xs font-normal leading-5 text-[#667085]">
                강남/강남구 또는 서울→부산/서울→대전처럼 조합이 다르면 서로 다른
                URL이 생성됩니다. 같은 조합이나 같은 사용자 지정 URL은 중복
                차단됩니다.
              </span>
            </label>
            <label className={labelClass}>
              보조 키워드 (쉼표 구분)
              <input
                value={form.secondaryKeywords.join(', ')}
                onChange={(e) =>
                  set(
                    'secondaryKeywords',
                    e.target.value
                      .split(',')
                      .map((v) => v.trim())
                      .filter(Boolean),
                  )
                }
                className={fieldClass}
              />
            </label>
            <label className={labelClass}>
              SEO 제목{' '}
              <span className="text-xs font-normal text-[#667085]">
                {form.metaTitle.length}/70
              </span>
              <input
                value={form.metaTitle}
                onChange={(e) => set('metaTitle', e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className={labelClass}>
              메타 설명{' '}
              <span className="text-xs font-normal text-[#667085]">
                {form.metaDescription.length}/170
              </span>
              <textarea
                value={form.metaDescription}
                onChange={(e) => set('metaDescription', e.target.value)}
                rows={3}
                className={fieldClass}
              />
            </label>
            <label className={labelClass}>
              Canonical (비워두면 자기 URL)
              <input
                value={form.canonical || ''}
                onChange={(e) => set('canonical', e.target.value || null)}
                className={fieldClass}
              />
            </label>
            <label className={labelClass}>
              검색 색인
              <select
                value={form.indexPolicy}
                onChange={(e) =>
                  set(
                    'indexPolicy',
                    e.target.value as LandingInput['indexPolicy'],
                  )
                }
                className={fieldClass}
              >
                <option value="INDEX">INDEX</option>
                <option value="NOINDEX">NOINDEX</option>
              </select>
            </label>
            <label className={labelClass}>
              OG 제목
              <input
                value={form.ogTitle}
                onChange={(e) => set('ogTitle', e.target.value)}
                className={fieldClass}
              />
            </label>
            <label className={labelClass}>
              OG 설명
              <textarea
                value={form.ogDescription}
                onChange={(e) => set('ogDescription', e.target.value)}
                rows={3}
                className={fieldClass}
              />
            </label>
            <label className={labelClass}>
              OG 이미지
              <input
                value={form.ogImage}
                onChange={(e) => set('ogImage', e.target.value)}
                className={fieldClass}
              />
            </label>
          </div>
        </details>
      </div>
    </section>
  );
}
