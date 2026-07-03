import React from 'react';

import type { AppLanguage } from '../hooks/useAppLanguage';

interface LanguageToggleProps {
  language: AppLanguage;
  onChange: (language: AppLanguage) => void;
  fixed?: boolean;
  className?: string;
}

export default function LanguageToggle({ language, onChange, fixed = true, className = '' }: LanguageToggleProps) {
  const positioningClass = fixed ? 'fixed left-4 top-4 z-40 md:left-6 md:top-6' : '';

  return (
    <div className={`${positioningClass} ${className} flex h-12 items-center gap-1.5 rounded-full bg-white/92 px-1.5 shadow-lg backdrop-blur-sm md:gap-2 md:px-2`.trim()}>
      <button
        type="button"
        onClick={() => onChange('en')}
        className="h-9 rounded-full px-3 text-sm font-semibold transition-colors md:px-4"
        style={{
          backgroundColor: language === 'en' ? '#3EB181' : '#FFFFFF',
          color: language === 'en' ? '#FFFFFF' : '#2A383E',
          border: language === 'en' ? 'none' : '1px solid rgba(42,56,62,0.12)',
        }}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => onChange('zh')}
        className="h-9 rounded-full px-3 text-sm font-semibold transition-colors md:px-4"
        style={{
          backgroundColor: language === 'zh' ? '#3EB181' : '#FFFFFF',
          color: language === 'zh' ? '#FFFFFF' : '#2A383E',
          border: language === 'zh' ? 'none' : '1px solid rgba(42,56,62,0.12)',
        }}
      >
        中文
      </button>
    </div>
  );
}
