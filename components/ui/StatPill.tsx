type StatPillProps = {
  label: string;
  value?: string;
  className?: string;
  tone?: 'dark' | 'light';
};

export default function StatPill({ label, value, className = '', tone = 'dark' }: StatPillProps) {
  const isDark = tone === 'dark';

  return (
    <div className={`rounded-[var(--radius-sm)] px-3 py-3 ${className}`}>
      <p className={`text-[10px] font-bold uppercase tracking-[0.12em] ${isDark ? 'text-white/62' : 'text-[var(--color-text-muted)]'}`}>
        {label}
      </p>
      <p className={`mt-1 text-sm font-semibold leading-snug ${isDark ? 'text-white' : 'text-[var(--color-ink)]'}`}>
        {value || '—'}
      </p>
    </div>
  );
}
