import { type ReactNode, type RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import OverviewToSliderMorph from '../components/OverviewToSliderMorph';
import ShuibeiOverviewMap from '../components/ShuibeiOverviewMap';
import LanguageToggle from '../components/LanguageToggle';
import { stationDetailMedia } from '../data/stationDetailMedia';
import { useAppLanguage } from '../hooks/useAppLanguage';
import {
  createStationSlug,
  getStationDetailData,
  getStationHeadline,
  getStationQuickFacts,
  type StationHistoryStage,
  getStationSectionLabel,
  type StationTimelineCard,
} from '../data/stationDetails';

/*
  StationDetailPage.tsx
  - Renders a richly annotated, scroll-driven detail page for a single station or a shared station area.
  - Major parts:
    * `pageCopy` — localized UI strings
    * helper utilities (color mixing, layout math)
    * `SectionHeader` and `StickySectionFrame` — reusable UI building blocks
    * `HistoryJourneySection` — the horizontal timeline / stage UI
    * `StationDetailPage` — main exported page component that wires everything together
  - If you're editing content, look for `sections` and `template` in the station data
    (see `data/stationDetails.ts`) — the page composition is data-driven.
*/

const pageCopy = {
  en: {
    back: 'Back to metro stations',
    sharedTemplate: 'Shared area template',
    summary: 'Template summary',
    mobility: 'Mobility reading',
    development: 'Development direction',
    focus: 'Planning focus',
    related: 'Related stations in this shared page',
    stationMeta: 'Station metadata',
    coordinates: 'Coordinates',
    stationName: 'Station name',
    chineseName: 'Chinese name',
    noChineseName: 'Not provided',
    noArea: 'Not assigned',
    emptyRelated: 'This station currently does not share a detail page with other stations.',
    notFoundTitle: 'Station detail page not found',
    notFoundText:
      'This station does not have a code-based detail page yet, or the route slug is invalid.',
    returnMap: 'Return to map',
    sections: [
      'Research area map',
      'Remote sensing images',
      'History of the area',
      'Area and thematic map relationships',
      'References and notes',
    ],
    overviewTitle: 'Overview information',
    overviewDiagramTitle: 'Area overview diagram',
    overviewDiagramText:
      'A central research graphic is paired with short notes that explain the main spatial patterns visible around the station cluster.',
    remoteSensingTitle: 'Remote Sensing',
    remoteSensingText:
      'The comparison slider highlights how urban form, green structure, and station-edge conditions changed between earlier and later imagery.',
    beforeLabel: 'Before',
    afterLabel: 'After',
    dragNote: 'Drag note',
    historyJourneyLabel: 'History journey',
    historyLayoutLabel: 'Layout',
    historyLayoutHorizontal: 'Horizontal',
    historyLayoutVertical: 'Vertical',
    stationCounter: 'Station',
    stationProgress: 'Station progress',
    continuousView: 'Continuous text',
    visualizedView: 'Visualized',
    contentFlowBlock: 'Content flow',
    stageOverviewBlock: 'Stage overview',
    summaryBlock: 'Narrative',
    notesBlock: 'Notes',
    highlightsBlock: 'Key points',
    mediaBlock: 'Visual references',
    remoteSensingBlock: 'Before and after',
    showRunnerGallery: 'Show runner gallery',
    hideRunnerGallery: 'Hide runner gallery',
    sectionNav: 'Page sections',
    researchMapCaption: 'Research area overview',
    researchMapText:
      'Use this section for a scrollable, code-based research map layout with area-level notes and station grouping logic.',
    historyHint: 'Each card represents one station in the shared area and scrolls horizontally.',
    historyHintVertical: 'Each station card and phase is laid out vertically for full top-to-bottom reading.',
    thematicHint: 'These cards connect this area with thematic map narratives, text, and image content.',
    notesHint: 'Reserve these notes for citations, source tracking, and future documentation.',
  },
  zh: {
    back: '返回地铁站页面',
    sharedTemplate: '共享片区模板',
    summary: '模板摘要',
    mobility: '出行解读',
    development: '发展方向',
    focus: '规划关注点',
    related: '共享此页面的相关站点',
    stationMeta: '站点元数据',
    coordinates: '坐标',
    stationName: '站点名称',
    chineseName: '中文名称',
    noChineseName: '暂无',
    noArea: '未设置',
    emptyRelated: '该站点目前没有与其他站点共享详情页。',
    notFoundTitle: '未找到站点详情页',
    notFoundText: '该站点暂未配置代码化详情页，或当前路由标识无效。',
    returnMap: '返回地图',
    sections: ['研究片区地图', '遥感影像', '片区历史', '片区与专题地图关系', '参考资料与注释'],
    overviewTitle: '总览信息',
    overviewDiagramTitle: '片区总览图解',
    overviewDiagramText: '以中央研究图示为核心，配合周边简短注释，说明站点片区中的主要空间结构与变化线索。',
    remoteSensingTitle: '遥感分析',
    remoteSensingText: '对比滑块用于展示早期与后期影像中的城市形态、绿地结构以及站点边界条件变化。',
    beforeLabel: '前期',
    afterLabel: '后期',
    dragNote: '拖动注释',
    historyJourneyLabel: '历史叙事',
    historyLayoutLabel: '布局',
    historyLayoutHorizontal: '横向',
    historyLayoutVertical: '纵向',
    stationCounter: '站点',
    stationProgress: '当前进度',
    continuousView: '连续文本',
    visualizedView: '可视化',
    contentFlowBlock: '内容顺序',
    stageOverviewBlock: '阶段概览',
    summaryBlock: '叙事',
    notesBlock: '注释',
    highlightsBlock: '要点',
    mediaBlock: '图像资料',
    remoteSensingBlock: '前后对比',
    showRunnerGallery: '显示流动画廊',
    hideRunnerGallery: '隐藏流动画廊',
    sectionNav: '页面章节',
    researchMapCaption: '研究片区总览',
    researchMapText: '此部分可用于放置可滚动的代码化研究地图布局、片区级说明，以及站点分组逻辑。',
    historyHint: '每张卡片代表共享片区中的一个站点，并以横向滚动方式呈现。',
    historyHintVertical: '每个站点卡片与阶段内容按纵向完整排布，可从上到下连续阅读。',
    thematicHint: '这些内容卡可用于连接片区故事与专题地图中的文字、图像和叙事。',
    notesHint: '此处用于整理引用来源、资料追踪与后续补充说明。',
  },
} as const;

const PAGE_DARK = '#3EB181';
const PAGE_LIGHT = '#f2f2ef';

type SectionNavItem = {
  id: string;
  label: string;
  level: 0 | 1 | 2;
  order?: number;
  parentId?: string;
};

function getHistoryStationNavId(stationName: string) {
  return `history-station-${createStationSlug(stationName)}`;
}

function getHistoryPhaseNavId(stationName: string, phaseId: string, phaseIndex: number) {
  const phaseSlug = createStationSlug(phaseId || `phase-${phaseIndex + 1}`);
  return `history-phase-${createStationSlug(stationName)}-${phaseSlug}`;
}

function getHistoryPhaseNavLabel(phaseIndex: number, language: 'en' | 'zh') {
  return language === 'zh' ? `第 ${phaseIndex + 1} 阶段` : `Phase ${phaseIndex + 1}`;
}

// Format a line string for the active language. Example: "Line 1" -> "1号线" in Chinese
function formatOverviewLine(lineName: string, language: 'en' | 'zh') {
  if (language === 'en') return lineName;

  const lineNumberMatch = lineName.match(/Line\s+(\d+)/i);
  return lineNumberMatch ? `${lineNumberMatch[1]}号线` : lineName;
}

// Utility to map a progress value into a [0,1] window bounded by start/end.
// Used to calculate reveal transitions for stage panels.
function getRevealWindow(progress: number, start: number, end: number) {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

// Small presentational header used across sections. Keeps markup consistent.
function SectionHeader({
  eyebrow,
  title,
  description,
  theme = 'dark',
}: {
  eyebrow: string;
  title: string;
  description: string;
  theme?: 'dark' | 'light'; 
}) {
  const eyebrowClass = theme === 'light' ? 'text-zinc-500' : 'text-cyan-100/58';
  const titleClass = theme === 'light' ? 'text-zinc-950' : 'text-white';
  const descriptionClass = theme === 'light' ? 'text-zinc-700' : 'text-white/68';

  return (
    <div className="mb-6">
      <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${eyebrowClass}`}>{eyebrow}</p>
      <h2 className={`mt-3 text-2xl font-semibold md:text-3xl ${titleClass}`}>{title}</h2>
      <p className={`mt-3 max-w-3xl text-sm leading-7 md:text-base ${descriptionClass}`}>{description}</p>
    </div>
  );
}

// Sticky frame wrapper used to create the floating title/description area
// and constrain the section content to a centered column or full-width band.
function StickySectionFrame({
  id,
  sectionRef,
  theme,
  eyebrow,
  title,
  description,
  children,
  className = '',
  fullWidth = false,
}: {
  id?: string;
  sectionRef?: RefObject<HTMLElement | null>;
  theme: 'dark' | 'light';
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}) {
  const isLightTheme = theme === 'light';
  const sectionTagClass = isLightTheme ? 'text-zinc-500/65' : 'text-white/42';

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative left-1/2 mt-8 w-screen -translate-x-1/2 ${className}`}
    >
      <div className="px-4 md:px-8">
        <div className={`flex min-h-screen w-full items-start pb-10 pt-2 md:pb-12 ${fullWidth ? '' : 'mx-auto max-w-7xl'}`}>
          <div className="w-full">{children}</div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-5 z-20 md:left-8">
        <p className={`text-[10px] font-medium uppercase tracking-[0.24em] ${sectionTagClass}`}>
          {title}
        </p>
      </div>
    </section>
  );
}

const darkSectionClass = 'p-6 md:p-8';
const lightSectionClass = 'p-6 md:p-8';
const darkBandClass = 'relative left-1/2 mt-8 w-screen -translate-x-1/2 py-10';
const lightBandClass = 'relative left-1/2 mt-8 w-screen -translate-x-1/2 py-10';
const bandInnerClass = 'mx-auto w-full px-4 md:px-8';

// Color utilities — convert hex to RGB components
function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized;

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

// Linearly mix two hex colors based on progress in [0,1]
function mixHexColors(startHex: string, endHex: string, progress: number) {
  const start = hexToRgb(startHex);
  const end = hexToRgb(endHex);
  const clamped = Math.min(1, Math.max(0, progress));

  const mix = (from: number, to: number) => Math.round(from + (to - from) * clamped);

  return `rgb(${mix(start.r, end.r)}, ${mix(start.g, end.g)}, ${mix(start.b, end.b)})`;
}

// Calculate perceived brightness for a hex or rgb(...) string.
// Used to pick light/dark text colors against a background.
function getColorBrightness(color: string) {
  if (color.startsWith('rgb')) {
    const values = color.match(/\d+/g)?.map(Number) ?? [8, 18, 33];
    const [r, g, b] = values;
    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  const { r, g, b } = hexToRgb(color);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/*
  HistoryJourneySection
  - Complex UI: horizontally scrollable station timeline where each station shows
    multiple history stages as panels. The component measures sizes and transforms
    scroll progress into per-station and per-stage reveal animations.
  - Props include `cards` (timeline data), language, and a `scrollContainerRef`
    which is the page scroll container used to compute progress.
*/
function HistoryJourneySection({
  language,
  cards,
  eyebrow,
  title,
  description,
  scrollMode = 'horizontal',
  copy,
  scrollContainerRef,
  theme,
}: {
  language: 'en' | 'zh';
  cards: StationTimelineCard[];
  eyebrow: string;
  title: string;
  description: string;
  scrollMode?: 'horizontal' | 'vertical';
  copy: {
    historyJourneyLabel: string;
    historyLayoutLabel: string;
    historyLayoutHorizontal: string;
    historyLayoutVertical: string;
    stationCounter: string;
    stationProgress: string;
    beforeLabel: string;
    afterLabel: string;
    contentFlowBlock: string;
    stageOverviewBlock: string;
    summaryBlock: string;
    notesBlock: string;
    highlightsBlock: string;
    mediaBlock: string;
    remoteSensingBlock: string;
  };
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  theme: 'dark' | 'light';
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stationRefs = useRef<Array<HTMLDivElement | null>>([]);
  const verticalCardRefs = useRef<Array<HTMLElement | null>>([]);
  const verticalStageRefs = useRef<Array<Array<HTMLDivElement | null>>>([]);
  const [selectedScrollMode, setSelectedScrollMode] = useState<'horizontal' | 'vertical'>(scrollMode);
  const isVerticalMode = selectedScrollMode === 'vertical';
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [stationHeights, setStationHeights] = useState<number[]>(cards.map(() => 0));
  const [verticalTimelineState, setVerticalTimelineState] = useState<Array<{
    progress: number;
    markerOffsets: number[];
    markerProgresses: number[];
  }>>(
    cards.map((card) => ({
      progress: 0,
      markerOffsets: card.stages.map(() => 0),
      markerProgresses: card.stages.map(() => 0),
    }))
  );
  const [historyState, setHistoryState] = useState<{
    activeStation: number;
    stationProgress: number;
    overallProgress: number;
    stationProgresses: number[];
    outerPanelIndices: number[];
    stageInnerShifts: number[][];
  }>({
    activeStation: 0,
    stationProgress: 0,
    overallProgress: 0,
    stationProgresses: cards.map(() => 0),
    outerPanelIndices: cards.map(() => 0),
    stageInnerShifts: cards.map(() => []),
  });

  const historyMediaPool = [
    stationDetailMedia.researchMap,
    stationDetailMedia.beforeUrbanFabric,
    stationDetailMedia.afterUrbanFabric,
    stationDetailMedia.beforeTransitEdge,
    stationDetailMedia.afterTransitEdge,
    stationDetailMedia.thematicConnection,
  ];

  const getPhaseCardWidth = (viewportWidth: number) => Math.max(320, Math.round(viewportWidth * 0.8));

  useEffect(() => {
    setSelectedScrollMode(scrollMode);
  }, [scrollMode]);

  useEffect(() => {
    const updateViewport = () => {
      const container = scrollContainerRef.current;
      setViewportSize({
        width: container?.clientWidth ?? window.innerWidth,
        height: container?.clientHeight ?? window.innerHeight,
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => window.removeEventListener('resize', updateViewport);
  }, [scrollContainerRef]);

  useEffect(() => {
    if (isVerticalMode) return;

    const measureStationHeights = () => {
      const viewportHeight = scrollContainerRef.current?.clientHeight ?? window.innerHeight;
      const viewportWidth = scrollContainerRef.current?.clientWidth ?? window.innerWidth;
      const introScrollDistance = viewportHeight * (viewportSize.width < 768 ? 0.85 : 0.70);
      const snapSettleDistance = viewportHeight * (viewportSize.width < 768 ? 0.28 : 0.24);
      const readBufferPerStage = viewportHeight * (viewportSize.width < 768 ? 0.45 : 0.40);
      const availableArticleW = getPhaseCardWidth(viewportWidth);

      setStationHeights(
        cards.map((card) => {
          const stagePanels = ensureMinimumStagePanels(card);
          let totalScrollable = introScrollDistance;
          stagePanels.forEach((stage) => {
            const innerW = getStagePanelWidth(stage, availableArticleW);
            const innerOverflow = Math.max(0, innerW - availableArticleW);
            // budget = settle deadband + content reveal + read buffer at end
            totalScrollable += snapSettleDistance + innerOverflow + readBufferPerStage;
          });
          return viewportHeight + totalScrollable;
        })
      );
    };

    measureStationHeights();

    window.addEventListener('resize', measureStationHeights);

    return () => {
      window.removeEventListener('resize', measureStationHeights);
    };
  }, [cards, isVerticalMode, scrollContainerRef, viewportSize.width]);

  useEffect(() => {
    if (isVerticalMode) return;

    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const updateState = () => {
      const section = sectionRef.current;
      if (!section) return;

      const viewportHeight = scrollContainer.clientHeight;
      const containerRect = scrollContainer.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const sectionTop = sectionRect.top - containerRect.top + scrollContainer.scrollTop;
      const sectionRange = Math.max(section.offsetHeight - viewportHeight, 1);
      const overallProgress = Math.min(
        1,
        Math.max(0, (scrollContainer.scrollTop - sectionTop) / sectionRange)
      );

      const stationProgresses = cards.map((_, index) => {
        const station = stationRefs.current[index];
        if (!station) return 0;

        const stationRect = station.getBoundingClientRect();
        const stationTop = stationRect.top - containerRect.top + scrollContainer.scrollTop;
        const stationRange = Math.max(station.offsetHeight - viewportHeight, 1);

        return Math.min(
          1,
          Math.max(0, (scrollContainer.scrollTop - stationTop) / stationRange)
        );
      });

      const firstActive = stationProgresses.findIndex((progress) => progress > 0 && progress < 1);
      const firstIncomplete = stationProgresses.findIndex((progress) => progress < 1);
      const activeStation = firstActive >= 0 ? firstActive : firstIncomplete >= 0 ? firstIncomplete : Math.max(cards.length - 1, 0);
      const stationProgress = stationProgresses[activeStation] ?? 0;

      const viewportW = scrollContainer.clientWidth;
      const isMob = viewportW < 768;
      const introScrollDist    = viewportHeight * (isMob ? 0.85 : 0.70);
      // snapSettleDist: dead-band after the outer panel snaps in — inner pan is frozen
      const snapSettleDist     = viewportHeight * (isMob ? 0.28 : 0.24);
      const readBufPerStage    = viewportHeight * (isMob ? 0.45 : 0.40);
      const availableW         = getPhaseCardWidth(viewportW);

      const outerPanelIndices: number[] = [];
      const stageInnerShifts: number[][] = [];

      cards.forEach((card, cardIdx) => {
        const stagePanels = ensureMinimumStagePanels(card);
        const stageOverflows = stagePanels.map((stage) =>
          Math.max(0, getStagePanelWidth(stage, availableW) - availableW)
        );
        // Per-stage scroll budget: settle deadband + inner content reveal + read buffer
        const stageScrollDists = stageOverflows.map((ov) => snapSettleDist + ov + readBufPerStage);
        const totalScrollable = introScrollDist + stageScrollDists.reduce((sum, d) => sum + d, 0);

        const progress = stationProgresses[cardIdx] ?? 0;
        const scrollPos = progress * Math.max(totalScrollable, 1);

        if (scrollPos < introScrollDist || stagePanels.length === 0) {
          outerPanelIndices.push(0);
          stageInnerShifts.push(stagePanels.map(() => 0));
          return;
        }

        let accumulated = introScrollDist;
        let innerShiftsForStation: number[] = stagePanels.map(() => 0);

        for (let i = 0; i < stagePanels.length; i++) {
          const stageEnd = accumulated + stageScrollDists[i];
          const isLastStage = i === stagePanels.length - 1;

          if (scrollPos < stageEnd || isLastStage) {
            const localScrollPos = scrollPos - accumulated;
            // Inner pan only starts after the settle deadband
            const panStart = snapSettleDist;
            const panRange = Math.max(stageOverflows[i], 1);
            const localP = Math.min(1, Math.max(0, (localScrollPos - panStart) / panRange));

            innerShiftsForStation = stagePanels.map((_, j) => {
              if (j < i) return stageOverflows[j];          // fully revealed earlier stages
              if (j === i) return Math.round(stageOverflows[i] * localP); // current stage
              return 0;                                       // future stages hidden
            });

            outerPanelIndices.push(i + 1);
            stageInnerShifts.push(innerShiftsForStation);
            return;
          }

          accumulated = stageEnd;
        }

        // Fallback: all stages fully revealed
        outerPanelIndices.push(stagePanels.length);
        stageInnerShifts.push(stageOverflows.slice());
      });

      setHistoryState({
        activeStation,
        stationProgress,
        overallProgress,
        stationProgresses,
        outerPanelIndices,
        stageInnerShifts,
      });
    };

    updateState();
    scrollContainer.addEventListener('scroll', updateState, { passive: true });
    window.addEventListener('resize', updateState);

    return () => {
      scrollContainer.removeEventListener('scroll', updateState);
      window.removeEventListener('resize', updateState);
    };
  }, [cards.length, isVerticalMode, scrollContainerRef]);

  useEffect(() => {
    setVerticalTimelineState(
      cards.map((card) => ({
        progress: 0,
        markerOffsets: card.stages.map((_, stageIndex) => {
          if (card.stages.length <= 1) return 0;
          return stageIndex / (card.stages.length - 1);
        }),
        markerProgresses: card.stages.map(() => 0),
      }))
    );
  }, [cards]);

  useEffect(() => {
    if (!isVerticalMode) return;

    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

    const updateVerticalTimeline = () => {
      const containerRect = scrollContainer.getBoundingClientRect();
      const scrollTop = scrollContainer.scrollTop;
      const activationAbs = scrollTop + scrollContainer.clientHeight * 0.32;

      const nextState = cards.map((card, cardIndex) => {
        const stageElements = verticalStageRefs.current[cardIndex] ?? [];

        if (stageElements.length === 0 || stageElements.every((element) => !element)) {
          return {
            progress: 0,
            markerOffsets: card.stages.map((_, stageIndex) => {
              if (card.stages.length <= 1) return 0;
              return stageIndex / (card.stages.length - 1);
            }),
            markerProgresses: card.stages.map(() => 0),
          };
        }

        const resolvedStages = stageElements.filter((element): element is HTMLDivElement => Boolean(element));
        if (resolvedStages.length === 0) {
          return {
            progress: 0,
            markerOffsets: card.stages.map((_, stageIndex) => {
              if (card.stages.length <= 1) return 0;
              return stageIndex / (card.stages.length - 1);
            }),
            markerProgresses: card.stages.map(() => 0),
          };
        }

        const stageBounds = resolvedStages.map((element) => {
          const rect = element.getBoundingClientRect();
          const top = rect.top - containerRect.top + scrollTop;
          const bottom = rect.bottom - containerRect.top + scrollTop;
          const center = top + (bottom - top) / 2;

          return { top, bottom, center };
        });

        const lineStart = stageBounds[0].top;
        const lineEnd = stageBounds[stageBounds.length - 1].bottom;
        const lineRange = Math.max(lineEnd - lineStart, 1);

        const markerOffsets = stageBounds.map((bounds) => clamp01((bounds.center - lineStart) / lineRange));
        const markerProgresses = stageBounds.map((bounds) =>
          clamp01((activationAbs - bounds.top) / Math.max(bounds.bottom - bounds.top, 1))
        );
        const progress = clamp01((activationAbs - lineStart) / lineRange);

        return {
          progress,
          markerOffsets,
          markerProgresses,
        };
      });

      setVerticalTimelineState(nextState);
    };

    updateVerticalTimeline();
    scrollContainer.addEventListener('scroll', updateVerticalTimeline, { passive: true });
    window.addEventListener('resize', updateVerticalTimeline);

    return () => {
      scrollContainer.removeEventListener('scroll', updateVerticalTimeline);
      window.removeEventListener('resize', updateVerticalTimeline);
    };
  }, [cards, isVerticalMode, scrollContainerRef]);

  const isMobile = viewportSize.width < 768;
  const isLightTheme = theme === 'light';
  const frameClass = isLightTheme
    ? 'bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(241,241,238,0.94))]'
    : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(0,0,0,0.94))]';
  const overlayClass = isLightTheme
    ? 'bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.08),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.08),transparent_24%),linear-gradient(180deg,rgba(0,0,0,0.01),transparent_30%)]'
    : 'bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.15),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.16),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_30%)]';
  const edgeLeftClass = isLightTheme ? 'bg-gradient-to-r from-[#f2f2ef] to-transparent' : 'bg-gradient-to-r from-[#050e1b] to-transparent';
  const edgeRightClass = isLightTheme ? 'bg-gradient-to-l from-[#f2f2ef] to-transparent' : 'bg-gradient-to-l from-[#050e1b] to-transparent';
  const stickyCardClass = isLightTheme
    ? 'bg-white/82'
    : 'bg-[#07121d]/62';
  const titleTextClass = isLightTheme ? 'text-zinc-950' : 'text-white';
  const bodyTextClass = isLightTheme ? 'text-zinc-700' : 'text-white/68';
  const subtleTextClass = isLightTheme ? 'text-zinc-500' : 'text-white/45';
  const accentTextClass = isLightTheme ? 'text-cyan-800/80' : 'text-cyan-100/58';
  const surfaceClass = isLightTheme
    ? 'border-transparent bg-transparent text-zinc-800'
    : 'border-transparent bg-transparent text-white';
  const minorSurfaceClass = isLightTheme
    ? 'border-transparent bg-transparent text-zinc-700'
    : 'border-transparent bg-transparent text-white/72';
  const progressShellClass = isLightTheme
    ? 'border-black/10 bg-white/82'
    : 'border-white/10 bg-[#07121d]/70';
  const dotIdleClass = isLightTheme ? 'bg-black/20' : 'bg-white/30';
  const ctaClass = isLightTheme
    ? 'border border-cyan-700/20 bg-cyan-500/10 text-cyan-900 hover:border-cyan-700/35 hover:bg-cyan-500/18'
    : 'border border-cyan-300/25 bg-cyan-400/10 text-cyan-100 hover:border-cyan-200/50 hover:bg-cyan-400/18';
  const modePanelClass = isLightTheme
    ? 'border-black/10 bg-white/88 text-zinc-700'
    : 'border-white/10 bg-[#07121d]/72 text-white/78';
  const modeButtonBaseClass = 'rounded-full border px-3 py-1.5 text-xs font-medium transition';
  const getModeButtonClass = (mode: 'horizontal' | 'vertical') => {
    const isActive = selectedScrollMode === mode;

    if (isLightTheme) {
      return isActive
        ? 'border-cyan-700/28 bg-cyan-500/14 text-cyan-900'
        : 'border-black/10 bg-white/80 text-zinc-600 hover:border-cyan-700/24 hover:text-cyan-900';
    }

    return isActive
      ? 'border-cyan-200/36 bg-cyan-400/18 text-cyan-100'
      : 'border-white/12 bg-white/6 text-white/65 hover:border-cyan-300/30 hover:text-cyan-100';
  };

  const renderScrollModePanel = () => (
    <div className={`inline-flex items-center gap-2 rounded-full border px-2 py-2 ${modePanelClass}`}>
      <span className={`px-2 text-[10px] font-semibold uppercase tracking-[0.22em] ${subtleTextClass}`}>
        {copy.historyLayoutLabel}
      </span>
      <button
        type="button"
        onClick={() => setSelectedScrollMode('horizontal')}
        className={`${modeButtonBaseClass} ${getModeButtonClass('horizontal')}`}
      >
        {copy.historyLayoutHorizontal}
      </button>
      <button
        type="button"
        onClick={() => setSelectedScrollMode('vertical')}
        className={`${modeButtonBaseClass} ${getModeButtonClass('vertical')}`}
      >
        {copy.historyLayoutVertical}
      </button>
    </div>
  );

  const renderVerticalStage = (
    card: StationTimelineCard,
    stage: StationHistoryStage,
    stageIndex: number,
    stageProgress: number
  ) => {
    const summaryParagraphs = stage.summary[language]
      .split(/\n+/)
      .filter((paragraph) => paragraph.trim().length > 0);
    const notes = stage.notes
      .map((note) => note[language])
      .filter((note) => note.trim().length > 0);
    const historyBeforeOptions = stage.remoteSensing?.beforeOptions?.length
      ? stage.remoteSensing.beforeOptions
      : stage.remoteSensing
        ? [
            {
              id: `${stage.id}-remote-before`,
              label: { en: copy.beforeLabel, zh: copy.beforeLabel },
              src: stage.remoteSensing.before.src,
            },
          ]
        : [];
    const historyAfterOptions = stage.remoteSensing?.afterOptions?.length
      ? stage.remoteSensing.afterOptions
      : stage.remoteSensing
        ? [
            {
              id: `${stage.id}-remote-after`,
              label: { en: copy.afterLabel, zh: copy.afterLabel },
              src: stage.remoteSensing.after.src,
            },
          ]
        : [];

    const clampedStageProgress = Math.min(1, Math.max(0, stageProgress));
    const watchStart = 0.14;
    const watchEnd = 0.78;
    const minScale = 0.88;
    const maxScale = 1;
    const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);
    const isInitialFirstStage = stageIndex === 0 && clampedStageProgress <= watchStart;

    const smoothScaleEnd = Math.min(0.36, watchStart + 0.18);
    const enterProgress = getRevealWindow(clampedStageProgress, 0, smoothScaleEnd);
    const isStageActive = isInitialFirstStage || (clampedStageProgress >= watchStart && clampedStageProgress <= watchEnd);
    const activeStageClass = isStageActive
      ? isLightTheme
        ? 'bg-cyan-500/6'
        : 'bg-cyan-400/10'
      : '';
    const stageContentOpacity = isStageActive ? 1 : 0.3;
    const stageScale = isInitialFirstStage
      ? maxScale
      : clampedStageProgress < watchStart
      ? minScale + (maxScale - minScale) * easeOutCubic(enterProgress)
      : maxScale;

    return (
      <article
        className={`rounded-2xl p-4 md:p-5 ${minorSurfaceClass} ${activeStageClass}`}
        style={{
          transform: `scale(${stageScale})`,
          transformOrigin: 'center center',
          transition: 'transform 520ms cubic-bezier(0.22, 1, 0.36, 1), background-color 220ms ease',
        }}
      >
        <div id={getHistoryPhaseNavId(card.station.name, stage.id, stageIndex)} className="relative -top-24 h-0" />
        <div style={{ opacity: stageContentOpacity, transition: 'opacity 240ms ease' }}>
          <p className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${subtleTextClass}`}>{stage.period[language]}</p>
          <h4 className={`mt-2 text-xl font-semibold ${titleTextClass}`}>{stage.title[language]}</h4>

          <div className="mt-4 space-y-4">
            {summaryParagraphs.map((paragraph, paragraphIndex) => (
              <p key={`${stage.id}-vertical-summary-${paragraphIndex}`} className={`text-sm leading-7 md:text-base ${bodyTextClass}`}>
                {paragraph}
              </p>
            ))}
          </div>

          {notes.length > 0 && (
            <div className="mt-5 space-y-3">
              {notes.map((note, noteIndex) => (
                <p key={`${stage.id}-vertical-note-${noteIndex}`} className={`text-sm leading-7 md:text-base ${bodyTextClass}`}>
                  {note}
                </p>
              ))}
            </div>
          )}

          {stage.highlights.length > 0 && (
            <div className="mt-5 grid gap-2 md:grid-cols-2">
              {stage.highlights.map((item, highlightIndex) => (
                <div key={`${stage.id}-vertical-highlight-${highlightIndex}`} className={`rounded-xl px-3 py-2 text-sm ${surfaceClass}`}>
                  {item[language]}
                </div>
              ))}
            </div>
          )}

          {stage.media.length > 0 && (
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {stage.media.map((mediaItem) => (
                <figure key={`${mediaItem.id}-vertical`} className="overflow-hidden rounded-xl">
                  <img
                    src={mediaItem.src}
                    alt={mediaItem.alt?.[language] ?? stage.title[language]}
                    className="h-44 w-full object-cover"
                  />
                  {mediaItem.caption && (
                    <figcaption className={`px-3 py-2 text-xs leading-6 ${bodyTextClass}`}>
                      {mediaItem.caption[language]}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}

          {stage.remoteSensing && historyBeforeOptions.length > 0 && historyAfterOptions.length > 0 && (
            <div className="mt-5 rounded-2xl p-4">
              {stage.remoteSensing.title && (
                <h5 className={`text-sm font-semibold md:text-base ${titleTextClass}`}>
                  {stage.remoteSensing.title[language]}
                </h5>
              )}
              {stage.remoteSensing.description && (
                <p className={`mt-2 text-sm leading-7 ${bodyTextClass}`}>
                  {stage.remoteSensing.description[language]}
                </p>
              )}
              <div className="mt-4">
                <BeforeAfterSlider
                  language={language}
                  beforeOptions={historyBeforeOptions}
                  afterOptions={historyAfterOptions}
                  initialBeforeId={historyBeforeOptions[0]?.id}
                  initialAfterId={historyAfterOptions[0]?.id}
                  initialPosition={50}
                  height={420}
                  showHint={false}
                  showOptionControls
                  fullViewport
                  squareCorners
                />
              </div>
            </div>
          )}
        </div>
      </article>
    );
  };

  const ensureMinimumStagePanels = (card: StationTimelineCard) => {
    const minimumStageCount = 3;

    if (card.stages.length >= minimumStageCount) {
      return card.stages;
    }

    return [
      ...card.stages,
      ...Array.from({ length: minimumStageCount - card.stages.length }, (_, fillerIndex) => {
          const fallbackStage = card.stages[card.stages.length - 1] ?? {
            id: `${card.station.name}-fallback-stage`,
            title: card.title,
            period: card.period,
            summary: card.summary,
            highlights: card.highlights,
            notes: [],
            media: (card.image?.src || card.imageSrc)
              ? [
                  {
                    id: `${card.station.name}-fallback-media`,
                    src: card.image?.src ?? card.imageSrc ?? '',
                    alt: card.image?.alt ?? card.title,
                    caption: card.image?.caption,
                  },
                ]
              : [],
          };

        return {
          ...fallbackStage,
          id: `${fallbackStage.id}-repeat-${fillerIndex + 1}`,
        };
      }),
    ];
  };

  const getStagePanelWidth = (stage: StationHistoryStage, baseWidth: number) => {
    const summaryLength = stage.summary[language].length;
    const noteLength = stage.notes.reduce((total, note) => total + note[language].length, 0);
    const paragraphCount = stage.summary[language]
      .split(/\n+/)
      .filter((paragraph) => paragraph.trim().length > 0).length;
    const mediaCount = stage.media.length;
    const highlightCount = stage.highlights.length;

    const contentScore =
      (summaryLength + noteLength) / 420 +
      paragraphCount * 0.22 +
      mediaCount * 0.35 +
      highlightCount * 0.18;

    const minFactor = isMobile ? 0.98 : 1.02;
    const maxFactor = isMobile ? 1.45 : 1.85;
    const widthFactor = Math.min(maxFactor, Math.max(minFactor, 0.95 + contentScore * 0.14));

    return Math.round(baseWidth * widthFactor);
  };

  const renderStage = (stage: StationHistoryStage, innerShift: number = 0, innerContentWidth: number = 0) => {
    const hasMedia = stage.media.length > 0;
    const mediaColW = 280;
    const colGap = 20;
    const trackW = innerContentWidth > 0 ? innerContentWidth : 0;
    const textColW = trackW > 0
      ? (hasMedia ? Math.max(200, trackW - mediaColW - colGap) : trackW)
      : 0;
    const contentOrder = stage.contentOrder?.length
      ? stage.contentOrder
      : ['summary', 'notes', 'highlights', 'media', 'remoteSensing'];
    const visibleContentOrder = contentOrder.filter((key) => key !== 'notes' && key !== 'highlights');
    const contentLabelMap = {
      summary: copy.summaryBlock,
      notes: copy.notesBlock,
      highlights: copy.highlightsBlock,
      media: copy.mediaBlock,
      remoteSensing: copy.remoteSensingBlock,
    } as const;
    const summaryParagraphs = stage.summary[language]
      .split(/\n+/)
      .filter((paragraph) => paragraph.trim().length > 0);
    const notes = stage.notes.map((note) => note[language]).filter((note) => note.trim().length > 0);
    const splitNarrativeIntoTwoBlocks = (parts: string[]): [string, string] => {
      const normalized = parts.map((part) => part.trim()).filter((part) => part.length > 0).join('\n\n');
      if (!normalized) return ['', ''];

      const sentenceCandidates = normalized
        .split(/\n+/)
        .flatMap((segment) => segment.match(/[^.!?。！？]+[.!?。！？]?/g) ?? [])
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      if (sentenceCandidates.length >= 2) {
        const columns: [string[], string[]] = [[], []];
        const weights: [number, number] = [0, 0];

        sentenceCandidates.forEach((sentence) => {
          const targetColumn = weights[0] <= weights[1] ? 0 : 1;
          columns[targetColumn].push(sentence);
          weights[targetColumn] += sentence.length;
        });

        return [columns[0].join('\n\n'), columns[1].join('\n\n')];
      }

      if (normalized.length < 2) return [normalized, ''];

      const midpoint = Math.floor(normalized.length / 2);
      const rightSlice = normalized.slice(midpoint);
      const leftSlice = normalized.slice(0, midpoint);
      const rightBreak = rightSlice.search(/[\s，。,.;；:：]/);
      const leftBreak = leftSlice.lastIndexOf(' ');
      const splitIndex = rightBreak >= 0
        ? midpoint + rightBreak
        : leftBreak > Math.floor(normalized.length * 0.3)
          ? leftBreak
          : midpoint;

      return [normalized.slice(0, splitIndex).trim(), normalized.slice(splitIndex).trim()];
    };
    const [notesLeftText, notesRightText] = splitNarrativeIntoTwoBlocks(notes);

    const renderContinuousContent = () => (
      <div className="mt-4 flex-1 min-h-0 overflow-hidden">
        <div
          className="flex h-full gap-5"
          style={{
            width: trackW > 0 ? `${trackW}px` : '100%',
            transform: `translateX(-${innerShift}px)`,
            transition: 'transform 140ms linear',
          }}
        >
          <div
            className="shrink-0 h-full"
            style={{
              width: textColW > 0 ? `${textColW}px` : '100%',
              columnWidth: '15rem',
              columnFill: 'auto',
              columnGap: '1.25rem',
            }}
          >
            {summaryParagraphs.map((paragraph, paragraphIndex) => (
              <p
                key={`${stage.id}-summary-${paragraphIndex}`}
                className={`mb-4 break-inside-avoid text-justify text-sm leading-7 md:text-base md:leading-8 ${bodyTextClass}`}
              >
                {paragraph}
              </p>
            ))}

            {notes.map((note, noteIndex) => (
              <p
                key={`${stage.id}-note-${noteIndex}`}
                className={`mb-4 break-inside-avoid text-justify text-sm leading-7 md:text-base md:leading-8 ${bodyTextClass}`}
              >
                {note}
              </p>
            ))}

            {stage.highlights.map((item) => (
              <div key={item.en} className={`mb-2 break-inside-avoid rounded-xl px-3 py-2 text-sm leading-6 ${surfaceClass}`}>
                {item[language]}
              </div>
            ))}
          </div>

          {hasMedia && (
            <div
              className="shrink-0 grid content-start gap-3 overflow-y-auto pr-1"
              style={{ width: `${mediaColW}px` }}
            >
              <figure className="overflow-hidden rounded-2xl">
                <img
                  src={stage.media[0].src}
                  alt={stage.media[0].alt?.[language] ?? stage.title[language]}
                  className="h-52 w-full object-cover md:h-64"
                />
                {stage.media[0].caption && (
                  <figcaption className={`px-3 py-2 text-xs leading-6 ${bodyTextClass}`}>
                    {stage.media[0].caption[language]}
                  </figcaption>
                )}
              </figure>

              {stage.media.length > 1 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {stage.media.slice(1).map((mediaItem) => (
                    <figure key={mediaItem.id} className="overflow-hidden rounded-xl">
                      <img
                        src={mediaItem.src}
                        alt={mediaItem.alt?.[language] ?? stage.title[language]}
                        className="h-28 w-full object-cover"
                      />
                      {mediaItem.caption && (
                        <figcaption className={`px-2 py-1.5 text-[11px] leading-5 ${bodyTextClass}`}>
                          {mediaItem.caption[language]}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );

    const renderContentFlow = () => (
      <section className={`rounded-2xl border p-4 ${surfaceClass}`}>
        <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${subtleTextClass}`}>{copy.contentFlowBlock}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {visibleContentOrder.map((contentKey, index) => (
            <div key={`${stage.id}-flow-${contentKey}`} className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs ${minorSurfaceClass}`}>
              <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${isLightTheme ? 'bg-zinc-950 text-white' : 'bg-white text-[#06121d]'}`}>
                {index + 1}
              </span>
              <span>{contentLabelMap[contentKey]}</span>
            </div>
          ))}
        </div>
      </section>
    );

    const renderVisualizedBlock = (key: string) => {
      if (key === 'summary' && summaryParagraphs.length > 0) {
        const summaryText = summaryParagraphs.join('\n\n');

        return (
          <section key={`${stage.id}-visual-summary`} className={`rounded-2xl border p-4 ${surfaceClass}`}>
            <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${subtleTextClass}`}>{copy.summaryBlock}</p>
            <article className={`mt-3 rounded-xl border p-4 ${minorSurfaceClass}`}>
              <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${subtleTextClass}`}>{copy.summaryBlock}</p>
              <p className={`mt-2 whitespace-pre-line text-sm leading-7 md:text-[15px] ${bodyTextClass}`}>{summaryText}</p>
            </article>
          </section>
        );
      }

      if (key === 'notes' && notes.length > 0) {
        return (
          <section key={`${stage.id}-visual-notes`} className={`rounded-2xl border p-4 ${surfaceClass}`}>
            <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${subtleTextClass}`}>{copy.notesBlock}</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[notesLeftText, notesRightText].map((columnText, columnIndex) => (
                <div key={`${stage.id}-visual-note-column-${columnIndex}`} className={`rounded-xl border px-4 py-3 ${minorSurfaceClass}`}>
                  <p className={`whitespace-pre-line text-sm leading-7 md:text-[15px] ${bodyTextClass}`}>{columnText}</p>
                </div>
              ))}
            </div>
          </section>
        );
      }

      if (key === 'highlights' && stage.highlights.length > 0) {
        return (
          <section key={`${stage.id}-visual-highlights`} className={`rounded-2xl border p-4 ${surfaceClass}`}>
            <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${subtleTextClass}`}>{copy.highlightsBlock}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {stage.highlights.map((item, highlightIndex) => (
                <article key={`${stage.id}-visual-highlight-${highlightIndex}`} className={`rounded-xl border p-4 ${minorSurfaceClass}`}>
                  <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${subtleTextClass}`}>
                    {String(highlightIndex + 1).padStart(2, '0')}
                  </p>
                  <p className={`mt-2 text-sm leading-7 ${bodyTextClass}`}>{item[language]}</p>
                </article>
              ))}
            </div>
          </section>
        );
      }

      if (key === 'media' && stage.media.length > 0) {
        return (
          <section key={`${stage.id}-visual-media`} className={`rounded-2xl border p-4 ${surfaceClass}`}>
            <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${subtleTextClass}`}>{copy.mediaBlock}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {stage.media.map((mediaItem) => (
                <figure key={mediaItem.id} className="overflow-hidden rounded-xl">
                  <img
                    src={mediaItem.src}
                    alt={mediaItem.alt?.[language] ?? stage.title[language]}
                    className="h-40 w-full object-cover"
                  />
                  {mediaItem.caption && (
                    <figcaption className={`px-3 py-2 text-[11px] leading-5 ${bodyTextClass}`}>
                      {mediaItem.caption[language]}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        );
      }

      if (key === 'remoteSensing' && stage.remoteSensing) {
        const historyBeforeOptions = stage.remoteSensing.beforeOptions?.length
          ? stage.remoteSensing.beforeOptions
          : [
              {
                id: `${stage.id}-remote-before`,
                label: { en: copy.beforeLabel, zh: copy.beforeLabel },
                src: stage.remoteSensing.before.src,
              },
            ];
        const historyAfterOptions = stage.remoteSensing.afterOptions?.length
          ? stage.remoteSensing.afterOptions
          : [
              {
                id: `${stage.id}-remote-after`,
                label: { en: copy.afterLabel, zh: copy.afterLabel },
                src: stage.remoteSensing.after.src,
              },
            ];

        return (
          <section key={`${stage.id}-visual-remote`} className={`rounded-2xl border p-4 ${surfaceClass}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${subtleTextClass}`}>{copy.remoteSensingBlock}</p>
                {stage.remoteSensing.title && (
                  <h5 className={`mt-2 text-sm font-semibold md:text-base ${titleTextClass}`}>{stage.remoteSensing.title[language]}</h5>
                )}
              </div>
              {stage.remoteSensing.description && (
                <p className={`max-w-2xl text-sm leading-7 ${bodyTextClass}`}>{stage.remoteSensing.description[language]}</p>
              )}
            </div>
            <div className="mt-4">
              <BeforeAfterSlider
                language={language}
                beforeOptions={historyBeforeOptions}
                afterOptions={historyAfterOptions}
                initialBeforeId={historyBeforeOptions[0]?.id}
                initialAfterId={historyAfterOptions[0]?.id}
                initialPosition={50}
                height={420}
                showHint={false}
                showOptionControls
                fullViewport
                squareCorners
              />
            </div>
          </section>
        );
      }

      return null;
    };

    const renderVisualizedContent = () => {
      const desktopContentOrder = visibleContentOrder.filter((key) => key !== 'media');
      const hasReferenceMedia = stage.media.length > 0;

      return (
        <div className="mt-4 flex-1 min-h-0 overflow-hidden">
          <div className={`grid h-full gap-4 ${hasReferenceMedia ? 'md:grid-cols-[minmax(0,1fr)_17.5rem]' : ''}`}>
            <div className="min-h-0 overflow-y-auto pr-1">
              <div className="grid gap-4">
                {renderContentFlow()}
                {desktopContentOrder.map((key) => renderVisualizedBlock(key)).filter(Boolean)}
                {hasReferenceMedia && (
                  <section className={`md:hidden rounded-2xl border p-4 ${surfaceClass}`}>
                    <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${subtleTextClass}`}>{copy.mediaBlock}</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {stage.media.map((mediaItem) => (
                        <figure key={`${mediaItem.id}-mobile`} className="overflow-hidden rounded-xl">
                          <img
                            src={mediaItem.src}
                            alt={mediaItem.alt?.[language] ?? stage.title[language]}
                            className="h-36 w-full object-cover"
                          />
                          {mediaItem.caption && (
                            <figcaption className={`px-3 py-2 text-[11px] leading-5 ${bodyTextClass}`}>
                              {mediaItem.caption[language]}
                            </figcaption>
                          )}
                        </figure>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>

            {hasReferenceMedia && (
              <aside className={`hidden md:flex md:h-fit md:max-h-full md:flex-col md:gap-3 md:overflow-y-auto md:pr-1`}>
                <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${subtleTextClass}`}>{copy.mediaBlock}</p>
                {stage.media.map((mediaItem) => (
                  <figure key={`${mediaItem.id}-side`} className="overflow-hidden rounded-xl">
                    <img
                      src={mediaItem.src}
                      alt={mediaItem.alt?.[language] ?? stage.title[language]}
                      className="h-32 w-full object-cover"
                    />
                    {mediaItem.caption && (
                      <figcaption className={`px-2.5 py-2 text-[11px] leading-5 ${bodyTextClass}`}>
                        {mediaItem.caption[language]}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </aside>
            )}
          </div>
        </div>
      );
    };

    return (
      <article className={`flex w-full min-h-0 flex-col overflow-hidden rounded-[20px] border p-4 md:p-5 ${minorSurfaceClass}`}>
        <div className="shrink-0">
          <p className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${subtleTextClass}`}>{stage.period[language]}</p>
          <h4 className={`mt-2 text-base font-semibold md:text-lg ${titleTextClass}`}>{stage.title[language]}</h4>
        </div>

        {renderVisualizedContent()}
      </article>
    );
  };

  if (isVerticalMode) {
    return (
      <section
        id="area-history"
        ref={sectionRef}
        className="relative left-1/2 mt-8 w-screen -translate-x-1/2"
      >
        <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
          <div className="mb-5 md:mb-6">{renderScrollModePanel()}</div>

          <div className="mb-4 rounded-2xl p-5 md:p-6">
            <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${accentTextClass}`}>{eyebrow}</p>
            <h2 className="mt-3 text-2xl font-semibold text-[#3EB181] md:text-3xl">{title}</h2>
            <p className={`mt-3 max-w-4xl text-sm leading-7 md:text-base ${bodyTextClass}`}>{description}</p>
          </div>

          <div className="space-y-8 md:space-y-10">
            {cards.map((card, index) => {
              const imageSrc = card.image?.src || card.imageSrc || historyMediaPool[index % historyMediaPool.length];
              const imageAlt = card.image?.alt?.[language] ?? card.title[language];
              const imageCaption = card.image?.caption?.[language];
              const cardTimeline = verticalTimelineState[index] ?? {
                progress: 0,
                markerOffsets: card.stages.map((_, stageIndex) => (card.stages.length <= 1 ? 0 : stageIndex / (card.stages.length - 1))),
                markerProgresses: card.stages.map(() => 0),
              };
              const milestoneActivationThreshold = 0.08;
              const activatedMilestoneIndex = cardTimeline.markerProgresses.reduce((lastActiveIndex, progress, markerIndex) => {
                if (progress >= milestoneActivationThreshold) return markerIndex;
                return lastActiveIndex;
              }, cardTimeline.markerOffsets.length > 0 ? 0 : -1);
              const lastMarkerProgress = cardTimeline.markerProgresses[cardTimeline.markerProgresses.length - 1] ?? 0;
              const isLastPhasePassed = lastMarkerProgress >= 0.98;
              const steppedProgress = isLastPhasePassed
                ? 1
                : activatedMilestoneIndex >= 0
                ? (cardTimeline.markerOffsets[activatedMilestoneIndex] ?? 0)
                : 0;
              const timelineAccentPalette = ['#3EB181', '#2A383E', '#EAAF73'] as const;
              const timelineActiveColor = timelineAccentPalette[index % timelineAccentPalette.length];
              const timelineActiveRgb = hexToRgb(timelineActiveColor);
              const timelineActiveGlow = `rgba(${timelineActiveRgb.r}, ${timelineActiveRgb.g}, ${timelineActiveRgb.b}, 0.45)`;
              const timelineIdleColor = isLightTheme ? 'rgba(161, 161, 170, 0.78)' : 'rgba(228, 228, 231, 0.62)';

              return (
                <article
                  key={`${card.station.name}-vertical`}
                  ref={(element) => {
                    verticalCardRefs.current[index] = element;
                  }}
                  className={`rounded-[24px] p-5 md:p-6 ${stickyCardClass}`}
                >
                  <div id={getHistoryStationNavId(card.station.name)} className="relative -top-24 h-0" />
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
                    <div>
                      <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${accentTextClass}`}>{card.period[language]}</p>
                      <h3 className={`mt-3 text-3xl font-semibold leading-tight md:text-4xl ${titleTextClass}`}>
                        {card.title[language]}
                      </h3>
                      <p className={`mt-4 text-sm leading-7 md:text-base ${bodyTextClass}`}>
                        {card.summary[language]}
                      </p>
                    </div>

                    <figure className={`overflow-hidden rounded-2xl ${surfaceClass}`}>
                      <img src={imageSrc} alt={imageAlt} className="h-56 w-full object-cover md:h-full" />
                      {imageCaption && (
                        <figcaption className={`px-3 py-2 text-xs leading-6 ${bodyTextClass}`}>{imageCaption}</figcaption>
                      )}
                    </figure>
                  </div>

                  <div className="mt-6 grid grid-cols-[1.6rem_minmax(0,1fr)] gap-3 md:grid-cols-[2.2rem_minmax(0,1fr)] md:gap-4">
                    <aside className="relative" aria-hidden="true">
                      <div className="absolute left-1/2 top-2 bottom-2 w-[3px] -translate-x-1/2 overflow-visible">
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundColor: timelineIdleColor,
                            boxShadow: isLightTheme ? '0 0 0 1px rgba(63, 63, 70, 0.12)' : '0 0 0 1px rgba(255, 255, 255, 0.08)',
                          }}
                        />
                        <div
                          className="absolute left-0 top-0 w-full"
                          style={{
                            height: `${Math.round(steppedProgress * 100)}%`,
                            backgroundColor: timelineActiveColor,
                            boxShadow: `0 0 14px ${timelineActiveGlow}`,
                            transition: 'none',
                          }}
                        />

                        {cardTimeline.markerOffsets.map((offset, stageIndex) => {
                          const stageActivated = stageIndex <= activatedMilestoneIndex;

                          return (
                            <span
                              key={`${card.station.name}-timeline-dot-${stageIndex}`}
                              className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                              style={{
                                top: `${Math.round(offset * 100)}%`,
                                borderColor: stageActivated
                                  ? timelineActiveColor
                                  : isLightTheme
                                    ? 'rgba(63, 63, 70, 0.35)'
                                    : 'rgba(255, 255, 255, 0.35)',
                                backgroundColor: stageActivated
                                  ? timelineActiveColor
                                  : isLightTheme
                                    ? 'rgba(63, 63, 70, 0.2)'
                                    : 'rgba(255, 255, 255, 0.2)',
                                boxShadow: stageActivated
                                  ? `0 0 12px ${timelineActiveGlow}`
                                  : 'none',
                                transition: 'background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
                              }}
                            />
                          );
                        })}
                      </div>
                    </aside>

                    <div className="space-y-4">
                      {card.stages.map((stage, stageIndex) => (
                        <div
                          key={`${card.station.name}-${stage.id}-${stageIndex}`}
                          ref={(element) => {
                            if (!verticalStageRefs.current[index]) {
                              verticalStageRefs.current[index] = [];
                            }
                            verticalStageRefs.current[index][stageIndex] = element;
                          }}
                        >
                          {renderVerticalStage(card, stage, stageIndex, cardTimeline.markerProgresses[stageIndex] ?? 0)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5">
                    <Link
                      to={`/stations/${createStationSlug(card.station.name)}`}
                      className={`inline-flex w-fit items-center rounded-full px-4 py-2 text-sm font-medium transition ${ctaClass}`}
                    >
                      {getStationSectionLabel(card.station, language)}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="area-history"
      ref={sectionRef}
      className="relative left-1/2 mt-8 w-screen -translate-x-1/2"
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="mb-5 md:mb-6">{renderScrollModePanel()}</div>
      </div>

      <div className="relative mt-4 md:mt-5">
        {cards.map((card, index) => {
          const stagePanels = ensureMinimumStagePanels(card);
          const stageCount = stagePanels.length;
          const panelWidth = viewportSize.width || 320;
          const viewportHeight = viewportSize.height || window.innerHeight || 900;
          const introScrollDistance = viewportHeight * (isMobile ? 0.85 : 0.70);
          const snapSettleDistance = viewportHeight * (isMobile ? 0.28 : 0.24);
          const readBufferPerStage = viewportHeight * (isMobile ? 0.45 : 0.40);
          const availableArticleWidth = getPhaseCardWidth(panelWidth);
          const stageScrollDistances = stagePanels.map((stage) => {
            const innerWidth = getStagePanelWidth(stage, availableArticleWidth);
            const innerOverflow = Math.max(0, innerWidth - availableArticleWidth);
            return snapSettleDistance + innerOverflow + readBufferPerStage;
          });
          const phaseAnchorOffsets = card.stages.map((_, stageIndex) => {
            const previousScroll = stageScrollDistances
              .slice(0, stageIndex)
              .reduce((sum, distance) => sum + distance, 0);
            return introScrollDistance + previousScroll;
          });
          const totalPanels = 1 + stageCount;
          const stationTrackWidth = panelWidth * totalPanels;
          const outerPanelIndex = historyState.outerPanelIndices[index] ?? 0;
          const stageShifts = historyState.stageInnerShifts[index] ?? stagePanels.map(() => 0);
          const outerShift = outerPanelIndex * panelWidth;
          const imageSrc = card.image?.src || card.imageSrc || historyMediaPool[index % historyMediaPool.length];
          const imageAlt = card.image?.alt?.[language] ?? card.title[language];
          const imageCaption = card.image?.caption?.[language];

          return (
            <div
              key={card.station.name}
              ref={(element) => {
                stationRefs.current[index] = element;
              }}
              className="relative"
              style={{ height: `${stationHeights[index] || (viewportSize.height || 900) * (isMobile ? 2.2 : 2.4)}px` }}
            >
              <div id={getHistoryStationNavId(card.station.name)} className="absolute top-0 h-px w-px" />
              {card.stages.map((stage, stageIndex) => (
                <div
                  key={`${stage.id}-nav-anchor`}
                  id={getHistoryPhaseNavId(card.station.name, stage.id, stageIndex)}
                  className="absolute h-px w-px"
                  style={{ top: `${phaseAnchorOffsets[stageIndex] ?? introScrollDistance}px` }}
                />
              ))}

              <div className={`sticky top-0 h-screen overflow-hidden ${frameClass}`}>
                <div className={`absolute inset-0 ${overlayClass}`} />
                <div className={`absolute inset-y-0 left-0 z-10 w-12 md:w-20 ${edgeLeftClass}`} />
                <div className={`absolute inset-y-0 right-0 z-10 w-12 md:w-20 ${edgeRightClass}`} />
                <div className="pointer-events-none absolute bottom-5 left-5 z-20 md:left-8">
                  <p className={`text-[10px] font-medium uppercase tracking-[0.24em] ${subtleTextClass}`}>
                    {title}
                  </p>
                </div>

                <div className="relative h-full overflow-hidden">
                  <div
                    className="flex h-full"
                    style={{
                      width: `${stationTrackWidth}px`,
                      transform: `translate3d(-${outerShift}px, 0, 0)`,
                      transition: 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
                    }}
                  >
                    <div className="flex h-full shrink-0 items-center" style={{ width: `${panelWidth}px` }}>
                      <div className="mx-auto flex h-full w-full max-w-7xl items-center px-5 pb-16 pt-28 md:px-10 md:pb-20 md:pt-32">
                        <div
                          className="grid w-full gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12"
                        >
                          <div
                            className="max-w-4xl"
                            style={{
                              opacity: 1,
                              transform: 'translateY(0px)',
                              transition: 'opacity 180ms linear, transform 180ms linear',
                            }}
                          >
                            <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${accentTextClass}`}>{card.period[language]}</p>
                            <h3 className={`mt-4 text-4xl font-semibold leading-tight md:text-6xl xl:text-7xl ${titleTextClass}`}>
                              {card.title[language]}
                            </h3>
                            <p className={`mt-6 max-w-3xl text-base leading-8 md:text-xl md:leading-9 ${bodyTextClass}`}>
                              {card.summary[language]}
                            </p>
                          </div>

                          <div
                            className={`overflow-hidden rounded-[28px] ${surfaceClass}`}
                            style={{
                              opacity: 1,
                              transform: 'translateY(0px) scale(1)',
                              transition: 'opacity 180ms linear, transform 180ms linear',
                            }}
                          >
                            <img src={imageSrc} alt={imageAlt} className="h-[38vh] w-full object-cover md:h-[56vh]" />
                            {imageCaption && (
                              <p className={`px-3 py-2 text-xs leading-6 ${bodyTextClass}`}>{imageCaption}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {stagePanels.map((stage, stageIndex) => {
                      const availableArticleWidth = getPhaseCardWidth(panelWidth);
                      const innerContentWidth = getStagePanelWidth(stage, availableArticleWidth);
                      const innerShift = stageShifts[stageIndex] ?? 0;

                      return (
                        // flex-col so the article (flex-1) stretches to fill the available height
                        <div key={stage.id} className="flex h-full shrink-0 flex-col" style={{ width: `${panelWidth}px` }}>
                          <div
                            className="mx-auto flex h-full flex-col justify-center pb-20 pt-16 md:pb-24 md:pt-20"
                            style={{ width: `${availableArticleWidth}px` }}
                          >
                            <p className={`shrink-0 mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] ${subtleTextClass}`}>
                              {language === 'zh'
                                ? `${getStationSectionLabel(card.station, language)} · 第 ${stageIndex + 1} 阶段`
                                : `${getStationSectionLabel(card.station, language)} · Phase ${stageIndex + 1}`}
                            </p>

                            {renderStage(stage, innerShift, innerContentWidth)}

                            {stageIndex === stagePanels.length - 1 && (
                              <div className="shrink-0 pt-3">
                                <Link
                                  to={`/stations/${createStationSlug(card.station.name)}`}
                                  className={`inline-flex w-fit items-center rounded-full px-4 py-2 text-sm font-medium transition ${ctaClass}`}
                                >
                                  {getStationSectionLabel(card.station, language)}
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 flex w-[min(92vw,32rem)] -translate-x-1/2 flex-col gap-3">
                    <div className={`rounded-full px-4 py-3 backdrop-blur-xl ${progressShellClass}`}>
                      <div className={`mb-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.24em] ${subtleTextClass}`}>
                        <span>{copy.stationProgress}</span>
                        <span>{Math.round(historyState.stationProgress * 100)}%</span>
                      </div>
                      <div className={`h-2 rounded-full ${isLightTheme ? 'bg-black/8' : 'bg-white/8'}`}>
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-400 transition-[width] duration-200"
                          style={{ width: `${historyState.stationProgress * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-center gap-2">
                      {cards.map((innerCard, innerIndex) => {
                        const isActive = innerIndex === historyState.activeStation;
                        return (
                          <span
                            key={`${innerCard.station.name}-dot`}
                            className={`h-2.5 rounded-full transition-all duration-300 ${isActive ? 'w-8 bg-cyan-300' : `w-2.5 ${dotIdleClass}`}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}

type OverviewNotePosition = {
  x: number;
  y: number;
};

const overviewPositionPresets: Record<number, OverviewNotePosition[]> = {
  1: [{ x: 50, y: 14 }],
  2: [
    { x: 20, y: 32 },
    { x: 80, y: 32 },
  ],
  3: [
    { x: 50, y: 14 },
    { x: 20, y: 72 },
    { x: 80, y: 72 },
  ],
  4: [
    { x: 50, y: 14 },
    { x: 18, y: 34 },
    { x: 82, y: 34 },
    { x: 50, y: 86 },
  ],
  5: [
    { x: 50, y: 12 },
    { x: 18, y: 28 },
    { x: 82, y: 28 },
    { x: 22, y: 76 },
    { x: 78, y: 76 },
  ],
  6: [
    { x: 50, y: 12 },
    { x: 18, y: 28 },
    { x: 82, y: 28 },
    { x: 16, y: 58 },
    { x: 84, y: 58 },
    { x: 50, y: 86 },
  ],
  7: [
    { x: 50, y: 12 },
    { x: 18, y: 24 },
    { x: 82, y: 24 },
    { x: 12, y: 50 },
    { x: 88, y: 50 },
    { x: 24, y: 78 },
    { x: 76, y: 78 },
  ],
  8: [
    { x: 50, y: 12 },
    { x: 22, y: 18 },
    { x: 78, y: 18 },
    { x: 10, y: 40 },
    { x: 90, y: 40 },
    { x: 14, y: 70 },
    { x: 86, y: 70 },
    { x: 50, y: 88 },
  ],
};

function getOverviewNotePositions(count: number): OverviewNotePosition[] {
  if (overviewPositionPresets[count]) {
    return overviewPositionPresets[count];
  }

  const radiusX = 38;
  const radiusY = 33;

  return Array.from({ length: count }, (_, index) => {
    const angle = (-Math.PI / 2) + (index / count) * Math.PI * 2;
    return {
      x: 50 + Math.cos(angle) * radiusX,
      y: 50 + Math.sin(angle) * radiusY,
    };
  });
}

// Main page component. Reads the `stationSlug` param, fetches the detail data
// via `getStationDetailData`, sets up section refs, and renders the composed page.
function StationDetailPage() {
  const { stationSlug = '' } = useParams();
  const { language, setLanguage } = useAppLanguage('en');
  const copy = pageCopy[language];
  const detail = getStationDetailData(stationSlug);
  const [highlightedNoteId, setHighlightedNoteId] = useState<string | null>(null);
  const [overviewAspectRatio, setOverviewAspectRatio] = useState<number | undefined>(undefined);
  const pageScrollRef = useRef<HTMLDivElement | null>(null);
  const overviewBoardRef = useRef<HTMLDivElement | null>(null);
  const introSectionRef = useRef<HTMLElement | null>(null);
  const researchSectionRef = useRef<HTMLElement | null>(null);
  const thematicSectionRef = useRef<HTMLElement | null>(null);
  const referencesSectionRef = useRef<HTMLElement | null>(null);

  if (!detail) {
    return (
      <div className="h-screen overflow-y-auto bg-[#081221] px-6 pb-24 pt-0 text-white md:px-10">
        <LanguageToggle language={language} onChange={setLanguage} />
        <div className="mx-auto flex max-w-3xl flex-col items-center rounded-[32px] border border-white/10 bg-white/6 px-8 py-14 pt-28 text-center shadow-[0_24px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl md:pt-32">
          <p className="rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
            Shenzhen Metro AI Map
          </p>
          <h1 className="mt-6 text-3xl font-semibold md:text-4xl">{copy.notFoundTitle}</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
            {copy.notFoundText}
          </p>
          <Link
            to="/map"
            className="mt-8 inline-flex items-center rounded-full border border-emerald-300/40 bg-emerald-400/15 px-5 py-3 text-sm font-medium text-emerald-100 transition hover:border-emerald-200/70 hover:bg-emerald-400/25"
          >
            {copy.returnMap}
          </Link>
        </div>
      </div>
    );
  }

  const { station, areaLabel, areaLabelCn, sharedStations, siblings, template, sections } = detail;
  const facts = getStationQuickFacts(detail, language);
  const stationDisplayName = language === 'zh' ? station.nameCn || station.name : station.name;
  const overviewImage = sections.overviewImage ?? (sections.overviewImageSrc ? { src: sections.overviewImageSrc } : undefined);
  const overviewCards = (sections.overviewNotes ?? []).map((note) => ({
    id: note.id,
    title: note.title[language],
    description: note.description[language],
    image: note.image,
  }));
  const overviewPoints = sections.overviewPoints ?? [];
  const remoteSensingBeforeOptions = sections.remoteSensingBeforeOptions ?? [];
  const remoteSensingAfterOptions = sections.remoteSensingAfterOptions ?? [];
  const headerGalleryImages = useMemo(() => {
    const fallbackImages = [
      stationDetailMedia.researchMap,
      stationDetailMedia.beforeTransitEdge,
      stationDetailMedia.afterTransitEdge,
      stationDetailMedia.beforeGreenNetwork,
      stationDetailMedia.afterGreenNetwork,
    ];

    const collected = [
      overviewImage?.src,
      ...remoteSensingBeforeOptions.map((item) => item.src),
      ...remoteSensingAfterOptions.map((item) => item.src),
      ...fallbackImages,
    ].filter((src): src is string => Boolean(src));

    const unique = Array.from(new Set(collected));
    return unique.slice(0, Math.max(5, Math.min(8, unique.length)));
  }, [overviewImage?.src, remoteSensingBeforeOptions, remoteSensingAfterOptions]);
  const headerGalleryLoop = useMemo(
    () => [...headerGalleryImages, ...headerGalleryImages],
    [headerGalleryImages]
  );
  const historyCards = sections.historyCards ?? [];
  const historyScrollMode = sections.historyScrollMode ?? 'horizontal';
  const thematicRelations = sections.thematicRelations ?? [];
  const references = sections.references ?? [];
  const sectionTitles = sections.sectionTitles;
  const getReferenceEntries = (text: string) => {
    const normalizedText = text.trim();
    if (!normalizedText) return [] as string[];

    const doubleBracketMatches = Array.from(normalizedText.matchAll(/\[\[(.*?)\]\]/g))
      .map((match) => match[1]?.trim() ?? '')
      .map((entry) => entry.replace(/^\[+\s*/, '').replace(/\s*\]+$/, '').trim())
      .filter((entry) => entry.length > 0);

    if (doubleBracketMatches.length > 0) {
      return doubleBracketMatches;
    }

    const delimiterSplit = normalizedText
      .split('[]')
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);

    if (delimiterSplit.length > 1) {
      return delimiterSplit;
    }

    return [normalizedText];
  };
  const developmentText = template.development[language].trim();
  const hasOverviewImage = Boolean(overviewImage?.src);
  const hasOverviewCards = overviewCards.length > 0;
  const hasOverviewBoard = hasOverviewImage || hasOverviewCards;
  const hasOverviewPoints = overviewPoints.length > 0;
  const hasRemoteSensingSection =
    remoteSensingBeforeOptions.length > 0 && remoteSensingAfterOptions.length > 0;
  const useMorphTransition = hasOverviewImage && hasRemoteSensingSection && !hasOverviewCards;
  const hasResearchSection = hasOverviewBoard || hasOverviewPoints || hasRemoteSensingSection;
  const hasHistorySection = historyCards.length > 0;
  const hasThematicSection = thematicRelations.length > 0;
  const hasReferencesGrid = references.length > 0;
  const hasDevelopmentPanel = Boolean(developmentText) || siblings.length > 0;
  const hasReferencesSection = hasReferencesGrid || hasDevelopmentPanel;
  const researchSectionTitle = sectionTitles?.research?.[language] ?? copy.overviewDiagramTitle;
  const historySectionTitle = sectionTitles?.history?.[language] ?? copy.sections[2];
  const historySectionDescription =
    historyScrollMode === 'vertical' ? copy.historyHintVertical : copy.historyHint;
  const thematicSectionTitle = sectionTitles?.thematic?.[language] ?? copy.mobility;
  const referencesSectionTitle = sectionTitles?.references?.[language] ?? copy.focus;
  const useInteractiveOverviewBoard = hasOverviewImage && hasOverviewCards;
  const useSideBySideOverviewBoard = hasOverviewImage && hasOverviewCards && !useMorphTransition;
  const sectionNavItems: SectionNavItem[] = [];
  let sectionOrder = 1;

  useEffect(() => {
    if (!overviewImage?.src) {
      setOverviewAspectRatio(undefined);
      return;
    }

    let cancelled = false;
    const image = new Image();
    image.onload = () => {
      if (!cancelled && image.naturalWidth > 0) {
        setOverviewAspectRatio(image.naturalHeight / image.naturalWidth);
      }
    };
    image.src = overviewImage.src;

    return () => {
      cancelled = true;
    };
  }, [overviewImage?.src]);

  if (hasResearchSection) {
    sectionNavItems.push({ id: 'research-map', label: copy.sections[0], level: 0, order: sectionOrder });
    sectionOrder += 1;
  }

  if (hasHistorySection) {
    sectionNavItems.push({ id: 'area-history', label: copy.sections[2], level: 0, order: sectionOrder });
    historyCards.forEach((card) => {
      const stationNavId = getHistoryStationNavId(card.station.name);

      sectionNavItems.push({
        id: stationNavId,
        label: getStationSectionLabel(card.station, language),
        level: 1,
        parentId: 'area-history',
      });

      card.stages.forEach((stage, stageIndex) => {
        sectionNavItems.push({
          id: getHistoryPhaseNavId(card.station.name, stage.id, stageIndex),
          label: getHistoryPhaseNavLabel(stageIndex, language),
          level: 2,
          parentId: stationNavId,
        });
      });
    });
    sectionOrder += 1;
  }

  if (hasThematicSection) {
    sectionNavItems.push({ id: 'thematic-relations', label: copy.sections[3], level: 0, order: sectionOrder });
    sectionOrder += 1;
  }

  if (hasReferencesSection) {
    sectionNavItems.push({ id: 'references', label: copy.sections[4], level: 0, order: sectionOrder });
  }
  const defaultOverviewPositions = useMemo(
    () => getOverviewNotePositions(overviewCards.length),
    [overviewCards.length]
  );
  const [overviewPositions, setOverviewPositions] = useState<OverviewNotePosition[]>(defaultOverviewPositions);
  const [dragState, setDragState] = useState<{
    index: number;
    startClientX: number;
    startClientY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const [expandedThematicCards, setExpandedThematicCards] = useState<Record<string, boolean>>({});
  const [expandedReferenceCards, setExpandedReferenceCards] = useState<Record<string, boolean>>({});
  const [showRunnerGallery, setShowRunnerGallery] = useState(true);
  const [pageBackground, setPageBackground] = useState(PAGE_DARK);
  const pageTone = getColorBrightness(pageBackground) > 170 ? 'light' : 'dark';
  const isLightPage = pageTone === 'light';
  const adaptiveTextClass = isLightPage ? 'text-zinc-950' : 'text-white';
  const adaptiveMutedClass = isLightPage ? 'text-zinc-700' : 'text-white/72';
  const adaptiveSubtleClass = isLightPage ? 'text-zinc-500' : 'text-white/45';
  const adaptiveChipClass = isLightPage
    ? 'border-zinc-900/10 bg-zinc-900/5 text-zinc-700'
    : 'border-white/12 bg-white/10 text-white/78';
  const adaptivePrimaryCardClass = isLightPage
    ? ''
    : '';
  const navChildrenByParent = useMemo(() => {
    const children = new Map<string, SectionNavItem[]>();

    sectionNavItems.forEach((item) => {
      if (!item.parentId) return;

      const siblings = children.get(item.parentId) ?? [];
      siblings.push(item);
      children.set(item.parentId, siblings);
    });

    return children;
  }, [sectionNavItems]);
  const navItemById = useMemo(() => {
    return new Map(sectionNavItems.map((item) => [item.id, item]));
  }, [sectionNavItems]);
  const defaultExpandedNavIds = useMemo(() => {
    const expandedState: Record<string, boolean> = {};

    sectionNavItems.forEach((item) => {
      if (navChildrenByParent.has(item.id)) {
        expandedState[item.id] = false;
      }
    });

    return expandedState;
  }, [navChildrenByParent, sectionNavItems]);
  const [expandedNavIds, setExpandedNavIds] = useState<Record<string, boolean>>(defaultExpandedNavIds);
  const [activeNavItemId, setActiveNavItemId] = useState<string | null>(null);

  useEffect(() => {
    setExpandedNavIds((current) => {
      const nextState: Record<string, boolean> = {};

      Object.keys(defaultExpandedNavIds).forEach((key) => {
        nextState[key] = current[key] ?? defaultExpandedNavIds[key];
      });

      return nextState;
    });
  }, [defaultExpandedNavIds]);

  useEffect(() => {
    setActiveNavItemId((current) => {
      if (!current) return null;
      return sectionNavItems.some((item) => item.id === current) ? current : null;
    });
  }, [sectionNavItems]);

  const isNavItemVisible = (item: SectionNavItem) => {
    let parentId = item.parentId;

    while (parentId) {
      if (!expandedNavIds[parentId]) return false;
      parentId = navItemById.get(parentId)?.parentId;
    }

    return true;
  };

  const visibleSectionNavItems = sectionNavItems.filter(isNavItemVisible);

  const isNavItemActive = (item: SectionNavItem) => {
    if (!activeNavItemId) return false;
    if (item.id === activeNavItemId) return true;

    let parentId = navItemById.get(activeNavItemId)?.parentId;
    while (parentId) {
      if (parentId === item.id) return true;
      parentId = navItemById.get(parentId)?.parentId;
    }

    return false;
  };

  const scrollToSectionTarget = (targetId: string) => {
    const container = pageScrollRef.current;
    const target = container?.querySelector(`#${targetId}`) as HTMLElement | null;
    if (!container || !target) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const scrollOffset = targetRect.top - containerRect.top + container.scrollTop;
    container.scrollTo({ top: scrollOffset, behavior: 'smooth' });
  };

  const toggleNavItem = (itemId: string) => {
    setExpandedNavIds((current) => ({
      ...current,
      [itemId]: !current[itemId],
    }));
  };

  useEffect(() => {
    setOverviewPositions(defaultOverviewPositions);
  }, [defaultOverviewPositions, stationSlug]);

  useEffect(() => {
    setExpandedThematicCards({});
    setExpandedReferenceCards({});
  }, [stationSlug]);

  useEffect(() => {
    if (!dragState) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (!overviewBoardRef.current) return;

      const rect = overviewBoardRef.current.getBoundingClientRect();
      const deltaX = ((event.clientX - dragState.startClientX) / rect.width) * 100;
      const deltaY = ((event.clientY - dragState.startClientY) / rect.height) * 100;

      setOverviewPositions((currentPositions) =>
        currentPositions.map((position, index) => {
          if (index !== dragState.index) return position;

          return {
            x: Math.min(90, Math.max(10, dragState.originX + deltaX)),
            y: Math.min(88, Math.max(12, dragState.originY + deltaY)),
          };
        })
      );
    };

    const handlePointerUp = () => setDragState(null);

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragState]);

  useEffect(() => {
    const scrollContainer = pageScrollRef.current;
    if (!scrollContainer) return;

    const sectionPalette = [
      { top: 0, color: PAGE_DARK },
      { element: introSectionRef.current, color: PAGE_DARK },
      ...(hasResearchSection ? [{ element: researchSectionRef.current, color: PAGE_LIGHT }] : []),
      ...(hasHistorySection
        ? [{ element: scrollContainer.querySelector('#area-history') as HTMLElement | null, color: PAGE_LIGHT }]
        : []),
      ...(hasThematicSection ? [{ element: thematicSectionRef.current, color: PAGE_LIGHT }] : []),
      ...(hasReferencesSection ? [{ element: referencesSectionRef.current, color: PAGE_LIGHT }] : []),
    ];

    const updateBackground = () => {
      const scrollTop = scrollContainer.scrollTop;
      const containerRect = scrollContainer.getBoundingClientRect();
      const sectionStops = sectionPalette
        .map((section) => {
          if ('top' in section) {
            return section;
          }

          if (!section.element) return null;

          return {
            color: section.color,
            top: section.element.getBoundingClientRect().top - containerRect.top + scrollTop,
          };
        })
        .filter((section): section is { color: string; top: number } => Boolean(section))
        .sort((first, second) => first.top - second.top);

      if (sectionStops.length === 0) return;

      if (scrollTop <= sectionStops[0].top) {
        setPageBackground(sectionStops[0].color);
        return;
      }

      for (let index = 0; index < sectionStops.length - 1; index += 1) {
        const current = sectionStops[index];
        const next = sectionStops[index + 1];

        if (scrollTop >= current.top && scrollTop < next.top) {
          const range = Math.max(1, next.top - current.top);
          const progress = (scrollTop - current.top) / range;
          setPageBackground(mixHexColors(current.color, next.color, progress));
          return;
        }
      }

      setPageBackground(sectionStops[sectionStops.length - 1].color);
    };

    updateBackground();
    scrollContainer.addEventListener('scroll', updateBackground, { passive: true });
    window.addEventListener('resize', updateBackground);

    return () => {
      scrollContainer.removeEventListener('scroll', updateBackground);
      window.removeEventListener('resize', updateBackground);
    };
  }, [
    hasHistorySection,
    hasReferencesSection,
    hasResearchSection,
    hasThematicSection,
    stationSlug,
  ]);

  useEffect(() => {
    const scrollContainer = pageScrollRef.current;
    if (!scrollContainer || sectionNavItems.length === 0) return;

    const updateActiveNavItem = () => {
      const containerRect = scrollContainer.getBoundingClientRect();
      const scrollTop = scrollContainer.scrollTop;
      const activationTop = scrollTop + scrollContainer.clientHeight * 0.24;

      const sections = sectionNavItems
        .map((item) => {
          const target = scrollContainer.querySelector(`#${item.id}`) as HTMLElement | null;
          if (!target) return null;

          const targetTop = target.getBoundingClientRect().top - containerRect.top + scrollTop;
          return { id: item.id, top: targetTop };
        })
        .filter((entry): entry is { id: string; top: number } => Boolean(entry))
        .sort((a, b) => a.top - b.top);

      if (sections.length === 0) return;

      if (activationTop < sections[0].top) {
        setActiveNavItemId(null);
        return;
      }

      const reachedSections = sections.filter((entry) => entry.top <= activationTop);
      const active = reachedSections[reachedSections.length - 1] ?? sections[0];
      setActiveNavItemId(active.id);
    };

    updateActiveNavItem();
    scrollContainer.addEventListener('scroll', updateActiveNavItem, { passive: true });
    window.addEventListener('resize', updateActiveNavItem);

    return () => {
      scrollContainer.removeEventListener('scroll', updateActiveNavItem);
      window.removeEventListener('resize', updateActiveNavItem);
    };
  }, [sectionNavItems, stationSlug]);

  return (
    <div
      ref={pageScrollRef}
      className="h-screen overflow-x-hidden overflow-y-auto px-4 pt-0 pb-32 text-white md:px-8"
      style={{
        overscrollBehaviorY: 'contain',
        WebkitOverflowScrolling: 'touch',
        backgroundColor: pageBackground,
        transition: 'background-color 180ms linear',
      }}
    >
      <LanguageToggle language={language} onChange={setLanguage} />
      <style>
        {`
          @keyframes stationHeaderGalleryDrift {
            from { transform: translate3d(0, 0, 0); }
            to { transform: translate3d(-50%, 0, 0); }
          }
        `}
      </style>

      {/* ── FLOATING SECTION NAVIGATOR ──────────────────────────────────────
           Fixed to the right side of the viewport. Stays on screen through
           all scroll positions. Click any item to smooth-scroll the page
           container (pageScrollRef) to that section.
           Hidden on mobile (md:flex) to avoid covering content.
           ─────────────────────────────────────────────────────────────────── */}
      {sectionNavItems.length > 0 && (
        <nav
          className="fixed right-6 top-1/2 z-50 hidden -translate-y-1/2 flex-col md:flex"
          aria-label={copy.sectionNav}
        >
          <div className={`flex max-h-[72vh] flex-col gap-0.5 overflow-y-auto rounded-2xl border p-3 backdrop-blur-xl ${
            isLightPage
              ? 'border-black/10 bg-white/82 shadow-[0_12px_40px_rgba(0,0,0,0.12)]'
              : 'border-white/10 bg-[#07121d]/72 shadow-[0_12px_40px_rgba(0,0,0,0.28)]'
          }`}>
            <p className={`mb-2 px-1 text-[9px] font-semibold uppercase tracking-[0.28em] ${
              isLightPage ? 'text-zinc-400' : 'text-white/35'
            }`}>
              {copy.sectionNav}
            </p>
            {visibleSectionNavItems.map((item) => {
              const hasChildren = navChildrenByParent.has(item.id);
              const isExpanded = expandedNavIds[item.id];
              const isActive = isNavItemActive(item);

              return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (hasChildren) {
                    toggleNavItem(item.id);
                  }

                  scrollToSectionTarget(item.id);
                }}
                aria-expanded={hasChildren ? isExpanded : undefined}
                className={`flex items-center gap-2.5 rounded-xl text-left transition-all duration-150 ${
                  item.level === 0
                    ? 'px-2.5 py-1.5 text-xs font-medium'
                    : item.level === 1
                      ? 'ml-4 px-2 py-1 text-[11px] font-medium'
                      : 'ml-8 px-2 py-1 text-[11px]'
                } ${
                  isActive
                    ? 'text-[#3EB181]'
                    : isLightPage
                      ? 'text-zinc-600 hover:bg-cyan-500/10 hover:text-cyan-900'
                      : 'text-white/55 hover:bg-cyan-400/12 hover:text-cyan-100'
                }`}
              >
                {item.level === 0 ? (
                  <span className={`w-5 shrink-0 text-[10px] font-semibold tabular-nums ${
                    isActive ? 'text-[#3EB181]' : isLightPage ? 'text-zinc-400' : 'text-white/30'
                  }`}>
                    {String(item.order ?? 0).padStart(2, '0')}
                  </span>
                ) : (
                  <span className={`shrink-0 ${item.level === 1 ? 'w-2.5' : 'w-4'} ${
                    isActive ? 'text-[#3EB181]' : isLightPage ? 'text-zinc-300' : 'text-white/20'
                  }`}>
                    {item.level === 1 ? '•' : '·'}
                  </span>
                )}
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {hasChildren && (
                  <span className={`shrink-0 text-[10px] transition-transform duration-150 ${isExpanded ? 'rotate-90' : ''} ${
                    isActive ? 'text-[#3EB181]' : isLightPage ? 'text-zinc-400' : 'text-white/35'
                  }`}>
                    ›
                  </span>
                )}
              </button>
              );
            })}
          </div>
        </nav>
      )}

      <div className="w-full pt-24 md:pt-28">
        <Link
          to="/map"
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium backdrop-blur-md transition ${isLightPage ? 'border border-black/10 bg-white/72 text-zinc-700 hover:border-black/20 hover:bg-white/90 hover:text-zinc-950' : 'border border-white/12 bg-white/8 text-white/75 hover:border-white/30 hover:bg-white/12 hover:text-white'}`}
        >
          ← {copy.back}
        </Link>

        <section ref={introSectionRef} className={`${lightBandClass} mt-6 flex min-h-screen items-center`}>
          <div className={`${bandInnerClass} relative`}>
          {showRunnerGallery && headerGalleryImages.length > 0 && (
            <div className="pointer-events-none absolute left-0 right-0 top-0 h-36 overflow-hidden rounded-[34px] md:h-44">
              <div className="absolute inset-0 flex items-start">
                <div
                  className="flex w-max items-center gap-4 pr-4"
                  style={{ animation: 'stationHeaderGalleryDrift 56s linear infinite', willChange: 'transform' }}
                >
                  {headerGalleryLoop.map((src, index) => (
                    <figure
                      key={`header-gallery-${src}-${index}`}
                      className="h-24 w-40 overflow-hidden rounded-2xl md:h-28 md:w-48"
                    >
                      <img
                        src={src}
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full object-cover"
                        style={{
                          filter: 'none',
                          opacity: 1,
                          mixBlendMode: 'normal',
                        }}
                      />
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          )}
          {headerGalleryImages.length > 0 && (
            <div className="absolute right-4 top-4 z-20 md:right-6">
              <button
                type="button"
                onClick={() => setShowRunnerGallery((current) => !current)}
                className="rounded-full border border-white/28 bg-black/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/92 backdrop-blur-sm transition hover:bg-black/32"
              >
                {showRunnerGallery ? copy.hideRunnerGallery : copy.showRunnerGallery}
              </button>
            </div>
          )}
          <div className={`overflow-hidden rounded-[34px] ${adaptivePrimaryCardClass}`}>
          <div className={`relative z-10 px-6 pb-8 md:px-10 md:pb-10 ${showRunnerGallery ? 'pt-44 md:pt-52' : 'pt-12 md:pt-14'}`}>
            <div>
              <p className="inline-flex rounded-full border border-white/35 bg-white/14 px-4 py-1 text-xs font-semibold uppercase tracking-[0.34em] text-white/95">
                {copy.sharedTemplate}
              </p>
              <h1 className="mt-5 text-4xl font-semibold leading-tight text-white md:text-5xl">
                {stationDisplayName}
              </h1>
              
              <p className="mt-6 max-w-3xl text-base leading-8 text-white/88 md:text-lg">
                {getStationHeadline(detail, language)}
              </p>

            </div>

            <div className="mt-8 overflow-x-auto pb-1">
              <div className="flex min-w-max flex-nowrap items-center gap-3">
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-full border border-white/35 bg-transparent px-4 py-2.5"
                  >
                    <div className="flex items-center gap-2.5 whitespace-nowrap">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/72">
                        {fact.label}
                      </span>
                      <span className="text-sm font-semibold text-white">{fact.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
          </div>
        </section>

        {hasResearchSection && (
          <StickySectionFrame
            id="research-map"
            sectionRef={researchSectionRef}
            theme="light"
            eyebrow={copy.sections[0]}
            title={researchSectionTitle}
            description={copy.overviewDiagramText}
            fullWidth
          >
            <div className={lightSectionClass}>
            <div className="mb-4 rounded-2xl p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-800/80">{copy.sections[0]}</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#3EB181] md:text-3xl">{researchSectionTitle}</h2>
              <p className="max-w-4xl text-sm leading-7 text-zinc-700 md:text-base">{copy.overviewDiagramText}</p>
            </div>
            <div className="grid gap-6">
              {hasOverviewBoard && (
                <article className="flex min-h-screen flex-col justify-start rounded-[28px] p-5 md:p-6">
                  <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">{copy.sharedTemplate}</p>
                      <h3 className="mt-2 text-xl font-semibold text-zinc-950">{language === 'zh' ? areaLabelCn : areaLabel}</h3>
                    </div>
                    <div className="rounded-2xl px-4 py-3 text-right">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">{copy.related}</p>
                      <p className="mt-1 text-lg font-semibold text-zinc-950">{sharedStations.length}</p>
                    </div>
                  </div>

                  <div
                    ref={overviewBoardRef}
                    className={useSideBySideOverviewBoard
                      ? 'grid gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-start'
                      : useInteractiveOverviewBoard
                        ? 'relative grid gap-4 lg:min-h-[54rem] lg:grid-cols-1'
                        : 'grid gap-4'}
                  >
                    {!useSideBySideOverviewBoard && useInteractiveOverviewBoard && (
                      <svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" aria-hidden="true">
                        {overviewPositions.map((position, index) => (
                          <line
                            key={`${overviewCards[index]?.id ?? index}-connector`}
                            x1="50%"
                            y1="50%"
                            x2={`${position.x}%`}
                            y2={`${position.y}%`}
                            stroke="rgba(14, 116, 144, 0.22)"
                            strokeWidth="1.5"
                            strokeDasharray="6 8"
                          />
                        ))}
                      </svg>
                    )}

                    {hasOverviewImage && !useMorphTransition && (
                      <div className={`w-full rounded-[32px] p-5 ${
                        useSideBySideOverviewBoard
                          ? 'lg:max-w-[32rem]'
                          : useInteractiveOverviewBoard
                          ? 'lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2'
                          : ''
                      }`}>
                        {sections.useInteractiveMap && overviewImage?.src ? (
                          <ShuibeiOverviewMap
                            imageSrc={overviewImage.src}
                            language={language}
                            activeNoteId={highlightedNoteId}
                            onHighlight={setHighlightedNoteId}
                          />
                        ) : (
                          <div className="overflow-hidden rounded-[22px] border border-black/10 bg-white">
                            <img
                              src={overviewImage?.src}
                              alt={overviewImage?.alt?.[language] ?? copy.researchMapCaption}
                              className="block h-auto w-full object-contain"
                            />
                          </div>
                        )}
                        {overviewImage?.caption && (
                          <p className="mt-3 text-xs leading-6 text-zinc-600">{overviewImage.caption[language]}</p>
                        )}
                      </div>
                    )}

                    {hasOverviewCards && (
                      <div className={useSideBySideOverviewBoard
                        ? 'grid gap-4'
                        : useInteractiveOverviewBoard
                          ? 'grid gap-4 lg:block'
                          : 'grid gap-4 md:grid-cols-2 xl:grid-cols-3'}>
                        {overviewCards.map((card, index) => (
                          <div
                            key={card.id}
                            className={useSideBySideOverviewBoard
                              ? ''
                              : useInteractiveOverviewBoard
                                ? 'lg:absolute lg:w-[29rem] lg:-translate-x-1/2 lg:-translate-y-1/2'
                                : ''}
                            style={!useSideBySideOverviewBoard && useInteractiveOverviewBoard
                              ? {
                                  left: `${overviewPositions[index]?.x ?? 50}%`,
                                  top: `${overviewPositions[index]?.y ?? 50}%`,
                                }
                              : undefined}
                          >
                            {!useSideBySideOverviewBoard && useInteractiveOverviewBoard && (
                              <div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-700/20 bg-cyan-500/25 shadow-[0_0_18px_rgba(14,165,233,0.18)] lg:block" />
                            )}
                            <article
                              className={`relative rounded-[24px] border bg-transparent p-5 ${
                                !useSideBySideOverviewBoard && useInteractiveOverviewBoard ? 'lg:backdrop-blur-xl' : ''
                              } ${
                                !useSideBySideOverviewBoard && useInteractiveOverviewBoard && dragState?.index === index
                                  ? 'lg:cursor-grabbing'
                                  : !useSideBySideOverviewBoard && useInteractiveOverviewBoard
                                    ? 'lg:cursor-grab'
                                    : ''
                              }`}
                              style={{
                                borderColor: 'rgba(0,0,0,0.10)',
                              }}
                              onMouseEnter={() => {
                                if (sections.useInteractiveMap) {
                                  setHighlightedNoteId(card.id);
                                }
                              }}
                              onMouseLeave={() => {
                                if (sections.useInteractiveMap) {
                                  setHighlightedNoteId(null);
                                }
                              }}
                              onPointerDown={(event) => {
                                if (useSideBySideOverviewBoard || !useInteractiveOverviewBoard || window.innerWidth < 1024) return;

                                event.preventDefault();
                                setDragState({
                                  index,
                                  startClientX: event.clientX,
                                  startClientY: event.clientY,
                                  originX: overviewPositions[index]?.x ?? 50,
                                  originY: overviewPositions[index]?.y ?? 50,
                                });
                              }}
                            >
                              {card.image?.src && (
                                <figure className="mb-3 overflow-hidden rounded-2xl">
                                  <img
                                    src={card.image.src}
                                    alt={card.image.alt?.[language] ?? card.title}
                                    className="h-40 w-full object-cover"
                                  />
                                  {card.image.caption && (
                                    <figcaption className="px-3 py-2 text-[11px] leading-5 text-zinc-600">
                                      {card.image.caption[language]}
                                    </figcaption>
                                  )}
                                </figure>
                              )}
                              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-800/70">{card.title}</p>
                              <p className="mt-3 text-sm leading-7 text-zinc-700">{card.description}</p>
                            </article>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              )}

              {hasOverviewPoints && (
                <article className="rounded-[24px] p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">{copy.overviewTitle}</p>
                  <div className="mt-4 grid gap-3">
                    {overviewPoints.map((point) => (
                      <div key={point.en} className="rounded-2xl px-4 py-4 text-sm leading-7 text-zinc-700">
                        {point[language]}
                      </div>
                    ))}
                  </div>
                </article>
              )}

              {useMorphTransition && hasOverviewImage && (
                <OverviewToSliderMorph
                  overviewSlot={sections.useInteractiveMap && overviewImage?.src ? (
                    <ShuibeiOverviewMap
                      imageSrc={overviewImage.src}
                      language={language}
                      activeNoteId={highlightedNoteId}
                      onHighlight={setHighlightedNoteId}
                      fillContainer
                    />
                  ) : (
                    <img
                      src={overviewImage?.src}
                      alt={overviewImage?.alt?.[language] ?? copy.researchMapCaption}
                      className="h-full w-full object-contain"
                      draggable={false}
                    />
                  )}
                  overviewCaption={overviewImage?.caption?.[language]}
                  overviewAspectRatio={overviewAspectRatio}
                  beforeOptions={remoteSensingBeforeOptions}
                  afterOptions={remoteSensingAfterOptions}
                  remoteSensingIntro={sections.remoteSensingIntro?.[language]}
                  language={language}
                  scrollContainerRef={pageScrollRef}
                  beforeLabel={copy.beforeLabel}
                  afterLabel={copy.afterLabel}
                />
              )}

              {hasRemoteSensingSection && !useMorphTransition && (
                <article className="flex min-h-screen flex-col justify-center rounded-[24px] p-5">
                  <div className="mb-5 flex justify-center">
                    {sections.remoteSensingIntro && (
                      <p className="max-w-3xl text-center text-sm leading-7 text-zinc-800">
                        {sections.remoteSensingIntro[language]}
                      </p>
                    )}
                  </div>
                  <BeforeAfterSlider
                    language={language}
                    beforeOptions={remoteSensingBeforeOptions}
                    afterOptions={remoteSensingAfterOptions}
                    initialBeforeId={remoteSensingBeforeOptions[0]?.id}
                    initialAfterId={remoteSensingAfterOptions[0]?.id}
                    initialPosition={50}
                    height={Math.max(
                      700,
                      (pageScrollRef.current?.clientHeight
                        ?? (typeof window !== 'undefined' ? window.innerHeight : 900)) - 56
                    )}
                    fullViewport
                  />
                </article>
              )}
            </div>
            </div>
          </StickySectionFrame>
        )}

        {hasHistorySection && (
          <HistoryJourneySection
            language={language}
            cards={historyCards}
            eyebrow={copy.sections[2]}
            title={historySectionTitle}
            description={historySectionDescription}
            scrollMode={historyScrollMode}
            copy={{
              historyJourneyLabel: copy.historyJourneyLabel,
              historyLayoutLabel: copy.historyLayoutLabel,
              historyLayoutHorizontal: copy.historyLayoutHorizontal,
              historyLayoutVertical: copy.historyLayoutVertical,
              stationCounter: copy.stationCounter,
              stationProgress: copy.stationProgress,
              beforeLabel: copy.beforeLabel,
              afterLabel: copy.afterLabel,
              contentFlowBlock: copy.contentFlowBlock,
              stageOverviewBlock: copy.stageOverviewBlock,
              summaryBlock: copy.summaryBlock,
              notesBlock: copy.notesBlock,
              highlightsBlock: copy.highlightsBlock,
              mediaBlock: copy.mediaBlock,
              remoteSensingBlock: copy.remoteSensingBlock,
            }}
            scrollContainerRef={pageScrollRef}
            theme="light"
          />
        )}

        {hasThematicSection && (
          <StickySectionFrame
            id="thematic-relations"
            sectionRef={thematicSectionRef}
            theme="light"
            eyebrow={copy.sections[3]}
            title={thematicSectionTitle}
            description={copy.thematicHint}
          >
            <div className="w-full">
            <div className="mb-4 rounded-2xl p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-800/80">{copy.sections[3]}</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#3EB181] md:text-3xl">{thematicSectionTitle}</h2>
              <p className="max-w-4xl text-sm leading-7 text-zinc-700 md:text-base">{copy.thematicHint}</p>
            </div>
            <div className="grid gap-0">
              {thematicRelations.map((item) => {
                const isThematicCardExpanded = Boolean(expandedThematicCards[item.id]);
                const thematicToggleLabel = language === 'zh'
                  ? (isThematicCardExpanded ? '收起' : '展开')
                  : (isThematicCardExpanded ? 'Collapse' : 'Expand');
                const thematicParagraphs = (item.paragraphs?.length ? item.paragraphs : [item.summary])
                  .map((paragraph) => paragraph[language]);
                const thematicText = thematicParagraphs.join('\n\n');
                const thematicGalleryCollections = item.galleries?.length
                  ? item.galleries.filter((collection) => collection.items.length > 0)
                  : item.gallery?.length
                    ? [{ id: `${item.id}-gallery-1`, items: item.gallery }]
                    : item.imageSrc
                      ? [{ id: `${item.id}-gallery-cover`, items: [{ id: `${item.id}-cover`, src: item.imageSrc }] }]
                      : [];
                const hasThematicGallery = thematicGalleryCollections.length > 0;

                return (
                  <div
                    key={item.id}
                    className={`${isThematicCardExpanded ? 'min-h-screen' : 'h-screen'} flex items-start py-6 md:py-8`}
                  >
                    <div className="w-full">
                      <article className="overflow-hidden rounded-[28px] p-5 md:p-6">
                        <h3 className="text-2xl font-semibold text-zinc-950">{item.title[language]}</h3>
                        <p className="mt-4 text-sm leading-7 text-zinc-700">{item.summary[language]}</p>

                        <div className="mt-5 flex flex-wrap gap-2">
                            {item.tags.map((tag) => (
                              <span key={tag.en} className="rounded-full border border-black/10 bg-black/[0.03] px-3 py-2 text-xs text-zinc-700">
                                {tag[language]}
                              </span>
                            ))}
                        </div>

                        <div className={`mt-6 grid gap-6 ${isThematicCardExpanded ? '' : 'max-h-[52vh] overflow-hidden'}`}>
                          <div className={`grid gap-5 ${hasThematicGallery ? 'md:grid-cols-[minmax(0,1fr)_20rem]' : ''}`}>
                            <div className="space-y-5">
                              <div className="px-4 py-3 text-sm leading-7 text-zinc-700">
                                <p className="whitespace-pre-line text-justify">{thematicText}</p>
                              </div>

                              {hasThematicGallery && (
                                <div className="space-y-4 md:hidden">
                                  {thematicGalleryCollections.map((collection) => (
                                    <div key={`${item.id}-${collection.id}-mobile`} className="p-3">
                                      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
                                        {collection.items.map((mediaItem) => (
                                          <figure key={`${mediaItem.id}-mobile`} className="overflow-hidden rounded-xl">
                                            <img
                                              src={mediaItem.src}
                                              alt={item.title[language]}
                                              className="max-h-[42vh] w-full object-contain"
                                            />
                                            {mediaItem.caption && (
                                              <figcaption className="px-3 py-2 text-xs leading-6 text-zinc-600">
                                                {mediaItem.caption[language]}
                                              </figcaption>
                                            )}
                                          </figure>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {hasThematicGallery && (
                              <aside className="hidden md:block md:sticky md:top-4">
                                <div className="space-y-4">
                                  {thematicGalleryCollections.map((collection) => (
                                    <div key={`${item.id}-${collection.id}-side`} className="space-y-3 p-3">
                                      {collection.items.map((mediaItem) => (
                                        <figure key={`${mediaItem.id}-side`} className="overflow-hidden rounded-xl">
                                          <img
                                            src={mediaItem.src}
                                            alt={item.title[language]}
                                            className="max-h-56 w-full object-contain"
                                          />
                                          {mediaItem.caption && (
                                            <figcaption className="px-3 py-2 text-xs leading-6 text-zinc-600">
                                              {mediaItem.caption[language]}
                                            </figcaption>
                                          )}
                                        </figure>
                                      ))}
                                    </div>
                                  ))}
                                </div>
                              </aside>
                            )}
                          </div>
                        </div>
                      </article>

                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setExpandedThematicCards((current) => ({
                              ...current,
                              [item.id]: !current[item.id],
                            }));
                          }}
                          className="rounded-full border border-black/12 bg-white/78 px-4 py-2 text-xs font-medium text-zinc-700 transition hover:border-cyan-700/25 hover:bg-cyan-500/10 hover:text-zinc-950"
                        >
                          {thematicToggleLabel}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            </div>
          </StickySectionFrame>
        )}

        {hasReferencesSection && (
          <StickySectionFrame
            id="references"
            sectionRef={referencesSectionRef}
            theme="light"
            eyebrow={copy.sections[4]}
            title={referencesSectionTitle}
            description={copy.notesHint}
          >
            <div className={`${lightSectionClass} w-full`}>
            <div className="mb-4 rounded-2xl p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-800/80">{copy.sections[4]}</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#3EB181] md:text-3xl">{referencesSectionTitle}</h2>
              <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-700 md:text-base">{copy.notesHint}</p>
            </div>
            {hasReferencesGrid && (
              <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
                {references.map((reference) => {
                  const isReferenceCardExpanded = Boolean(expandedReferenceCards[reference.id]);
                  const referenceToggleLabel = language === 'zh'
                    ? (isReferenceCardExpanded ? '收起' : '展开')
                    : (isReferenceCardExpanded ? 'Collapse' : 'Expand');

                  return (
                  <div key={reference.id} className="w-full">
                    <article className={`rounded-[24px] p-5 ${isReferenceCardExpanded ? '' : 'max-h-[78vh] overflow-hidden'}`}>
                      {reference.image?.src && (
                        <figure className="mb-3 overflow-hidden rounded-2xl">
                          <img
                            src={reference.image.src}
                            alt={reference.image.alt?.[language] ?? reference.title[language]}
                            className="h-36 w-full object-cover"
                          />
                          {reference.image.caption && (
                            <figcaption className="px-3 py-2 text-[11px] leading-5 text-zinc-600">
                              {reference.image.caption[language]}
                            </figcaption>
                          )}
                        </figure>
                      )}
                      <h3 className="text-lg font-semibold text-zinc-950">{reference.title[language]}</h3>
                      <div className="mt-3 space-y-3">
                        {getReferenceEntries(reference.detail[language]).map((entry, entryIndex) => (
                          <div key={`${reference.id}-entry-${entryIndex}`} className="flex items-start gap-3 rounded-xl px-3 py-2">
                            <span className="mt-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-black/12 bg-white text-[11px] font-semibold text-zinc-700">
                              {entryIndex + 1}
                            </span>
                            <p className="text-sm leading-7 text-zinc-700">{entry}</p>
                          </div>
                        ))}
                      </div>
                    </article>

                    <div className="mt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setExpandedReferenceCards((current) => ({
                            ...current,
                            [reference.id]: !current[reference.id],
                          }));
                        }}
                        className="rounded-full border border-black/12 bg-white/78 px-4 py-2 text-xs font-medium text-zinc-700 transition hover:border-cyan-700/25 hover:bg-cyan-500/10 hover:text-zinc-950"
                      >
                        {referenceToggleLabel}
                      </button>
                    </div>
                  </div>
                );})}
              </div>
            )}

            </div>
          </StickySectionFrame>
        )}
      </div>
    </div>
  );
}

export default StationDetailPage;
