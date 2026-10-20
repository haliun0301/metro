import type { ReactNode } from 'react';

type StationSearchProps<T> = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  results: T[];
  onSelect: (result: T) => void;
  renderResult: (result: T) => ReactNode;
  getResultKey?: (result: T, index: number) => string;
  id?: string;
  className?: string;
};

export default function StationSearch<T>({
  value,
  onChange,
  placeholder,
  results,
  onSelect,
  renderResult,
  getResultKey = (_, index) => String(index),
  id = 'metro-station-search',
  className = '',
}: StationSearchProps<T>) {
  const hasResults = value.trim().length > 0 && results.length > 0;

  return (
    <div className={`relative ${className}`.trim()}>
      <label className="sr-only" htmlFor={id}>
        {placeholder}
      </label>
      <div className="flex h-12 items-center rounded-full border border-[var(--color-hairline)] bg-[var(--color-field)] px-4 transition focus-within:border-[var(--color-ink)] focus-within:bg-[var(--color-canvas)]">
        <svg aria-hidden="true" className="mr-3 h-4 w-4 shrink-0 text-[var(--color-text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4.5 4.5" strokeLinecap="round" />
        </svg>
        <input
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[var(--color-ink)] outline-none placeholder:text-[var(--color-text-muted)]"
        />
      </div>
      {hasResults && (
        <div className="absolute left-0 right-0 top-full z-[var(--z-modal)] mt-2 max-h-96 overflow-y-auto rounded-2xl border border-[var(--color-hairline-soft)] bg-[var(--color-canvas)] p-1 shadow-[var(--shadow-panel)]">
          {results.map((result, index) => (
            <button
              key={getResultKey(result, index)}
              type="button"
              onClick={() => onSelect(result)}
              className="block w-full rounded-xl px-3 py-3 text-left transition hover:bg-[var(--color-field)]"
            >
              {renderResult(result)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
