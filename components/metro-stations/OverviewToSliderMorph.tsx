import { type ReactNode, type RefObject, useEffect, useRef, useState } from 'react';
import BeforeAfterSlider, { type BeforeAfterOption } from './BeforeAfterSlider';

const DEFAULT_SLIDER_HEIGHT = 500;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function ease(t: number) {
  if (t < 0.5) return 2 * t * t;
  return -1 + (4 - 2 * t) * t;
}

function segment(progress: number, start: number, end: number) {
  return clamp((progress - start) / (end - start), 0, 1);
}

interface OverviewToSliderMorphProps {
  overviewSlot: ReactNode;
  overviewCaption?: string;
  overviewAspectRatio?: number;
  beforeOptions: BeforeAfterOption[];
  afterOptions: BeforeAfterOption[];
  remoteSensingIntro?: string;
  language: 'en' | 'zh';
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  beforeLabel: string;
  afterLabel: string;
}

export default function OverviewToSliderMorph({
  overviewSlot,
  overviewCaption,
  overviewAspectRatio,
  beforeOptions,
  afterOptions,
  remoteSensingIntro,
  language,
  scrollContainerRef,
  beforeLabel,
  afterLabel,
}: OverviewToSliderMorphProps) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [frameWidth, setFrameWidth] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(900);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const outer = outerRef.current;
    if (!container || !outer) return;

    const updateProgress = () => {
      const cRect = container.getBoundingClientRect();
      const oRect = outer.getBoundingClientRect();
      const range = Math.max(1, outer.offsetHeight - container.clientHeight);
      const next = clamp(-(oRect.top - cRect.top) / range, 0, 1);
      setProgress(next);
    };

    updateProgress();
    container.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      container.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [scrollContainerRef]);

  useEffect(() => {
    const node = contentRef.current;
    if (!node || typeof ResizeObserver === 'undefined') return;

    const updateWidth = () => {
      setFrameWidth(node.clientWidth);
      setViewportHeight(window.innerHeight);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);
    window.addEventListener('resize', updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const imageScale = 1 + ease(segment(progress, 0, 0.36)) * 0.048;
  const imageBlur = ease(segment(progress, 0.16, 0.38)) * 3.5;
  const imageOpacity = 1 - ease(segment(progress, 0.24, 0.5));

  const dividerScaleY = ease(segment(progress, 0.1, 0.28));
  const dividerOpacity =
    progress < 0.34
      ? ease(segment(progress, 0.1, 0.26)) * 0.75
      : (1 - ease(segment(progress, 0.34, 0.48))) * 0.75;

  const dotScale = ease(segment(progress, 0.2, 0.36));
  const dotOpacity =
    progress < 0.36
      ? ease(segment(progress, 0.2, 0.36))
      : 1 - ease(segment(progress, 0.36, 0.5));

  const sliderOpacity = ease(segment(progress, 0.38, 0.58));
  const sliderTranslateY = (1 - ease(segment(progress, 0.38, 0.58))) * 16;
  const captionOpacity = imageOpacity * (1 - ease(segment(progress, 0.34, 0.56)));
  const badgeOpacity = ease(segment(progress, 0.44, 0.66));

  const originalHeight = overviewAspectRatio && frameWidth > 0
    ? frameWidth * overviewAspectRatio * 0.72
    : DEFAULT_SLIDER_HEIGHT;
  const maxSliderHeight = clamp(viewportHeight * 0.84, DEFAULT_SLIDER_HEIGHT + 80, 760);
  // Reach the expanded slider state before the slider becomes visible.
  const toMaxPhase = ease(segment(progress, 0.12, 0.34));
  // Shrink to default only after the slider has fully faded in.
  const toDefaultPhase = ease(segment(progress, 0.58, 0.82));
  const elevatedHeight = originalHeight + (maxSliderHeight - originalHeight) * toMaxPhase;
  const frameHeight = elevatedHeight + (DEFAULT_SLIDER_HEIGHT - elevatedHeight) * toDefaultPhase;
  const sliderHeight = Math.round(frameHeight);

  return (
    <div ref={outerRef} style={{ height: '145vh' }}>
      <div className="sticky top-0 flex h-screen items-center justify-center px-2 md:px-4">
        <div ref={contentRef} className="w-full max-w-[46rem]">
          <div
            className="relative overflow-hidden rounded-[22px]"
            style={{ height: frameHeight, transform: `scale(${imageScale})`, transformOrigin: 'center center' }}
          >
            <div
              className="absolute inset-0"
              style={{
                opacity: imageOpacity,
                filter: `blur(${imageBlur}px)`,
                transition: 'opacity 140ms linear, filter 140ms linear',
              }}
            >
              {overviewSlot}
            </div>

            <div
              className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-white"
              style={{
                opacity: dividerOpacity,
                transform: `translateX(-0.5px) scaleY(${dividerScaleY})`,
                transformOrigin: 'center center',
              }}
            />

            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-8 w-8 rounded-full border border-white/90 bg-white/20 backdrop-blur-sm"
              style={{
                opacity: dotOpacity,
                transform: `translate(-50%, -50%) scale(${dotScale})`,
              }}
            />

            <div
              className="absolute inset-0"
              style={{
                opacity: sliderOpacity,
                transform: `translateY(${sliderTranslateY}px)`,
                transition: 'opacity 160ms linear, transform 160ms linear',
              }}
            >
              <BeforeAfterSlider
                language={language}
                beforeOptions={beforeOptions}
                afterOptions={afterOptions}
                initialBeforeId={beforeOptions[0]?.id}
                initialAfterId={afterOptions[afterOptions.length - 1]?.id}
                initialPosition={50}
                height={sliderHeight}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
