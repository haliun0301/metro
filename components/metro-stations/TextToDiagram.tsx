import { type ReactNode } from 'react';

interface TextToDiagramProps {
  text: string;
  language: 'en' | 'zh';
  theme?: 'dark' | 'light';
  renderText?: (text: string) => ReactNode;
  className?: string;
}

export default function TextToDiagram({
  text,
  renderText,
  className = '',
}: TextToDiagramProps) {
  return (
    <div className={`relative ${className}`}>
      {renderText ? renderText(text) : (
        <p className="whitespace-pre-line text-justify text-sm leading-7 md:text-base md:leading-8">
          {text}
        </p>
      )}
    </div>
  );
}
