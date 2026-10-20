import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAppLanguage } from '../hooks/useAppLanguage';
import PageShell from './ui/PageShell';

const copy = {
  en: {
    kicker: 'An interactive urban portrait',
    title: ['RAPID TRANSIT', 'IN SHENZHEN'],
    prompt: 'Explore the atlas',
    chapters: {
      stations: { label: 'Metro & Places', title: 'Read the city through its places.', description: 'Navigate the full network, locate key nodes, and discover how neighbourhoods changed around them.' },
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
  { key: 'stations', index: '01', color: 'var(--color-stations)', route: '/map' },
  { key: 'people', index: '02', color: 'var(--color-people)', route: '/people' },
  { key: 'city', index: '03', color: 'var(--color-city)', route: '/thematicmap' },
] as const;

function AboutSection() {
  return (
    <section id="about" className="relative z-20 mt-[100svh] bg-[var(--color-people)] px-6 py-20 text-white md:px-12 md:py-28 lg:px-20">
      <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-24">
        <div>
          <p className="text-[var(--text-label)] font-semibold uppercase tracking-[0.28em] text-white/60">About us · 关于我们</p>
          <h2 className="mt-6 max-w-xl text-[clamp(3.2rem,8vw,8rem)] font-black uppercase leading-[.82] tracking-[-.06em]">The city<br /><span className="text-[var(--color-primary)]">in motion.</span></h2>
        </div>
        <div className="flex flex-col justify-end gap-10 lg:pb-2">
          <p className="max-w-2xl text-xl leading-relaxed text-white/85 md:text-2xl">Shenzhen Metro Atlas is an interactive portrait of a city that never stands still. We connect stations, people, and urban change to make the everyday journeys shaping Shenzhen visible.</p>
          <div className="grid max-w-xl grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-md)] bg-white/20 text-sm">
            <div className="bg-white/10 p-5"><span className="block text-3xl font-bold text-[var(--color-primary)]">3</span><span className="mt-2 block text-white/60">ways to read the city</span></div>
            <div className="bg-white/10 p-5"><span className="block text-3xl font-bold text-[var(--color-primary)]">∞</span><span className="mt-2 block text-white/60">stories in motion</span></div>
          </div>
          <Link to="/about" className="self-start text-sm font-semibold uppercase tracking-[0.16em] underline-offset-8 hover:underline">Read more about us →</Link>
        </div>
      </div>
    </section>
  );
}

function ImageSection() {
  const [imagePosition, setImagePosition] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const dragStart = useRef<{ y: number; position: number } | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const scrollContainer = section?.closest('.landing-scroll');
    if (!section || !scrollContainer) return;

    const updateParallax = () => {
      const bounds = section.getBoundingClientRect();
      const viewportHeight = scrollContainer.clientHeight;
      const scrollDistance = Math.max(1, bounds.height - viewportHeight);
      const progress = -bounds.top / scrollDistance;
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    updateParallax();
    scrollContainer.addEventListener('scroll', updateParallax, { passive: true });
    window.addEventListener('resize', updateParallax);
    return () => {
      scrollContainer.removeEventListener('scroll', updateParallax);
      window.removeEventListener('resize', updateParallax);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="group relative z-20 h-[180svh] min-h-[900px] cursor-grab bg-[#15262b] text-white active:cursor-grabbing"
      onPointerDown={(event) => {
        dragStart.current = { y: event.clientY, position: imagePosition };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!dragStart.current) return;
        const delta = ((event.clientY - dragStart.current.y) / event.currentTarget.clientHeight) * 100;
        setImagePosition(Math.max(0, Math.min(100, dragStart.current.position + delta)));
      }}
      onPointerUp={() => { dragStart.current = null; }}
      onPointerCancel={() => { dragStart.current = null; }}
    >
      <div className="sticky top-0 h-[100svh] min-h-[420px] overflow-hidden">
      <img
        src="/images/penan_upscale.png"
        alt="Shenzhen cityscape between stations"
        draggable="false"
        style={{ objectPosition: `center ${Math.min(100, imagePosition + scrollProgress * (100 - imagePosition))}%` }}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,9,12,.78)_0%,rgba(2,9,12,.2)_62%,rgba(2,9,12,.08)_100%)]" />
      <div className="relative flex h-full items-end px-6 pb-8 md:px-12 md:pb-12 lg:px-20">
        <div className="max-w-xl">
          <p className="text-[var(--text-label)] font-semibold uppercase tracking-[0.28em] text-white/65">Between stations · 站点之间</p>
          <p className="mt-4 text-2xl font-medium leading-tight md:text-4xl">Every journey leaves a trace on the city.</p>
        </div>
        <span className="ml-auto hidden self-end text-xs uppercase tracking-[0.24em] text-white/55 md:block">Shenzhen, in motion</span>
      </div>
      </div>
    </section>
  );
}

function TransitImageSection() {
  return (
    <section className="relative z-20 h-[70svh] min-h-[420px] overflow-hidden bg-[#111719] text-white">
      <img
        src="/images/shenzhen-transit-architecture.png"
        alt="Geometric ceiling and concourse inside a Shenzhen transit station"
        className="absolute inset-0 h-full w-full object-cover object-bottom"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#02090c]/80 via-transparent to-[#02090c]/10" />
      <div className="relative flex h-full items-end px-6 pb-8 md:px-12 md:pb-12 lg:px-20">
        <div>
          <p className="text-[var(--text-label)] font-semibold uppercase tracking-[0.28em] text-white/65">The infrastructure of movement</p>
          <p className="mt-4 max-w-lg text-2xl font-medium leading-tight md:text-4xl">A city is also shaped by the spaces between destinations.</p>
        </div>
      </div>
    </section>
  );
}

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
  const [heroImagePosition, setHeroImagePosition] = useState(0);
  const hoverDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (view === 'chapters') {
      setHoverEnabled(false);
      setHoveredChapter(null);
      requestAnimationFrame(() => {
        document.getElementById('chapters')?.scrollIntoView({ behavior: 'smooth' });
      });
    }

    return () => {
      if (hoverDelayRef.current) clearTimeout(hoverDelayRef.current);
    };
  }, [view]);

  useEffect(() => {
    const scrollContainer = document.querySelector('.landing-scroll');
    if (!scrollContainer) return;
    const updateHeroParallax = () => {
      const progress = scrollContainer.scrollTop / Math.max(1, scrollContainer.clientHeight);
      setHeroImagePosition(Math.max(0, Math.min(100, progress * 100)));
    };
    updateHeroParallax();
    scrollContainer.addEventListener('scroll', updateHeroParallax, { passive: true });
    return () => scrollContainer.removeEventListener('scroll', updateHeroParallax);
  }, []);

  const prepareInitialHover = (chapter: (typeof chapters)[number]['key']) => {
    if (hoverEnabled) return;
    if (hoverDelayRef.current) clearTimeout(hoverDelayRef.current);
    hoverDelayRef.current = setTimeout(() => {
      setHoverEnabled(true);
      setHoveredChapter(chapter);
    }, 150);
  };

  return (
    <PageShell
      theme={{ chapterColor: 'var(--color-primary)', backgroundColor: '#02090c' }}
      className="landing-scroll relative h-[100svh] min-h-[560px] overflow-y-auto overflow-x-hidden bg-[#02090c]"
    >
      <AboutSection />
      <ImageSection />
      <div>
      <>
      <motion.section
        key="landing"
        className="absolute inset-0 overflow-hidden text-white"
        initial={{ opacity: 0, scale: 1.025, filter: 'brightness(0)' }}
        animate={{ opacity: 1, scale: 1, filter: 'brightness(1)' }}
        exit={{ opacity: 0, scale: 1.035, filter: 'brightness(0)' }}
        transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1] }}
      >
        <img src="/images/shenzhen-skyline-background.png" alt="" style={{ objectPosition: heroImagePosition === 0 ? 'center top' : `center ${heroImagePosition}%` }} className="absolute inset-0 h-full w-full object-cover" />
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
            <button type="button" aria-label={language === 'zh' ? '进入关于我们' : 'Read about us'} onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="flex h-11 w-11 items-center justify-center rounded-full text-xl text-white transition hover:bg-white/10"><span aria-hidden="true">↓</span></button>
          </div>
        </div>
      </motion.section>
      <motion.section
        key="chapters"
        id="chapters"
        className="relative h-[60svh] min-h-[320px] w-screen flex flex-col overflow-hidden sm:flex-row"
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
              className={`chapter-panel group relative flex min-h-0 min-w-0 basis-0 items-center justify-center overflow-hidden px-6 py-6 text-center focus-visible:z-10 focus-visible:outline focus-visible:outline-4 focus-visible:outline-inset ${
                chapter.key === 'stations' ? 'text-[#26383D] focus-visible:outline-[#26383D]' : 'text-[#FFFFFF] focus-visible:outline-[#FFFFFF]'
              }`}
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
      </>
      </div>

      <TransitImageSection />

      <footer className="relative z-20 bg-[var(--primitive-teal)] px-6 pb-8 pt-12 text-white md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col justify-between gap-10 border-b border-white/20 pb-12 md:flex-row md:items-end">
            <div>
              <p className="text-4xl font-black uppercase leading-none tracking-[-.05em] md:text-6xl">Shenzhen · 深圳</p>
              <p className="mt-4 max-w-sm text-sm leading-6 opacity-70">An interactive atlas of rapid transit, urban life, and the city between the stations.</p>
            </div>
            <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm font-semibold md:grid-cols-3">
              <Link to="/" className="transition hover:opacity-60">Home</Link>
              <Link to="/map" className="transition hover:opacity-60">Places</Link>
              <Link to="/people" className="transition hover:opacity-60">People</Link>
              <Link to="/thematicmap" className="transition hover:opacity-60">City</Link>
              <Link to="/about" className="transition hover:opacity-60">About us</Link>
              <Link to="/contact" className="transition hover:opacity-60">Contact</Link>
            </nav>
          </div>
          <div className="flex flex-col justify-between gap-3 pt-6 text-xs opacity-60 sm:flex-row"><span>© 2026 Shenzhen Metro Atlas</span><span>Made for the moving city</span></div>
        </div>
      </footer>
    </PageShell>
  );
}
