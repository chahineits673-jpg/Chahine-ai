import React from 'react';
import { Code, PenTool, Lightbulb, GraduationCap, ArrowUpLeft } from 'lucide-react';
import { ChahineLogo } from './ChahineLogo';

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt }) => {
  const suggestions = [
    {
      category: 'البرمجة والتقنية',
      icon: <Code size={18} className="text-teal-400" />,
      prompts: [
        'اكتب كود بايثون لقراءة ملف CSV واستخراج الإحصائيات مع رسم بياني',
        'اشرح لي الفرق بين React و Vue ومتى أختار كلاً منهما؟',
      ],
    },
    {
      category: 'الكتابة والإبداع',
      icon: <PenTool size={18} className="text-emerald-400" />,
      prompts: [
        'صغ رسالة بريد إلكتروني رسمية لتقديم اقتراح شراكة استراتيجية',
        'اكتب مقدمة مشوقة لكتاب يتناول أسرار الذكاء الاصطناعي',
      ],
    },
    {
      category: 'التخطيط والأعمال',
      icon: <Lightbulb size={18} className="text-amber-400" />,
      prompts: [
        'ضع خطة عمل لمدة 90 يوماً لإطلاق تطبيق هاتف ناجح',
        'ما هي استراتيجيات التسويق بالمحتوى الأكثر فاعلية للشركات الناشئة؟',
      ],
    },
    {
      category: 'العلوم والمعرفة',
      icon: <GraduationCap size={18} className="text-cyan-400" />,
      prompts: [
        'اشرح الحوسبة الكمومية بأسلوب مبسط لأي شخص غير متخصص',
        'كيف تعمل النماذج اللغوية الضخمة (LLMs) في فهم اللغة وتوليدها؟',
      ],
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-4xl mx-auto w-full select-none">
      {/* Brand Hero */}
      <div className="text-center space-y-4 mb-8 sm:mb-10 animate-in fade-in duration-500">
        <div className="flex justify-center">
          <ChahineLogo size="xl" showText={false} />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            مرحباً بك، أنا <span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent">شاهين AI</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            مساعدك الذكي المستوحى من دقة الصقر شاهين وسرعته. اسألني في البرمجة، التحليل، الكتابة، والمعرفة العامة.
          </p>
        </div>
      </div>

      {/* Suggestion Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 w-full">
        {suggestions.map((group, groupIdx) => (
          <div
            key={groupIdx}
            className="rounded-2xl p-4 bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 hover:border-teal-500/40 transition-all space-y-3"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20">
                {group.icon}
              </span>
              <span>{group.category}</span>
            </div>

            <div className="space-y-1.5">
              {group.prompts.map((prompt, promptIdx) => (
                <button
                  key={promptIdx}
                  type="button"
                  onClick={() => onSelectPrompt(prompt)}
                  className="w-full text-right p-2.5 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300 bg-white/60 dark:bg-slate-800/40 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200/60 dark:border-slate-700/40 hover:border-teal-400/30 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <span className="line-clamp-2 leading-relaxed">{prompt}</span>
                  <ArrowUpLeft
                    size={14}
                    className="shrink-0 text-slate-400 group-hover:text-teal-500 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
