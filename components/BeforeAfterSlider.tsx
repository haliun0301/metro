import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type LocalizedLabel = {
  en: string;
  zh: string;
};

export interface BeforeAfterOption {
  id: string;
  label: LocalizedLabel;
  src: string;
}

interface BeforeAfterSliderProps {
  language: 'en' | 'zh';
  beforeOptions: BeforeAfterOption[];
  afterOptions: BeforeAfterOption[];
  initialBeforeId?: string;
  initialAfterId?: string;
  initialPosition?: number;
  height?: number;
  showHint?: boolean;
  showOptionControls?: boolean;
  fullViewport?: boolean;
  squareCorners?: boolean;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function LoadingSpinner() {
  return (
    <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white/90" />
  );
}

function BeforeAfterSlider({
  language,
  beforeOptions,
  afterOptions,
  initialBeforeId,
  initialAfterId,
  initialPosition = 50,
  height = 460,
  showHint = true,
  showOptionControls = true,
  fullViewport = false,
  squareCorners = false,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState(clamp(initialPosition, 0, 100));
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [leftMenuOpen, setLeftMenuOpen] = useState(false);
  const [rightMenuOpen, setRightMenuOpen] = useState(false);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [leftLoading, setLeftLoading] = useState(false);
  const [rightLoading, setRightLoading] = useState(false);
  const [frameWidth, setFrameWidth] = useState(0);
  const [beforeAspectRatio, setBeforeAspectRatio] = useState<number | null>(null);
  const [afterAspectRatio, setAfterAspectRatio] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const defaultBefore = useMemo(
    () => beforeOptions.find((option) => option.id === initialBeforeId) ?? beforeOptions[0],
    [beforeOptions, initialBeforeId]
  );
  const defaultAfter = useMemo(
    () => afterOptions.find((option) => option.id === initialAfterId) ?? afterOptions[0],
    [afterOptions, initialAfterId]
  );

  const [beforeId, setBeforeId] = useState(defaultBefore?.id ?? '');
  const [afterId, setAfterId] = useState(defaultAfter?.id ?? '');

  const beforeOption = beforeOptions.find((option) => option.id === beforeId) ?? defaultBefore;
  const afterOption = afterOptions.find((option) => option.id === afterId) ?? defaultAfter;
  const beforeSrc = beforeOption?.src || '';
  const afterSrc = afterOption?.src || '';

  useEffect(() => {
    if (!beforeOptions.length) {
      setBeforeId('');
      return;
    }

    const hasCurrent = beforeOptions.some((option) => option.id === beforeId);
    if (!hasCurrent) {
      setBeforeId(defaultBefore?.id ?? beforeOptions[0]?.id ?? '');
    }
  }, [beforeOptions, beforeId, defaultBefore]);

  useEffect(() => {
    if (!afterOptions.length) {
      setAfterId('');
      return;
    }

    const hasCurrent = afterOptions.some((option) => option.id === afterId);
    if (!hasCurrent) {
      setAfterId(defaultAfter?.id ?? afterOptions[0]?.id ?? '');
    }
  }, [afterOptions, afterId, defaultAfter]);

  const uiCopy = {
    en: {
      before: 'Before image',
      after: 'After image',
      presets: 'Presets',
      divider: 'Comparison divider',
      hint: 'Hover to move the divider automatically, or drag the center handle.',
      expand: 'Expand',
      exit: 'Exit',
    },
    zh: {
      before: '前期影像',
      after: '后期影像',
      presets: '预设图像',
      divider: '对比分割线',
      hint: '将鼠标悬停在组件上可自动移动分隔线，也可拖动中心手柄。',
      expand: '全屏',
      exit: '退出',
    },
  } as const;

  const copy = uiCopy[language];

  const updatePositionFromPointer = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(clamp(next, 0, 100));
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (event: PointerEvent) => updatePositionFromPointer(event.clientX);
    const handleUp = () => setIsDragging(false);

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [isDragging]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const updateWidth = () => setFrameWidth(frame.clientWidth);
    updateWidth();

    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(frame);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isFullscreen]);

  const handleImageLoad = (
    event: React.SyntheticEvent<HTMLImageElement>,
    side: 'left' | 'right'
  ) => {
    const image = event.currentTarget;
    const ratio = image.naturalWidth > 0 && image.naturalHeight > 0
      ? image.naturalWidth / image.naturalHeight
      : null;

    if (side === 'left') {
      setBeforeAspectRatio(ratio);
      setLeftLoading(false);
      return;
    }

    setAfterAspectRatio(ratio);
    setRightLoading(false);
  };

  const targetHeight = isFullscreen ? Math.max(height, 760) : height;
  const activeAspectRatio = afterAspectRatio ?? beforeAspectRatio ?? (16 / 9);
  const preferredWidth = targetHeight * activeAspectRatio;
  const computedWidth = frameWidth > 0
    ? (fullViewport ? frameWidth : Math.min(frameWidth, preferredWidth))
    : undefined;
  const computedHeight = fullViewport
    ? targetHeight
    : computedWidth && activeAspectRatio > 0
      ? computedWidth / activeAspectRatio
      : targetHeight;

  const Dropdown = ({
    title,
    selectedLabel,
    options,
    open,
    onOpen,
    onClose,
    onSelect,
    side,
  }: {
    title: string;
    selectedLabel: string;
    options: BeforeAfterOption[];
    open: boolean;
    onOpen: () => void;
    onClose: () => void;
    onSelect: (value: string) => void;
    side: 'left' | 'right';
  }) => (
    <div
      className="relative"
      onMouseEnter={() => {
        setIsDropdownActive(true);
        onOpen();
      }}
      onMouseLeave={() => {
        setIsDropdownActive(false);
        onClose();
      }}
    >
      <button
        type="button"
        className="min-w-[180px] rounded-2xl border border-white/15 bg-[#081522]/80 px-4 py-3 text-left backdrop-blur-md"
      >
        <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">
          {title}
        </span>
        <span className="mt-1 block truncate text-sm font-medium text-white">{selectedLabel}</span>
      </button>

      {open && (
        <div
          className={`absolute top-full z-20 mt-3 w-[240px] rounded-2xl border border-white/12 bg-[#07121d]/92 p-3 backdrop-blur-xl ${
            side === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">
            {copy.presets}
          </p>
          <div className="grid max-h-56 gap-2 overflow-y-auto pr-1">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onPointerDown={(event) => {
                  event.preventDefault();
                  onSelect(option.id);
                  onClose();
                }}
                className="rounded-xl border border-white/10 bg-white/6 px-3 py-2 text-left text-sm text-white/78 transition hover:border-cyan-300/35 hover:bg-cyan-400/10 hover:text-white"
              >
                {option.label[language]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSliderFrame = () => (
    <div
      ref={frameRef}
      className="w-full"
    >
      <div
        ref={containerRef}
        className={`group relative mx-auto overflow-hidden border border-white/12 bg-[#06121d] ${squareCorners ? 'rounded-none' : 'rounded-[28px]'}`}
        style={{ width: computedWidth, height: computedHeight }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setIsDragging(false);
        }}
        onMouseMove={(event) => {
          if (!isDragging && isHovering) {
            updatePositionFromPointer(event.clientX);
          }
        }}
      >
        <img
          src={afterSrc}
          alt={afterOption?.label[language] || copy.after}
          className="absolute inset-0 h-full w-full object-contain object-center"
          onLoad={(event) => handleImageLoad(event, 'right')}
        />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={beforeSrc}
            alt={beforeOption?.label[language] || copy.before}
            className="absolute inset-0 h-full w-full object-contain object-center"
            onLoad={(event) => handleImageLoad(event, 'left')}
          />
        </div>

        {showOptionControls && (
          <div className="absolute left-4 top-4 z-20">
            <Dropdown
              title={copy.before}
              selectedLabel={beforeOption?.label[language] || copy.before}
              options={beforeOptions}
              open={leftMenuOpen}
              onOpen={() => setLeftMenuOpen(true)}
              onClose={() => setLeftMenuOpen(false)}
              onSelect={(value) => {
                setLeftLoading(true);
                setBeforeId(value);
              }}
              side="left"
            />
          </div>
        )}

        {showOptionControls && (
          <div className="absolute right-4 top-4 z-20">
            <Dropdown
              title={copy.after}
              selectedLabel={afterOption?.label[language] || copy.after}
              options={afterOptions}
              open={rightMenuOpen}
              onOpen={() => setRightMenuOpen(true)}
              onClose={() => setRightMenuOpen(false)}
              onSelect={(value) => {
                setRightLoading(true);
                setAfterId(value);
              }}
              side="right"
            />
          </div>
        )}

        {(leftLoading || rightLoading) && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#06121d]/55 backdrop-blur-sm">
            <LoadingSpinner />
          </div>
        )}

        <div
          className="absolute inset-y-0 z-10"
          style={{ left: `calc(${position}% - 1px)` }}
          aria-label={copy.divider}
        >
          <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-white/85" />
          <button
            type="button"
            className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-white/35 bg-[#06121d]/90 text-white backdrop-blur-md"
            onPointerDown={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
          >
            <span className="text-lg">↔</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsFullscreen((prev) => !prev)}
          className="absolute right-4 bottom-14 z-20 rounded-full border border-white/22 bg-black/45 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-black/60"
        >
          {isFullscreen ? copy.exit : copy.expand}
        </button>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-[#04111d]/90 to-transparent px-5 pb-4 pt-20 text-xs uppercase tracking-[0.24em] text-white/55">
          <span>{beforeOption?.label[language] || copy.before}</span>
          <span>{afterOption?.label[language] || copy.after}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {!isFullscreen && (
        <div>
          {showHint && <p className="mb-4 text-center text-sm leading-7 text-zinc-800">{copy.hint}</p>}
          {renderSliderFrame()}
        </div>
      )}

      {isFullscreen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/92 backdrop-blur-sm [background:radial-gradient(circle_at_center,rgba(0,0,0,0.58)_0%,rgba(0,0,0,0.9)_62%,rgba(0,0,0,0.96)_100%)] p-4 md:p-8"
          onClick={() => setIsFullscreen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-[min(96vw,1500px)]"
            onClick={(event) => event.stopPropagation()}
          >
            {renderSliderFrame()}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default BeforeAfterSlider;
