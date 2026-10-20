/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Menu,
  Plus,
  Moon,
  Sun,
  Share2,
  ChevronDown,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { Message, ChatSession, ThemeMode, ModelSettings } from './types';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { EmptyState } from './components/EmptyState';
import { SettingsModal } from './components/SettingsModal';
import { ChahineLogo } from './components/ChahineLogo';

const STORAGE_KEY_SESSIONS = 'chahine_ai_sessions_v1';
const STORAGE_KEY_ACTIVE_ID = 'chahine_ai_active_id_v1';
const STORAGE_KEY_THEME = 'chahine_ai_theme_v1';
const STORAGE_KEY_SETTINGS = 'chahine_ai_settings_v1';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark';
  });

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sessions state
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse sessions from localStorage:', e);
    }
    const initialSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'محادثة جديدة',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    return [initialSession];
  });

  // Current session ID
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    const savedId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
    if (savedId) return savedId;
    return sessions[0]?.id || `session-${Date.now()}`;
  });

  // Save sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, currentSessionId);
    } catch (e) {
      console.error('Failed to save sessions to localStorage:', e);
    }
  }, [sessions, currentSessionId]);

  // Model settings
  const [settings, setSettings] = useState<ModelSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { temperature: 0.7 };
  });

  const handleSaveSettings = (newSettings: ModelSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(newSettings));
  };

  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // References
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Active session object
  const currentSession = sessions.find((s) => s.id === currentSessionId) || sessions[0];
  const messages = currentSession?.messages || [];

  // Scroll to bottom smoothly
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Handle scroll events to show/hide "scroll to bottom" button
  const handleScroll = () => {
    if (!chatScrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatScrollContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
    setShowScrollBottom(!isNearBottom);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!showScrollBottom) {
      scrollToBottom();
    }
  }, [messages, showScrollBottom, scrollToBottom]);

  // Create a new chat session
  const handleNewChat = () => {
    // If current session is already empty, just select it
    if (currentSession && currentSession.messages.length === 0) {
      return;
    }
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'محادثة جديدة',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setInput('');
  };

  // Delete a session
  const handleDeleteSession = (id: string) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered.length === 0) {
        const fresh: ChatSession = {
          id: `session-${Date.now()}`,
          title: 'محادثة جديدة',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        setCurrentSessionId(fresh.id);
        return [fresh];
      }
      if (currentSessionId === id) {
        setCurrentSessionId(filtered[0].id);
      }
      return filtered;
    });
  };

  // Rename a session
  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle, updatedAt: Date.now() } : s))
    );
  };

  // Clear all sessions
  const handleClearAll = () => {
    if (window.confirm('هل أنت متأكد من مسح جميع المحادثات المخزنة؟')) {
      const fresh: ChatSession = {
        id: `session-${Date.now()}`,
        title: 'محادثة جديدة',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setSessions([fresh]);
      setCurrentSessionId(fresh.id);
      localStorage.removeItem(STORAGE_KEY_SESSIONS);
    }
  };

  // Stop active generation
  const handleStopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);

    // Mark current streaming message as finished
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== currentSessionId) return session;
        return {
          ...session,
          messages: session.messages.map((m) =>
            m.isStreaming ? { ...m, isStreaming: false } : m
          ),
        };
      })
    );
  };

  // Send message
  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || isStreaming) return;

    setInput('');

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
    };

    const assistantMsgId = `msg-${Date.now() + 1}`;
    const assistantPlaceholder: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };

    // Update session title if first message
    const isFirstMessage = messages.length === 0;
    const generatedTitle =
      isFirstMessage && textToSend.length > 0
        ? textToSend.slice(0, 32) + (textToSend.length > 32 ? '...' : '')
        : currentSession.title;

    // Prepare updated message history for API
    const updatedMessages = [...messages, userMessage];

    // Optimistically update session in state
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== currentSessionId) return session;
        return {
          ...session,
          title: generatedTitle,
          messages: [...updatedMessages, assistantPlaceholder],
          updatedAt: Date.now(),
        };
      })
    );

    setIsStreaming(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      // Connect to secure server-side streaming route
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          temperature: settings.temperature,
          systemInstruction: settings.systemInstruction,
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        throw new Error(errorJson.error || `خطأ في الخادم (${response.status})`);
      }

      if (!response.body) {
        throw new Error('لم يتم استلام تدفق بيانات من الخادم.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedContent = '';

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;

          const dataStr = trimmed.slice(5).trim();
          if (dataStr === '[DONE]') {
            break;
          }

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.error) {
              throw new Error(parsed.error);
            }
            if (parsed.text) {
              accumulatedContent += parsed.text;

              setSessions((prev) =>
                prev.map((session) => {
                  if (session.id !== currentSessionId) return session;
                  return {
                    ...session,
                    messages: session.messages.map((m) =>
                      m.id === assistantMsgId
                        ? { ...m, content: accumulatedContent, isStreaming: true }
                        : m
                    ),
                  };
                })
              );
            }
          } catch (e) {
            // Ignore parse errors on partial chunks
          }
        }
      }

      // Finalize message streaming status
      setSessions((prev) =>
        prev.map((session) => {
          if (session.id !== currentSessionId) return session;
          return {
            ...session,
            messages: session.messages.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: accumulatedContent || 'لم يتم توليد رد.',
                    isStreaming: false,
                  }
                : m
            ),
          };
        })
      );
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User aborted intentionally
        return;
      }
      console.error('Chat error:', err);

      setSessions((prev) =>
        prev.map((session) => {
          if (session.id !== currentSessionId) return session;
          return {
            ...session,
            messages: session.messages.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    content: err.message || 'حدث خطأ في الاتصال بنموذج شاهين AI.',
                    error: true,
                    isStreaming: false,
                  }
                : m
            ),
          };
        })
      );
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  // Regenerate response for the last user prompt
  const handleRegenerate = () => {
    if (isStreaming || messages.length === 0) return;

    // Find the last user message
    let lastUserIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserIndex = i;
        break;
      }
    }

    if (lastUserIndex === -1) return;

    const userPrompt = messages[lastUserIndex].content;
    // Remove subsequent messages from that point
    const truncatedHistory = messages.slice(0, lastUserIndex);

    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== currentSessionId) return session;
        return {
          ...session,
          messages: truncatedHistory,
        };
      })
    );

    // Re-send that prompt
    setTimeout(() => {
      handleSend(userPrompt);
    }, 50);
  };

  return (
    <div
      dir="rtl"
      className="flex h-screen w-screen overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans"
    >
      {/* Sidebar Navigation */}
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={setCurrentSessionId}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        onClearAll={handleClearAll}
        theme={theme}
        onToggleTheme={toggleTheme}
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Chat Workspace */}
      <main className="flex-1 flex flex-col h-full min-w-0 relative bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-950 dark:via-slate-900/30 dark:to-slate-950">
        {/* Top App Bar */}
        <header className="h-14 sm:h-16 border-b border-slate-200/80 dark:border-slate-800/80 px-3 sm:px-6 flex items-center justify-between shrink-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-30">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -mr-1 text-slate-600 dark:text-slate-300 hover:text-teal-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="فتح القائمة"
            >
              <Menu size={20} />
            </button>

            {/* Current Chat Title */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                {currentSession?.title || 'محادثة جديدة'}
              </span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* New Chat Button */}
            <button
              onClick={handleNewChat}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 font-medium text-xs transition-colors cursor-pointer border border-teal-500/20"
              title="محادثة جديدة"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">محادثة جديدة</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
              aria-label="تبديل المظهر"
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} className="text-teal-600" />
              )}
            </button>

            {/* Settings Trigger */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="إعدادات النموذج"
              aria-label="الإعدادات"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </header>

        {/* Messages Scroll Area */}
        <div
          ref={chatScrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col"
        >
          {messages.length === 0 ? (
            <EmptyState onSelectPrompt={(prompt) => handleSend(prompt)} />
          ) : (
            <div className="w-full flex-1 pb-4">
              {messages.map((msg, idx) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isLast={idx === messages.length - 1}
                  onRegenerate={handleRegenerate}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Floating Scroll-to-Bottom button */}
          {showScrollBottom && (
            <button
              onClick={() => scrollToBottom('smooth')}
              className="fixed bottom-28 left-6 sm:left-12 p-2.5 rounded-full bg-slate-900/90 dark:bg-slate-800/90 text-teal-400 border border-slate-700 shadow-xl hover:scale-110 active:scale-95 transition-all z-30 cursor-pointer"
              title="الانتقال لآخر الرسائل"
            >
              <ChevronDown size={18} />
            </button>
          )}
        </div>

        {/* Input Bar Section */}
        <footer className="shrink-0 w-full bg-gradient-to-t from-white via-white/95 to-transparent dark:from-slate-950 dark:via-slate-950/95 dark:to-transparent pt-2">
          <ChatInput
            input={input}
            setInput={setInput}
            onSend={handleSend}
            onStop={handleStopStreaming}
            isStreaming={isStreaming}
          />
        </footer>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        currentSession={currentSession}
        allSessions={sessions}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
