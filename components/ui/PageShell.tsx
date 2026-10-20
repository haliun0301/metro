import type { CSSProperties, HTMLAttributes, PropsWithChildren } from 'react';

export type PageTheme = {
  chapterColor?: string;
  backgroundColor?: string;
  color?: string;
};

type PageShellProps = PropsWithChildren<{
  theme?: PageTheme;
  className?: string;
  style?: CSSProperties;
}> & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

export default function PageShell({ children, theme, className = '', style, ...props }: PageShellProps) {
  return (
    <div
      className={`min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] ${className}`}
      style={{
        '--page-chapter-color': theme?.chapterColor ?? 'var(--color-primary)',
        backgroundColor: theme?.backgroundColor,
        color: theme?.color,
        ...style,
      } as CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
}
