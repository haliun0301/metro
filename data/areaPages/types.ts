import type {
  AreaTemplate,
  ContentImage,
  LocalizedText,
  OverviewNote,
  ReferenceItem,
  RemoteSensingOption,
  StationDetailSectionTitles,
  StationHistoryStageContentKey,
  ThematicRelationCard,
} from '../stationDetails';

export interface StationTimelineCardOverride {
  stationName?: string;
  title?: LocalizedText;
  period?: LocalizedText;
  summary?: LocalizedText;
  highlights?: LocalizedText[];
  image?: StationHistoryStageMediaOverride;
  imageSrc?: string;
  remoteSensing?: StationHistoryRemoteSensingOverride;
  stages?: StationHistoryStageOverride[];
}

export interface StationHistoryStageMediaOverride {
  id?: string;
  src: string;
  alt?: LocalizedText;
  caption?: LocalizedText;
  options?: RemoteSensingOption[];
}

export interface StationHistoryStageOverride {
  id?: string;
  title: LocalizedText;
  period: LocalizedText;
  summary: LocalizedText;
  contentOrder?: StationHistoryStageContentKey[];
  highlights?: LocalizedText[];
  notes?: LocalizedText[];
  media?: StationHistoryStageMediaOverride[];
  remoteSensing?: StationHistoryRemoteSensingOverride;
}

export interface StationHistoryRemoteSensingOverride {
  title?: LocalizedText;
  description?: LocalizedText;
  before: StationHistoryStageMediaOverride;
  after: StationHistoryStageMediaOverride;
  beforeOptions?: RemoteSensingOption[];
  afterOptions?: RemoteSensingOption[];
}

export interface AreaPageContentOverride {
  template?: Partial<AreaTemplate>;
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
  historyCards?: StationTimelineCardOverride[];
  thematicRelations?: ThematicRelationCard[];
  references?: ReferenceItem[];
}
