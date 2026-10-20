import type { ButtonHTMLAttributes, ReactNode } from 'react';

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  label: string;
  size?: 'sm' | 'md' | 'lg';
};

export default function IconButton({ children, label, size = 'md', className = '', ...props }: IconButtonProps) {
  const sizeClass = size === 'sm' ? 'h-9 w-9' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10';

  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex ${sizeClass} items-center justify-center rounded-full border border-[var(--color-hairline)] bg-[var(--color-canvas-soft)] text-[var(--color-ink)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-canvas)] hover:shadow-[var(--shadow-control)] active:translate-y-0 active:scale-[0.98] ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
