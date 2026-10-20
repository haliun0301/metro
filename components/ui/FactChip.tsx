import type { ReactNode } from 'react';

type FactChipProps = {
  label: ReactNode;
  value: ReactNode;
  className?: string;
};

export default function FactChip({ label, value, className = '' }: FactChipProps) {
  return (
    <div className={`rounded-full border border-white/35 bg-transparent px-4 py-2.5 ${className}`}>
      <div className="flex items-center gap-2.5 whitespace-nowrap">
        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/72">{label}</span>
        <span className="text-sm font-semibold text-white">{value}</span>
      </div>
    </div>
  );
}
