'use client';

import { useMemo, useState } from 'react';
import type { Region, Service, ServiceRouteIntent } from '@/lib/domain';
import { slugify } from '@/lib/seo';

const fieldClass =
  'w-full min-w-0 rounded-xl border border-[#cfd9e6] bg-white px-4 py-3 text-sm outline-none focus:border-[#1b4dff] focus:ring-2 focus:ring-[#1b4dff]/15';

type RegionDraft = Pick<
  Region,
  | 'name'
  | 'slug'
  | 'parentId'
  | 'type'
  | 'description'
  | 'active'
  | 'sortOrder'
  | 'usesDaeguPhone'
> & { id?: string; archived?: boolean };

const emptyRegion: RegionDraft = {
  name: '',
  slug: '',
  parentId: null,
  type: 'AREA',
  description: '',
  active: true,
  sortOrder: 1000,
  usesDaeguPhone: false,
  archived: false,
};

export function RegionManager({ initial }: { initial: Region[] }) {
  const [items, setItems] = useState(initial);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<RegionDraft>(emptyRegion);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const filtered = useMemo(
    () =>
      items.filter((item) =>
        `${item.name} ${item.slug}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [items, query],
  );

  const edit = (item: Region) =>
    setForm({
      id: item.id,
      name: item.name,
      slug: item.slug,
      parentId: item.parentId,
      type: item.type,
      description: item.description,
      active: item.active,
      sortOrder: item.sortOrder,
      usesDaeguPhone: item.usesDaeguPhone,
      archived: Boolean(item.archived),
    });

  const persist = async (draft = form) => {
    setSaving(true);
    setMessage('저장 중…');
    const response = await fetch(
      draft.id ? `/api/admin/regions/${draft.id}` : '/api/admin/regions',
      {
        method: draft.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      },
    );
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || '지역을 저장하지 못했습니다.');
      setSaving(false);
      return;
    }
    setItems((current) => {
      const exists = current.some((item) => item.id === data.region.id);
      return exists
        ? current.map((item) =>
            item.id === data.region.id ? data.region : item,
          )
        : [...current, data.region];
    });
    setForm(emptyRegion);
    setMessage(draft.id ? '지역을 수정했습니다.' : '새 지역을 추가했습니다.');
    setSaving(false);
  };

  return (
    <section
      id="regions"
      className="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-7"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-black">지역 관리</h2>
          <p className="mt-2 text-sm text-[#667085]">
            현재 {items.length}개 · 활성{' '}
            {items.filter((item) => item.active && !item.archived).length}개 ·
            등록 개수 제한 없음
          </p>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="지역명·URL 검색"
          className={fieldClass}
        />
      </div>
      <p
        aria-live="polite"
        className="mt-4 min-h-5 text-sm font-bold text-[#1b4dff]"
      >
        {message}
      </p>
      <div className="mt-3 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <div className="min-w-0 max-h-[600px] max-w-full overflow-auto rounded-xl border border-[#dce5f0]">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="sticky top-0 bg-[#edf3fb] text-xs text-[#667085]">
              <tr>
                <th className="p-3">지역</th>
                <th className="p-3">상위 지역</th>
                <th className="p-3">상태</th>
                <th className="p-3">작업</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-t border-[#edf1f6]">
                  <td className="p-3" aria-label={`${item.name} 작업`}>
                    <strong className="block">{item.name}</strong>
                    <span className="text-xs text-[#667085]">/{item.slug}</span>
                  </td>
                  <td className="p-3">{item.parentName || '최상위'}</td>
                  <td className="p-3" aria-label={`${item.name} 작업`}>
                    {item.archived ? '보관' : item.active ? '활성' : '비활성'}
                  </td>
                  <td className="p-3" aria-label={`${item.name} 작업`}>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => edit(item)}
                        className="font-bold text-[#1b4dff]"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          void persist({ ...item, active: !item.active })
                        }
                        className="font-bold"
                      >
                        {item.active ? '비활성' : '활성'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          void persist({
                            ...item,
                            archived: !item.archived,
                            active: Boolean(item.archived),
                          })
                        }
                        className="font-bold text-red-600"
                      >
                        {item.archived ? '복원' : '보관'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <form
          className="grid h-fit gap-4 rounded-xl border border-[#dce5f0] p-5"
          onSubmit={(event) => {
            event.preventDefault();
            void persist();
          }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-black">
              {form.id ? '지역 수정' : '새 지역 추가'}
            </h3>
            {form.id ? (
              <button
                type="button"
                onClick={() => setForm(emptyRegion)}
                className="text-sm font-bold text-[#667085]"
              >
                새로 입력
              </button>
            ) : null}
          </div>
          <label className="grid gap-2 text-sm font-bold">
            지역명
            <input
              required
              maxLength={100}
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                  slug:
                    current.id || current.slug
                      ? current.slug
                      : slugify(event.target.value),
                }))
              }
              className={fieldClass}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            URL slug
            <input
              required
              maxLength={100}
              value={form.slug}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  slug: slugify(event.target.value),
                }))
              }
              className={fieldClass}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            상위 지역
            <select
              value={form.parentId || ''}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  parentId: event.target.value || null,
                }))
              }
              className={fieldClass}
            >
              <option value="">최상위 지역</option>
              {items
                .filter((item) => item.id !== form.id && !item.archived)
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">
              유형
              <select
                value={form.type}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    type: event.target.value as Region['type'],
                  }))
                }
                className={fieldClass}
              >
                {['METRO', 'PROVINCE', 'DISTRICT', 'CITY', 'AREA'].map(
                  (type) => (
                    <option key={type}>{type}</option>
                  ),
                )}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold">
              정렬값
              <input
                type="number"
                value={form.sortOrder}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    sortOrder: Number(event.target.value),
                  }))
                }
                className={fieldClass}
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-bold">
            설명
            <textarea
              rows={4}
              maxLength={800}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className={fieldClass}
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={form.usesDaeguPhone}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  usesDaeguPhone: event.target.checked,
                }))
              }
            />
            대구 053 번호 적용
          </label>
          <button
            disabled={saving}
            className="rounded-xl bg-[#1b4dff] px-5 py-3 text-sm font-black text-white"
          >
            {saving ? '저장 중…' : form.id ? '수정 저장' : '지역 추가'}
          </button>
        </form>
      </div>
    </section>
  );
}

type ServiceDraft = Pick<
  Service,
  | 'name'
  | 'slug'
  | 'group'
  | 'shortDescription'
  | 'description'
  | 'keywords'
  | 'image'
  | 'active'
  | 'sortOrder'
> & { id?: string; archived?: boolean; routeText: string };

const emptyService: ServiceDraft = {
  name: '',
  slug: '',
  group: 'LOCAL',
  shortDescription: '',
  description: '',
  keywords: [],
  image: '/service-freight.png',
  active: true,
  sortOrder: 1000,
  archived: false,
  routeText: '',
};

function routeTextFor(service: Pick<Service, 'routeIntents'>) {
  return (service.routeIntents || [])
    .map(
      (route) =>
        `${route.origin} | ${route.destination} | ${route.label} | ${route.active === false ? '비활성' : '활성'}`,
    )
    .join('\n');
}

function serviceDraftFor(item: Service): ServiceDraft {
  return {
    id: item.id,
    name: item.name,
    slug: item.slug,
    group: item.group,
    shortDescription: item.shortDescription,
    description: item.description,
    keywords: item.keywords,
    image: item.image,
    active: item.active,
    sortOrder: item.sortOrder,
    archived: Boolean(item.archived),
    routeText: routeTextFor(item),
  };
}

function parseRouteText(value: string, serviceName: string) {
  const routes: ServiceRouteIntent[] = [];
  for (const [index, line] of value.split(/\r?\n/).entries()) {
    if (!line.trim()) continue;
    const [origin = '', destination = '', label = '', status = '활성'] = line
      .split('|')
      .map((part) => part.trim());
    if (!origin || !destination)
      throw new Error(
        `${index + 1}번째 주요 노선은 “출발지 | 도착지 | 표시문구 | 활성/비활성” 형식으로 입력해주세요.`,
      );
    if (!['활성', '비활성'].includes(status))
      throw new Error(
        `${index + 1}번째 주요 노선 상태는 “활성” 또는 “비활성”으로 입력해주세요.`,
      );
    routes.push({
      origin,
      destination,
      label: label || `${origin}–${destination} ${serviceName}`,
      source: '관리자 입력',
      active: status === '활성',
      sortOrder: routes.length,
    });
  }
  return routes;
}

export function ServiceManager({ initial }: { initial: Service[] }) {
  const [items, setItems] = useState(initial);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<ServiceDraft>(emptyService);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const filtered = useMemo(
    () =>
      items.filter((item) =>
        `${item.name} ${item.slug}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [items, query],
  );

  const edit = (item: Service) => setForm(serviceDraftFor(item));
  const persist = async (draft = form) => {
    setSaving(true);
    setMessage('저장 중…');
    let routeIntents: ServiceRouteIntent[];
    try {
      routeIntents = parseRouteText(draft.routeText, draft.name);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : '주요 노선을 확인해주세요.',
      );
      setSaving(false);
      return;
    }
    const { routeText: _routeText, ...servicePayload } = draft;
    const response = await fetch(
      draft.id ? `/api/admin/services/${draft.id}` : '/api/admin/services',
      {
        method: draft.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...servicePayload, routeIntents }),
      },
    );
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || '서비스를 저장하지 못했습니다.');
      setSaving(false);
      return;
    }
    setItems((current) =>
      current.some((item) => item.id === data.service.id)
        ? current.map((item) =>
            item.id === data.service.id ? data.service : item,
          )
        : [...current, data.service],
    );
    setForm(emptyService);
    setMessage(
      draft.id ? '서비스를 수정했습니다.' : '새 서비스를 추가했습니다.',
    );
    setSaving(false);
  };
  return (
    <section
      id="services"
      className="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-7"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-black">서비스 관리</h2>
          <p className="mt-2 text-sm text-[#667085]">
            현재 {items.length}개 · 활성{' '}
            {items.filter((item) => item.active && !item.archived).length}개 ·
            등록 개수 제한 없음
          </p>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="서비스명·URL 검색"
          className={fieldClass}
        />
      </div>
      <p
        aria-live="polite"
        className="mt-4 min-h-5 text-sm font-bold text-[#1b4dff]"
      >
        {message}
      </p>
      <div className="mt-3 grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <div className="min-w-0 max-h-[520px] max-w-full overflow-auto rounded-xl border border-[#dce5f0]">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="sticky top-0 bg-[#edf3fb] text-xs text-[#667085]">
              <tr>
                <th className="p-3">서비스</th>
                <th className="p-3">그룹</th>
                <th className="p-3">상태</th>
                <th className="p-3">작업</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-t border-[#edf1f6]">
                  <td className="p-3">
                    <strong className="block">{item.name}</strong>
                    <span className="text-xs text-[#667085]">/{item.slug}</span>
                  </td>
                  <td className="p-3">{item.group}</td>
                  <td className="p-3">
                    {item.archived ? '보관' : item.active ? '활성' : '비활성'}
                  </td>
                  <td className="p-3" aria-label={`${item.name} 작업`}>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => edit(item)}
                        className="font-bold text-[#1b4dff]"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          void persist({
                            ...serviceDraftFor(item),
                            active: !item.active,
                          })
                        }
                        className="font-bold"
                      >
                        {item.active ? '비활성' : '활성'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          void persist({
                            ...serviceDraftFor(item),
                            archived: !item.archived,
                            active: Boolean(item.archived),
                          })
                        }
                        className="font-bold text-red-600"
                      >
                        {item.archived ? '복원' : '보관'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <form
          className="grid h-fit gap-4 rounded-xl border border-[#dce5f0] p-5"
          onSubmit={(event) => {
            event.preventDefault();
            void persist();
          }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-black">
              {form.id ? '서비스 수정' : '새 서비스 추가'}
            </h3>
            {form.id ? (
              <button
                type="button"
                onClick={() => setForm(emptyService)}
                className="text-sm font-bold text-[#667085]"
              >
                새로 입력
              </button>
            ) : null}
          </div>
          <label className="grid gap-2 text-sm font-bold">
            서비스명
            <input
              required
              maxLength={100}
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                  slug:
                    current.id || current.slug
                      ? current.slug
                      : slugify(event.target.value),
                }))
              }
              className={fieldClass}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            URL slug
            <input
              required
              maxLength={100}
              value={form.slug}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  slug: slugify(event.target.value),
                }))
              }
              className={fieldClass}
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold">
              그룹
              <select
                value={form.group}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    group: event.target.value as Service['group'],
                  }))
                }
                className={fieldClass}
              >
                {['LOCAL', 'INTERCITY', 'JEJU', 'TRAVEL'].map((group) => (
                  <option key={group}>{group}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold">
              정렬값
              <input
                type="number"
                value={form.sortOrder}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    sortOrder: Number(event.target.value),
                  }))
                }
                className={fieldClass}
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-bold">
            요약
            <input
              required
              maxLength={300}
              value={form.shortDescription}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  shortDescription: event.target.value,
                }))
              }
              className={fieldClass}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            설명
            <textarea
              rows={4}
              maxLength={1200}
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className={fieldClass}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            기본 키워드 (쉼표 구분)
            <input
              value={form.keywords.join(', ')}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  keywords: event.target.value
                    .split(',')
                    .map((value) => value.trim())
                    .filter(Boolean),
                }))
              }
              className={fieldClass}
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            주요 노선 상담
            <textarea
              rows={6}
              value={form.routeText}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  routeText: event.target.value,
                }))
              }
              placeholder={
                '서울 | 부산 | 서울–부산 고속버스택배 | 활성\n서울 | 대전 | 서울–대전 고속버스택배 | 비활성'
              }
              className={fieldClass}
            />
            <span className="text-xs font-normal leading-5 text-[#667085]">
              한 줄에 출발지 | 도착지 | 표시문구 | 활성/비활성 순서로
              입력하세요. 줄 순서가 공개 정렬 순서이며, 활성 노선만 서비스
              상세의 ‘주요 연계 노선 상담’에 표시됩니다.
            </span>
          </label>
          <label className="grid gap-2 text-sm font-bold">
            대표 이미지 경로
            <input
              value={form.image}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  image: event.target.value,
                }))
              }
              className={fieldClass}
            />
          </label>
          <button
            disabled={saving}
            className="rounded-xl bg-[#1b4dff] px-5 py-3 text-sm font-black text-white"
          >
            {saving ? '저장 중…' : form.id ? '수정 저장' : '서비스 추가'}
          </button>
        </form>
      </div>
    </section>
  );
}
