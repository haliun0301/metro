import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppLanguage } from '../hooks/useAppLanguage';
import PageShell from '../components/ui/PageShell';
import { STATIONS } from '../data/metro-stations/stations';
import { METRO_ROUTES } from '../data/metro-stations/metroRoutes';
import { PeopleData } from '../data/metro-people/people';
import { THEMATIC_TOPICS } from '../data/metro-city/thematicTopics';

const copy = {
  en: {
    kicker: 'About us · 关于我们',
    title: ['History told by', 'rapid transit.'],
    lead: 'Shenzhen Metro Atlas is an interactive urban research exhibition. We connect stations, people, and urban change to make the everyday journeys shaping Shenzhen visible.',
    scroll: 'Read on',
    missionLabel: 'Our purpose',
    mission: 'A metro line is more than infrastructure. It is a daily routine, a first arrival, a changed neighbourhood. This atlas reads rapid transit as a human and spatial story, not only a network diagram.',
    chapters: [
      { key: 'stations', label: 'Metro & Places', description: 'Navigate the full network, locate key nodes, and discover how neighbourhoods changed around them.', cta: 'Open the map', route: '/map' },
      { key: 'people', label: 'Metro & People', description: "Meet the people behind Shenzhen's metro: where they come from, when they arrived, and how occupation and generation shape urban life.", cta: 'Meet the people', route: '/people' },
      { key: 'city', label: 'Metro & City', description: 'Follow visual themes connecting rapid transit with growth, public space, and identity.', cta: 'Explore themes', route: '/thematicmap' },
    ],
    teamLabel: 'Contributors',
    team: 'This atlas brings research, interviews, data, and design together to explore how Shenzhen changes through everyday journeys.',
    teamRoles: [
      { title: 'Maya Chen', text: 'Urban research' },
      { title: 'Ethan Wu', text: 'Station histories' },
      { title: 'Lina Zhou', text: 'Interviews' },
      { title: 'Jun Park', text: 'Story editing' },
      { title: 'Amira Li', text: 'Data analysis' },
      { title: 'Leo Zhang', text: 'Network mapping' },
      { title: 'Hana Xu', text: 'Visual design' },
      { title: 'Noah Lin', text: 'Editorial design' },
      { title: 'Sophie Wong', text: 'Field research' },
      { title: 'Daniel Hu', text: 'Demographic research' },
      { title: 'Iris Sun', text: 'Urban themes' },
      { title: 'Kai Liu', text: 'Digital production' },
    ],
    statsLabel: 'The atlas in numbers',
    stats: ['metro lines', 'stations', 'people profiles', 'research themes'],
    ctaTitle: 'Start exploring.',
    ctaText: 'Choose a chapter, or return to the beginning.',
    home: 'Back to home',
    contact: 'Contact',
  },
  zh: {
    kicker: '关于我们 · About us',
    title: ['行进中的', '城市'],
    lead: '深圳地铁图集是一场互动式城市研究展览。我们把站点、人群与城市变迁联系起来，让塑造深圳的日常旅程被看见。',
    scroll: '继续阅读',
    missionLabel: '我们的初衷',
    mission: '一条地铁线不只是基础设施，它是日复一日的通勤、初来乍到的第一天，也是一个被改变的街区。本图集把轨道交通当作人与空间的故事来阅读，而不只是一张线路图。',
    chapters: [
      { key: 'stations', label: '地铁站点', description: '浏览完整地铁网络，寻找重要枢纽，观察轨道交通如何改变周边街区。', cta: '打开地图', route: '/map' },
      { key: 'people', label: '地铁与人', description: '遇见深圳地铁背后的人群：他们来自哪里、何时来到深圳，以及职业和世代如何塑造城市生活。', cta: '认识他们', route: '/people' },
      { key: 'city', label: '地铁与城市', description: '通过视觉主题连接轨道交通与城市增长、公共空间及城市身份。', cta: '探索主题', route: '/thematicmap' },
    ],
    teamLabel: '项目贡献者',
    team: '本图集结合研究、访谈、数据与设计，探索日常出行如何映照深圳的城市变迁。',
    teamRoles: [
      { title: 'Maya Chen', text: '城市研究' },
      { title: 'Ethan Wu', text: '站点历史' },
      { title: 'Lina Zhou', text: '访谈' },
      { title: 'Jun Park', text: '故事编辑' },
      { title: 'Amira Li', text: '数据分析' },
      { title: 'Leo Zhang', text: '网络制图' },
      { title: 'Hana Xu', text: '视觉设计' },
      { title: 'Noah Lin', text: '编辑设计' },
      { title: 'Sophie Wong', text: '实地研究' },
      { title: 'Daniel Hu', text: '人口研究' },
      { title: 'Iris Sun', text: '城市主题' },
      { title: 'Kai Liu', text: '数字制作' },
    ],
    statsLabel: '数字中的图集',
    stats: ['条地铁线路', '个站点', '份人物档案', '个研究主题'],
    ctaTitle: '开始探索。',
    ctaText: '选择一个章节，或回到起点。',
    home: '返回首页',
    contact: '联系我们',
  },
} as const;

const fadeUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
} as const;

export default function AboutPage() {
  const { language } = useAppLanguage('en');
  const text = copy[language];
  const statValues = [METRO_ROUTES.length, STATIONS.length, PeopleData.length, THEMATIC_TOPICS.length];

  return (
    <PageShell
      theme={{ chapterColor: 'var(--color-primary)', backgroundColor: '#02090c' }}
      className="landing-scroll relative h-[100svh] min-h-[560px] overflow-y-auto overflow-x-hidden bg-[#02090c] text-white"
    >
      <header className="bg-[var(--primitive-green)] px-6 pb-16 pt-32 text-[var(--color-ink)] md:px-12 md:pb-24 md:pt-40 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <div>
            <motion.p
              className="mb-5 text-[var(--text-label)] font-semibold uppercase tracking-[0.28em] text-[var(--color-ink)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {text.kicker}
            </motion.p>
            <motion.h1
              className="max-w-6xl text-[clamp(3.2rem,8vw,8rem)] font-black uppercase leading-[0.82] tracking-[-0.06em] [text-wrap:balance]"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="block text-white">{text.title[0]}</span>
              <span className="block text-[var(--color-ink)]">{text.title[1]}</span>
            </motion.h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-ink)]/80 md:text-xl">{text.lead}</p>
            <button
              type="button"
              onClick={() => document.getElementById('mission')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-8 inline-flex items-center gap-3 rounded-[var(--radius-pill)] bg-white px-6 py-3 text-sm font-semibold text-[var(--color-ink)] transition hover:bg-white/85"
            >
              {text.scroll} <span aria-hidden="true">↓</span>
            </button>
          </div>
        </div>
      </header>

      <section id="mission" className="relative z-10 bg-[var(--color-people)] px-6 py-20 md:px-12 md:py-28 lg:px-20">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-24">
          <motion.p {...fadeUp} className="text-[var(--text-label)] font-semibold uppercase tracking-[0.28em] text-white/60">{text.missionLabel}</motion.p>
          <motion.p {...fadeUp} className="max-w-3xl text-2xl font-medium leading-snug md:text-4xl">{text.mission}</motion.p>
        </div>
      </section>

      <section className="relative z-10 bg-white px-6 py-20 text-[var(--color-ink)] md:px-12 md:py-28 lg:px-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="type-section-heading">{text.teamLabel}</h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-[var(--color-text-muted)] md:text-lg">{text.team}</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-5xl justify-items-center gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {text.teamRoles.map((role, index) => (
            <motion.article
              key={role.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: index * 0.08 }}
              className="w-full pt-5 text-center"
            >
              <div
                aria-hidden="true"
                className="mx-auto mb-4 aspect-square w-20 rounded-full bg-[var(--color-canvas-soft)]"
              />
              <h3 className="text-xl font-semibold leading-snug tracking-[-0.02em]">{role.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{role.text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="relative z-10 bg-[var(--color-primary)] px-6 py-16 text-[var(--primitive-teal)] md:px-12 md:py-20 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="text-[var(--text-label)] font-semibold uppercase tracking-[0.28em] opacity-70">{text.statsLabel}</p>
          <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
            {statValues.map((value, index) => (
              <div key={text.stats[index]}>
                <dt className="order-2 mt-2 text-sm font-semibold">{text.stats[index]}</dt>
                <dd className="text-[clamp(3rem,7vw,6.5rem)] font-black leading-none tracking-[-0.06em]">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <footer className="relative z-10 bg-[var(--primitive-teal)] px-6 pb-8 pt-16 text-white md:px-12 lg:px-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col justify-between gap-10 border-b border-white/20 pb-12 md:flex-row md:items-end">
            <div>
              <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-black uppercase leading-[.85] tracking-[-0.055em]">{text.ctaTitle}</h2>
              <p className="mt-4 max-w-sm text-sm leading-6 opacity-70">{text.ctaText}</p>
            </div>
            <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm font-semibold">
              <Link to="/" className="transition hover:opacity-60">{text.home}</Link>
              <Link to="/map" className="transition hover:opacity-60">{text.chapters[0].label}</Link>
              <Link to="/people" className="transition hover:opacity-60">{text.chapters[1].label}</Link>
              <Link to="/thematicmap" className="transition hover:opacity-60">{text.chapters[2].label}</Link>
              <Link to="/contact" className="transition hover:opacity-60">{text.contact}</Link>
            </nav>
          </div>
          <div className="flex flex-col justify-between gap-3 pt-6 text-xs opacity-60 sm:flex-row"><span>© 2026 Shenzhen Metro Atlas</span><span>Shenzhen · 深圳</span></div>
        </div>
      </footer>
    </PageShell>
  );
}
