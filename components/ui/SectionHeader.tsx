import type { ReactNode } from 'react';

type SectionHeaderProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  chapterColor?: string;
  className?: string;
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  chapterColor = 'var(--color-primary)',
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`mb-8 max-w-3xl ${className}`}>
      {eyebrow && (
        <p
          className="text-[var(--text-label)] font-semibold uppercase tracking-[0.28em]"
          style={{ color: chapterColor }}
        >
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.025em] md:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-7 text-[var(--color-text-muted)] md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
