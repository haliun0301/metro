import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import LanguageToggle from './LanguageToggle';
import { useAppLanguage } from '../hooks/useAppLanguage';
import { STATIONS } from '../data/metro-stations/stations';
import { createStationSlug } from '../data/metro-stations/stationDetails';
import { METRO_AREAS, isMetroAreaMatch } from '../data/metro-stations/metroAreas';
import { THEMATIC_TOPICS } from '../data/metro-city/thematicTopics';
import { PeopleData } from '../data/metro-people/people';

const AREA_CIRCLE_COLORS = [
  '#3EB181',
  '#2F8FDA',
  '#F2B84B',
  '#D95F59',
  '#7B6DD6',
  '#E985B5',
  '#4FA7A2',
  '#D88745',
] as const;

const THEME_TILE_IMAGES = [
  '/assets/bg1.jpg',
  '/assets/station-details/shuibeiArea/Overview/overview.png',
  '/assets/station-details/shuibeiArea/Shuibei/Section 4/Remote Sensing 1/1.png',
  '/assets/station-details/shuibeiArea/Shuibei/Section 4/Remote Sensing 1/6.png',
  '/assets/station-details/shuibeiArea/Shuibei/Section 4/1.png',
  '/assets/station-details/shuibeiArea/Shuibei/Section 5/1.png',
  '/assets/station-details/shuibeiArea/Comparison/Section 2/1_1.png',
  '/assets/station-details/shuibeiArea/Comparison/Section 2/2_1.png',
  '/assets/station-details/shuibeiArea/Tianbei/Section 2/1_2.png',
  '/assets/station-details/shuibeiArea/Honghu/Section 3/1.png',
  '/assets/station-details/shuibeiArea/Shuibei/Section 2/1.png',
  '/assets/station-details/shuibeiArea/Shuibei/Section 4/Remote Sensing 2/Title.png',
] as const;

const copy = {
  menu: {
    returnHome: {
      en: 'Return home',
      zh: '返回首页',
    },
    open: {
      en: 'Open menu',
      zh: '打开菜单',
    },
    close: {
      en: 'Close menu',
      zh: '关闭菜单',
    },
    title: {
      en: 'Menu',
      zh: '菜单',
    },
  },
  sectionLabels: {
    stations: {
      en: 'METRO STATIONS',
      zh: '地铁站点',
    },
    people: {
      en: 'METRO & PEOPLE',
      zh: '地铁与人',
    },
    city: {
      en: 'METRO & CITY',
      zh: '地铁与城市',
    },
  },
  sectionOverviews: {
    stations: {
      bullets: {
        en: ['Interactive GIS-based metro map', 'Station and route visualization', 'City-wide network navigation'],
        zh: ['交互式 GIS 地铁地图', '站点与线路可视化', '全市地铁网络导览'],
      },
    },
    people: {
      bullets: {
        en: ['Demographic filtering', 'Occupation and migration patterns', 'Visual stories of metro users'],
        zh: ['人口维度筛选', '职业与迁移模式', '地铁使用者的视觉叙事'],
      },
    },
  },
} as const;

type MenuKey = 'stations' | 'people' | 'city';
type StationBrowseMode = 'areas' | 'lines';
type GlobalTopBarVariant = 'v1' | 'v2';
type PeopleMenuKey = 'introduction' | 'demographics' | 'interviews' | 'analysis';

interface StationMenuLink {
  label: string;
  route: string;
  lat: number;
  lng: number;
  lineColor?: string;
}

interface GlobalTopBarProps {
  variant?: GlobalTopBarVariant;
}

function translateLineName(lineName: string, language: 'en' | 'zh') {
  if (language === 'en') return lineName;

  const lineNumberMatch = lineName.match(/Line\s+(.+)/i);
  return lineNumberMatch ? `${lineNumberMatch[1]}号线` : lineName;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function GlobalTopBar({ variant = 'v1' }: GlobalTopBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useAppLanguage('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState<MenuKey>('stations');
  const [activeStationBrowseMode, setActiveStationBrowseMode] = useState<StationBrowseMode>('areas');
  const [activeStationArea, setActiveStationArea] = useState('');
  const [activeStationLine, setActiveStationLine] = useState('');
  const [hoveredStationCircleArea, setHoveredStationCircleArea] = useState('');
  const [activePeopleSection, setActivePeopleSection] = useState<PeopleMenuKey>('introduction');
  const isHomePage = location.pathname === '/';
  const isV2 = variant === 'v2';
  const showStationCircleMenu = true;
  const showStationMapBackground = true;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    document.body.style.overflow = menuOpen ? 'hidden' : '';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const stationAreaGroups = useMemo(() => {
    return METRO_AREAS.map((area) => {
      const stationLinks: StationMenuLink[] = STATIONS.filter(
        (station) => station.isDetail && (isMetroAreaMatch(station.area, area) || isMetroAreaMatch(station.areaCn, area))
      )
        .map((station) => ({
          label: language === 'zh' ? station.nameCn || station.name : station.name,
          route: `/stations/${createStationSlug(station.name)}`,
          lat: station.lat,
          lng: station.lng,
          lineColor: station.lineColor,
        }))
        .filter((station, index, stations) => (
          stations.findIndex((candidate) => candidate.route === station.route) === index
        ))
        .sort((a, b) => a.label.localeCompare(b.label));

      return {
        area: area.en,
        areaCn: area.zh,
        stations: stationLinks,
      };
    }).filter((group) => group.stations.length > 0);
  }, [language]);

  useEffect(() => {
    if (stationAreaGroups.length === 0) {
      setActiveStationArea('');
      return;
    }

    setActiveStationArea((currentArea) => {
      if (currentArea && stationAreaGroups.some((group) => group.area === currentArea)) {
        return currentArea;
      }

      return stationAreaGroups[0]?.area ?? '';
    });
  }, [stationAreaGroups]);

  const stationLineGroups = useMemo(() => {
    const lineMap = new Map<string, Array<{ label: string; route: string }>>();

    STATIONS.filter((station) => station.isDetail).forEach((station) => {
      station.line.split('&').map((line) => line.trim()).filter(Boolean).forEach((line) => {
        const route = `/stations/${createStationSlug(station.name)}`;
        const stationLink = {
          label: language === 'zh' ? station.nameCn || station.name : station.name,
          route,
        };
        const existingStations = lineMap.get(line) ?? [];

        if (!existingStations.some((candidate) => candidate.route === route)) {
          lineMap.set(line, [...existingStations, stationLink]);
        }
      });
    });

    return Array.from(lineMap.entries()).map(([line, stations]) => ({
      line,
      label: translateLineName(line, language),
      stations: stations.sort((a, b) => a.label.localeCompare(b.label)),
    }));
  }, [language]);

  useEffect(() => {
    if (stationLineGroups.length === 0) {
      setActiveStationLine('');
      return;
    }

    setActiveStationLine((currentLine) => {
      if (currentLine && stationLineGroups.some((group) => group.line === currentLine)) {
        return currentLine;
      }

      return stationLineGroups[0]?.line ?? '';
    });
  }, [stationLineGroups]);

  const menuItems = useMemo(() => [
    {
      key: 'stations' as const,
      label: copy.sectionLabels.stations[language],
      route: '/map',
      links: copy.sectionOverviews.stations.bullets[language],
    },
    {
      key: 'people' as const,
      label: copy.sectionLabels.people[language],
      route: '/people',
      links: copy.sectionOverviews.people.bullets[language],
    },
    {
      key: 'city' as const,
      label: copy.sectionLabels.city[language],
      route: '/thematicmap',
      links: THEMATIC_TOPICS.map((topic) => topic[language]),
    },
  ], [language]);

  const thematicThemeTiles = useMemo(() => (
    THEMATIC_TOPICS.map((topic, index) => ({
      title: topic[language],
      imageSrc: THEME_TILE_IMAGES[index % THEME_TILE_IMAGES.length],
      number: String(index + 1).padStart(2, '0'),
    }))
  ), [language]);

  const activeMenuContent = menuItems.find((item) => item.key === activeMenuItem) ?? menuItems[0];
  const activeStationGroup = stationAreaGroups.find((group) => group.area === activeStationArea) ?? stationAreaGroups[0];
  const activeLineGroup = stationLineGroups.find((group) => group.line === activeStationLine) ?? stationLineGroups[0];
  const stationCircleGroups = useMemo(() => {
    if (stationAreaGroups.length === 0) return [];

    const allLats = stationAreaGroups.flatMap((group) => group.stations.map((station) => station.lat));
    const allLngs = stationAreaGroups.flatMap((group) => group.stations.map((station) => station.lng));
    const minLat = Math.min(...allLats);
    const maxLat = Math.max(...allLats);
    const minLng = Math.min(...allLngs);
    const maxLng = Math.max(...allLngs);
    const latRange = Math.max(0.001, maxLat - minLat);
    const lngRange = Math.max(0.001, maxLng - minLng);

    return stationAreaGroups.map((group, index) => {
      const avgLat = group.stations.reduce((total, station) => total + station.lat, 0) / group.stations.length;
      const avgLng = group.stations.reduce((total, station) => total + station.lng, 0) / group.stations.length;
      const lats = group.stations.map((station) => station.lat);
      const lngs = group.stations.map((station) => station.lng);
      const spread = Math.max(Math.max(...lats) - Math.min(...lats), Math.max(...lngs) - Math.min(...lngs));
      const detailWeight = Math.min(group.stations.length, 8) / 8;

      return {
        ...group,
        x: clamp(8 + ((avgLng - minLng) / lngRange) * 84, 7, 93),
        y: clamp(10 + ((maxLat - avgLat) / latRange) * 80, 9, 91),
        radius: clamp(28 + spread * 190 + detailWeight * 20, 34, 72),
        color: AREA_CIRCLE_COLORS[index % AREA_CIRCLE_COLORS.length],
      };
    });
  }, [stationAreaGroups]);
  const hoveredStationCircleGroup = stationCircleGroups.find((group) => group.area === hoveredStationCircleArea);
  const selectedStationCircleGroup = hoveredStationCircleGroup ?? stationCircleGroups.find((group) => group.area === activeStationArea);
  const stationBrowseItems = [
    {
      key: 'areas' as const,
      label: language === 'zh' ? '片区' : 'Areas',
    },
    {
      key: 'lines' as const,
      label: language === 'zh' ? '线路' : 'Lines',
    },
  ];
  const peopleMenuItems = [
    {
      key: 'introduction' as const,
      label: language === 'zh' ? '引言' : 'Introduction',
      subtitle: language === 'zh' ? '研究入口与阅读路径' : 'Section entry and reading path',
    },
    {
      key: 'demographics' as const,
      label: language === 'zh' ? '人口特征' : 'Demographics',
      subtitle: language === 'zh' ? '性别、来源与迁移时间' : 'Gender, origin, and migration timing',
    },
    {
      key: 'interviews' as const,
      label: language === 'zh' ? '访谈记录' : 'Interview accounts',
      subtitle: language === 'zh' ? '来自地铁使用者的账户索引' : 'Indexed accounts from metro users',
    },
    {
      key: 'analysis' as const,
      label: language === 'zh' ? '分析' : 'Analysis',
      subtitle: language === 'zh' ? '职业、通勤与日常生活模式' : 'Occupation, commute, and everyday patterns',
    },
  ];
  const activePeopleMenuItem =
    peopleMenuItems.find((item) => item.key === activePeopleSection) ?? peopleMenuItems[0];
  const peopleIntroductionPassage = language === 'zh'
    ? '“地铁与人”部分以访谈对象为入口，观察深圳地铁如何嵌入居民的迁移、职业、通勤与日常生活。菜单中的层级将页面拆分为引言、人口特征、访谈记录与分析，方便在叙事和数据视图之间快速切换。'
    : 'Metro People uses interview participants as the entry point for understanding how Shenzhen metro life connects with migration, occupation, commuting, and everyday routines. This hierarchy separates the section into introduction, demographics, interview accounts, and analysis so readers can move quickly between narrative and data views.';
  const peopleDemographicItems = [
    {
      label: language === 'zh' ? '性别分布' : 'Gender distribution',
      detail: language === 'zh' ? '按性别筛选访谈对象。' : 'Filter interview participants by gender.',
    },
    {
      label: language === 'zh' ? '来源分布' : 'Origin distribution',
      detail: language === 'zh' ? '比较深圳出生与迁入深圳的访谈对象。' : 'Compare Shenzhen-born and migrated participants.',
    },
    {
      label: language === 'zh' ? '出生年代' : 'Birth decade',
      detail: language === 'zh' ? '按出生年代理解代际差异。' : 'Read generational differences by decade of birth.',
    },
    {
      label: language === 'zh' ? '来深年份' : 'Year of arrival',
      detail: language === 'zh' ? '观察不同迁入时间与城市经验。' : 'Trace arrival timing and urban experience.',
    },
  ];
  const peopleAnalysisItems = [
    {
      label: language === 'zh' ? '职业结构' : 'Occupation structure',
      detail: language === 'zh' ? '比较职业类型与地铁生活的关系。' : 'Compare occupation types and metro life patterns.',
    },
    {
      label: language === 'zh' ? '迁移与居住年限' : 'Migration and residence',
      detail: language === 'zh' ? '分析来深年限如何影响城市叙事。' : 'Analyze how years in Shenzhen shape urban narratives.',
    },
    {
      label: language === 'zh' ? '通勤与日常生活' : 'Commuting and everyday life',
      detail: language === 'zh' ? '将访谈账户连接到通勤和日常活动。' : 'Connect accounts to commuting and everyday activities.',
    },
  ];
  const interviewAccountItems = PeopleData.slice(0, 100).map((person, index) => ({
    id: person.id,
    label: `${language === 'zh' ? '引用' : 'Quote'} ${String(index + 1).padStart(3, '0')}`,
    personLabel: language === 'zh'
      ? person.nickname || person.name
      : person.nickname || person.name,
    detail: language === 'zh'
      ? `${person.occupationCn || person.occupation || '访谈对象'} · ${person.shenzhenBorn ? '深圳出生' : `来深年份 ${person.yearOfResidence ?? '未知'}`}`
      : `${person.occupation || person.occupationCn || 'Interview participant'} · ${person.shenzhenBorn ? 'Shenzhen born' : `Arrived ${person.yearOfResidence ?? 'unknown'}`}`,
  }));

  const goToMenuRoute = (route: string) => {
    setMenuOpen(false);
    navigate(route);
  };

  const returnHome = () => {
    setMenuOpen(false);
    navigate('/');
  };

  const selectMenuItem = (itemKey: MenuKey) => {
    setActiveMenuItem(itemKey);

    if (itemKey === 'stations' && stationAreaGroups.length > 0) {
      setActiveStationBrowseMode('areas');
      setActiveStationArea((currentArea) => currentArea || stationAreaGroups[0].area);
      setHoveredStationCircleArea((currentArea) => currentArea || stationAreaGroups[0].area);
    }

    if (itemKey === 'people') {
      setActivePeopleSection('introduction');
    }
  };

  return (
    <>
      <div
        data-global-top-bar
        className="fixed left-4 top-[50px] z-[3400] flex items-center gap-3 md:left-6 md:top-[50px]"
      >
        {!isHomePage && (
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/92 shadow-lg backdrop-blur-sm transition hover:bg-white focus:outline-none"
            aria-label={copy.menu.returnHome[language]}
            onClick={returnHome}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M15 6L9 12L15 18"
                stroke="rgba(42,56,62,0.72)"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/92 shadow-lg backdrop-blur-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/80"
          aria-label={copy.menu.open[language]}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect y="7" width="32" height="3" rx="1.5" fill="rgba(42,56,62,0.72)" />
            <rect y="14.5" width="32" height="3" rx="1.5" fill="rgba(42,56,62,0.72)" />
            <rect y="22" width="32" height="3" rx="1.5" fill="rgba(42,56,62,0.72)" />
          </svg>
        </button>
        <LanguageToggle
          language={language}
          onChange={setLanguage}
          fixed={false}
        />
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-[3500] flex justify-start bg-black/35 text-white backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={copy.menu.title[language]}
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label={copy.menu.close[language]}
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative flex h-full w-full flex-col overflow-y-auto bg-[#2A383E]/50 px-6 py-20 shadow-2xl md:px-10">
            <button
              type="button"
              className="absolute right-8 top-8 text-4xl font-light leading-none text-white/80 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-white/80"
              aria-label={copy.menu.close[language]}
              onClick={() => setMenuOpen(false)}
            >
              ×
            </button>
            <nav
              className="grid min-h-0 w-full flex-1 content-start gap-10 md:grid-cols-[11rem_minmax(0,1fr)]"
              aria-label={copy.menu.title[language]}
            >
              <div className="flex h-full flex-col items-start gap-8 pt-2">
                {menuItems.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className={`origin-left text-left text-xl font-semibold uppercase leading-tight tracking-wide transition duration-200 ease-out focus:outline-none md:text-2xl ${
                      activeMenuItem === item.key
                        ? 'scale-105 text-[#3EB181]'
                        : 'text-white/78 hover:scale-105 hover:text-[#3EB181] focus:scale-105 focus:text-[#3EB181]'
                    }`}
                    onMouseEnter={() => selectMenuItem(item.key)}
                    onFocus={() => selectMenuItem(item.key)}
                    onClick={() => selectMenuItem(item.key)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div
                className="h-full min-h-0 overflow-hidden text-left"
                aria-live="polite"
              >
                {activeMenuItem === 'stations' ? (
                  showStationCircleMenu ? (
                    <div className="flex h-full min-h-[650px] flex-col">
                      <div className="shrink-0 pb-4">
                        <div className="text-xs font-black uppercase tracking-[0.24em] text-[#3EB181]">
                          {language === 'zh' ? '地铁站点片区' : 'Metro Station Areas'}
                        </div>
                        <div className="mt-2 w-full max-w-none text-sm font-semibold leading-6 text-white/58">
                          {language === 'zh'
                            ? '这些片区是本项目开展地铁与城市空间研究的重点研究区域。每个圆形代表一个研究片区；悬停圆形即可查看该片区包含的站点。'
                            : 'These are the research areas where we conduct our metro and urban-space study. Each circle represents one research area; hover a circle to reveal the stations included in that area.'}
                        </div>
                      </div>
                      <div
                        className="relative mb-10 mt-6 min-h-[440px] flex-1 overflow-hidden"
                      >
                        {showStationMapBackground && (
                          <>
                            <div className="pointer-events-none absolute inset-0 opacity-[0.34] grayscale-[35%] saturate-75">
                              <div className="absolute left-1/2 top-1/2 grid w-[118%] -translate-x-1/2 -translate-y-1/2 grid-cols-4 overflow-hidden">
                                {[891, 892, 893].map((tileY) => (
                                  [1671, 1672, 1673, 1674].map((tileX) => (
                                    <img
                                      key={`osm-menu-${tileX}-${tileY}`}
                                      src={`https://tile.openstreetmap.org/11/${tileX}/${tileY}.png`}
                                      alt=""
                                      className="h-full w-full object-cover"
                                      draggable={false}
                                    />
                                  ))
                                ))}
                              </div>
                              <div className="absolute inset-0 bg-[#2A383E]/58" />
                            </div>
                            <div className="pointer-events-none absolute bottom-1 right-2 z-[1] text-[10px] font-semibold text-white/32">
                              © OpenStreetMap contributors
                            </div>
                          </>
                        )}
                        <div className="absolute inset-0">
                          {stationCircleGroups.map((group) => {
                            const isActive = hoveredStationCircleGroup?.area === group.area;
                            const isDimmed = Boolean(hoveredStationCircleGroup) && !isActive;
                            const label = language === 'zh' ? group.areaCn : group.area;
                            const circleStack = Math.round(120 - group.radius);

                            return (
                              <button
                                key={group.area}
                                type="button"
                                className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-center transition duration-200 ease-out focus:outline-none ${
                                  isActive
                                    ? 'scale-105 shadow-[0_24px_70px_rgba(36,49,54,0.22)]'
                                    : 'shadow-[0_14px_38px_rgba(36,49,54,0.12)] hover:scale-105 focus:scale-105'
                                }`}
                                style={{
                                  left: `${group.x}%`,
                                  top: `${group.y}%`,
                                  width: group.radius * 2,
                                  height: group.radius * 2,
                                  backgroundColor: isDimmed ? 'rgba(100,112,112,0.72)' : isActive ? group.color : `${group.color}d9`,
                                  opacity: isDimmed ? 0.68 : 1,
                                  filter: isDimmed ? 'grayscale(0.72) saturate(0.55)' : 'none',
                                  zIndex: isActive ? 220 : circleStack,
                                }}
                                onMouseEnter={() => {
                                  setHoveredStationCircleArea(group.area);
                                  setActiveStationArea(group.area);
                                }}
                                onMouseLeave={() => {
                                  setHoveredStationCircleArea((currentArea) => currentArea === group.area ? '' : currentArea);
                                }}
                                onFocus={() => {
                                  setHoveredStationCircleArea(group.area);
                                  setActiveStationArea(group.area);
                                }}
                                onClick={() => {
                                  setActiveStationArea(group.area);
                                  setHoveredStationCircleArea(group.area);
                                }}
                                aria-label={label}
                              >
                                {isActive && (
                                  <span className="max-w-[78%] px-2 text-center text-[11px] font-black uppercase leading-tight tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
                                    {label.replace(/\s+area$/i, '')}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="mt-3 min-h-[7.25rem] shrink-0 pt-3">
                        {selectedStationCircleGroup ? (
                          <div
                            className="w-full text-white"
                            onMouseEnter={() => setHoveredStationCircleArea(selectedStationCircleGroup.area)}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className="mt-1 h-4 w-4 shrink-0 rounded-full"
                                style={{ backgroundColor: selectedStationCircleGroup.color }}
                              />
                              <div className="min-w-0">
                                <div className="text-lg font-black leading-tight text-white">
                                  {language === 'zh' ? selectedStationCircleGroup.areaCn : selectedStationCircleGroup.area}
                                </div>
                                <div className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/42">
                                  {selectedStationCircleGroup.stations.length} {language === 'zh' ? '个站点' : 'stations'}
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 flex max-h-[6.5rem] flex-wrap gap-2 overflow-y-auto pr-1">
                              {selectedStationCircleGroup.stations.map((station) => (
                                <button
                                key={station.route}
                                type="button"
                                  className="flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 text-sm font-bold leading-6 text-white/68 transition duration-200 ease-out hover:border-[#3EB181]/80 hover:bg-[#3EB181]/18 hover:text-white focus:border-[#3EB181]/80 focus:bg-[#3EB181]/18 focus:text-white focus:outline-none"
                                  onClick={() => goToMenuRoute(station.route)}
                                >
                                  <span
                                    className="h-2 w-2 shrink-0 rounded-full bg-[#3EB181]"
                                    style={{ backgroundColor: station.lineColor || selectedStationCircleGroup.color }}
                                  />
                                  {station.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="flex h-full min-h-[6.5rem] items-center text-sm font-semibold text-white/42">
                            {language === 'zh' ? '悬停任意圆形查看该片区站点。' : 'Hover any circle to show that area’s stations here.'}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                  <div className="grid h-full min-h-0 overflow-hidden gap-8 px-1 md:grid-cols-[8rem_15rem_minmax(0,1fr)] md:gap-10">
                    <div className={`flex min-h-0 flex-col items-start overflow-y-auto ${
                      isV2 ? 'gap-2' : 'gap-4'
                    }`}>
                      {stationBrowseItems.map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          className={isV2
                            ? `w-full rounded-full px-3 py-2 text-left text-xs font-black uppercase tracking-[0.16em] transition duration-200 ease-out focus:outline-none ${
                                activeStationBrowseMode === item.key
                                  ? 'bg-[#3EB181] text-white'
                                  : 'bg-[#243136]/6 text-[#243136]/58 hover:bg-[#243136]/10 hover:text-[#243136] focus:bg-[#243136]/10 focus:text-[#243136]'
                              }`
                            : `origin-left text-left text-base font-semibold uppercase tracking-[0.18em] transition duration-200 ease-out focus:outline-none ${
                                activeStationBrowseMode === item.key
                                  ? 'scale-105 text-[#3EB181]'
                                  : 'text-white/62 hover:scale-105 hover:text-[#3EB181] focus:scale-105 focus:text-[#3EB181]'
                              }`
                          }
                          onMouseEnter={() => setActiveStationBrowseMode(item.key)}
                          onFocus={() => setActiveStationBrowseMode(item.key)}
                          onClick={() => setActiveStationBrowseMode(item.key)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <div className={`min-h-0 overflow-y-auto ${
                      isV2 ? 'rounded-2xl bg-[#eef5ef] p-4' : 'border-white/12 md:border-r md:pr-6'
                    }`}>
                      <div className={`text-xs font-semibold uppercase tracking-[0.26em] ${
                        isV2 ? 'text-[#243136]/38' : 'text-white/38'
                      }`}>
                        {activeStationBrowseMode === 'areas'
                          ? language === 'zh' ? '片区' : 'Areas'
                          : language === 'zh' ? '线路' : 'Lines'}
                      </div>
                      <div className={`mt-4 flex flex-col items-start ${isV2 ? 'gap-1.5' : 'gap-3'}`}>
                        {activeStationBrowseMode === 'areas' ? stationAreaGroups.map((group) => {
                          const isActive = group.area === activeStationGroup?.area;

                          return (
                            <button
                              key={group.area}
                              type="button"
                              className={isV2
                                ? `w-full rounded-xl px-3 py-2 text-left text-sm font-bold leading-tight transition duration-200 ease-out focus:outline-none ${isActive ? 'bg-white text-[#3EB181] shadow-sm' : 'text-[#243136]/62 hover:bg-white/70 hover:text-[#243136] focus:bg-white/70 focus:text-[#243136]'}`
                                : `origin-left text-left text-base font-semibold leading-tight transition duration-200 ease-out focus:outline-none ${isActive ? 'scale-105 text-[#3EB181]' : 'text-white/68 hover:scale-105 hover:text-[#3EB181] focus:scale-105 focus:text-[#3EB181]'}`
                              }
                              onMouseEnter={() => setActiveStationArea(group.area)}
                              onFocus={() => setActiveStationArea(group.area)}
                              onClick={() => setActiveStationArea(group.area)}
                            >
                              {language === 'zh' ? group.areaCn : group.area}
                            </button>
                          );
                        }) : stationLineGroups.map((group) => {
                          const isActive = group.line === activeLineGroup?.line;

                          return (
                            <button
                              key={group.line}
                              type="button"
                              className={isV2
                                ? `w-full rounded-xl px-3 py-2 text-left text-sm font-bold leading-tight transition duration-200 ease-out focus:outline-none ${isActive ? 'bg-white text-[#3EB181] shadow-sm' : 'text-[#243136]/62 hover:bg-white/70 hover:text-[#243136] focus:bg-white/70 focus:text-[#243136]'}`
                                : `origin-left text-left text-base font-semibold leading-tight transition duration-200 ease-out focus:outline-none ${isActive ? 'scale-105 text-[#3EB181]' : 'text-white/68 hover:scale-105 hover:text-[#3EB181] focus:scale-105 focus:text-[#3EB181]'}`
                              }
                              onMouseEnter={() => setActiveStationLine(group.line)}
                              onFocus={() => setActiveStationLine(group.line)}
                              onClick={() => setActiveStationLine(group.line)}
                            >
                              {group.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="min-h-0 overflow-y-auto">
                      <div className={`text-xs font-semibold uppercase tracking-[0.26em] ${
                        isV2 ? 'text-[#243136]/38' : 'text-white/38'
                      }`}>
                        {language === 'zh' ? '站点' : 'Stations'}
                      </div>
                      {activeStationBrowseMode === 'areas' && activeStationGroup ? (
                        <>
                          <div className={`mt-4 text-lg font-semibold leading-tight ${
                            isV2 ? 'text-[#243136]' : 'text-white/82'
                          }`}>
                            {language === 'zh' ? activeStationGroup.areaCn : activeStationGroup.area}
                          </div>
                          <div className="mt-4 flex max-w-3xl flex-wrap gap-x-4 gap-y-2">
                            {activeStationGroup.stations.map((station) => (
                              <button
                                key={station.route}
                                type="button"
                                className={isV2
                                  ? 'rounded-full bg-[#243136]/6 px-3 py-1.5 text-sm font-bold leading-6 text-[#243136]/66 transition duration-200 ease-out hover:bg-[#3EB181] hover:text-white focus:bg-[#3EB181] focus:text-white focus:outline-none md:text-base'
                                  : 'origin-left text-sm font-medium leading-6 text-white/62 transition duration-200 ease-out hover:scale-105 hover:text-[#3EB181] focus:scale-105 focus:outline-none focus:text-[#3EB181] md:text-base'
                                }
                                onClick={() => goToMenuRoute(station.route)}
                              >
                                {station.label}
                              </button>
                            ))}
                          </div>
                        </>
                      ) : null}
                      {activeStationBrowseMode === 'lines' && activeLineGroup ? (
                        <>
                          <div className={`mt-4 text-lg font-semibold leading-tight ${
                            isV2 ? 'text-[#243136]' : 'text-white/82'
                          }`}>
                            {activeLineGroup.label}
                          </div>
                          <div className="mt-4 flex max-w-3xl flex-wrap gap-x-4 gap-y-2">
                            {activeLineGroup.stations.map((station) => (
                              <button
                                key={station.route}
                                type="button"
                                className={isV2
                                  ? 'rounded-full bg-[#243136]/6 px-3 py-1.5 text-sm font-bold leading-6 text-[#243136]/66 transition duration-200 ease-out hover:bg-[#3EB181] hover:text-white focus:bg-[#3EB181] focus:text-white focus:outline-none md:text-base'
                                  : 'origin-left text-sm font-medium leading-6 text-white/62 transition duration-200 ease-out hover:scale-105 hover:text-[#3EB181] focus:scale-105 focus:outline-none focus:text-[#3EB181] md:text-base'
                                }
                                onClick={() => goToMenuRoute(station.route)}
                              >
                                {station.label}
                              </button>
                            ))}
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                  )
                ) : activeMenuItem === 'people' ? (
                  <div className="grid h-full min-h-0 overflow-hidden gap-8 px-1 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10">
                    <div className="flex min-h-0 flex-col items-start gap-4 overflow-y-auto border-white/12 md:border-r md:pr-6">
                      {peopleMenuItems.map((item) => {
                        const isActive = item.key === activePeopleSection;

                        return (
                          <button
                            key={item.key}
                          type="button"
                            className={`origin-left max-w-full text-left transition duration-200 ease-out focus:outline-none ${
                              isActive
                                ? 'scale-105 text-[#3EB181]'
                                : 'text-white/62 hover:scale-105 hover:text-[#3EB181] focus:scale-105 focus:text-[#3EB181]'
                            }`}
                            onMouseEnter={() => setActivePeopleSection(item.key)}
                            onFocus={() => setActivePeopleSection(item.key)}
                            onClick={() => setActivePeopleSection(item.key)}
                          >
                            <span className="block text-base font-semibold uppercase leading-tight tracking-[0.18em]">
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="min-h-0 overflow-y-auto">
                      <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/38">
                        {activePeopleMenuItem.label}
                      </div>

                      {activePeopleSection === 'introduction' && (
                        <div className="mt-4 max-w-3xl">
                          <p className="text-base font-medium leading-8 text-white/72 md:text-lg">
                            {peopleIntroductionPassage}
                          </p>
                          <button
                            type="button"
                            className="mt-6 origin-left text-sm font-semibold uppercase tracking-[0.18em] text-[#3EB181] transition duration-200 ease-out hover:scale-105 hover:text-white focus:scale-105 focus:outline-none focus:text-white"
                            onClick={() => goToMenuRoute('/people')}
                          >
                            {language === 'zh' ? '打开地铁与人页面' : 'Open Metro People'}
                          </button>
                        </div>
                      )}

                      {activePeopleSection === 'demographics' && (
                        <div className="mt-4 flex max-w-3xl flex-col items-start gap-4">
                          {peopleDemographicItems.map((item) => (
                            <button
                              key={item.label}
                              type="button"
                              className="group origin-left text-left transition duration-200 ease-out hover:scale-[1.02] focus:scale-[1.02] focus:outline-none"
                              onClick={() => goToMenuRoute('/people')}
                            >
                              <span className="block text-base font-semibold leading-tight text-white/82 transition group-hover:text-[#3EB181] group-focus:text-[#3EB181]">
                                {item.label}
                              </span>
                              <span className="mt-1 block max-w-2xl text-sm leading-6 text-white/48">
                                {item.detail}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {activePeopleSection === 'interviews' && (
                        <div className="mt-4">
                          <div className="mb-4 text-sm font-medium leading-6 text-white/50">
                            {language === 'zh'
                              ? '前 100 条访谈账户索引。当前数据集中没有逐字引用文本，因此这里以访谈对象记录作为引用入口。'
                              : 'Index of the first 100 interview accounts. The current dataset has no verbatim quote text, so each item uses the participant record as the quote entry.'}
                          </div>
                          <div className="grid max-h-[56vh] max-w-5xl gap-2 overflow-y-auto pr-2 md:grid-cols-2 xl:grid-cols-3">
                            {interviewAccountItems.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-left transition duration-200 ease-out hover:border-[#3EB181]/60 hover:bg-[#3EB181]/10 focus:border-[#3EB181]/60 focus:bg-[#3EB181]/10 focus:outline-none"
                                onClick={() => goToMenuRoute('/people')}
                              >
                                <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#3EB181]">
                                  {item.label}
                                </span>
                                <span className="mt-1 block truncate text-sm font-semibold text-white/82">
                                  {item.personLabel}
                                </span>
                                <span className="mt-1 block truncate text-xs text-white/46">
                                  {item.detail}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {activePeopleSection === 'analysis' && (
                        <div className="mt-4 flex max-w-3xl flex-col items-start gap-4">
                          {peopleAnalysisItems.map((item) => (
                            <button
                              key={item.label}
                              type="button"
                              className="group origin-left text-left transition duration-200 ease-out hover:scale-[1.02] focus:scale-[1.02] focus:outline-none"
                              onClick={() => goToMenuRoute('/people')}
                            >
                              <span className="block text-base font-semibold leading-tight text-white/82 transition group-hover:text-[#3EB181] group-focus:text-[#3EB181]">
                                {item.label}
                              </span>
                              <span className="mt-1 block max-w-2xl text-sm leading-6 text-white/48">
                                {item.detail}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full min-h-0 overflow-y-auto pr-1">
                    <div className="grid max-w-6xl grid-cols-1 gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {thematicThemeTiles.map((theme) => (
                        <button
                          key={theme.title}
                          type="button"
                          className="group flex min-h-[230px] overflow-hidden rounded-[8px] bg-white/[0.07] text-left shadow-[0_18px_44px_rgba(8,18,24,0.18)] transition duration-200 ease-out hover:-translate-y-1 hover:bg-white/[0.11] focus:-translate-y-1 focus:bg-white/[0.11] focus:outline-none focus:ring-2 focus:ring-[#3EB181]/70"
                          onClick={() => goToMenuRoute(activeMenuContent.route)}
                        >
                          <span className="flex w-full flex-col">
                            <span className="relative block h-[138px] overflow-hidden bg-[#172126]">
                              <img
                                src={theme.imageSrc}
                                alt=""
                                className="h-full w-full object-cover opacity-86 transition duration-300 ease-out group-hover:scale-105 group-hover:opacity-100 group-focus:scale-105 group-focus:opacity-100"
                              />
                              <span className="absolute inset-0 bg-gradient-to-t from-[#172126]/54 via-transparent to-transparent" />
                              <span className="absolute left-3 top-3 rounded-full bg-[#172126]/76 px-2.5 py-1 text-[11px] font-black leading-none text-white/88 backdrop-blur-md">
                                {theme.number}
                              </span>
                            </span>
                            <span className="flex min-h-[92px] flex-1 items-end px-4 pb-4 pt-3">
                              <span className="text-sm font-semibold leading-5 text-white/82 transition group-hover:text-white group-focus:text-white md:text-[15px]">
                                {theme.title}
                              </span>
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
