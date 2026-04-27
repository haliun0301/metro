import type { MetroStation } from '../types';
import { STATIONS } from './stations';
import { stationDetailMedia } from './stationDetailMedia';
import { AREA_PAGE_CONTENT } from './areaPages/index';
import type {
  AreaPageContentOverride,
  StationHistoryRemoteSensingOverride,
  StationHistoryStageOverride,
  StationHistoryStageMediaOverride,
  StationTimelineCardOverride,
} from './areaPages/types';

/*
  data/stationDetails.ts
  - Data model and helpers used to compose station detail pages.
  - Defines TypeScript interfaces for localized content, timeline stages,
    and the assembled `StationDetailData` shape used by `StationDetailPage`.
  - Edit area templates and station-specific overrides here to change page content.
*/

export type StationDetailLanguage = 'en' | 'zh';

export interface LocalizedText {
  en: string;
  zh: string;
}

export interface AreaTemplate {
  headline: LocalizedText;
  summary: LocalizedText;
  mobility: LocalizedText;
  development: LocalizedText;
  focusTags: LocalizedText[];
}

export interface ContentImage {
  src: string;
  alt?: LocalizedText;
  caption?: LocalizedText;
}

export interface StationTimelineCard {
  station: MetroStation;
  title: LocalizedText;
  period: LocalizedText;
  summary: LocalizedText;
  highlights: LocalizedText[];
  image?: ContentImage;
  imageSrc?: string;
  stages: StationHistoryStage[];
}

export interface StationHistoryStageMedia {
  id: string;
  src: string;
  alt?: LocalizedText;
  caption?: LocalizedText;
}

export interface StationHistoryRemoteSensing {
  title?: LocalizedText;
  description?: LocalizedText;
  before: ContentImage;
  after: ContentImage;
  beforeOptions?: RemoteSensingOption[];
  afterOptions?: RemoteSensingOption[];
}

export type StationHistoryStageContentKey = 'summary' | 'notes' | 'highlights' | 'media' | 'remoteSensing';

export interface StationHistoryStage {
  id: string;
  title: LocalizedText;
  period: LocalizedText;
  summary: LocalizedText;
  highlights: LocalizedText[];
  notes: LocalizedText[];
  media: StationHistoryStageMedia[];
  remoteSensing?: StationHistoryRemoteSensing;
  contentOrder?: StationHistoryStageContentKey[];
}

export interface OverviewNote {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  image?: ContentImage;
}

export interface ThematicRelationCard {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  imageSrc?: string;
  tags: LocalizedText[];
  paragraphs?: LocalizedText[];
  gallery?: ThematicRelationMediaItem[];
  galleries?: ThematicRelationGalleryCollection[];
  diagram?: ThematicRelationDiagram;
}

export interface ThematicRelationMediaItem {
  id: string;
  src: string;
  caption?: LocalizedText;
}

export interface ThematicRelationGalleryCollection {
  id: string;
  items: ThematicRelationMediaItem[];
}

export interface ThematicRelationDiagramPoint {
  year: string;
  total: number;
}

export interface ThematicRelationDiagram {
  title: LocalizedText;
  description?: LocalizedText;
  data: ThematicRelationDiagramPoint[];
  highlightedYear?: string;
}

export interface ReferenceItem {
  id: string;
  title: LocalizedText;
  detail: LocalizedText;
  image?: ContentImage;
}

export interface RemoteSensingOption {
  id: string;
  label: LocalizedText;
  src: string;
}

export interface StationDetailSectionTitles {
  research?: LocalizedText;
  history?: LocalizedText;
  thematic?: LocalizedText;
  references?: LocalizedText;
}

export interface StationDetailSections {
  sectionTitles?: StationDetailSectionTitles;
  historyScrollMode?: 'horizontal' | 'vertical';
  overviewImage?: ContentImage;
  overviewImageSrc?: string;
  useInteractiveMap?: boolean;
  overviewNotes?: OverviewNote[];
  overviewPoints?: LocalizedText[];
  remoteSensingIntro?: LocalizedText;
  remoteSensingBeforeOptions?: RemoteSensingOption[];
  remoteSensingAfterOptions?: RemoteSensingOption[];
  historyCards?: StationTimelineCard[];
  thematicRelations?: ThematicRelationCard[];
  references?: ReferenceItem[];
}

export interface StationDetailData {
  station: MetroStation;
  slug: string;
  areaLabel: string;
  areaLabelCn: string;
  sharedStations: MetroStation[];
  siblings: MetroStation[];
  template: AreaTemplate;
  sections: StationDetailSections;
}

interface AreaTemplateRule {
  test: (areaName: string) => boolean;
  template: AreaTemplate;
}

const DETAIL_STATIONS = STATIONS.filter((station) => station.isDetail === true);

const defaultAreaName = {
  en: 'Shared station cluster',
  zh: '共享站点片区',
};

const AREA_TEMPLATE_RULES: AreaTemplateRule[] = [
  {
    test: (areaName) => /CBD|Huaqiang|Chegongmiao/i.test(areaName),
    template: {
      headline: {
        en: 'Commercial intensity and metro-driven urban exchange',
        zh: '商业强度与地铁驱动的城市交换',
      },
      summary: {
        en: 'This cluster concentrates offices, retail, and high footfall public space. Station detail pages in this group should focus on interchange convenience, walkability, and the way metro access supports all-day activity.',
        zh: '该片区集中了办公、零售与高人流公共空间。此类站点详情页应重点呈现换乘便捷性、步行体验，以及地铁可达性如何支撑全天候城市活动。',
      },
      mobility: {
        en: 'Peak flows are typically commuter-led in the morning and experience-led in the evening, with strong last-mile pressure around plazas, malls, and office towers.',
        zh: '早高峰通常以通勤客流为主，晚间则转向消费与体验型出行，广场、商场与写字楼周边往往承受较强的末端接驳压力。',
      },
      development: {
        en: 'Useful extensions for this template include commercial vitality metrics, time-of-day crowd charts, and storefront or skyline imagery around the station exits.',
        zh: '此模板后续适合补充商业活力指标、分时人流图，以及站点出入口周边的街景或天际线影像。',
      },
      focusTags: [
        { en: 'Interchange convenience', zh: '换乘便捷' },
        { en: 'Retail frontage', zh: '零售界面' },
        { en: 'Pedestrian comfort', zh: '步行舒适度' },
      ],
    },
  },
  {
    test: (areaName) => /Qianhai|Houhai|Shekou|Nanyou/i.test(areaName),
    template: {
      headline: {
        en: 'Waterfront growth, mixed-use living, and regional connection',
        zh: '滨海增长、复合生活与区域连接',
      },
      summary: {
        en: 'Stations in this group sit inside Shenzhen’s western coastal development belt. The shared detail structure works well for showing business expansion, waterfront neighbourhood life, and cross-district accessibility.',
        zh: '这一类站点位于深圳西部滨海发展带。共享详情结构适合展示商务拓展、滨水社区生活，以及跨片区的可达性。',
      },
      mobility: {
        en: 'Travel patterns often blend commuting, leisure, and destination visits. Metro access is especially important for linking residential towers, office clusters, parks, and waterfront amenities.',
        zh: '出行模式往往混合通勤、休闲与目的地访问。地铁在串联住宅、办公集群、公园与滨水设施方面尤其关键。',
      },
      development: {
        en: 'This template can later absorb shoreline mapping, business district indicators, and narrative content about how stations support coastal redevelopment.',
        zh: '该模板后续可接入滨海空间地图、商务区指标，以及站点如何支撑滨海更新的叙事内容。',
      },
      focusTags: [
        { en: 'Regional gateway', zh: '区域门户' },
        { en: 'Waterfront access', zh: '滨水可达' },
        { en: 'Mixed-use district', zh: '复合功能片区' },
      ],
    },
  },
  {
    test: (areaName) => /University|High-tech|Tanglang|Changlingpi/i.test(areaName),
    template: {
      headline: {
        en: 'Education, research, and innovation corridor',
        zh: '教育、科研与创新走廊',
      },
      summary: {
        en: 'These stations serve campus populations, research spaces, and knowledge-economy destinations. Shared pages here should highlight talent movement, daily routines, and the connection between learning spaces and urban services.',
        zh: '这些站点服务于校园人群、科研空间与知识经济目的地。共享页面适合强调人才流动、日常活动模式，以及学习空间与城市服务之间的联系。',
      },
      mobility: {
        en: 'Rider demand often peaks around class schedules and office cycles, while public-space use expands in the evening and on weekends around student-oriented amenities.',
        zh: '客流通常围绕课程时段与办公周期形成高峰，而面向学生的公共空间在晚间和周末会进一步放大使用强度。',
      },
      development: {
        en: 'Future modules could include innovation ecosystem notes, university catchment maps, and snapshots of student or researcher mobility behaviour.',
        zh: '后续可扩展创新生态说明、大学服务范围地图，以及学生或研究人员出行行为的可视化。',
      },
      focusTags: [
        { en: 'Campus access', zh: '校园可达' },
        { en: 'Innovation network', zh: '创新网络' },
        { en: 'Talent mobility', zh: '人才流动' },
      ],
    },
  },
  {
    test: (areaName) => /Buji|Huangbeiling|Shuibei|Meilin|Hongshan/i.test(areaName),
    template: {
      headline: {
        en: 'Dense urban connector with strong transfer potential',
        zh: '高密城市连接节点与强换乘潜力',
      },
      summary: {
        en: 'This cluster represents mature urban districts where metro stations help stitch together housing, commerce, and cross-line transfers. Shared pages should balance movement efficiency with neighbourhood identity.',
        zh: '这一片区多为成熟城区，地铁站承担着连接居住、商业与跨线换乘的作用。共享页面应同时体现通行效率与片区个性。',
      },
      mobility: {
        en: 'Passenger volumes are usually distributed across multiple trip purposes, making entrance management, transfer legibility, and local street integration especially important.',
        zh: '客流通常分布于多种出行目的，因此出入口组织、换乘识别性与周边街道衔接尤为重要。',
      },
      development: {
        en: 'A strong next step for this template is to add transfer diagrams, station-area walking routes, and notes on neighbourhood upgrading or public-space improvement.',
        zh: '该模板后续适合加入换乘示意、站区步行路线，以及社区更新或公共空间改善的说明。',
      },
      focusTags: [
        { en: 'Transfer legibility', zh: '换乘清晰度' },
        { en: 'Street integration', zh: '街道衔接' },
        { en: 'Neighbourhood service', zh: '社区服务' },
      ],
    },
  },
  {
    test: (areaName) => /Longcheng|Universiade|Tongle/i.test(areaName),
    template: {
      headline: {
        en: 'Eastern growth corridor and event-linked urban expansion',
        zh: '东部增长走廊与事件驱动扩展',
      },
      summary: {
        en: 'Stations here support expanding residential districts, civic destinations, and event-oriented travel. The shared template is useful for comparing how each stop anchors new development over time.',
        zh: '这些站点服务于扩展中的居住区、市政目的地与活动型出行。共享模板适合比较不同站点如何逐步锚定新发展。',
      },
      mobility: {
        en: 'Travel demand can shift between everyday commuting and occasional surges linked to venues, schools, or district-scale attractions.',
        zh: '客流会在日常通勤与场馆、学校、片区级吸引物带来的阶段性高峰之间切换。',
      },
      development: {
        en: 'Later enhancements may include development timelines, housing growth indicators, and event-day accessibility analysis.',
        zh: '后续可加入发展时间轴、居住增长指标，以及活动日可达性分析。',
      },
      focusTags: [
        { en: 'Growth monitoring', zh: '增长监测' },
        { en: 'Event access', zh: '活动可达' },
        { en: 'Emerging centres', zh: '新兴中心' },
      ],
    },
  },
  {
    test: (areaName) => /Bitou|Shatian|Biyan|Fenghuang/i.test(areaName),
    template: {
      headline: {
        en: 'Peripheral expansion and metro-led district formation',
        zh: '边缘扩展与地铁引导的片区形成',
      },
      summary: {
        en: 'These stations often sit in newer or transforming districts where metro service helps define future urban structure. Shared pages should document change, not just current activity.',
        zh: '这类站点多位于较新的或正在转型的片区，地铁服务正在参与塑造未来的城市结构。共享页面应记录变化过程，而不仅是当前状态。',
      },
      mobility: {
        en: 'Riders may rely on longer feeder trips, bus interchange, or park-and-ride style access. Coverage and network confidence matter as much as density.',
        zh: '乘客可能更多依赖接驳公交、较长的前后段出行或类似停车换乘的方式，覆盖范围与网络信心和密度同样重要。',
      },
      development: {
        en: 'This template can grow into a stronger monitoring page with land-use snapshots, new project inventories, and before-and-after area comparisons.',
        zh: '该模板后续可发展为更强的监测页面，加入用地快照、新项目清单，以及片区前后对比内容。',
      },
      focusTags: [
        { en: 'Expansion corridor', zh: '扩展走廊' },
        { en: 'Feeder access', zh: '接驳可达' },
        { en: 'Transformation tracking', zh: '转型追踪' },
      ],
    },
  },
];

const DEFAULT_TEMPLATE: AreaTemplate = {
  headline: {
    en: 'Shared metro station detail template',
    zh: '共享地铁站详情模板',
  },
  summary: {
    en: 'This page is generated from a reusable code template. It replaces the previous Framer page and provides a stable structure for station-level narratives, metrics, media, and future research modules.',
    zh: '该页面由可复用的代码模板生成，已替代此前的 Framer 页面，并为站点叙事、指标、图像与后续研究模块提供稳定结构。',
  },
  mobility: {
    en: 'The current version emphasises station context, shared area logic, and links to related stations so that the detail system can scale gradually across the metro network.',
    zh: '当前版本重点呈现站点语境、共享片区逻辑，以及与相关站点的连接方式，以便详情系统能在整个地铁网络中逐步扩展。',
  },
  development: {
    en: 'You can extend this template later with charts, photos, thematic indicators, embedded maps, or station-specific essays without changing the routing model again.',
    zh: '后续可以在不改变路由模型的前提下，继续为该模板接入图表、照片、专题指标、嵌入地图或站点专属长文内容。',
  },
  focusTags: [
    { en: 'Reusable layout', zh: '可复用布局' },
    { en: 'Area grouping', zh: '片区分组' },
    { en: 'Scalable content', zh: '可扩展内容' },
  ],
};

export function createStationSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function translateLineName(lineName: string, language: StationDetailLanguage): string {
  if (language === 'en') return lineName;

  const lineNumberMatch = lineName.match(/Line\s+(\d+)/i);
  if (lineNumberMatch) {
    return `${lineNumberMatch[1]}号线`;
  }

  return lineName;
}

function getAreaTemplate(areaName: string): AreaTemplate {
  const rule = AREA_TEMPLATE_RULES.find(({ test }) => test(areaName));
  return rule?.template ?? DEFAULT_TEMPLATE;
}

function mergeAreaTemplate(template: AreaTemplate, override?: AreaPageContentOverride): AreaTemplate {
  if (!override?.template) {
    return template;
  }

  return {
    headline: override.template.headline ?? template.headline,
    summary: override.template.summary ?? template.summary,
    mobility: override.template.mobility ?? template.mobility,
    development: override.template.development ?? template.development,
    focusTags: override.template.focusTags ?? template.focusTags,
  };
}

function getAreaContentOverride(
  station: MetroStation,
  areaLabel: string,
  areaLabelCn: string
): AreaPageContentOverride | undefined {
  const keys = [
    station.areaPageKey,
    createStationSlug(areaLabel),
    createStationSlug(areaLabelCn),
    createStationSlug(station.name),
    createStationSlug(station.nameCn || ''),
  ].filter(Boolean) as string[];

  const uniqueKeys = Array.from(new Set(keys));
  return uniqueKeys.map((key) => AREA_PAGE_CONTENT[key]).find(Boolean);
}

function getLocalizedStationName(station: MetroStation, language: StationDetailLanguage) {
  return language === 'zh' ? station.nameCn || station.name : station.name;
}

function dedupeStationsByName(stations: MetroStation[], preferredStationName?: string) {
  const uniqueStations = new Map<string, MetroStation>();

  stations.forEach((station) => {
    const key = createStationSlug(station.name);
    const existingStation = uniqueStations.get(key);

    if (!existingStation) {
      uniqueStations.set(key, station);
      return;
    }

    if (preferredStationName && station.name === preferredStationName) {
      uniqueStations.set(key, station);
    }
  });

  return Array.from(uniqueStations.values());
}

function createHistoryCard(
  station: MetroStation,
  areaLabel: string,
  areaLabelCn: string,
  index: number,
  image?: ContentImage
): StationTimelineCard {
  const title = {
    en: `${station.name} as a local anchor`,
    zh: `${station.nameCn || station.name} 的片区锚点作用`,
  };
  const period = {
    en: `Phase ${index + 1} · Station-area evolution`,
    zh: `阶段 ${index + 1} · 站区演变`,
  };
  const summary = {
    en: `${station.name} is read here as one chapter inside the ${areaLabel}. This card is intended for station-specific narratives, interviews, archival images, and district changes connected to metro access.`,
    zh: `${station.nameCn || station.name} 在此被视作${areaLabelCn}中的一个站区章节。该卡片适合承载站点叙事、访谈、档案图像，以及与地铁可达性相关的片区变化。`,
  };
  const highlights = [
    {
      en: `Exit conditions, frontage, and station arrival sequence around ${station.name}`,
      zh: `${station.nameCn || station.name} 周边出入口条件、界面与到达路径`,
    },
    {
      en: `How ${station.name} connects daily flows to the wider shared area`,
      zh: `${station.nameCn || station.name} 如何将日常流动连接到更大的共享片区`,
    },
    {
      en: `Potential place-specific materials: photos, quotes, and micro-history`,
      zh: `可补充的在地材料：照片、引语与微观历史`,
    },
  ];

  const stageIdBase = createStationSlug(station.name);
  const stageMedia: StationHistoryStageMedia[] = image
    ? [
        {
          id: `${stageIdBase}-stage-1-media-1`,
          src: image.src,
          alt: image.alt ?? title,
          caption: image.caption,
        },
      ]
    : [];

  return {
    station,
    title,
    period,
    summary,
    highlights,
    image,
    imageSrc: image?.src,
    stages: [
      {
        id: `${stageIdBase}-stage-1`,
        title,
        period,
        summary,
        highlights,
        notes: [],
        media: stageMedia,
      },
    ],
  };
}

function normalizeStageMedia(
  media: StationHistoryStageMediaOverride[] | undefined,
  stageId: string
): StationHistoryStageMedia[] {
  if (!media?.length) return [];

  return media.map((item, mediaIndex) => ({
    id: item.id ?? `${stageId}-media-${mediaIndex + 1}`,
    src: item.src,
    alt: item.alt,
    caption: item.caption,
  }));
}

function normalizeContentImage(
  image: StationHistoryStageMediaOverride | ContentImage | undefined
): ContentImage | undefined {
  if (!image?.src) return undefined;

  return {
    src: image.src,
    alt: image.alt,
    caption: image.caption,
  };
}

function normalizeRemoteSensing(
  remoteSensing: StationHistoryRemoteSensingOverride | undefined
): StationHistoryRemoteSensing | undefined {
  if (!remoteSensing) return undefined;

  const before = normalizeContentImage(remoteSensing.before);
  const after = normalizeContentImage(remoteSensing.after);

  if (!before || !after) return undefined;

  const normalizeOptionList = (
    options: RemoteSensingOption[] | undefined,
    side: 'before' | 'after'
  ): RemoteSensingOption[] | undefined => {
    if (!options?.length) return undefined;

    const normalized = options
      .map((option, index) => {
        const src = option?.src?.trim();
        if (!src) return null;

        const fallbackLabel = side === 'before'
          ? { en: `Before ${index + 1}`, zh: `前期 ${index + 1}` }
          : { en: `After ${index + 1}`, zh: `后期 ${index + 1}` };

        return {
          id: option.id?.trim() || `remote-${side}-${index + 1}`,
          label: option.label ?? fallbackLabel,
          src,
        };
      })
      .filter((option): option is RemoteSensingOption => Boolean(option));

    return normalized.length > 0 ? normalized : undefined;
  };

  const beforeOptions = normalizeOptionList(
    remoteSensing.beforeOptions ?? remoteSensing.before.options,
    'before'
  );
  const afterOptions = normalizeOptionList(
    remoteSensing.afterOptions ?? remoteSensing.after.options,
    'after'
  );

  return {
    title: remoteSensing.title,
    description: remoteSensing.description,
    before,
    after,
    beforeOptions,
    afterOptions,
  };
}

const STAGE_CONTENT_FIELD_MAP: Partial<Record<keyof StationHistoryStageOverride, StationHistoryStageContentKey>> = {
  summary: 'summary',
  notes: 'notes',
  highlights: 'highlights',
  media: 'media',
  remoteSensing: 'remoteSensing',
};

const DEFAULT_STAGE_CONTENT_ORDER: StationHistoryStageContentKey[] = [
  'summary',
  'notes',
  'highlights',
  'media',
  'remoteSensing',
];

function hasLocalizedText(text: LocalizedText | undefined): boolean {
  if (!text) return false;

  return text.en.trim().length > 0 || text.zh.trim().length > 0;
}

function hasStageContentData(
  key: StationHistoryStageContentKey,
  stage: {
    summary: LocalizedText;
    notes?: LocalizedText[];
    highlights?: LocalizedText[];
    media?: StationHistoryStageMediaOverride[] | StationHistoryStageMedia[];
    remoteSensing?: StationHistoryRemoteSensingOverride | StationHistoryRemoteSensing;
  }
): boolean {
  if (key === 'summary') return hasLocalizedText(stage.summary);
  if (key === 'notes') return Boolean(stage.notes?.length);
  if (key === 'highlights') return Boolean(stage.highlights?.length);
  if (key === 'media') return Boolean(stage.media?.length);
  return Boolean(stage.remoteSensing?.before?.src && stage.remoteSensing?.after?.src);
}

function getOrderedContentKeys(
  candidateKeys: string[],
  hasContent: (key: StationHistoryStageContentKey) => boolean
): StationHistoryStageContentKey[] {
  const ordered: StationHistoryStageContentKey[] = [];

  candidateKeys.forEach((rawKey) => {
    const contentKey = STAGE_CONTENT_FIELD_MAP[rawKey as keyof StationHistoryStageOverride];
    if (!contentKey || !hasContent(contentKey) || ordered.includes(contentKey)) return;
    ordered.push(contentKey);
  });

  DEFAULT_STAGE_CONTENT_ORDER.forEach((contentKey) => {
    if (!hasContent(contentKey) || ordered.includes(contentKey)) return;
    ordered.push(contentKey);
  });

  return ordered;
}

function normalizeStageContentOrderFromOverride(
  stage: StationHistoryStageOverride
): StationHistoryStageContentKey[] {
  const explicitOrder = stage.contentOrder?.filter(
    (contentKey, index, array) => array.indexOf(contentKey) === index && hasStageContentData(contentKey, stage)
  );
  if (explicitOrder && explicitOrder.length > 0) return explicitOrder;

  return getOrderedContentKeys(Object.keys(stage), (contentKey) =>
    hasStageContentData(contentKey, stage)
  );
}

function normalizeStageContentOrderFromStage(stage: StationHistoryStage): StationHistoryStageContentKey[] {
  return getOrderedContentKeys(Object.keys(stage), (contentKey) =>
    hasStageContentData(contentKey, stage)
  );
}

function normalizeHistoryStages(
  override: StationTimelineCardOverride,
  fallbackCard: StationTimelineCard
): StationHistoryStage[] {
  const stationSlug = createStationSlug(fallbackCard.station.name);

  if (override.stages?.length) {
    return override.stages.map((stage, stageIndex) => {
      const stageId = stage.id ?? `${stationSlug}-stage-${stageIndex + 1}`;

      return {
        id: stageId,
        title: stage.title,
        period: stage.period,
        summary: stage.summary,
        highlights: stage.highlights ?? [],
        notes: stage.notes ?? [],
        media: normalizeStageMedia(stage.media, stageId),
        remoteSensing: normalizeRemoteSensing(stage.remoteSensing),
        contentOrder: normalizeStageContentOrderFromOverride(stage),
      };
    });
  }

  const hasLegacyStageFields = Boolean(
    override.title || override.period || override.summary || override.highlights || override.image || override.imageSrc || override.remoteSensing
  );

  if (!hasLegacyStageFields) {
    return fallbackCard.stages.map((stage) => ({
      ...stage,
      contentOrder: normalizeStageContentOrderFromStage(stage),
    }));
  }

  const stageId = `${stationSlug}-stage-1`;
  return [
    {
      id: stageId,
      title: override.title ?? fallbackCard.title,
      period: override.period ?? fallbackCard.period,
      summary: override.summary ?? fallbackCard.summary,
      highlights: override.highlights ?? fallbackCard.highlights,
      notes: [],
      media: (override.image?.src || override.imageSrc)
        ? [
            {
              id: `${stageId}-media-1`,
              src: override.image?.src ?? override.imageSrc ?? '',
              alt: override.image?.alt ?? override.title ?? fallbackCard.title,
              caption: override.image?.caption,
            },
          ]
        : fallbackCard.stages[0]?.media ?? [],
      remoteSensing: normalizeRemoteSensing(override.remoteSensing),
      contentOrder: normalizeStageContentOrderFromOverride({
        title: override.title ?? fallbackCard.title,
        period: override.period ?? fallbackCard.period,
        summary: override.summary ?? fallbackCard.summary,
        highlights: override.highlights ?? fallbackCard.highlights,
        media: (override.image?.src || override.imageSrc)
          ? [
              {
                src: override.image?.src ?? override.imageSrc ?? '',
                alt: override.image?.alt ?? override.title ?? fallbackCard.title,
                caption: override.image?.caption,
              },
            ]
          : undefined,
        remoteSensing: override.remoteSensing,
      }),
    },
  ];
}

function getCardImage(
  override: StationTimelineCardOverride,
  stages: StationHistoryStage[],
  fallback?: ContentImage
): ContentImage | undefined {
  const overrideImage = normalizeContentImage(override.image);
  if (overrideImage) return overrideImage;
  if (override.imageSrc) {
    return {
      src: override.imageSrc,
      alt: override.title ?? fallback?.alt,
      caption: fallback?.caption,
    };
  }

  const firstMedia = stages.find((stage) => stage.media.length > 0)?.media[0];
  if (firstMedia?.src) {
    return {
      src: firstMedia.src,
      alt: firstMedia.alt,
      caption: firstMedia.caption,
    };
  }

  return fallback;
}

function createDefaultOverviewNotes(
  sharedStations: MetroStation[],
  areaLabel: string,
  areaLabelCn: string
): OverviewNote[] {
  return sharedStations.map((sharedStation, index) => ({
    id: createStationSlug(`${sharedStation.name}-${index}`),
    title: {
      en: sharedStation.name,
      zh: sharedStation.nameCn || sharedStation.name,
    },
    description: {
      en: `${sharedStation.line} station helps explain how ${areaLabel} combines local variation with a shared research structure.`,
      zh: `${sharedStation.nameCn || sharedStation.name} 所在的${sharedStation.line}可用于说明${areaLabelCn}内部的差异与共通结构。`,
    },
  }));
}

function createAreaHistoryCards(
  overrides: StationTimelineCardOverride[] | undefined,
  sharedStations: MetroStation[],
  areaLabel: string,
  areaLabelCn: string
): StationTimelineCard[] {
  if (!overrides?.length) {
    return sharedStations.map((sharedStation, index) =>
      createHistoryCard(sharedStation, areaLabel, areaLabelCn, index)
    );
  }

  return overrides.map((override, index) => {
    const matchedStation = override.stationName
      ? sharedStations.find((station) => station.name === override.stationName || station.nameCn === override.stationName)
      : undefined;
    const station = matchedStation ?? sharedStations[index] ?? sharedStations[0];
    const fallbackImage = normalizeContentImage(override.image)
      ?? (override.imageSrc
        ? {
            src: override.imageSrc,
            alt: override.title,
          }
        : undefined);
    const fallbackCard = createHistoryCard(station, areaLabel, areaLabelCn, index, fallbackImage);
    const stages = normalizeHistoryStages(override, fallbackCard);
    const firstStage = stages[0];
    const cardImage = getCardImage(override, stages, fallbackCard.image);

    return {
      station,
      title: override.title ?? firstStage?.title ?? fallbackCard.title,
      period: override.period ?? firstStage?.period ?? fallbackCard.period,
      summary: override.summary ?? firstStage?.summary ?? fallbackCard.summary,
      highlights: override.highlights ?? firstStage?.highlights ?? fallbackCard.highlights,
      image: cardImage,
      imageSrc: cardImage?.src ?? fallbackCard.imageSrc,
      stages,
    };
  });
}

function hasItems<T>(items: T[] | undefined): items is T[] {
  return Array.isArray(items) && items.length > 0;
}

function getSectionContent(
  station: MetroStation,
  sharedStations: MetroStation[],
  areaLabel: string,
  areaLabelCn: string,
  template: AreaTemplate,
  areaOverride?: AreaPageContentOverride
): StationDetailSections {
  const overviewImage = normalizeContentImage(areaOverride?.overviewImage)
    ?? (areaOverride?.overviewImageSrc ? { src: areaOverride.overviewImageSrc } : undefined);

  return {
    ...(areaOverride?.sectionTitles ? { sectionTitles: areaOverride.sectionTitles } : {}),
    ...(areaOverride?.historyScrollMode ? { historyScrollMode: areaOverride.historyScrollMode } : {}),
    ...(overviewImage ? { overviewImage } : {}),
    ...(areaOverride?.overviewImageSrc ? { overviewImageSrc: areaOverride.overviewImageSrc } : {}),
    ...(areaOverride?.useInteractiveMap ? { useInteractiveMap: true } : {}),
    ...(hasItems(areaOverride?.overviewNotes) ? { overviewNotes: areaOverride.overviewNotes } : {}),
    ...(hasItems(areaOverride?.overviewPoints) ? { overviewPoints: areaOverride.overviewPoints } : {}),
    ...(areaOverride?.remoteSensingIntro ? { remoteSensingIntro: areaOverride.remoteSensingIntro } : {}),
    ...(hasItems(areaOverride?.remoteSensingBeforeOptions)
      ? { remoteSensingBeforeOptions: areaOverride.remoteSensingBeforeOptions }
      : {}),
    ...(hasItems(areaOverride?.remoteSensingAfterOptions)
      ? { remoteSensingAfterOptions: areaOverride.remoteSensingAfterOptions }
      : {}),
    ...(hasItems(areaOverride?.historyCards)
      ? {
          historyCards: createAreaHistoryCards(
            areaOverride.historyCards,
            sharedStations,
            areaLabel,
            areaLabelCn
          ),
        }
      : {}),
    ...(hasItems(areaOverride?.thematicRelations)
      ? { thematicRelations: areaOverride.thematicRelations }
      : {}),
    ...(hasItems(areaOverride?.references) ? { references: areaOverride.references } : {}),
  };
}

export function getDetailStationBySlug(slug: string): MetroStation | undefined {
  return DETAIL_STATIONS.find((station) => createStationSlug(station.name) === slug);
}

export function getStationDetailData(slug: string): StationDetailData | null {
  const station = getDetailStationBySlug(slug);
  if (!station) return null;

  const areaLabel = station.area || defaultAreaName.en;
  const areaLabelCn = station.areaCn || defaultAreaName.zh;
  const sharedStations = dedupeStationsByName(
    DETAIL_STATIONS.filter((candidate) => {
      if (station.area && candidate.area) {
        return candidate.area === station.area;
      }

      return candidate.name === station.name;
    }),
    station.name
  ).sort((a, b) => a.name.localeCompare(b.name));

  const siblings = sharedStations.filter((candidate) => candidate.name !== station.name);
  const baseTemplate = getAreaTemplate(areaLabel);
  const areaOverride = getAreaContentOverride(station, areaLabel, areaLabelCn);
  const template = mergeAreaTemplate(baseTemplate, areaOverride);

  return {
    station,
    slug,
    areaLabel,
    areaLabelCn,
    sharedStations,
    siblings,
    template,
    sections: getSectionContent(station, sharedStations, areaLabel, areaLabelCn, template, areaOverride),
  };
}

export function getStationSectionLabel(station: MetroStation, language: StationDetailLanguage) {
  return getLocalizedStationName(station, language);
}

export function getStationHeadline(detail: StationDetailData, language: StationDetailLanguage): string {
  const { station, sharedStations, areaLabel, areaLabelCn } = detail;

  if (language === 'zh') {
    if (sharedStations.length > 1) {
      return `${station.nameCn || station.name} 位于${areaLabelCn}，与另外 ${sharedStations.length - 1} 个站点共享同一套详情模板。`;
    }

    return `${station.nameCn || station.name} 当前使用独立的站点详情模板，后续可继续补充专属内容模块。`;
  }

  if (sharedStations.length > 1) {
    return `${station.name} sits inside the ${areaLabel} and shares this code-based template with ${sharedStations.length - 1} related stations.`;
  }

  return `${station.name} currently uses a standalone code-based detail template that can be expanded with station-specific content over time.`;
}

export function getStationQuickFacts(detail: StationDetailData, language: StationDetailLanguage) {
  const { station, sharedStations, areaLabel, areaLabelCn } = detail;

  return [
    {
      label: language === 'zh' ? '线路' : 'Line',
      value: translateLineName(station.line, language),
    },
    {
      label: language === 'zh' ? '片区' : 'Shared area',
      value: language === 'zh' ? areaLabelCn : areaLabel,
    },
    {
      label: language === 'zh' ? '共享站点数' : 'Shared stations',
      value: `${sharedStations.length}`,
    },
    {
      label: language === 'zh' ? '换乘属性' : 'Transfer status',
      value: station.isTransfer
        ? language === 'zh'
          ? '换乘站'
          : 'Transfer station'
        : language === 'zh'
          ? '普通站'
          : 'Regular station',
    },
  ];
}
