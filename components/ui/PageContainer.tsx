import type { CSSProperties, PropsWithChildren } from 'react';

type PageContainerProps = PropsWithChildren<{
  className?: string;
  style?: CSSProperties;
}>;

export default function PageContainer({ children, className = '', style }: PageContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[1440px] px-5 md:px-10 lg:px-16 ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
