import React, { useState } from 'react';
import { Copy, Check, Volume2, VolumeX, RotateCcw, AlertTriangle, User } from 'lucide-react';
import { Message } from '../types';
import { MarkdownMessage } from './MarkdownMessage';
import { ChahineLogo } from './ChahineLogo';

interface ChatMessageProps {
  message: Message;
  isLast: boolean;
  onRegenerate?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLast,
  onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    if (!message.content) return;
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.lang = 'ar-SA';
    
    // Attempt to pick an Arabic voice if available
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div
      className={`py-4 sm:py-6 px-3 sm:px-6 w-full transition-colors ${
        isUser
          ? 'bg-transparent'
          : 'bg-slate-50/50 dark:bg-slate-900/40 border-y border-slate-200/50 dark:border-slate-800/40'
      }`}
    >
      <div className="max-w-3xl mx-auto flex items-start gap-3 sm:gap-4">
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-medium shadow-xs">
              <User size={16} />
            </div>
          ) : (
            <ChahineLogo size="sm" showText={false} />
          )}
        </div>

        {/* Content & Actions */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header Name */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <span>{isUser ? 'أنت' : 'شاهين AI'}</span>
              {!isUser && (
                <span className="text-[10px] font-normal px-1.5 py-0.2 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400">
                  Falcon Core
                </span>
              )}
            </div>

            <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500">
              {new Date(message.timestamp).toLocaleTimeString('ar-EG', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* Body */}
          {message.error ? (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm flex flex-col gap-2">
              <div className="flex items-start gap-2.5">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <div className="space-y-1 flex-1">
                  <p className="font-semibold">تعذر إكمال الرد</p>
                  <p className="text-xs opacity-90 leading-relaxed">{message.content}</p>
                </div>
              </div>
              {onRegenerate && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={onRegenerate}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-xs font-medium text-rose-700 dark:text-rose-300 transition-colors cursor-pointer"
                  >
                    <RotateCcw size={13} />
                    <span>إعادة المحاولة</span>
                  </button>
                </div>
              )}
            </div>
          ) : isUser ? (
            <p className="text-slate-900 dark:text-slate-100 text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          ) : (
            <MarkdownMessage
              content={message.content}
              isStreaming={message.isStreaming}
            />
          )}

          {/* Assistant Action Buttons */}
          {!isUser && !message.isStreaming && !message.error && (
            <div className="flex items-center gap-1.5 pt-2 text-slate-500 dark:text-slate-400">
              {/* Copy button */}
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs py-1 px-2.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="نسخ الرد"
              >
                {copied ? (
                  <>
                    <Check size={13} className="text-teal-500 dark:text-teal-400" />
                    <span className="text-teal-500 dark:text-teal-400">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>نسخ</span>
                  </>
                )}
              </button>

              {/* Text to Speech */}
              {'speechSynthesis' in window && (
                <button
                  type="button"
                  onClick={handleSpeak}
                  className="flex items-center gap-1 text-xs py-1 px-2.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title={isSpeaking ? 'إيقاف القراءة' : 'استماع صوتي'}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX size={13} className="text-amber-500" />
                      <span className="text-amber-500">إيقاف</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={13} />
                      <span>قراءة</span>
                    </>
                  )}
                </button>
              )}

              {/* Regenerate for last message */}
              {isLast && onRegenerate && (
                <button
                  type="button"
                  onClick={onRegenerate}
                  className="flex items-center gap-1 text-xs py-1 px-2.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="إعادة المحاولة"
                >
                  <RotateCcw size={13} />
                  <span>إعادة الرد</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
