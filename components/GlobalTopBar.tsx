import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import LanguageToggle from './LanguageToggle';
import { useAppLanguage } from '../hooks/useAppLanguage';
import { STATIONS } from '../data/metro-stations/stations';
import { createStationSlug } from '../data/metro-stations/stationDetails';
import { METRO_AREAS, isMetroAreaMatch } from '../data/metro-stations/metroAreas';
import { THEMATIC_TOPICS } from '../data/metro-city/thematicTopics';

const copy = {
  menu: {
    returnHome: {
      en: 'Return home',
      zh: '返回首页',
    },
    compress: {
      en: 'Compress detail page',
      zh: '压缩详情页',
    },
    expand: {
      en: 'Expand detail page',
      zh: '展开详情页',
    },
    exitDetail: {
      en: 'Exit detail page',
      zh: '退出详情页',
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

function translateLineName(lineName: string, language: 'en' | 'zh') {
  if (language === 'en') return lineName;

  const lineNumberMatch = lineName.match(/Line\s+(.+)/i);
  return lineNumberMatch ? `${lineNumberMatch[1]}号线` : lineName;
}

export default function GlobalTopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useAppLanguage('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState<MenuKey>('stations');
  const [activeStationBrowseMode, setActiveStationBrowseMode] = useState<StationBrowseMode>('areas');
  const [activeStationArea, setActiveStationArea] = useState('');
  const [activeStationLine, setActiveStationLine] = useState('');
  const isHomePage = location.pathname === '/';
  const isStationDetailPage = location.pathname.startsWith('/stations/');
  const [detailCompressed, setDetailCompressed] = useState(false);

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

  useEffect(() => {
    if (!isStationDetailPage) {
      setDetailCompressed(false);
      document.documentElement.classList.remove('station-detail-compressed');
      return;
    }

    document.documentElement.classList.toggle('station-detail-compressed', detailCompressed);

    return () => {
      document.documentElement.classList.remove('station-detail-compressed');
    };
  }, [detailCompressed, isStationDetailPage]);

  const stationAreaGroups = useMemo(() => {
    return METRO_AREAS.map((area) => {
      const stationLinks = STATIONS.filter(
        (station) => station.isDetail && (isMetroAreaMatch(station.area, area) || isMetroAreaMatch(station.areaCn, area))
      )
        .map((station) => ({
          label: language === 'zh' ? station.nameCn || station.name : station.name,
          route: `/stations/${createStationSlug(station.name)}`,
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

  const activeMenuContent = menuItems.find((item) => item.key === activeMenuItem) ?? menuItems[0];
  const activeStationGroup = stationAreaGroups.find((group) => group.area === activeStationArea) ?? stationAreaGroups[0];
  const activeLineGroup = stationLineGroups.find((group) => group.line === activeStationLine) ?? stationLineGroups[0];
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

  const goToMenuRoute = (route: string) => {
    setMenuOpen(false);
    navigate(route);
  };

  const returnHome = () => {
    setMenuOpen(false);
    navigate('/');
  };

  const exitDetailPage = () => {
    setMenuOpen(false);
    setDetailCompressed(false);
    navigate('/map');
  };

  return (
    <>
      <style>{`
        html.station-detail-compressed [data-station-detail-page] {
          width: min(68vw, 100%);
          margin-left: auto;
          box-shadow: -24px 0 80px rgba(0, 0, 0, 0.2);
          transition: width 260ms ease, box-shadow 260ms ease;
        }

        @media (max-width: 767px) {
          html.station-detail-compressed [data-station-detail-page] {
            width: 100%;
            margin-left: 0;
          }
        }
      `}</style>
      <div className="fixed left-4 top-[50px] z-[3400] flex items-center gap-3 md:left-6 md:top-[50px]">
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
        {isStationDetailPage && (
          <>
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/92 text-[#2A383E] shadow-lg backdrop-blur-sm transition hover:bg-white focus:outline-none"
              aria-label={detailCompressed ? copy.menu.expand[language] : copy.menu.compress[language]}
              onClick={() => setDetailCompressed((isCompressed) => !isCompressed)}
            >
              {detailCompressed ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <polyline points="8 3 8 8 3 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="16 21 16 16 21 16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="8" y1="8" x2="3" y2="3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  <line x1="16" y1="16" x2="21" y2="21" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <polyline points="15 3 21 3 21 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="9 21 3 21 3 15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="21" y1="3" x2="14" y2="10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  <line x1="3" y1="21" x2="10" y2="14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              )}
            </button>
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/92 text-[#2A383E] shadow-lg backdrop-blur-sm transition hover:bg-white focus:outline-none"
              aria-label={copy.menu.exitDetail[language]}
              onClick={exitDetailPage}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
              </svg>
            </button>
          </>
        )}
        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/92 shadow-lg backdrop-blur-sm transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/80"
          aria-label={copy.menu.open[language]}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect y="7" width="32" height="3" rx="1.5" fill="rgba(42,56,62,0.72)" />
            <rect y="14.5" width="32" height="3" rx="1.5" fill="rgba(42,56,62,0.72)" />
            <rect y="22" width="32" height="3" rx="1.5" fill="rgba(42,56,62,0.72)" />
          </svg>
        </button>
        <LanguageToggle language={language} onChange={setLanguage} fixed={false} />
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
            <nav className="grid h-[72vh] w-full content-start gap-10 md:grid-cols-[11rem_minmax(0,1fr)]" aria-label={copy.menu.title[language]}>
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
                    onMouseEnter={() => {
                      setActiveMenuItem(item.key);
                      if (item.key === 'stations' && stationAreaGroups.length > 0) {
                        setActiveStationBrowseMode('areas');
                        setActiveStationArea((currentArea) => currentArea || stationAreaGroups[0].area);
                      }
                    }}
                    onFocus={() => {
                      setActiveMenuItem(item.key);
                      if (item.key === 'stations' && stationAreaGroups.length > 0) {
                        setActiveStationBrowseMode('areas');
                        setActiveStationArea((currentArea) => currentArea || stationAreaGroups[0].area);
                      }
                    }}
                    onClick={() => goToMenuRoute(item.route)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="h-full min-h-0 overflow-hidden text-left" aria-live="polite">
                {activeMenuItem === 'stations' ? (
                  <div className="grid h-full min-h-0 gap-8 overflow-hidden px-1 md:grid-cols-[8rem_15rem_minmax(0,1fr)] md:gap-10">
                    <div className="flex min-h-0 flex-col items-start gap-4 overflow-y-auto">
                      {stationBrowseItems.map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          className={`origin-left text-left text-base font-semibold uppercase tracking-[0.18em] transition duration-200 ease-out focus:outline-none ${
                            activeStationBrowseMode === item.key
                              ? 'scale-105 text-[#3EB181]'
                              : 'text-white/62 hover:scale-105 hover:text-[#3EB181] focus:scale-105 focus:text-[#3EB181]'
                          }`}
                          onMouseEnter={() => setActiveStationBrowseMode(item.key)}
                          onFocus={() => setActiveStationBrowseMode(item.key)}
                          onClick={() => setActiveStationBrowseMode(item.key)}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>

                    <div className="min-h-0 overflow-y-auto border-white/12 md:border-r md:pr-6">
                      <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/38">
                        {activeStationBrowseMode === 'areas'
                          ? language === 'zh' ? '片区' : 'Areas'
                          : language === 'zh' ? '线路' : 'Lines'}
                      </div>
                      <div className="mt-4 flex flex-col items-start gap-3">
                        {activeStationBrowseMode === 'areas' ? stationAreaGroups.map((group) => {
                          const isActive = group.area === activeStationGroup?.area;

                          return (
                            <button
                              key={group.area}
                              type="button"
                              className={`origin-left text-left text-base font-semibold leading-tight transition duration-200 ease-out focus:outline-none ${isActive ? 'scale-105 text-[#3EB181]' : 'text-white/68 hover:scale-105 hover:text-[#3EB181] focus:scale-105 focus:text-[#3EB181]'}`}
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
                              className={`origin-left text-left text-base font-semibold leading-tight transition duration-200 ease-out focus:outline-none ${isActive ? 'scale-105 text-[#3EB181]' : 'text-white/68 hover:scale-105 hover:text-[#3EB181] focus:scale-105 focus:text-[#3EB181]'}`}
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
                      <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/38">
                        {language === 'zh' ? '站点' : 'Stations'}
                      </div>
                      {activeStationBrowseMode === 'areas' && activeStationGroup ? (
                        <>
                          <div className="mt-4 text-lg font-semibold leading-tight text-white/82">
                            {language === 'zh' ? activeStationGroup.areaCn : activeStationGroup.area}
                          </div>
                          <div className="mt-4 flex max-w-3xl flex-wrap gap-x-4 gap-y-2">
                            {activeStationGroup.stations.map((station) => (
                              <button
                                key={station.route}
                                type="button"
                                className="origin-left text-sm font-medium leading-6 text-white/62 transition duration-200 ease-out hover:scale-105 hover:text-[#3EB181] focus:scale-105 focus:outline-none focus:text-[#3EB181] md:text-base"
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
                          <div className="mt-4 text-lg font-semibold leading-tight text-white/82">
                            {activeLineGroup.label}
                          </div>
                          <div className="mt-4 flex max-w-3xl flex-wrap gap-x-4 gap-y-2">
                            {activeLineGroup.stations.map((station) => (
                              <button
                                key={station.route}
                                type="button"
                                className="origin-left text-sm font-medium leading-6 text-white/62 transition duration-200 ease-out hover:scale-105 hover:text-[#3EB181] focus:scale-105 focus:outline-none focus:text-[#3EB181] md:text-base"
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
                ) : (
                  <div className="flex h-full max-w-2xl flex-wrap content-start justify-start gap-x-4 gap-y-2 overflow-y-auto">
                    {activeMenuContent.links.map((link) => (
                      <button
                        key={link}
                        type="button"
                        className="origin-left text-sm font-medium leading-6 text-white/58 transition duration-200 ease-out hover:scale-105 hover:text-white focus:scale-105 focus:outline-none focus:text-white md:text-base"
                        onClick={() => goToMenuRoute(activeMenuContent.route)}
                      >
                        {link}
                      </button>
                    ))}
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
