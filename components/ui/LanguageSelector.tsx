import type { AppLanguage } from '../../hooks/useAppLanguage';

type LanguageSelectorProps = {
  language: AppLanguage;
  onChange: (language: AppLanguage) => void;
  className?: string;
};

export default function LanguageSelector({ language, onChange, className = '' }: LanguageSelectorProps) {
  return (
    <div
      className={`inline-flex min-h-12 items-center gap-1 rounded-full border border-[var(--color-hairline)] bg-[var(--color-canvas-soft)] p-1 ${className}`.trim()}
      role="group"
      aria-label="Language"
    >
      {([
        ['en', 'EN'],
        ['zh', '中文'],
      ] as const).map(([value, label]) => (
        <button
          key={value}
          type="button"
          aria-pressed={language === value}
          onClick={() => onChange(value)}
          className={`min-w-12 rounded-full px-3 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-offset-0 ${
            language === value
              ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm'
              : 'bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-canvas)]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
