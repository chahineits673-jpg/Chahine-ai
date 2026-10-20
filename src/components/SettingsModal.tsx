import React, { useState } from 'react';
import { X, Sliders, ShieldCheck, Download, Trash2, RotateCcw } from 'lucide-react';
import { ModelSettings, ChatSession } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ModelSettings;
  onSaveSettings: (settings: ModelSettings) => void;
  currentSession?: ChatSession;
  allSessions: ChatSession[];
  onClearAll: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  currentSession,
  allSessions,
  onClearAll,
}) => {
  const [temperature, setTemperature] = useState(settings.temperature);
  const [systemInstruction, setSystemInstruction] = useState(
    settings.systemInstruction || ''
  );

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveSettings({
      temperature,
      systemInstruction: systemInstruction.trim() || undefined,
    });
    onClose();
  };

  const handleExportCurrent = () => {
    if (!currentSession) return;
    const textContent = currentSession.messages
      .map(
        (m) =>
          `[${m.role === 'user' ? 'المستخدم' : 'شاهين AI'} - ${new Date(
            m.timestamp
          ).toLocaleString('ar-EG')}]:\n${m.content}\n`
      )
      .join('\n---\n\n');

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chahine-ai-${currentSession.title.slice(0, 20)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportAllJSON = () => {
    const dataStr = JSON.stringify(allSessions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chahine-ai-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders size={18} className="text-teal-400" />
            <h3 className="font-bold text-base text-white">إعدادات شاهين AI</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Temperature Setting */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-200">
                درجة الإبداع (Temperature)
              </label>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-400">
                {temperature.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1.5"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>دقيق ومنطقي (0.2)</span>
              <span>متوازن وموصى به (0.7)</span>
              <span>شديد الإبداع (1.2)</span>
            </div>
          </div>

          {/* System Instruction */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-200">
              تعليمات النظام المخصصة (اختياري)
            </label>
            <textarea
              value={systemInstruction}
              onChange={(e) => setSystemInstruction(e.target.value)}
              placeholder="اكتب تعليمات مخصصة لأسلوب شاهين AI (مثلاً: أجب دوماً باختصار شديد، أو ركز على أمثلة بايثون)..."
              rows={3}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
            <button
              type="button"
              onClick={() => setSystemInstruction('')}
              className="text-[11px] text-slate-400 hover:text-teal-400 flex items-center gap-1"
            >
              <RotateCcw size={11} />
              <span>استعادة التوجيه الافتراضي</span>
            </button>
          </div>

          {/* Model & Security Info */}
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
              <ShieldCheck size={16} />
              <span>الأمان وحماية المفاتيح</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              تتم معالجة كافة الطلبات عبر خادم خلفي مؤمّن. مفتاح API لا يصل أبداً إلى المتصفح وفق أعلى معايير أمان التطبيقات.
            </p>
            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80 font-mono">
              <span>النموذج النشط:</span>
              <span className="text-teal-300">gemini-3.8-flash</span>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-300">تصدير البيانات</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExportCurrent}
                disabled={!currentSession || currentSession.messages.length === 0}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium border border-slate-700/60 disabled:opacity-50 cursor-pointer"
              >
                <Download size={13} />
                <span>تصدير المحادثة الحالية</span>
              </button>
              <button
                type="button"
                onClick={handleExportAllJSON}
                disabled={allSessions.length === 0}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium border border-slate-700/60 disabled:opacity-50 cursor-pointer"
              >
                <Download size={13} />
                <span>نسخ احتياطي لكل السجل</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 cursor-pointer"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-medium bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white rounded-xl shadow-md cursor-pointer"
          >
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
};
