import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { services } from '@/data/services';
import { ShippingDecisionGuide } from '@/components/shipping-decision-guide';

describe('shipping decisions from the actual catalog', () => {
  it('renders method-specific tradeoffs and shipment conditions for Seoul', () => {
    const html = renderToStaticMarkup(
      createElement(ShippingDecisionGuide, { name: '서울', services }),
    );
    expect(html).toContain('서울 운송 방법 비교');
    expect(html).toContain('비용은 어떤 조건으로 달라지나요?');
    expect(html).toContain('도착 희망 시각');
    expect(html).toContain('오토바이');
    expect(html).toContain('다마스');
    expect(html).toContain('영업소');
    expect(html).toContain('/services/ktx');
    expect(html).not.toContain('/area/');
  });
  it('uses live names and slugs, preserving archived-service restrictions', () => {
    const catalog = services.map((service) => ({
      ...service,
      archived: service.id !== 'damas',
      name: '등록된 차량 상담',
      slug: 'current-vehicle',
    }));
    const html = renderToStaticMarkup(
      createElement(ShippingDecisionGuide, { name: '포항', services: catalog }),
    );
    expect(html).toContain('/services/current-vehicle');
    expect(html).toContain('등록된 차량 상담');
    expect(html).not.toContain('href="/services/ktx"');
  });
});
