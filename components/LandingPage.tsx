import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppLanguage } from '../hooks/useAppLanguage';

const metroCityTopics = [
  {
    zh: '深圳居民移动性范式的跨时代变迁',
    en: 'The Epochal Shift in Mobility Paradigms among Shenzhen Residents',
  },
  {
    zh: '深圳城市格局的演化：增长的空间叙事',
    en: 'The Evolution of Shenzhen’s Urban Fabric: A Spatial Narrative of Growth',
  },
  {
    zh: '因地铁建设与开通而转变的地方',
    en: 'Places Transformed by the Advent of the Metro',
  },
  {
    zh: '深圳地铁网络的核心节点',
    en: 'Key Nodes in the Shenzhen Metro Network',
  },
  {
    zh: '在地铁上：公共空间中的日常生活',
    en: 'On the Metro: Everyday Life in a Public Space',
  },
  {
    zh: '第一次乘坐地铁！',
    en: 'My First Metro Ride!',
  },
  {
    zh: '地铁与其他交通方式的比较',
    en: 'The Metro vs. Other Modes of Transport',
  },
  {
    zh: '不同人群与地铁的关系',
    en: 'Diverse Interactions between Social Groups and the Metro',
  },
  {
    zh: '不只是交通！：地铁对个人生活的影响',
    en: 'More than Transportation: The Metro’s Impact on Individual Lives',
  },
  {
    zh: '不只是交通！：地铁对深圳城市的整体影响',
    en: 'More than Transportation: The Metro’s Overall Impact on Shenzhen as a City',
  },
  {
    zh: '深圳地铁与其他城市地铁的比较',
    en: 'Shenzhen Metro in Comparison with Metro Systems in Other Cities',
  },
  {
    zh: '深圳地铁存在的问题与改进建议',
    en: 'Existing Issues within the Shenzhen Metro and Recommendations for Improvement',
  },
];

const pageCopy = {
  heroTitle: {
    en: 'RAPID TRANSIT IN SHENZHEN',
    zh: '深圳快速轨道交通',
  },
  menu: {
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
  footerTitle: {
    en: 'Rapid Transit in Shenzhen city',
    zh: '深圳城市快速轨道交通',
  },
  footerCredit: {
    en: '© 2026 Powered by React, Vite and Framer',
    zh: '© 2026 由 React、Vite 和 Framer 提供支持',
  },
  cityHeader: {
    en: {
      eyebrow: 'Metro & City',
      title: 'Thematic Topics',
    },
    zh: {
      eyebrow: '地铁与城市',
      title: '主题列表',
    },
  },
} as const;

const sectionOverviews = {
  stations: {
    eyebrow: {
      en: 'Metro Stations',
      zh: '地铁站点',
    },
    title: {
      en: 'Route and station explorer',
      zh: '线路与站点总览',
    },
    description: {
      en: 'Browse the interactive Shenzhen Metro map, inspect station locations, and follow the full network across the city.',
      zh: '浏览深圳地铁交互地图，查看站点位置，并追踪覆盖全市的轨道网络。',
    },
    bullets: {
      en: ['Interactive GIS-based metro map', 'Station and route visualization', 'City-wide network navigation'],
      zh: ['交互式 GIS 地铁地图', '站点与线路可视化', '全市地铁网络导览'],
    },
  },
  people: {
    eyebrow: {
      en: 'Metro & People',
      zh: '地铁与人',
    },
    title: {
      en: 'People, migration, and everyday mobility',
      zh: '人群、迁移与日常流动',
    },
    description: {
      en: 'Explore how different social groups relate to the metro through demographic views, occupation patterns, and lived experience.',
      zh: '通过人口结构、职业分布与生活经验，探索不同人群与地铁之间的关系。',
    },
    bullets: {
      en: ['Demographic filtering', 'Occupation and migration patterns', 'Visual stories of metro users'],
      zh: ['人口维度筛选', '职业与迁移模式', '地铁使用者的视觉叙事'],
    },
  },
} as const;

type HoveredSection = 'stations' | 'people' | 'city' | null;

export default function LandingPage() {
  const navigate = useNavigate();
  const { language } = useAppLanguage('en');
  const [scrollY, setScrollY] = useState(0);
  const [hoveredSection, setHoveredSection] = useState<HoveredSection>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const maskProgress = Math.min(scrollY / window.innerHeight, 1);
  const clipPathValue = `circle(${20 + maskProgress * 80}% at 50% 50%)`;

  const globalStyle = `html, body { height: 100%; overflow-y: auto !important; }`;
  return (
    <>
      <style>{`
        ${globalStyle}
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-24px); }
          100% { transform: translateY(0); }
        }
        .float-animate {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
      <div
        className="w-full min-h-screen flex flex-col"
        style={{
          backgroundImage: "url('../assets/bg1.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Hero Section */}
        <div
          className="w-full h-screen flex items-center justify-center relative"
          style={{
            backgroundImage: "url('../assets/bg1.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-green-300 opacity-30" />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-6xl md:text-8xl font-extrabold text-white drop-shadow-2xl mb-4 float-animate">
              {pageCopy.heroTitle[language]}
            </h1>
          </div>
        </div>

        {/* 3 Columns Section */}
        <div className="w-full flex flex-row h-screen md:screen">
          <div
            className="flex-1 flex flex-col items-center justify-center cursor-pointer transition relative"
            style={{ backgroundColor: '#EAAF73' }}
            onClick={() => navigate('/map')}
            onMouseEnter={() => setHoveredSection('stations')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <h2
              className={`text-5xl font-bold text-white uppercase transition-all duration-300 ${
                hoveredSection === 'stations' ? 'opacity-0' : 'opacity-100'
              }`}
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                position: 'absolute',
                left: 16,
                top: 24,
                margin: 0,
                letterSpacing: '0.08em',
              }}
            >
              {pageCopy.sectionLabels.stations[language]}
            </h2>
            <div
              className={`absolute inset-0 z-10 flex flex-col justify-center bg-black/35 px-6 py-8 text-white backdrop-blur-[2px] transition-all duration-300 ${
                hoveredSection === 'stations' ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <div className="text-xs uppercase tracking-[0.3em] text-white/70">{sectionOverviews.stations.eyebrow[language]}</div>
              <div className="mt-4 text-2xl font-bold leading-tight md:text-3xl">{sectionOverviews.stations.title[language]}</div>
              <p className="mt-4 text-sm leading-6 text-white/85 md:text-base">{sectionOverviews.stations.description[language]}</p>
              <div className="mt-6 space-y-3">
                {sectionOverviews.stations.bullets[language].map((bullet) => (
                  <div key={bullet} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium md:text-base">
                    {bullet}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className="flex-1 flex flex-col items-center justify-center cursor-pointer transition relative"
            style={{ backgroundColor: '#2A383E' }}
            onClick={() => navigate('/people')}
            onMouseEnter={() => setHoveredSection('people')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <h2
              className={`text-5xl font-bold text-white uppercase transition-all duration-300 ${
                hoveredSection === 'people' ? 'opacity-0' : 'opacity-100'
              }`}
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                position: 'absolute',
                left: 16,
                top: 24,
                margin: 0,
                letterSpacing: '0.08em',
              }}
            >
              {pageCopy.sectionLabels.people[language]}
            </h2>
            <div
              className={`absolute inset-0 z-10 flex flex-col justify-center bg-black/35 px-6 py-8 text-white backdrop-blur-[2px] transition-all duration-300 ${
                hoveredSection === 'people' ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <div className="text-xs uppercase tracking-[0.3em] text-white/70">{sectionOverviews.people.eyebrow[language]}</div>
              <div className="mt-4 text-2xl font-bold leading-tight md:text-3xl">{sectionOverviews.people.title[language]}</div>
              <p className="mt-4 text-sm leading-6 text-white/85 md:text-base">{sectionOverviews.people.description[language]}</p>
              <div className="mt-6 space-y-3">
                {sectionOverviews.people.bullets[language].map((bullet) => (
                  <div key={bullet} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium md:text-base">
                    {bullet}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className="flex-1 flex flex-col items-center justify-center cursor-pointer transition relative"
            style={{ backgroundColor: '#3EB181' }}
            onClick={() => navigate('/thematicmap')}
            onMouseEnter={() => setHoveredSection('city')}
            onMouseLeave={() => setHoveredSection(null)}
          >
            <h2
              className={`text-5xl font-bold text-white uppercase transition-all duration-300 ${
                hoveredSection === 'city' ? 'opacity-0' : 'opacity-100'
              }`}
              style={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                position: 'absolute',
                left: 16,
                top: 24,
                margin: 0,
                letterSpacing: '0.08em',
              }}
            >
              {pageCopy.sectionLabels.city[language]}
            </h2>
            <div
              className={`absolute inset-0 z-10 flex flex-col justify-start bg-black/45 px-6 py-8 text-white backdrop-blur-[2px] transition-all duration-300 ${
                hoveredSection === 'city' ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            >
              <div className="mb-4 border-b border-white/30 pb-3">
                <div className="text-xs uppercase tracking-[0.3em] text-white/70">{pageCopy.cityHeader[language].eyebrow}</div>
                <div className="mt-2 text-xl font-bold leading-tight">{pageCopy.cityHeader[language].title}</div>
              </div>

              <div className="space-y-2 overflow-y-auto pr-2">
                {metroCityTopics.map((topic, index) => (
                  <button
                    key={topic.zh}
                    type="button"
                    className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-left transition hover:bg-white/20"
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate('/thematicmap');
                    }}
                  >
                    <div className="text-sm font-semibold text-white/80">{index + 1}</div>
                    <div className="mt-1 text-sm font-semibold leading-snug md:text-base">{topic[language]}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
                {/* No embedded Impact Map, handled by /map route */}
        </div>

        {/* Footer */}
        <footer className="w-full bg-black text-white py-8 mt-auto h-48 md:h-64 flex items-center">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-col items-center justify-between">
            <div className="text-lg">{pageCopy.footerTitle[language]}</div>
            <div className="text-sm text-gray-400">{pageCopy.footerCredit[language]}</div>
          </div>
        </footer>
      </div>
    </>
  );
}
