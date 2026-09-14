import { describe, expect, it } from 'vitest';
import {
  hasKoreanFinalConsonant,
  repairGeneratedObjectParticle,
  withObjectParticle,
  withTopicParticle,
} from '@/lib/korean-particles';

describe('Korean particles', () => {
  it.each([
    ['고속버스택배', false],
    ['KTX택배', false],
    ['퀵서비스', false],
    ['제주항공화물', true],
    ['전국배송', true],
    ['1톤', true],
  ])('detects the final consonant in %s', (value, expected) => {
    expect(hasKoreanFinalConsonant(value)).toBe(expected);
  });

  it('selects topic and object particles', () => {
    expect(withTopicParticle('서울–대전 고속버스택배')).toBe(
      '서울–대전 고속버스택배는',
    );
    expect(withObjectParticle('고속버스택배')).toBe('고속버스택배를');
    expect(withTopicParticle('제주항공화물')).toBe('제주항공화물은');
    expect(withObjectParticle('제주항공화물')).toBe('제주항공화물을');
  });

  it('repairs only the legacy generated summary phrase', () => {
    expect(
      repairGeneratedObjectParticle(
        '서울에서 대구까지 고속버스택배을 화물 조건과 희망 시간에 맞춰 상담합니다.',
        '고속버스택배',
      ),
    ).toBe(
      '서울에서 대구까지 고속버스택배를 화물 조건과 희망 시간에 맞춰 상담합니다.',
    );
    expect(
      repairGeneratedObjectParticle(
        '고객이 별도로 작성한 고속버스택배을 설명입니다.',
        '고속버스택배',
      ),
    ).toBe('고객이 별도로 작성한 고속버스택배을 설명입니다.');
  });
});
