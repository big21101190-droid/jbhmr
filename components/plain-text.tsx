import { Fragment } from 'react';

export function PlainText({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  const paragraphs = text.replace(/\r\n?/g, '\n').split(/\n{2,}/);

  return (
    <div className={className}>
      {paragraphs.map((paragraph, paragraphIndex) => (
        <p key={`${paragraphIndex}-${paragraph.slice(0, 24)}`}>
          {paragraph.split('\n').map((line, lineIndex, lines) => (
            <Fragment key={`${lineIndex}-${line.slice(0, 24)}`}>
              {line}
              {lineIndex < lines.length - 1 ? <br /> : null}
            </Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}
