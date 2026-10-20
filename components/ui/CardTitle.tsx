import type { ReactNode } from 'react';

type CardTitleProps = {
  children: ReactNode;
  size?: 'sm' | 'md';
  color?: string;
  className?: string;
};

export default function CardTitle({ children, size = 'sm', color = 'var(--color-ink)', className = '' }: CardTitleProps) {
  return (
    <h3
      className={`w-full text-center font-semibold ${size === 'md' ? 'mb-5 text-base' : 'mb-1 text-[13px]'} ${className}`}
      style={{ color }}
    >
      {children}
    </h3>
  );
}
