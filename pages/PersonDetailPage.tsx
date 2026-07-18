import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { PeopleData } from '../data/metro-people/people';
import { getPersonStory, PERSON_STORY_SECTIONS } from '../data/metro-people/personStories';
import { useAppLanguage } from '../hooks/useAppLanguage';
import type { Person } from '../components/metro-people/PeopleCircles';

const CURRENT_YEAR = 2026;
const people = PeopleData as Person[];

const personStoryImageModules = import.meta.glob('../assets/person-stories/**/*.{png,jpg,jpeg,webp,avif,gif}', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>;

function resolvePersonStoryImage(src?: string) {
  if (!src) return undefined;
  if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) return src;

  const normalizedSrc = src.startsWith('/') ? src : '/' + src;
  const moduleKey = '..' + normalizedSrc;
  return personStoryImageModules[moduleKey] || src;
}

const copy = {
  en: {
    back: 'Back to Metro People',
    record: 'Participant record',
    born: 'Year of birth',
    age: 'Age in 2026',
    residence: 'Shenzhen residence',
    origin: 'Connection to Shenzhen',
    occupation: 'Occupation',
    bornInShenzhen: 'Shenzhen-born',
    movedToShenzhen: 'Moved to Shenzhen',
    years: 'years',
    unknown: 'Not recorded',
    storyPending: 'Participant account to be added.',
    previous: 'Previous participant',
    next: 'Next participant',
    notFound: 'Participant not found',
    notFoundText: 'This person is not available in the local Metro People dataset.',
    return: 'Return to people',
    sectionNav: 'Page content',
  },
  zh: {
    back: '返回地铁与人',
    record: '受访者记录',
    born: '出生年份',
    age: '2026 年年龄',
    residence: '在深居住',
    origin: '与深圳的关联',
    occupation: '职业',
    bornInShenzhen: '深圳出生',
    movedToShenzhen: '来深居住',
    years: '年',
    unknown: '未记录',
    storyPending: '待补充受访者叙事。',
    previous: '上一位受访者',
    next: '下一位受访者',
    notFound: '未找到受访者',
    notFoundText: '本地“地铁与人”数据集中没有这位受访者。',
    return: '返回地铁与人',
    sectionNav: '页面内容',
  },
} as const;

function LifeTimeline({ items }: { items: Array<{ period: string; text: string }> }) {
  if (items.length === 0) return null;

  return (
    <ol className="mt-7 grid gap-4 md:gap-5" aria-label="Life trajectory timeline">
      {items.map((item, index) => (
        <li key={`${item.period}-${index}`} className="grid gap-3 md:grid-cols-[9.5rem_minmax(0,1fr)] md:gap-6">
          <div className="flex items-start gap-3 md:justify-end">
            <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3EB181] text-[10px] font-black text-white shadow-[0_8px_20px_rgba(62,177,129,0.24)] md:order-2">
              {String(index + 1).padStart(2, '0')}
            </span>
            <p className="pt-0.5 text-sm font-bold tracking-[0.08em] text-[#25855f] md:text-right">{item.period}</p>
          </div>
          <p className="text-base leading-8 text-[#243136]/72 md:text-lg">{item.text}</p>
        </li>
      ))}
    </ol>
  );
}

function MomentImageFrame({ index, label, src }: { index: number; label: string; src?: string }) {
  const imageSrc = resolvePersonStoryImage(src);

  return (
    <div
      className="group relative aspect-[4/3] min-h-[9rem] w-full overflow-hidden bg-[#eef3ef] shadow-[0_18px_42px_rgba(36,49,54,0.08)] md:min-h-[10.5rem]"
      aria-label={label}
    >
      {imageSrc ? (
        <img src={imageSrc} alt={label} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_calc(50%-1px),rgba(36,49,54,0.2)_50%,transparent_calc(50%+1px)),linear-gradient(45deg,transparent_calc(50%-1px),rgba(36,49,54,0.16)_50%,transparent_calc(50%+1px))]" />
        </>
      )}
      <span className="pointer-events-none absolute bottom-4 left-4 bg-[#f4f6f4]/86 px-2 py-1 text-xs font-black tracking-[0.22em] text-[#243136]/62">{String(index + 1).padStart(2, '0')}</span>
    </div>
  );
}

function ProfilePortrait({ person }: { person: Person }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = resolvePersonStoryImage(person.profileImage?.src || person.imageFile || person.image?.src);
  const initials = (person.nickname || person.name || '?').trim().slice(0, 1);

  if (!imageSrc || imageFailed) {
    return (
      <div
        className="flex aspect-square w-full items-center justify-center rounded-full border-[10px] border-white/30 text-7xl font-semibold text-white shadow-[0_24px_70px_rgba(22,37,34,0.25)] md:text-9xl"
        style={{ backgroundColor: person.circleColor || '#3EB181' }}
        aria-label={person.name}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={person.profileImage?.alt || person.image?.alt || person.name}
      className="aspect-square w-full rounded-full border-[10px] border-white/30 object-cover shadow-[0_24px_70px_rgba(22,37,34,0.25)]"
      onError={() => setImageFailed(true)}
    />
  );
}

export default function PersonDetailPage() {
  const { personId } = useParams();
  const navigate = useNavigate();
  const { language } = useAppLanguage();
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const [pendingSectionId, setPendingSectionId] = useState<string | null>(null);
  const [isSectionNavOpen, setIsSectionNavOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const storyScrollRef = useRef<HTMLElement | null>(null);
  const text = copy[language];
  const personIndex = people.findIndex((person) => person.id === personId);
  const person = personIndex >= 0 ? people[personIndex] : undefined;
  const isCompactDetail = !isDetailExpanded && typeof window !== 'undefined' && window.innerWidth >= 768;

  useEffect(() => {
    setIsDetailExpanded(false);
    setPendingSectionId(null);
    setIsSectionNavOpen(false);
    setActiveSectionId(null);
  }, [personId]);

  useEffect(() => {
    if (!isDetailExpanded || !pendingSectionId) return;

    const timeout = window.setTimeout(() => {
      document.getElementById(`person-story-${pendingSectionId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setPendingSectionId(null);
    }, 720);

    return () => window.clearTimeout(timeout);
  }, [isDetailExpanded, pendingSectionId]);

  useEffect(() => {
    const scrollContainer = storyScrollRef.current;
    if (!scrollContainer || isCompactDetail) return;

    const updateActiveSection = () => {
      const containerRect = scrollContainer.getBoundingClientRect();
      const scrollTop = scrollContainer.scrollTop;
      const activationTop = scrollTop + scrollContainer.clientHeight * 0.24;

      const sections = PERSON_STORY_SECTIONS
        .map((section) => {
          const target = scrollContainer.querySelector(`#person-story-${section.id}`) as HTMLElement | null;
          if (!target) return null;

          const targetTop = target.getBoundingClientRect().top - containerRect.top + scrollTop;
          return { id: section.id, top: targetTop };
        })
        .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
        .sort((a, b) => a.top - b.top);

      if (sections.length === 0) return;

      const reachedSections = sections.filter((entry) => entry.top <= activationTop);
      const active = reachedSections[reachedSections.length - 1] ?? sections[0];
      setActiveSectionId(active.id);
    };

    updateActiveSection();
    scrollContainer.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      scrollContainer.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [isCompactDetail, personId]);

  if (!person) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f4f6f4] px-6 text-[#243136]">
        <div className="max-w-md border-l-4 border-[#3EB181] pl-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3EB181]">Metro People</p>
          <h1 className="mt-3 text-3xl font-semibold">{text.notFound}</h1>
          <p className="mt-3 leading-7 text-[#243136]/65">{text.notFoundText}</p>
          <Link to="/people" className="mt-7 inline-flex text-sm font-bold text-[#25855f] underline underline-offset-4">
            {text.return}
          </Link>
        </div>
      </main>
    );
  }

  const age = typeof person.yearOfBirth === 'number' ? CURRENT_YEAR - person.yearOfBirth : null;
  const residenceYears = person.shenzhenBorn && typeof person.yearOfBirth === 'number'
    ? CURRENT_YEAR - person.yearOfBirth
    : typeof person.yearOfResidence === 'number' ? CURRENT_YEAR - person.yearOfResidence : null;
  const previousPerson = people[(personIndex - 1 + people.length) % people.length];
  const nextPerson = people[(personIndex + 1) % people.length];
  const story = getPersonStory(person.id || '');
  const displayName = language === 'zh' ? person.nickname || person.name : person.nickname || person.name;
  const facts = [
    { label: text.occupation, value: language === 'zh' ? person.occupationCn || person.occupation : person.occupation || person.occupationCn },
    { label: text.born, value: person.yearOfBirth?.toString() },
    { label: text.age, value: age?.toString() },
    { label: text.residence, value: residenceYears === null ? undefined : `${residenceYears} ${text.years}` },
    { label: text.origin, value: person.shenzhenBorn ? text.bornInShenzhen : text.movedToShenzhen },
  ];
  const openDetail = (sectionId?: string) => {
    if (sectionId) setPendingSectionId(sectionId);
    setIsDetailExpanded(true);
  };
  const scrollToStorySection = (sectionId: string) => {
    setIsSectionNavOpen(false);
    setActiveSectionId(sectionId);

    if (!isDetailExpanded) {
      openDetail(sectionId);
      return;
    }

    document.getElementById(`person-story-${sectionId}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <>
      {!isDetailExpanded && (
        <button
          type="button"
          className="fixed inset-0 z-[3200] hidden cursor-default md:block"
          aria-label={language === 'zh' ? '关闭个人详情' : 'Close participant details'}
          onClick={() => navigate('/people')}
        />
      )}
    <main
      className="fixed inset-y-0 right-0 z-[3300] min-h-screen overflow-hidden bg-white text-[#243136] transition-[width] duration-700 ease-out motion-reduce:transition-none md:h-screen"
      style={typeof window !== 'undefined' && window.innerWidth >= 768
        ? { width: isDetailExpanded ? '100vw' : '50vw' }
        : undefined}
      onClick={() => {
        if (isCompactDetail) openDetail();
      }}
    >
      {!isCompactDetail && (
        <nav
          className="fixed right-20 top-[50px] z-[3500] hidden flex-col items-end md:flex"
          aria-label={text.sectionNav}
        >
          <div className={`flex min-w-[180px] flex-col rounded-2xl border border-transparent bg-white/28 shadow-[0_14px_44px_rgba(15,23,42,0.14)] backdrop-blur-2xl ${isSectionNavOpen ? 'max-h-[72vh] p-2' : 'h-12 px-2 py-0'}`}>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setIsSectionNavOpen((isOpen) => !isOpen);
              }}
              aria-expanded={isSectionNavOpen}
              className="flex h-12 items-center justify-between gap-3 rounded-xl px-4 text-left text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-700 transition hover:bg-black/5 hover:text-zinc-950"
            >
              {text.sectionNav}
              <span className={`text-xs transition-transform duration-150 ${isSectionNavOpen ? 'rotate-90' : ''}`}>›</span>
            </button>
            {isSectionNavOpen && (
              <div className="mt-1 flex max-h-[62vh] flex-col gap-0.5 overflow-y-auto pr-1">
                {PERSON_STORY_SECTIONS.map((section, index) => {
                  const isActive = activeSectionId === section.id;

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        scrollToStorySection(section.id);
                      }}
                      className={`flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-left text-xs font-medium transition-all duration-150 ${
                        isActive
                          ? 'text-[#3EB181]'
                          : 'text-zinc-600 hover:bg-emerald-500/10 hover:text-zinc-950'
                      }`}
                    >
                      <span className={`w-5 shrink-0 text-[10px] font-semibold tabular-nums ${
                        isActive ? 'text-[#3EB181]' : 'text-zinc-400'
                      }`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{section.title}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
      )}
      <div className={`flex min-h-screen flex-col ${isDetailExpanded ? 'md:grid md:h-screen md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]' : isCompactDetail ? 'md:grid md:h-screen md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]' : ''}`}>
        <aside className={`bg-[#3EB181] text-white md:overflow-hidden ${isCompactDetail ? 'md:h-screen' : ''}`}>
          <div className="flex h-full flex-col items-center px-6 pb-10 pt-28 text-center md:justify-center md:px-10 md:py-8">
            <div className="w-32 md:w-36">
              <ProfilePortrait person={person} />
            </div>
            <h1 className="mt-7 text-4xl font-semibold leading-tight md:text-5xl">{displayName}</h1>
            <p className="mt-3 text-base leading-7 text-white/84">
              {language === 'zh' ? person.occupationCn || person.occupation : person.occupation || person.occupationCn || text.unknown}
            </p>
            <div className="mt-7 grid w-full max-w-sm grid-cols-2 text-left">
              {facts.map((fact, index) => (
                <div
                  key={fact.label}
                  className={`py-3 ${index === facts.length - 1 ? 'col-span-2 px-0' : index % 2 === 0 ? 'pr-3' : 'pl-3'}`}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/62">{fact.label}</p>
                  <p className="mt-1 text-sm font-semibold leading-snug text-white">{fact.value || text.unknown}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section ref={storyScrollRef} className={`min-w-0 bg-white md:h-screen md:overflow-y-auto ${isCompactDetail ? 'md:overflow-hidden' : ''}`} aria-label={text.record}>
          <div className={isCompactDetail ? 'grid h-full grid-rows-9' : 'mx-auto max-w-4xl px-6 pb-12 pt-12 md:px-12 md:pb-20 md:pt-36'}>
            <div className={isCompactDetail ? 'contents' : ''}>
              {PERSON_STORY_SECTIONS.map((section, index) => {
                const storySection = story?.sections.find((currentStorySection) => currentStorySection.id === section.id);
                const paragraphs = storySection?.paragraphs.filter(Boolean) ?? [];
                const momentItems = storySection?.items?.filter((item) => item.text || item.image) ?? [];
                const timelineItems = storySection?.timeline?.filter((item) => item.period || item.text) ?? [];
                const renderedMomentItems: Array<{ text: string; image?: string; alt?: string }> = momentItems.length > 0
                  ? momentItems
                  : paragraphs.map((paragraph) => ({ text: paragraph }));

                return (
                <section
                  key={section.id}
                  id={`person-story-${section.id}`}
                  className={isCompactDetail ? 'flex min-h-0 cursor-pointer items-center px-5 py-3 transition hover:bg-[#e8f4ed] focus:bg-[#e8f4ed] focus:outline-none' : 'grid gap-4 py-10 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-8 md:py-14'}
                  role={isCompactDetail ? 'button' : undefined}
                  tabIndex={isCompactDetail ? 0 : undefined}
                  onClick={isCompactDetail ? (event) => {
                    event.stopPropagation();
                    openDetail(section.id);
                  } : undefined}
                  onKeyDown={isCompactDetail ? (event) => {
                    if (event.key !== 'Enter' && event.key !== ' ') return;
                    event.preventDefault();
                    openDetail(section.id);
                  } : undefined}
                >
                  {!isCompactDetail && <span className="text-xs font-bold tracking-[0.16em] text-[#25855f]">{String(index + 1).padStart(2, '0')}</span>}
                  <div>
                    <h2 className={isCompactDetail ? 'text-xs font-bold leading-5 text-[#243136]/72' : 'max-w-2xl text-2xl font-semibold leading-tight md:text-4xl'}>{section.title}</h2>
                    {!isCompactDetail && (paragraphs.length > 0 || timelineItems.length > 0 ? (
                      section.id === 'life-trajectory' ? (
                        <>
                          {paragraphs.length > 0 && (
                            <div className="mt-5 space-y-4 text-base leading-8 text-[#243136]/72 md:text-lg">
                              {paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
                            </div>
                          )}
                          <LifeTimeline items={timelineItems} />
                        </>
                      ) : section.id === 'moments' ? (
                        <div className="mt-7 space-y-6">
                          {renderedMomentItems.map((item, paragraphIndex) => (
                            <article
                              key={paragraphIndex}
                              className="grid gap-4 pt-2 md:grid-cols-[minmax(0,1fr)_minmax(13rem,0.72fr)] md:items-start md:gap-7"
                            >
                              <p className="text-base leading-8 text-[#243136]/72 md:text-lg">{item.text}</p>
                              <MomentImageFrame
                                index={paragraphIndex}
                                src={item.image}
                                label={item.alt || (language === 'zh' ? '故事 ' + (paragraphIndex + 1) + ' 图片' : 'Story ' + (paragraphIndex + 1) + ' image')}
                              />
                            </article>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-5 space-y-4 text-base leading-8 text-[#243136]/72 md:text-lg">
                          {paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
                        </div>
                      )
                    ) : (
                      <p className="mt-4 text-sm font-medium text-[#243136]/48">{text.storyPending}</p>
                    ))}
                  </div>
                </section>
                );
              })}
            </div>

            {!isCompactDetail && <nav className="mt-16" aria-label="Participant navigation">
              <div className="grid grid-cols-2">
                <Link to={`/people/${previousPerson.id}`} className="group min-w-0 py-7 pr-4 transition focus:outline-none">
                  <span className="block text-xs font-bold uppercase tracking-[0.14em] text-[#25855f]">{text.previous}</span>
                  <span className="mt-2 block truncate text-lg font-semibold transition-colors group-hover:text-[#3EB181] group-focus:text-[#3EB181]">{previousPerson.nickname || previousPerson.name}</span>
                </Link>
                <Link to={`/people/${nextPerson.id}`} className="group min-w-0 py-7 pl-4 text-right transition focus:outline-none">
                  <span className="block text-xs font-bold uppercase tracking-[0.14em] text-[#25855f]">{text.next}</span>
                  <span className="mt-2 block truncate text-lg font-semibold">{nextPerson.nickname || nextPerson.name}</span>
                </Link>
              </div>
            </nav>}
          </div>
        </section>
      </div>
      <div className="fixed right-6 top-[50px] z-[3500] hidden md:block">
        <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setIsDetailExpanded((expanded) => !expanded);
            }}
            aria-label={language === 'zh'
              ? (isDetailExpanded ? '收起详情' : '展开详情')
              : (isDetailExpanded ? 'Collapse details' : 'Expand details')}
            title={language === 'zh'
              ? (isDetailExpanded ? '收起' : '展开')
              : (isDetailExpanded ? 'Collapse' : 'Expand')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/45 bg-white/95 text-[#2A383E] shadow-[0_8px_24px_rgba(15,23,42,0.16)] transition-colors hover:border-transparent hover:bg-[#3EB181] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
        </button>
      </div>
    </main>
    </>
  );
}
