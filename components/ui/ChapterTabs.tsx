import type { ReactNode } from 'react';

export type ChapterTab = {
  id: string;
  label: ReactNode;
};

type ChapterTabsProps = {
  tabs: ChapterTab[];
  activeId: string;
  onChange: (id: string) => void;
  accent?: string;
  className?: string;
};

export default function ChapterTabs({ tabs, activeId, onChange, accent = 'var(--color-primary)', className = '' }: ChapterTabsProps) {
  return (
    <div className={`flex flex-wrap gap-1 rounded-full bg-[var(--color-canvas-soft)] p-1 ${className}`.trim()} role="tablist">
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className="min-h-10 flex-1 rounded-full px-4 text-sm font-semibold text-[var(--color-ink)] transition duration-200 hover:bg-[var(--color-canvas)] focus-visible:outline-offset-0"
            style={active ? { backgroundColor: accent, color: accent === 'var(--color-people)' || accent === 'var(--color-ink)' ? 'var(--color-canvas)' : 'var(--color-on-primary)' } : undefined}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
