type MetroLineCheckboxRowProps = {
  label: string;
  lineColor: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
};

export default function MetroLineCheckboxRow({ label, lineColor, checked, onChange, disabled = false }: MetroLineCheckboxRowProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className="flex min-h-10 w-full items-center gap-2 rounded-xl border border-[var(--color-hairline-soft)] bg-[var(--color-canvas)] px-3 text-left transition hover:border-[var(--color-hairline)] hover:bg-[var(--color-field)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${checked ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' : 'border-[var(--color-hairline)] bg-[var(--color-canvas)]'}`}>
        {checked && (
          <svg aria-hidden="true" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
            <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="h-1.5 w-6 rounded-full" style={{ backgroundColor: lineColor, opacity: checked ? 1 : 0.35 }} />
      <span className={`truncate text-xs font-medium ${checked ? 'text-[var(--color-ink)]' : 'text-[var(--color-text-faint)]'}`}>{label}</span>
    </button>
  );
}
