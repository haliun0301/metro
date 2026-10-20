import { forwardRef, type ReactNode } from 'react';

type CityThemeCardProps = {
  index: number;
  title: ReactNode;
  active?: boolean;
  onClick: () => void;
};

const CityThemeCard = forwardRef<HTMLButtonElement, CityThemeCardProps>(function CityThemeCard({ index, title, active = false, onClick }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`h-[5.25rem] w-[15rem] shrink-0 rounded-2xl border px-4 py-3 text-left transition duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 md:w-[18rem] ${
        active
          ? 'border-[var(--color-ink)] bg-[var(--color-canvas)] text-[var(--color-ink)] shadow-[var(--shadow-control)]'
          : 'border-white/20 bg-white/[0.08] text-white/80 hover:border-white/35 hover:bg-white/[0.14] hover:text-white'
      }`}
    >
      <div className="text-[var(--text-label)] font-semibold tracking-[0.16em] opacity-60">{String(index + 1).padStart(2, '0')}</div>
      <div className="mt-1.5 line-clamp-2 text-sm font-semibold leading-5">{title}</div>
    </button>
  );
});

CityThemeCard.displayName = 'CityThemeCard';

export default CityThemeCard;
