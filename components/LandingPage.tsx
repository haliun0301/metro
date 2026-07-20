import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppLanguage } from '../hooks/useAppLanguage';
import backgroundImage from '../assets/bg1.jpg';

const copy = {
  en: {
    kicker: 'An interactive urban portrait',
    title: ['RAPID TRANSIT', 'IN SHENZHEN'],
    prompt: 'Explore the atlas',
    chapters: {
      stations: { label: 'Metro Stations', title: 'Read the city through its stations.', description: 'Navigate the full network, locate key nodes, and discover how neighbourhoods changed around them.' },
      people: { label: 'Metro & People', title: 'Meet the lives moving through the network.', description: "Explore the people behind Shenzhen's metro—where they come from, when they arrived, and how occupation and generation shape urban life." },
      city: { label: 'Metro & City', title: 'See how mobility remakes a metropolis.', description: 'Follow visual themes connecting rapid transit with growth, public space, and identity.' },
    },
  },
  zh: {
    kicker: '一幅互动式城市肖像',
    title: ['深圳', '快速轨道交通'],
    prompt: '探索互动图集',
    chapters: {
      stations: { label: '地铁站点', title: '从站点出发，阅读城市。', description: '浏览完整地铁网络，寻找重要枢纽，观察轨道交通如何改变周边街区。' },
      people: { label: '地铁与人', title: '遇见穿行于网络中的生活。', description: '探索深圳地铁背后的人群——他们来自哪里、何时来到深圳，以及职业和世代如何塑造城市生活。' },
      city: { label: '地铁与城市', title: '看见流动如何重塑都市。', description: '通过视觉主题连接轨道交通与城市增长、公共空间及城市身份。' },
    },
  },
} as const;

const chapters = [
  { key: 'stations', index: '01', color: '#ef9953', route: '/map' },
  { key: 'people', index: '02', color: '#26383d', route: '/people' },
  { key: 'city', index: '03', color: '#28a873', route: '/thematicmap' },
] as const;

function RailMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-8 w-8">
      <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M14 28V17.5L24 13l10 4.5V28M14 23h20M18 34l3-6m9 6-3-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { language } = useAppLanguage('en');
  const text = copy[language];
  const [view, setView] = useState<'landing' | 'chapters'>('landing');
  const [hoveredChapter, setHoveredChapter] = useState<(typeof chapters)[number]['key'] | null>(null);
  const [hoverEnabled, setHoverEnabled] = useState(false);
  const hoverDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (view === 'chapters') {
      setHoverEnabled(false);
      setHoveredChapter(null);
    }

    return () => {
      if (hoverDelayRef.current) clearTimeout(hoverDelayRef.current);
    };
  }, [view]);

  const prepareInitialHover = (chapter: (typeof chapters)[number]['key']) => {
    if (hoverEnabled) return;
    if (hoverDelayRef.current) clearTimeout(hoverDelayRef.current);
    hoverDelayRef.current = setTimeout(() => {
      setHoverEnabled(true);
      setHoveredChapter(chapter);
    }, 150);
  };

  return (
    <main
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-[#02090c]"
      onWheel={(event) => {
        if (event.deltaY > 18) setView('chapters');
        if (event.deltaY < -18) setView('landing');
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
      {view === 'landing' ? (
      <motion.section
        key="landing"
        className="absolute inset-0 overflow-hidden text-white"
        initial={{ opacity: 0, scale: 1.025, filter: 'brightness(0)' }}
        animate={{ opacity: 1, scale: 1, filter: 'brightness(1)' }}
        exit={{ opacity: 0, scale: 1.035, filter: 'brightness(0)' }}
        transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
      >
        <img src={backgroundImage} alt="" className="absolute inset-0 h-full w-full scale-105 object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(3,21,28,.94)_0%,rgba(6,31,38,.68)_53%,rgba(3,26,28,.2)_100%)]" />
        <div className="relative z-10 grid h-full grid-rows-[auto_1fr_auto] px-6 pb-8 pt-24 md:px-12 md:pb-10 lg:px-20">
          <motion.header className="flex items-center justify-end pb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="hidden font-serif text-lg italic sm:block">Shenzhen · 深圳</span>
          </motion.header>
          <div className="grid content-center py-8">
            <div>
              <motion.h1 className="text-[clamp(3.7rem,9.8vw,10.5rem)] font-black uppercase leading-[0.76] tracking-[-0.065em]" initial={{ opacity: 0, y: 70 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>
                <span className="block">{text.title[0]}</span><span className="block text-[#ef9953]">{text.title[1]}</span>
              </motion.h1>
            </div>
          </div>
          <div className="flex items-center justify-end pt-4">
            <button type="button" aria-label={language === 'zh' ? '进入章节' : 'Enter sections'} onClick={() => setView('chapters')} className="flex h-11 w-11 items-center justify-center rounded-full text-xl text-white transition hover:bg-white/10"><span aria-hidden="true">↓</span></button>
          </div>
        </div>
      </motion.section>
      ) : (

      <motion.section
        key="chapters"
        id="chapters"
        className="absolute inset-0 flex flex-col overflow-hidden sm:flex-row"
        initial={{ opacity: 0, filter: 'brightness(0)' }}
        animate={{ opacity: 1, filter: 'brightness(1)' }}
        exit={{ opacity: 0, filter: 'brightness(0)' }}
        transition={{ duration: 0.62, ease: [0.76, 0, 0.24, 1] }}
      >
        {chapters.map((chapter, index) => {
          const chapterText = text.chapters[chapter.key];
          return (
            <motion.button
              key={chapter.key}
              type="button"
              onClick={() => {
                if (chapter.key === 'people') {
                  const viewTransitionDocument = document as Document & {
                    startViewTransition?: (callback: () => void) => unknown;
                  };
                  if (viewTransitionDocument.startViewTransition) {
                    viewTransitionDocument.startViewTransition(() => navigate(chapter.route));
                  } else {
                    navigate(chapter.route);
                  }
                  return;
                }
                navigate(chapter.route);
              }}
              onMouseEnter={() => {
                if (hoverEnabled) setHoveredChapter(chapter.key);
              }}
              onMouseMove={() => prepareInitialHover(chapter.key)}
              onMouseLeave={() => {
                if (hoverDelayRef.current) clearTimeout(hoverDelayRef.current);
                if (hoverEnabled) setHoveredChapter(null);
              }}
              onFocus={() => setHoveredChapter(chapter.key)}
              onBlur={() => setHoveredChapter(null)}
              className="chapter-panel group relative flex min-h-0 min-w-0 basis-0 items-center justify-center overflow-hidden px-6 py-6 text-center text-white focus-visible:z-10 focus-visible:outline focus-visible:outline-4 focus-visible:outline-inset focus-visible:outline-white"
              style={{ backgroundColor: chapter.color }}
              initial={{ y: '100%' }}
              animate={{
                y: 0,
                flexGrow: hoveredChapter === null ? 1 : hoveredChapter === chapter.key ? 3.2 : 0.48,
              }}
              transition={{
                y: { delay: index * .11, duration: .72, ease: [0.22, 1, 0.36, 1] },
                flexGrow: { duration: .62, ease: [0.22, 1, 0.36, 1] },
              }}
            >
              <div className="pointer-events-none absolute inset-0 z-10 flex h-full w-full items-center justify-center px-6">
                <h2 className={`inline-flex max-w-full origin-center items-center justify-center text-balance text-center text-[clamp(1.6rem,4.2vw,5rem)] font-black uppercase leading-none tracking-[-0.045em] transition-all duration-500 ${chapter.key === 'people' ? 'metro-people-shared-title' : ''} ${
                  hoveredChapter !== null && hoveredChapter !== chapter.key
                    ? 'sm:-rotate-90 sm:scale-[.72] sm:whitespace-nowrap'
                    : 'group-hover:scale-105'
                }`}>
                  {chapterText.label}
                </h2>
              </div>
            </motion.button>
          );
        })}
      </motion.section>
      )}
      </AnimatePresence>
    </main>
  );
}
