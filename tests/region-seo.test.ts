import { describe, expect, it } from 'vitest';
import { getRegion } from '@/data/regions';
import { getRegionSeoContent, regionFaqSchema } from '@/lib/region-seo';

const contentFor = (id: string) => {
  const region = getRegion(id);
  if (!region) throw new Error(`Missing region ${id}`);
  return getRegionSeoContent(region);
};

describe('region SEO content', () => {
  it('gives Pohang and Gumi distinct, service-intent metadata and local copy', () => {
    const pohang = contentFor('gyeongbuk-pohang');
    const gumi = contentFor('gyeongbuk-gumi');

    expect(pohang.seoTitle).toContain('포항');
    expect(pohang.seoTitle).toContain('퀵서비스');
    expect(gumi.seoTitle).toContain('구미');
    expect(gumi.seoTitle).toContain('용달');
    expect(pohang.seoTitle).not.toBe(gumi.seoTitle);
    expect(pohang.h1).not.toBe(gumi.h1);
    expect(pohang.localSummary).not.toBe(gumi.localSummary);
    expect(pohang.metaDescription).toContain('일반 택배 접수처');
  });

  it('provides only canonical service and route links for priority regions', () => {
    for (const id of [
      'gyeongbuk-pohang',
      'gyeongbuk-gumi',
      'gyeongbuk-gyeongsan',
      'gyeongbuk-gyeongju',
      'gyeongbuk-andong',
      'gyeongbuk-hayang',
      'gyeongbuk-jillyang',
      'daegu-dong',
      'daegu-dalseong',
    ]) {
      const content = contentFor(id);
      expect(content.directLinks.length, id).toBeGreaterThan(0);
      for (const link of content.directLinks) {
        expect(link.href, id).toMatch(/^\/(services|routes)\//);
        expect(link.href, id).not.toContain('/area/');
      }
    }
  });

  it('keeps visible FAQs and FAQPage data synchronized', () => {
    const content = contentFor('gyeongbuk-pohang');
    const schema = regionFaqSchema(content);

    expect(content.faq).toHaveLength(3);
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toEqual(
      content.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    );
  });
});
