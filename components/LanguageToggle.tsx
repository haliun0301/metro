import React from 'react';

import type { AppLanguage } from '../hooks/useAppLanguage';

interface LanguageToggleProps {
  language: AppLanguage;
  onChange: (language: AppLanguage) => void;
}

export default function LanguageToggle({ language, onChange }: LanguageToggleProps) {
  return (
    <div className="fixed left-4 top-4 z-40 flex items-center gap-1.5 rounded-full bg-white/92 p-1.5 shadow-lg backdrop-blur-sm md:left-6 md:top-6 md:gap-2 md:p-2">
      <button
        type="button"
        onClick={() => onChange('en')}
        className="rounded-full px-3 py-1.5 text-sm font-semibold transition-colors md:px-4 md:py-2"
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
        className="rounded-full px-3 py-1.5 text-sm font-semibold transition-colors md:px-4 md:py-2"
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
