import React from 'react';

interface ChahineLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const ChahineLogo: React.FC<ChahineLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Falcon Crest Icon */}
      <div
        className={`${iconSizes[size]} relative rounded-2xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-teal-400 p-[1.5px] shadow-lg shadow-teal-500/20 flex-shrink-0 flex items-center justify-center group`}
      >
        <div className="w-full h-full bg-slate-950 dark:bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden relative">
          {/* Subtle geometric falcon shape */}
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-3/4 h-3/4 transform transition-transform group-hover:scale-110"
          >
            {/* Falcon wing left */}
            <path
              d="M10 28 C12 18, 16 12, 20 8 C18 16, 17 22, 16 28 Z"
              fill="url(#falcon-grad-1)"
              opacity="0.9"
            />
            {/* Falcon wing right */}
            <path
              d="M30 28 C28 18, 24 12, 20 8 C22 16, 23 22, 24 28 Z"
              fill="url(#falcon-grad-2)"
              opacity="0.9"
            />
            {/* Falcon Crown and Beak */}
            <path
              d="M20 7 L23 15 L20 22 L17 15 Z"
              fill="#2DD4BF"
            />
            {/* Central Falcon Core */}
            <circle cx="20" cy="18" r="2.2" fill="#FFFFFF" />
            <defs>
              <linearGradient id="falcon-grad-1" x1="10" y1="8" x2="20" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#14B8A6" />
                <stop offset="1" stopColor="#0D9488" />
              </linearGradient>
              <linearGradient id="falcon-grad-2" x1="30" y1="8" x2="20" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2DD4BF" />
                <stop offset="1" stopColor="#0F766E" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-bold tracking-tight text-slate-900 dark:text-white ${textSizes[size]}`}
            >
              شاهين
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded-md font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              AI
            </span>
          </div>
          {size !== 'sm' && (
            <span className="text-[11px] font-medium text-slate-400 tracking-wider">
              Chahine Intelligence
            </span>
          )}
        </div>
      )}
    </div>
  );
};
