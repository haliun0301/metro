import type { ButtonHTMLAttributes, ReactNode } from 'react';

type PillButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  active?: boolean;
  tone?: 'primary' | 'soft' | 'outline';
};

export default function PillButton({ children, active = false, tone = 'soft', className = '', ...props }: PillButtonProps) {
  const toneClass = active || tone === 'primary'
    ? 'border-transparent bg-[var(--color-primary)] text-[var(--color-on-primary)]'
    : tone === 'outline'
      ? 'border-[var(--color-hairline)] bg-[var(--color-canvas)] text-[var(--color-ink)]'
      : 'border-transparent bg-[var(--color-canvas-soft)] text-[var(--color-ink)]';

  return (
    <button
      type="button"
      aria-pressed={active || undefined}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-control)] active:translate-y-0 active:scale-[0.98] ${toneClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
