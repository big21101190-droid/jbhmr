'use client';

import { useMemo, useState } from 'react';
import type { Landing, Region, Service } from '@/lib/domain';

export function LandingAdminList({
  initial,
  regions,
  services,
}: {
  initial: Landing[];
  regions: Region[];
  services: Service[];
}) {
  const [items, setItems] = useState(initial);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [region, setRegion] = useState('ALL');
  const [service, setService] = useState('ALL');
  const [sort, setSort] = useState('UPDATED_DESC');
  const [collapsed, setCollapsed] = useState(true);
  const [visibleCount, setVisibleCount] = useState(25);
  const [message, setMessage] = useState('');
  const filtered = useMemo(() => {
    const next = items.filter(
      (item) =>
        (!query ||
          `${item.title} ${item.primaryKeyword} ${item.slug}`
            .toLowerCase()
            .includes(query.toLowerCase())) &&
        (status === 'ALL' || item.status === status) &&
        (region === 'ALL' ||
          item.regionId === region ||
          item.destinationRegionId === region) &&
        (service === 'ALL' || item.serviceId === service),
    );
    return next.sort((a, b) => {
      if (sort === 'TITLE_ASC') return a.title.localeCompare(b.title, 'ko');
      if (sort === 'REGION_ASC') {
        const aRegion =
          regions.find((item) => item.id === a.regionId)?.name || '';
        const bRegion =
          regions.find((item) => item.id === b.regionId)?.name || '';
        return aRegion.localeCompare(bRegion, 'ko');
      }
      if (sort === 'SERVICE_ASC') {
        const aService =
          services.find((item) => item.id === a.serviceId)?.name || '';
        const bService =
          services.find((item) => item.id === b.serviceId)?.name || '';
        return aService.localeCompare(bService, 'ko');
      }
      if (sort === 'STATUS_ASC') return a.status.localeCompare(b.status);
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [items, query, status, region, service, sort, regions, services]);
  const toggleCollapsed = () => {
    setCollapsed((current) => !current);
  };
  const update = async (item: Landing, next: Partial<Landing>) => {
    if (
      next.status === 'ARCHIVED' &&
      !window.confirm('이 랜딩페이지를 보관할까요? 공개 URL은 404가 됩니다.')
    )
      return;
    setMessage('저장 중…');
    const response = await fetch(`/api/admin/landings/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || '변경하지 못했습니다.');
      return;
    }
    setItems((current) =>
      current.map((record) =>
        record.id === data.landing.id ? data.landing : record,
      ),
    );
    setMessage('변경했습니다.');
  };
  return (
    <section className="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black">SEO 랜딩페이지</h1>
          <p className="mt-1 text-sm text-[#667085]">
            전체 {items.length} · 공개{' '}
            {items.filter((i) => i.status === 'PUBLISHED').length} · 초안{' '}
            {items.filter((i) => i.status === 'DRAFT').length}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-expanded={!collapsed}
            aria-controls="landing-management-content"
            className="rounded-xl border border-[#cfd9e6] px-5 py-3 text-sm font-black"
          >
            {collapsed ? '목록 펼치기' : '목록 접기'}
          </button>
          <a
            href="/admin/landings/new"
            className="rounded-xl bg-[#1b4dff] px-5 py-3 text-center text-sm font-black text-white"
          >
            + 새 랜딩
          </a>
        </div>
      </div>
      {!collapsed ? (
        <div id="landing-management-content">
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(25);
              }}
              placeholder="제목·키워드·URL 검색"
              aria-label="랜딩페이지 제목·키워드·URL 검색"
              className="w-full min-w-0 rounded-xl border border-[#dce5f0] px-4 py-3 text-sm"
            />
            <select
              value={region}
              aria-label="랜딩페이지 지역 필터"
              onChange={(e) => {
                setRegion(e.target.value);
                setVisibleCount(25);
              }}
              className="w-full min-w-0 rounded-xl border border-[#dce5f0] bg-white px-3 py-3 text-sm"
            >
              <option value="ALL">전체 지역</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <select
              value={service}
              aria-label="랜딩페이지 서비스 필터"
              onChange={(e) => {
                setService(e.target.value);
                setVisibleCount(25);
              }}
              className="w-full min-w-0 rounded-xl border border-[#dce5f0] bg-white px-3 py-3 text-sm"
            >
              <option value="ALL">전체 서비스</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              value={status}
              aria-label="랜딩페이지 상태 필터"
              onChange={(e) => {
                setStatus(e.target.value);
                setVisibleCount(25);
              }}
              className="w-full min-w-0 rounded-xl border border-[#dce5f0] bg-white px-3 py-3 text-sm"
            >
              <option value="ALL">전체 상태</option>
              <option>DRAFT</option>
              <option>PUBLISHED</option>
              <option>ARCHIVED</option>
            </select>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setVisibleCount(25);
              }}
              aria-label="랜딩페이지 정렬"
              className="w-full min-w-0 rounded-xl border border-[#dce5f0] bg-white px-3 py-3 text-sm"
            >
              <option value="UPDATED_DESC">최근 수정순</option>
              <option value="TITLE_ASC">제목 가나다순</option>
              <option value="REGION_ASC">지역 가나다순</option>
              <option value="SERVICE_ASC">서비스 가나다순</option>
              <option value="STATUS_ASC">상태순</option>
            </select>
          </div>
          <p
            className="mt-3 h-5 text-sm font-bold text-[#1b4dff]"
            aria-live="polite"
          >
            {message}
          </p>
          <div className="mt-2 min-w-0 max-w-full overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-[#dce5f0] text-xs text-[#667085]">
                <tr>
                  <th className="px-3 py-3">제목 / 키워드</th>
                  <th className="px-3 py-3">지역</th>
                  <th className="px-3 py-3">서비스</th>
                  <th className="px-3 py-3">상태</th>
                  <th className="px-3 py-3">수정일</th>
                  <th className="px-3 py-3">작업</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, visibleCount).map((item) => (
                  <tr key={item.id} className="border-b border-[#edf1f6]">
                    <td className="px-3 py-4">
                      <strong className="block">{item.title}</strong>
                      <span className="mt-1 block text-xs text-[#667085]">
                        {item.primaryKeyword} · /{item.slug}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      {regions.find((r) => r.id === item.regionId)?.name}
                      {item.destinationRegionId ? (
                        <>
                          {' → '}
                          {
                            regions.find(
                              (r) => r.id === item.destinationRegionId,
                            )?.name
                          }
                        </>
                      ) : null}
                    </td>
                    <td className="px-3 py-4">
                      {services.find((s) => s.id === item.serviceId)?.name}
                    </td>
                    <td className="px-3 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-black ${item.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : item.status === 'ARCHIVED' ? 'bg-gray-200 text-gray-600' : 'bg-amber-100 text-amber-700'}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-xs">
                      {new Date(item.updatedAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`/admin/landings/${item.id}`}
                          className="font-bold text-[#1b4dff]"
                        >
                          수정
                        </a>
                        <a
                          href={`/admin/preview/${item.id}`}
                          target="_blank"
                          className="font-bold"
                        >
                          미리보기
                        </a>
                        {item.status !== 'PUBLISHED' ? (
                          <button
                            onClick={() =>
                              update(item, { status: 'PUBLISHED' })
                            }
                            className="font-bold text-green-700"
                          >
                            공개
                          </button>
                        ) : (
                          <button
                            onClick={() => update(item, { status: 'DRAFT' })}
                            className="font-bold text-amber-700"
                          >
                            비공개
                          </button>
                        )}
                        {item.status !== 'ARCHIVED' ? (
                          <button
                            onClick={() => update(item, { status: 'ARCHIVED' })}
                            className="font-bold text-red-600"
                          >
                            보관
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 ? (
              <p className="py-12 text-center text-[#667085]">
                조건에 맞는 랜딩페이지가 없습니다.
              </p>
            ) : null}
            {filtered.length > visibleCount ? (
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + 25)}
                className="mx-auto my-5 block rounded-xl border border-[#cfd9e6] px-5 py-3 text-sm font-black"
              >
                25개 더 보기 ({visibleCount}/{filtered.length})
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
