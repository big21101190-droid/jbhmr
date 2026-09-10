import { beforeEach, describe, expect, it, vi } from 'vitest';

const blobState = vi.hoisted(() => new Map<string, unknown>());

vi.mock('server-only', () => ({}));
vi.mock('@netlify/blobs', () => ({
  getStore: () => ({
    async list({ prefix }: { prefix: string }) {
      return {
        blobs: [...blobState.keys()]
          .filter((key) => key.startsWith(prefix))
          .map((key) => ({ key, etag: key })),
      };
    },
    async get(key: string) {
      return blobState.get(key) ?? null;
    },
    async setJSON(key: string, value: unknown) {
      blobState.set(key, structuredClone(value));
    },
    async delete(key: string) {
      blobState.delete(key);
    },
  }),
}));

import {
  getRegionRecord,
  getServiceRecord,
  listRegions,
  listServices,
  saveRegion,
  saveService,
} from '@/lib/catalog-store';

describe('dynamic catalog persistence', () => {
  beforeEach(() => blobState.clear());

  it('looks up persisted Korean region/service slugs raw or encoded once', async () => {
    const region = await saveRegion({
      name: '서울 관악구',
      slug: '서울-관악구',
      parentId: 'seoul',
    });
    const service = await saveService({
      name: '한글 서비스',
      slug: '한글-서비스',
    });
    for (const input of [
      region.id,
      region.slug,
      encodeURIComponent(region.slug),
    ]) {
      expect((await getRegionRecord(input))?.id).toBe(region.id);
    }
    expect((await getServiceRecord(encodeURIComponent(service.slug)))?.id).toBe(
      service.id,
    );
    for (const bad of ['%', '%E0%A4%A', 'a%2Fb', '%252F', 'missing-region']) {
      expect(await getRegionRecord(bad)).toBeNull();
      expect(await getServiceRecord(bad)).toBeNull();
    }
    await saveRegion({ id: region.id, archived: true });
    expect(
      await getRegionRecord(encodeURIComponent(region.slug), false),
    ).toBeNull();
    expect((await getRegionRecord(region.id))?.archived).toBe(true);
  });

  it('creates, persists, and archives an additional region without a count limit', async () => {
    const before = await listRegions({ includeArchived: true });
    const created = await saveRegion({
      name: 'QA-지역자동테스트',
      slug: 'qa-region-automated-test',
      active: true,
    });

    expect(await listRegions({ includeArchived: true })).toHaveLength(
      before.length + 1,
    );
    expect(
      (await listRegions()).find((region) => region.id === created.id)?.name,
    ).toBe('QA-지역자동테스트');

    await saveRegion({ id: created.id, archived: true, active: false });
    expect(
      (await listRegions()).some((region) => region.id === created.id),
    ).toBe(false);
    expect(
      (await listRegions({ includeArchived: true })).find(
        (region) => region.id === created.id,
      )?.archived,
    ).toBe(true);
  });

  it('creates, persists, and archives a tenth-plus service without a count limit', async () => {
    const before = await listServices({ includeArchived: true });
    const created = await saveService({
      name: 'QA-서비스자동테스트',
      slug: 'qa-service-automated-test',
      active: true,
    });

    expect(await listServices({ includeArchived: true })).toHaveLength(
      before.length + 1,
    );
    expect(
      (await listServices()).find((service) => service.id === created.id)?.name,
    ).toBe('QA-서비스자동테스트');

    await saveService({ id: created.id, archived: true, active: false });
    expect(
      (await listServices()).some((service) => service.id === created.id),
    ).toBe(false);
    expect(
      (await listServices({ includeArchived: true })).find(
        (service) => service.id === created.id,
      )?.archived,
    ).toBe(true);
  });

  it('persists editable route intents and allows clearing the list', async () => {
    const created = await saveService({
      name: 'QA-노선서비스',
      slug: 'qa-route-service',
      active: true,
      routeIntents: [
        {
          origin: '서울',
          destination: '부산',
          label: '서울–부산 QA 노선',
          source: '자동 테스트',
        },
      ],
    });
    expect(
      (await listServices({ includeArchived: true })).find(
        (service) => service.id === created.id,
      )?.routeIntents,
    ).toHaveLength(1);

    await saveService({ id: created.id, routeIntents: [] });
    expect(
      (await listServices({ includeArchived: true })).find(
        (service) => service.id === created.id,
      )?.routeIntents,
    ).toEqual([]);
  });

  it('blocks route URL collisions across services', async () => {
    await saveService({
      name: 'QA-노선서비스-1',
      slug: 'qa-route-one',
      routeIntents: [
        {
          origin: '서울',
          destination: '부산',
          label: '첫 번째 노선',
          source: '자동 테스트',
          slug: 'qa-shared-route',
        },
      ],
    });
    await expect(
      saveService({
        name: 'QA-노선서비스-2',
        slug: 'qa-route-two',
        routeIntents: [
          {
            origin: '서울',
            destination: '대전',
            label: '두 번째 노선',
            source: '자동 테스트',
            slug: 'qa-shared-route',
          },
        ],
      }),
    ).rejects.toThrow('다른 서비스에서 같은 주요 노선 URL');
  });
});
