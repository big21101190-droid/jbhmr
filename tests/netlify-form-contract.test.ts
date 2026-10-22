import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { ContactForm } from '@/components/contact-form';

const expectedFields = [
  'form-name',
  'subject',
  'bot-field',
  'name',
  'phone',
  'email',
  'origin',
  'destination',
  'service',
  'message',
  'privacy-consent',
];

function formFields(markup: string) {
  return [...markup.matchAll(/<(input|textarea|select)\b[^>]*\bname="([^"]+)"[^>]*>/g)].map(
    (match) => match[2],
  );
}

function inputMarkup(markup: string, name: string) {
  return new RegExp(`<input\\b[^>]*\\bname="${name}"[^>]*>`).exec(markup)?.[0] || '';
}

describe('Netlify inquiry form contract', () => {
  it('registers the same required reply-to email field in the rendered and static forms', () => {
    const rendered = renderToStaticMarkup(createElement(ContactForm));
    const staticForm = readFileSync('public/__forms.html', 'utf8');

    expect(formFields(rendered)).toEqual(expectedFields);
    expect(formFields(staticForm)).toEqual(expectedFields);
    expect(inputMarkup(rendered, 'email')).toMatch(/\btype="email"/);
    expect(inputMarkup(rendered, 'email')).toMatch(/\brequired=""/);
    expect(inputMarkup(staticForm, 'email')).toMatch(/\btype="email"/);
  });
});
