import React, { useRef, useEffect } from 'react';
import { ArrowUp, Square, Sparkles } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: (text?: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSend,
  onStop,
  isStreaming,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && input.trim()) {
        onSend();
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 pb-3 sm:pb-5">
      <div className="relative rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-xl focus-within:border-teal-500/80 focus-within:ring-2 focus-within:ring-teal-500/20 transition-all p-2 sm:p-2.5">
        {/* Main Textarea */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اسأل شاهين أي سؤال، فكرة، أو كود برمجي..."
          disabled={disabled}
          rows={1}
          dir="auto"
          className="w-full resize-none bg-transparent px-3 py-2 text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none min-h-[44px] max-h-[180px] leading-relaxed"
        />

        {/* Bottom controls row inside input */}
        <div className="flex items-center justify-between pt-1 px-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Sparkles size={14} className="text-teal-500 dark:text-teal-400" />
            <span className="hidden sm:inline">شاهين AI 3.8</span>
          </div>

          <div className="flex items-center gap-2">
            {isStreaming ? (
              <button
                type="button"
                onClick={onStop}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-medium text-xs transition-colors cursor-pointer border border-rose-500/30"
                title="إيقاف التوليد"
              >
                <Square size={13} fill="currentColor" />
                <span>إيقاف</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onSend()}
                disabled={!input.trim() || disabled}
                className={`p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer ${
                  input.trim() && !disabled
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white shadow-md shadow-teal-500/20 scale-100 active:scale-95'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
                aria-label="إرسال الرسالة"
                title="إرسال"
              >
                <ArrowUp size={18} className="transform rotate-0" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="text-center mt-2">
        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          قد يقدم شاهين AI إجابات تحتاج للتحقق. صُمم للمساعدة الذكية في مختلف المجالات.
        </p>
      </div>
    </div>
  );
};
