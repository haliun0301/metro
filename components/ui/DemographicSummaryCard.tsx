import type { ReactNode } from 'react';

type DemographicSummaryCardProps = {
  title: ReactNode;
  value: ReactNode;
  detail?: ReactNode;
  accent?: string;
  selected?: boolean;
  onClick?: () => void;
};

export default function DemographicSummaryCard({
  title,
  value,
  detail,
  accent = 'var(--color-people)',
  selected = false,
  onClick,
}: DemographicSummaryCardProps) {
  const className = `flex min-h-32 flex-col justify-between rounded-2xl border p-4 text-left transition duration-200 ${
    selected
      ? 'border-[var(--color-ink)] bg-[var(--color-canvas)] shadow-[var(--shadow-control)]'
      : 'border-[var(--color-hairline)] bg-[var(--color-canvas)] hover:-translate-y-0.5 hover:border-[var(--color-ink)]'
  }`;

  if (onClick) {
    return (
      <button type="button" aria-pressed={selected} onClick={onClick} className={className}>
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">{title}</span>
        <span className="mt-4 text-4xl font-semibold leading-none tabular-nums" style={{ color: accent }}>
          {value}
        </span>
        {detail && <span className="mt-3 text-xs leading-5 text-[var(--color-text-muted)]">{detail}</span>}
      </button>
    );
  }

  return (
    <div className={className}>
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-muted)]">{title}</span>
      <span className="mt-4 text-4xl font-semibold leading-none tabular-nums" style={{ color: accent }}>
        {value}
      </span>
      {detail && <span className="mt-3 text-xs leading-5 text-[var(--color-text-muted)]">{detail}</span>}
    </div>
  );
}
