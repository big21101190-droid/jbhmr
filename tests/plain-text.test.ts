import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PlainText } from '@/components/plain-text';

describe('safe plain-text paragraphs', () => {
  it('renders blank lines as paragraphs and single newlines as line breaks', () => {
    const html = renderToStaticMarkup(
      createElement(PlainText, {
        text: '첫 줄\n둘째 줄\n\n셋째 문단',
      }),
    );
    expect(html).toContain('<p>첫 줄<br/>둘째 줄</p>');
    expect(html).toContain('<p>셋째 문단</p>');
  });

  it('escapes pasted HTML instead of executing it', () => {
    const html = renderToStaticMarkup(
      createElement(PlainText, { text: '<script>alert(1)</script>' }),
    );
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>');
  });
});
