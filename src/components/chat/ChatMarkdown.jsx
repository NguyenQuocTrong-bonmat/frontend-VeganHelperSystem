const inlineTokenPattern = /(\[[^\]\n]+\]\([^)]+\)|`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\*[^*\n]+\*)/g;

function safeHref(value) {
  const href = value.trim();
  try {
    const url = new URL(href, 'https://veganhelper.invalid');
    return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? href : null;
  } catch {
    return null;
  }
}

function renderInline(text, keyPrefix, depth = 0) {
  if (depth > 4) return text;

  const parts = [];
  let cursor = 0;
  let tokenIndex = 0;

  for (const match of text.matchAll(inlineTokenPattern)) {
    const [token] = match;
    const start = match.index ?? 0;
    if (start > cursor) parts.push(text.slice(cursor, start));

    const key = `${keyPrefix}-${tokenIndex++}`;
    const link = token.match(/^\[([^\]]+)\]\((.+)\)$/);
    if (link) {
      const href = safeHref(link[2].replace(/\s+["'][^"']*["']$/, ''));
      parts.push(href
      ? <a key={key} href={href} target={href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer" className="break-words font-medium text-[#2F5233] underline decoration-[#9BB49A] underline-offset-2 hover:text-[#1E3B21] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2F5233]">{renderInline(link[1], key, depth + 1)}</a>
        : token);
    } else if (token.startsWith('`')) {
      parts.push(<code key={key} className="rounded bg-[#EAF0E9] px-1.5 py-0.5 font-mono text-[0.9em] text-[#263B28]">{token.slice(1, -1)}</code>);
    } else if (token.startsWith('**') || token.startsWith('__')) {
      parts.push(<strong key={key} className="font-semibold text-[#252820]">{renderInline(token.slice(2, -2), key, depth + 1)}</strong>);
    } else if (token.startsWith('~~')) {
      parts.push(<del key={key}>{renderInline(token.slice(2, -2), key, depth + 1)}</del>);
    } else {
      parts.push(<em key={key}>{renderInline(token.slice(1, -1), key, depth + 1)}</em>);
    }
    cursor = start + token.length;
  }

  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts.length ? parts : text;
}

function startsBlock(line) {
  return /^\s{0,3}(?:#{1,6}\s|```|>\s?|[-*+]\s+|\d+[.)]\s+)(.*)$/.test(line) ||
    /^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/.test(line);
}

function renderBlocks(source) {
  const lines = String(source ?? '').replace(/\r\n?/g, '\n').split('\n');
  const blocks = [];
  let paragraph = [];
  let index = 0;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ type: 'paragraph', lines: paragraph });
    paragraph = [];
  };

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      flushParagraph();
      index += 1;
      continue;
    }

    const fence = line.match(/^\s{0,3}```([^`]*)$/);
    if (fence) {
      flushParagraph();
      index += 1;
      const code = [];
      while (index < lines.length && !/^\s{0,3}```\s*$/.test(lines[index])) code.push(lines[index++]);
      if (index < lines.length) index += 1;
      blocks.push({ type: 'code', text: code.join('\n') });
      continue;
    }

    const heading = line.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
    if (heading) {
      flushParagraph();
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] });
      index += 1;
      continue;
    }

    if (/^\s{0,3}(?:(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,})$/.test(line)) {
      flushParagraph();
      blocks.push({ type: 'rule' });
      index += 1;
      continue;
    }

    if (/^\s{0,3}>/.test(line)) {
      flushParagraph();
      const quote = [];
      while (index < lines.length && /^\s{0,3}>/.test(lines[index])) {
        quote.push(lines[index++].replace(/^\s{0,3}>\s?/, ''));
      }
      blocks.push({ type: 'quote', lines: quote });
      continue;
    }

    const unordered = line.match(/^\s{0,3}([-*+])\s+(.+)$/);
    const ordered = line.match(/^\s{0,3}(\d+)[.)]\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const type = unordered ? 'unordered' : 'ordered';
      const items = [];
      while (index < lines.length) {
        const item = type === 'unordered'
          ? lines[index].match(/^\s{0,3}[-*+]\s+(.+)$/)
          : lines[index].match(/^\s{0,3}\d+[.)]\s+(.+)$/);
        if (!item) break;
        items.push(item[1]);
        index += 1;
      }
      blocks.push({ type, items });
      continue;
    }

    if (startsBlock(line)) {
      flushParagraph();
      paragraph.push(line);
      index += 1;
      continue;
    }

    paragraph.push(line.trim());
    index += 1;
  }

  flushParagraph();
  return blocks;
}

export default function ChatMarkdown({ content }) {
  const blocks = renderBlocks(content);

  return (
    <div className="space-y-3 break-words text-base leading-7 [overflow-wrap:anywhere] sm:text-sm sm:leading-6">
      {blocks.map((block, index) => {
        const key = `block-${index}`;
        if (block.type === 'heading') {
          const Tag = block.level <= 2 ? 'h3' : 'h4';
          return <Tag key={key} className="font-semibold leading-snug text-[#252820]">{renderInline(block.text, key)}</Tag>;
        }
        if (block.type === 'unordered' || block.type === 'ordered') {
          const Tag = block.type === 'unordered' ? 'ul' : 'ol';
          const marker = block.type === 'unordered' ? 'list-disc' : 'list-decimal';
          return <Tag key={key} className={`${marker} space-y-1 pl-5 marker:text-[#557A55]`}>
            {block.items.map((item, itemIndex) => <li key={`${key}-${itemIndex}`} className="pl-0.5">{renderInline(item, `${key}-${itemIndex}`)}</li>)}
          </Tag>;
        }
        if (block.type === 'quote') {
          return <blockquote key={key} className="border-l-2 border-[#9BB49A] pl-3 text-[#51584C]">{block.lines.map((line, lineIndex) => <p key={`${key}-${lineIndex}`}>{renderInline(line, `${key}-${lineIndex}`)}</p>)}</blockquote>;
        }
        if (block.type === 'code') {
          return <pre key={key} className="max-w-full overflow-x-auto rounded-lg bg-[#263B28] p-3 font-mono text-xs leading-5 text-white"><code>{block.text}</code></pre>;
        }
        if (block.type === 'rule') return <hr key={key} className="border-[#DCE3D5]" />;
        return <p key={key}>{block.lines.map((line, lineIndex) => <span key={`${key}-${lineIndex}`}>{lineIndex > 0 && <>{' '}</>}{renderInline(line, `${key}-${lineIndex}`)}</span>)}</p>;
      })}
    </div>
  );
}
