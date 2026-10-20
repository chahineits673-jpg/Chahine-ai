import React, { useState, useMemo } from 'react';
import { marked } from 'marked';
import { Copy, Check, Terminal } from 'lucide-react';

interface MarkdownMessageProps {
  content: string;
  isStreaming?: boolean;
}

export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({
  content,
  isStreaming,
}) => {
  // Parse markdown content to find code blocks and render them with custom UI
  // or render formatted HTML using marked.
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => {
      setCopiedCodeId((prev) => (prev === id ? null : prev));
    }, 2000);
  };

  // Configure marked options
  const tokens = useMemo(() => {
    try {
      return marked.lexer(content);
    } catch (e) {
      return [];
    }
  }, [content]);

  // If there's an issue with marked or empty content
  if (!content && isStreaming) {
    return (
      <div className="flex items-center gap-1.5 py-1 text-teal-400">
        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse [animation-delay:200ms]"></span>
        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse [animation-delay:400ms]"></span>
      </div>
    );
  }

  return (
    <div className="prose-chahine text-slate-800 dark:text-slate-100 space-y-3">
      {tokens.map((token, index) => {
        if (token.type === 'code') {
          const codeId = `code-${index}`;
          const language = token.lang || 'code';
          const codeText = token.text;

          return (
            <div
              key={codeId}
              className="my-3 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-900/90 shadow-lg text-slate-100"
            >
              {/* Header with language tag and copy button */}
              <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-950/80 border-b border-slate-800 text-xs font-mono select-none">
                <div className="flex items-center gap-2 text-slate-400">
                  <Terminal size={14} className="text-teal-400" />
                  <span className="text-slate-300 font-medium uppercase">{language}</span>
                </div>
                <button
                  onClick={() => handleCopyCode(codeText, codeId)}
                  type="button"
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors py-1 px-2 rounded-md hover:bg-slate-800/80 cursor-pointer"
                  title="نسخ الكود"
                >
                  {copiedCodeId === codeId ? (
                    <>
                      <Check size={13} className="text-teal-400" />
                      <span className="text-teal-400">تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>نسخ الكود</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code content LTR */}
              <div className="p-3.5 overflow-x-auto code-container-ltr text-sm font-mono leading-relaxed bg-[#0d1117] text-slate-200">
                <pre className="m-0 p-0 font-mono">
                  <code>{codeText}</code>
                </pre>
              </div>
            </div>
          );
        }

        // Standard token rendering via marked HTML
        try {
          const html = marked.parser([token]);
          return (
            <div
              key={index}
              dangerouslySetInnerHTML={{ __html: html }}
              className="leading-relaxed break-words"
            />
          );
        } catch {
          return (
            <p key={index} className="whitespace-pre-wrap leading-relaxed">
              {token.raw}
            </p>
          );
        }
      })}

      {/* Blinking streaming cursor */}
      {isStreaming && (
        <span className="inline-block w-2 h-4 ms-1 bg-teal-500 animate-pulse align-middle rounded-xs" />
      )}
    </div>
  );
};
