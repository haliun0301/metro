import { useRef, useState, useEffect, startTransition, type ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';
import type { TimelineEvent } from '../../utils/textAnalyzer';

interface TimelineDiagramProps {
  events: TimelineEvent[];
  theme?: 'dark' | 'light';
  compact?: boolean;
  renderContent?: (text: string) => ReactNode;
}

const PALETTE = ['#3EB181', '#2A8BD0', '#EAAF73', '#D4607A', '#8B5CF6', '#F59E0B'];

function TimelineDiagram({ events, theme = 'light', compact = false, renderContent }: TimelineDiagramProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (inView && !animate) {
      const t = setTimeout(() => startTransition(() => setAnimate(true)), 100);
      return () => clearTimeout(t);
    }
  }, [inView, animate]);

  const isLight = theme === 'light';
  const textColor = isLight ? '#1a1a2e' : '#f1f1f3';
  const mutedColor = isLight ? '#71717a' : '#a1a1aa';
  const lineColor = isLight ? '#d4d4d8' : '#3f3f46';
  const markerTextColor = isLight ? '#111827' : '#f3f4f6';
  const markerColumnWidth = compact ? 52 : 64;

  return (
    <div ref={ref} style={{ width: '100%', position: 'relative' }}>
      {/* Vertical line */}
      <div
        style={{
          position: 'absolute',
          left: markerColumnWidth / 2,
          top: compact ? 24 : 32,
          bottom: compact ? 20 : 28,
          width: 2,
          backgroundColor: lineColor,
        }}
      />

      {events.map((event, i) => {
        const markerLabel = String(event.year);

        return (
          <motion.div
            key={i}
            initial={animate ? { opacity: 0, x: -16 } : undefined}
            animate={animate ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.45, delay: i * 0.1, ease: 'easeOut' }}
            style={{
              display: 'flex',
              gap: compact ? 12 : 20,
              paddingBottom: i < events.length - 1 ? (compact ? 24 : 36) : 0,
              position: 'relative',
            }}
          >
            {/* Timeline year marker */}
            <div
              style={{
                width: markerColumnWidth,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                zIndex: 1,
              }}
            >
              <span
                style={{
                  fontSize: compact ? 9 : 11,
                  fontWeight: 700,
                  color: markerTextColor,
                  fontFamily: 'var(--font-sans)',
                  lineHeight: 1,
                  letterSpacing: '0.02em',
                }}
              >
                {markerLabel}
              </span>
            </div>

            {/* Event content — full text, never truncated */}
            <div style={{ flex: 1, minWidth: 0, paddingTop: compact ? 2 : 6 }}>
              <div
                style={{
                  fontSize: compact ? 11 : 13,
                  lineHeight: compact ? 1.5 : 1.65,
                  color: textColor,
                  fontFamily: 'var(--font-sans)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {renderContent ? renderContent(event.content) : event.content}
              </div>
            </div>
          </motion.div>
        );
      })}

      {events.length === 0 && (
        <div
          style={{
            padding: compact ? 16 : 24,
            textAlign: 'center',
            color: mutedColor,
            fontSize: compact ? 11 : 13,
            fontFamily: 'var(--font-sans)',
          }}
        >
          No timeline events found in this text.
        </div>
      )}
    </div>
  );
}

export default TimelineDiagram;
