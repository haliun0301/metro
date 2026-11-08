import { forwardRef, type ReactNode } from 'react';

type CityThemeCardProps = {
  index: number;
  title: ReactNode;
  format: string;
  formatColor: string;
  active?: boolean;
  onClick: () => void;
};

const CityThemeCard = forwardRef<HTMLButtonElement, CityThemeCardProps>(function CityThemeCard({ index, title, format, formatColor, active = false, onClick }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`min-h-[4.25rem] w-full shrink-0 rounded-[var(--radius-sm)] border px-3.5 py-2.5 text-left transition duration-200 ease-out hover:translate-x-0.5 active:translate-x-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-city)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)] ${
        active
          ? 'border-[var(--color-city)]/55 bg-[var(--color-city)]/10 text-[var(--color-ink)] shadow-[var(--shadow-control)]'
          : 'border-[var(--color-hairline)] bg-[var(--color-canvas)] text-[var(--color-ink)] hover:border-[var(--color-city)]/45 hover:bg-[var(--color-canvas-soft)]'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className={`text-[var(--text-label)] font-semibold tabular-nums tracking-[0.16em] ${active ? 'text-[var(--color-city)]' : 'text-[var(--color-text-muted)]'}`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span
          className="rounded-[4px] border px-1.5 py-0.5 text-[0.6rem] font-semibold leading-none tracking-[0.06em]"
          style={{
            borderColor: `color-mix(in srgb, ${formatColor} 42%, var(--color-hairline))`,
            backgroundColor: `color-mix(in srgb, ${formatColor} 11%, var(--color-canvas))`,
            color: `color-mix(in srgb, ${formatColor} 45%, var(--color-ink))`,
          }}
        >
          {format}
        </span>
      </div>
      <div className="mt-1 line-clamp-2 text-sm font-semibold leading-5">{title}</div>
    </button>
  );
});

CityThemeCard.displayName = 'CityThemeCard';

export default CityThemeCard;
