import type { CSSProperties, ReactNode } from 'react';

type PageHeaderProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  chapterColor?: string;
  actions?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
  chapterColor = 'var(--color-primary)',
  actions,
  className = '',
  style,
}: PageHeaderProps) {
  return (
    <header className={`relative py-[var(--space-section-lg)] ${className}`} style={style}>
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-4xl">
          {eyebrow && (
            <p
              className="mb-5 text-[var(--text-label)] font-semibold uppercase tracking-[0.28em]"
              style={{ color: chapterColor }}
            >
              {eyebrow}
            </p>
          )}
          <h1 className="text-5xl font-semibold leading-none tracking-[-0.05em] md:text-7xl [text-wrap:balance]">
            {title}
          </h1>
          {description && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-text-muted)] md:text-xl">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </header>
  );
}
