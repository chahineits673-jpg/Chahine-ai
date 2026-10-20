import React, { useState } from 'react';
import {
  Plus,
  MessageSquare,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Moon,
  Sun,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { ChatSession, ThemeMode } from '../types';
import { ChahineLogo } from './ChahineLogo';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onClearAll: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  onClearAll,
  theme,
  onToggleTheme,
  isOpen,
  onCloseMobile,
  onOpenSettings,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startEditing = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const saveEditing = (e: React.MouseEvent | React.FormEvent, id: string) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 right-0 z-50 w-72 md:w-80 bg-slate-900 dark:bg-slate-950 border-l border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        } shadow-2xl md:shadow-none select-none`}
      >
        {/* Header & Logo */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <ChahineLogo size="md" />
          <button
            onClick={onCloseMobile}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="إغلاق القائمة"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action: New Chat Button */}
        <div className="p-3.5 pb-2">
          <button
            onClick={() => {
              onNewChat();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-medium shadow-md shadow-teal-500/10 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus size={18} />
            <span>محادثة جديدة</span>
          </button>
        </div>

        {/* Search Filter */}
        {sessions.length > 2 && (
          <div className="px-3.5 py-1.5">
            <div className="relative">
              <Search
                size={15}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في المحادثات..."
                className="w-full bg-slate-800/60 text-slate-200 placeholder-slate-500 text-xs py-2 pr-9 pl-3 rounded-lg border border-slate-700/50 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Conversation Sessions List */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            سجل المحادثات ({sessions.length})
          </div>

          {filteredSessions.length === 0 ? (
            <div className="text-center py-10 px-4 text-slate-500 text-xs">
              {searchQuery ? 'لا توجد نتائج مطابقة' : 'لا توجد محادثات سابقة حتى الآن'}
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === currentSessionId;
              const isEditing = editingId === session.id;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    onCloseMobile();
                  }}
                  className={`group relative flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                    isActive
                      ? 'bg-slate-800/90 text-teal-400 font-medium shadow-xs border border-teal-500/20'
                      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0">
                    <MessageSquare
                      size={16}
                      className={isActive ? 'text-teal-400 shrink-0' : 'text-slate-400 shrink-0'}
                    />
                    {isEditing ? (
                      <form
                        onSubmit={(e) => saveEditing(e, session.id)}
                        className="flex-1 flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full bg-slate-700 text-white text-xs px-2 py-1 rounded border border-teal-500 focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="submit"
                          className="p-1 text-teal-400 hover:text-white"
                          title="حفظ"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="p-1 text-slate-400 hover:text-white"
                          title="إلغاء"
                        >
                          <X size={14} />
                        </button>
                      </form>
                    ) : (
                      <span className="truncate text-xs font-normal leading-relaxed">
                        {session.title || 'محادثة بدون عنوان'}
                      </span>
                    )}
                  </div>

                  {/* Action buttons (Rename / Delete) */}
                  {!isEditing && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={(e) => startEditing(e, session)}
                        className="p-1 text-slate-400 hover:text-teal-300 rounded hover:bg-slate-700/60"
                        title="تعديل العنوان"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-700/60"
                        title="حذف المحادثة"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info & controls */}
        <div className="p-3 border-t border-slate-800/80 space-y-2 bg-slate-950/60">
          {/* Quick Settings & Theme */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={onToggleTheme}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer border border-slate-800"
              title="تبديل المظهر"
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={15} className="text-amber-400" />
                  <span>الوضع الفاتح</span>
                </>
              ) : (
                <>
                  <Moon size={15} className="text-teal-400" />
                  <span>الوضع الداكن</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenSettings}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer border border-slate-800"
            >
              <SlidersHorizontal size={15} className="text-teal-400" />
              <span>الإعدادات</span>
            </button>
          </div>

          {/* Model Status Badge */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-800/60 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-slate-300">Gemini 3.8 Flash</span>
            </div>
            <span className="text-[10px] text-teal-400 font-medium">نشط وآمن</span>
          </div>

          {sessions.length > 0 && (
            <button
              onClick={onClearAll}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 size={12} />
              <span>مسح جميع المحادثات</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
