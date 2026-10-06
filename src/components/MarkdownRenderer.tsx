import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  if (!content) return null;

  // Safe parsing helper for inline Markdown syntax (bold, italic, links, code)
  const parseInline = (text: string): React.ReactNode[] => {
    // Regex matches: code, links, bold, italic, auto-urls
    const pattern = /(```[\s\S]*?```|`[^`]+`|\[([^\]]+)\]\(([^)]+)\)|https?:\/\/[^\s<]+|\*\*([^*]+)\*\*|\*([^*]+)\*|__([^_]+)__|_\b([^_]+)\b)/g;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(text)) !== null) {
      const matchIndex = match.index;

      // Push text before match
      if (matchIndex > lastIndex) {
        parts.push(text.substring(lastIndex, matchIndex));
      }

      const fullMatch = match[0];

      if (fullMatch.startsWith('`')) {
        // Inline code
        const codeText = fullMatch.replace(/^`|`$/g, '');
        parts.push(
          <code key={matchIndex} className="px-1.5 py-0.5 rounded bg-theme-surface border border-theme text-xs font-mono font-semibold text-[var(--color-primary)]">
            {codeText}
          </code>
        );
      } else if (match[2] && match[3]) {
        // Custom link [text](url)
        const linkText = match[2];
        const linkUrl = match[3];
        parts.push(
          <a
            key={matchIndex}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-primary)] underline underline-offset-2 font-semibold hover:text-[var(--color-secondary)] transition-colors inline-flex items-center gap-0.5"
          >
            {linkText}
          </a>
        );
      } else if (fullMatch.startsWith('http://') || fullMatch.startsWith('https://')) {
        // Raw URL link
        parts.push(
          <a
            key={matchIndex}
            href={fullMatch}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-primary)] underline underline-offset-2 font-semibold hover:text-[var(--color-secondary)] transition-colors break-all"
          >
            {fullMatch}
          </a>
        );
      } else if (match[4] || match[6]) {
        // Bold **text** or __text__
        const boldText = match[4] || match[6];
        parts.push(
          <strong key={matchIndex} className="font-bold text-theme-primary">
            {boldText}
          </strong>
        );
      } else if (match[5] || match[7]) {
        // Italic *text* or _text_
        const italicText = match[5] || match[7];
        parts.push(
          <em key={matchIndex} className="italic text-theme-primary">
            {italicText}
          </em>
        );
      }

      lastIndex = pattern.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  // Block level parser (paragraphs, headers, blockquotes, lists, code blocks)
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check code blocks ```
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        // Close code block
        blocks.push(
          <pre key={`code-${i}`} className="p-3 my-2 rounded-xl bg-theme-base border border-theme text-xs font-mono overflow-x-auto text-[var(--color-primary)]">
            <code>{codeBlockLines.join('\n')}</code>
          </pre>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        // Open code block
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    // Headers
    if (trimmed.startsWith('# ')) {
      blocks.push(
        <h3 key={i} className="font-cinzel font-bold text-lg text-theme-primary mt-3 mb-1">
          {parseInline(trimmed.substring(2))}
        </h3>
      );
    } else if (trimmed.startsWith('## ')) {
      blocks.push(
        <h4 key={i} className="font-cinzel font-bold text-base text-theme-primary mt-2 mb-1">
          {parseInline(trimmed.substring(3))}
        </h4>
      );
    } else if (trimmed.startsWith('### ')) {
      blocks.push(
        <h5 key={i} className="font-cinzel font-semibold text-sm text-[var(--color-primary)] mt-2 mb-1">
          {parseInline(trimmed.substring(4))}
        </h5>
      );
    } else if (trimmed.startsWith('> ')) {
      // Blockquote
      blocks.push(
        <blockquote key={i} className="pl-3 py-1 my-1 border-l-4 border-[var(--color-primary)] italic text-theme-secondary bg-theme-surface/40 rounded-r-lg text-xs">
          {parseInline(trimmed.substring(2))}
        </blockquote>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      // List item
      blocks.push(
        <div key={i} className="flex items-start gap-2 my-0.5 text-xs text-theme-secondary">
          <span className="text-[var(--color-primary)] font-bold">•</span>
          <div>{parseInline(trimmed.substring(2))}</div>
        </div>
      );
    } else {
      // Regular paragraph
      blocks.push(
        <p key={i} className="my-1 text-xs sm:text-sm text-theme-primary leading-relaxed">
          {parseInline(line)}
        </p>
      );
    }
  }

  return <div className={`space-y-1.5 ${className}`}>{blocks}</div>;
}
