'use client';

import { useMemo, useState } from 'react';
import type { ServiceRoute } from '@/lib/service-routes';

export function ServiceRouteAdminList({
  initial,
}: {
  initial: ServiceRoute[];
}) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [collapsed, setCollapsed] = useState(false);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return initial.filter((route) => {
      const matchesQuery =
        !needle ||
        `${route.label} ${route.origin} ${route.destination} ${route.serviceName} ${route.slug}`
          .toLowerCase()
          .includes(needle);
      const matchesStatus =
        status === 'ALL' ||
        (status === 'ACTIVE' && route.active !== false) ||
        (status === 'INACTIVE' && route.active === false) ||
        (status === 'NOINDEX' && route.indexPolicy === 'NOINDEX');
      return matchesQuery && matchesStatus;
    });
  }, [initial, query, status]);

  return (
    <section
      id="routes"
      className="min-w-0 rounded-2xl bg-white p-5 shadow-sm sm:p-7"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black">주요 노선 SEO 페이지</h2>
          <p className="mt-1 text-sm text-[#667085]">
            사이트에 생성된 노선 {initial.length}개를 모두 같은 원본에서
            조회하고 수정합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((current) => !current)}
          aria-expanded={!collapsed}
          className="rounded-xl border border-[#cfd9e6] px-4 py-3 text-sm font-black"
        >
          {collapsed ? '목록 펼치기' : '목록 접기'}
        </button>
      </div>
      {!collapsed ? (
        <div className="mt-6">
          <div className="grid gap-3 sm:grid-cols-[1fr_180px]">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="제목·출발지·도착지·서비스·URL 검색"
              className="w-full rounded-xl border border-[#cfd9e6] px-4 py-3"
            />
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-xl border border-[#cfd9e6] bg-white px-4 py-3"
            >
              <option value="ALL">전체 상태</option>
              <option value="ACTIVE">공개</option>
              <option value="INACTIVE">비공개</option>
              <option value="NOINDEX">NOINDEX</option>
            </select>
          </div>
          <p className="mt-3 text-sm text-[#667085]">
            검색 결과 {filtered.length}개
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-y border-[#dce5f0] bg-[#f9fbfd] text-[#667085]">
                <tr>
                  <th className="px-4 py-3">페이지</th>
                  <th className="px-4 py-3">서비스</th>
                  <th className="px-4 py-3">상태</th>
                  <th className="px-4 py-3">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dce5f0]">
                {filtered.map((route) => (
                  <tr key={`${route.serviceId}-${route.slug}`}>
                    <td className="px-4 py-4">
                      <strong className="block">{route.label}</strong>
                      <span className="mt-1 block text-xs text-[#667085]">
                        /routes/{route.slug}
                      </span>
                    </td>
                    <td className="px-4 py-4">{route.serviceName}</td>
                    <td className="px-4 py-4">
                      {route.active === false ? '비공개' : '공개'} ·{' '}
                      {route.indexPolicy || 'INDEX'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-4">
                        <a
                          href={`/admin/routes/${route.serviceId}/${route.slug}`}
                          className="font-black text-[#1b4dff]"
                        >
                          수정
                        </a>
                        {route.active !== false ? (
                          <a
                            href={`/routes/${route.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold"
                          >
                            사이트 보기
                          </a>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 ? (
              <p className="py-10 text-center text-[#667085]">
                조건에 맞는 주요 노선이 없습니다.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
