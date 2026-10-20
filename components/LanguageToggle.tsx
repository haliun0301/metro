import React from 'react';

import type { AppLanguage } from '../hooks/useAppLanguage';
import LanguageSelector from './ui/LanguageSelector';

interface LanguageToggleProps {
  language: AppLanguage;
  onChange: (language: AppLanguage) => void;
  fixed?: boolean;
  className?: string;
}

export default function LanguageToggle({ language, onChange, fixed = true, className = '' }: LanguageToggleProps) {
  const positioningClass = fixed ? 'fixed left-4 top-4 z-[var(--z-sticky)] md:left-6 md:top-6' : '';

  return <LanguageSelector language={language} onChange={onChange} className={`${positioningClass} ${className}`.trim()} />;
}
