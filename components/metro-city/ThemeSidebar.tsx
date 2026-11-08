import { useEffect, useRef } from 'react';

import { THEMATIC_TOPICS } from '../../data/metro-city/thematicTopics';

type Language = 'en' | 'zh';

type ThemeSidebarProps = {
  language: Language;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  layout?: 'overlay' | 'reserved';
  variant?: 'default' | 'map';
};

const copy = {
  themeMenu: { en: 'Theme options', zh: '主题菜单' },
  selected: { en: 'Selected theme', zh: '当前主题' },
  none: { en: 'Select a theme to begin', zh: '选择一个主题开始' },
} as const;

const formatLabels = {
  essay: { en: 'Essay', zh: '文章' },
  map: { en: 'Map', zh: '地图' },
  category: { en: 'Category', zh: '分类' },
  'word-cloud': { en: 'Word cloud', zh: '词云' },
} as const;

const formatColors = {
  essay: 'var(--color-primary)',
  map: 'var(--color-people)',
  category: 'var(--color-accent)',
  'word-cloud': 'var(--color-city)',
} as const;

export default function ThemeSidebar({ language, selectedIndex, onSelect, layout = 'overlay', variant = 'default' }: ThemeSidebarProps) {
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const navRef = useRef<HTMLElement | null>(null);
  const selectedTheme = selectedIndex === null ? null : THEMATIC_TOPICS[selectedIndex];
  const layoutClasses = layout === 'reserved'
    ? 'relative order-last shrink-0 lg:order-none lg:inset-auto lg:ml-6'
    : 'absolute inset-x-0 bottom-0 lg:absolute lg:inset-y-0 lg:left-6 lg:right-auto';
  const surfaceClasses = variant === 'map'
    ? 'metro-map-glass-surface metro-map-glass-rail'
    : 'rounded-t-[var(--radius-md)] border-t border-white/45 bg-[var(--color-canvas)]/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),var(--shadow-panel)] backdrop-blur-[32px] backdrop-saturate-150';
  const navigationBorderClasses = variant === 'map'
    ? ''
    : 'border-t border-[var(--color-hairline)] lg:border-t-0';
  const desktopSurfaceClasses = variant === 'map'
    ? ''
    : 'lg:border-r-0 lg:border-t-0 lg:bg-transparent lg:shadow-none lg:backdrop-blur-0';

  useEffect(() => {
    const button = selectedIndex === null ? null : buttonRefs.current[selectedIndex];
    const nav = navRef.current;
    if (!button || !nav) return;

    const buttonRect = button.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    const start = isDesktop ? buttonRect.top : buttonRect.left;
    const end = isDesktop ? buttonRect.bottom : buttonRect.right;
    const navStart = isDesktop ? navRect.top : navRect.left;
    const navEnd = isDesktop ? navRect.bottom : navRect.right;
    const scrollOffset = start < navStart
      ? start - navStart
      : end > navEnd
        ? end - navEnd
        : 0;

    if (scrollOffset !== 0) {
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
      nav.scrollTo({
        [isDesktop ? 'top' : 'left']: (isDesktop ? nav.scrollTop : nav.scrollLeft) + scrollOffset,
        behavior,
      });
    }
  }, [selectedIndex]);

  return (
    <aside data-theme-sidebar className={`pointer-events-none ${layoutClasses} ${surfaceClasses} ${desktopSurfaceClasses} z-[var(--z-floating)] max-h-none w-full overflow-visible pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-1 lg:h-full lg:max-h-none lg:w-[3.5rem] lg:rounded-none lg:pb-4 lg:pt-24`}>
      <section className="pointer-events-auto flex min-h-0 flex-col lg:h-full lg:overflow-visible">
        <header className="shrink-0 px-3 pb-2 pt-2 lg:px-2 lg:pb-4 lg:pt-4">
          <div className="text-[var(--text-label)] font-bold uppercase tracking-[0.2em] text-[var(--color-city)] lg:sr-only">{copy.themeMenu[language]}</div>
          <div className="mt-2 flex items-start justify-between gap-3 lg:hidden">
            <div className="min-w-0">
              <div className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">{copy.selected[language]}</div>
              <div className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-[var(--color-ink)]">
                {selectedTheme ? selectedTheme[language] : copy.none[language]}
              </div>
            </div>
            <div className="shrink-0 rounded-[var(--radius-sm)] border border-[var(--color-hairline)] bg-[var(--color-canvas-soft)] px-2.5 py-1.5 text-xs font-semibold tabular-nums text-[var(--color-text-muted)]">
              <span className="text-[var(--color-ink)]">{selectedIndex === null ? '--' : String(selectedIndex + 1).padStart(2, '0')}</span>
              <span className="mx-1 text-[var(--color-text-faint)]">/</span>
              {String(THEMATIC_TOPICS.length).padStart(2, '0')}
            </div>
          </div>
        </header>
        <nav ref={navRef} aria-label={copy.themeMenu[language]} className={`min-h-0 overflow-x-auto overflow-y-hidden ${navigationBorderClasses} px-3 py-1 lg:flex-1 lg:overflow-visible lg:px-0 lg:py-3`}>
          <div className="relative flex w-max min-w-full gap-1.5 lg:h-full lg:w-auto lg:min-w-0 lg:flex-col lg:justify-between lg:gap-0">
            <span aria-hidden="true" className="pointer-events-none absolute bottom-[1.375rem] left-[1.375rem] top-[1.375rem] block w-px bg-[var(--color-text-faint)]/70" />
            {THEMATIC_TOPICS.map((topic, index) => (
              <button
                key={topic.en}
                ref={(element) => { buttonRefs.current[index] = element; }}
                type="button"
                aria-pressed={index === selectedIndex}
                aria-label={`${String(index + 1).padStart(2, '0')}: ${topic[language]}`}
                onClick={() => onSelect(index)}
                className="group relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-pill)] text-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-city)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)] lg:hover:z-20"
              >
                <span
                  className={`relative grid h-10 w-10 place-items-center rounded-[var(--radius-pill)] px-2 font-semibold tabular-nums tracking-[0.08em] transition-colors duration-150 motion-reduce:transition-none ${index === selectedIndex ? 'text-white shadow-[var(--shadow-control)]' : 'text-[var(--color-text-muted)]'}`}
                  style={index === selectedIndex ? { backgroundColor: formatColors[topic.format] } : undefined}
                >
                  {index === selectedIndex ? (
                    String(index + 1).padStart(2, '0')
                  ) : (
                    <>
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--color-text-faint)] transition-opacity lg:group-hover:opacity-0 lg:group-focus-visible:opacity-0 motion-reduce:transition-none" />
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 grid place-items-center rounded-full bg-[var(--color-canvas)] opacity-0 shadow-[var(--shadow-control)] transition-opacity lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100 motion-reduce:transition-none"
                        style={{ color: formatColors[topic.format] }}
                      >
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </>
                  )}
                </span>
                <span aria-hidden="true" className="pointer-events-none absolute left-full top-1/2 z-20 ml-2.5 w-max max-w-[min(22rem,calc(100vw-5rem))] -translate-y-1/2 whitespace-normal rounded-[var(--radius-sm)] border border-[var(--color-hairline)] bg-[var(--color-canvas)]/95 px-3 py-2 text-left text-sm font-semibold leading-5 text-[var(--color-ink)] opacity-0 shadow-[var(--shadow-panel)] transition-opacity duration-150 motion-reduce:transition-none lg:block lg:max-w-[min(22rem,calc(100vw-5rem))] lg:group-hover:pointer-events-auto lg:group-hover:opacity-100 lg:group-focus-visible:pointer-events-auto lg:group-focus-visible:opacity-100">
                  {topic[language]}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </section>
    </aside>
  );
}
