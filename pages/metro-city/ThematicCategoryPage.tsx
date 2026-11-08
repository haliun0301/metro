import { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import ThemeSidebar from '../../components/metro-city/ThemeSidebar';
import type { Person } from '../../components/metro-people/PeopleCircles';
import PageShell from '../../components/ui/PageShell';
import { useAppLanguage } from '../../hooks/useAppLanguage';
import { PeopleData } from '../../data/metro-people/people';
import {
  METRO_CITY_BENCHMARKS,
  METRO_CITY_SCOPE_NOTE,
} from '../../data/metro-city/categoryMetroBenchmarks';
import { getPersonStorySectionParagraphs } from '../../data/metro-people/personStories';
import { getThemeRoute, THEMATIC_TOPICS } from '../../data/metro-city/thematicTopics';

type Language = 'en' | 'zh';
type Localized = Record<Language, string>;
type ComparisonItem = {
  label: string;
  value: number;
  displayValue: string;
  color?: string;
};

const CATEGORY_TOPICS = [
  {
    index: 6,
    kind: 'transport',
    en: 'Compare the metro with buses and private cars through one interview account. Mode references are text mentions, not ridership or modal share.',
    zh: '通过一位受访者的叙述比较地铁、公交车与私家车。图表统计的是文本提及次数，不代表客流或出行分担率。',
  },
  {
    index: 7,
    kind: 'groups',
    en: 'Compare who is represented in the interview sample by gender, place of origin, and generation. These profile counts do not measure how groups use the metro.',
    zh: '按性别、来源地与出生年代比较受访者样本构成。这些个人资料统计不代表不同群体的地铁使用情况。',
  },
  {
    index: 10,
    kind: 'cities',
    en: 'A temporary comparison mockup using official 2024 figures for four city rail systems. Replace these benchmarks when the project dataset is ready.',
    zh: '使用四座城市官方 2024 年数据制作的临时比较示例。项目数据准备好后，可替换这些基准数据。',
  },
] as const;

const people = PeopleData as Person[];
const peopleById = new Map(people.map((person) => [person.id, person]));
const sourceInterviewSize = people.length;
const mutedBarColor = '#9BADA9';

const copy = {
  invalid: { en: 'This comparison could not be found', zh: '找不到这个比较主题' },
  modeChart: { en: 'References in the interview', zh: '访谈中的提及次数' },
  modeChartNote: { en: 'Mentions across the available interview text', zh: '现有访谈文本中的提及次数' },
  mode: { en: 'Metro mode', zh: '交通方式' },
  metro: { en: 'Subway', zh: '地铁' },
  bus: { en: 'Bus', zh: '公交车' },
  privateCar: { en: 'Private car', zh: '私家车' },
  interviewEvidence: { en: 'One interview perspective', zh: '一位受访者的观点' },
  excerptSource: { en: 'Interview excerpt', zh: '访谈摘录' },
  transportSampleNote: {
    en: 'Sample: one participant. Counts show how often each mode is named in the account; they are not a measure of travel frequency.',
    zh: '样本：1 位受访者。次数表示访谈中提及各交通方式的频率，不代表实际出行频率。',
  },
  sampleProfile: { en: 'Interview sample composition', zh: '受访者样本构成' },
  gender: { en: 'Gender', zh: '性别' },
  origin: { en: 'Connection to Shenzhen', zh: '与深圳的关联' },
  generation: { en: 'Birth decade', zh: '出生年代' },
  female: { en: 'Female', zh: '女性' },
  male: { en: 'Male', zh: '男性' },
  shenzhenBorn: { en: 'Shenzhen-born', zh: '深圳出生' },
  movedToShenzhen: { en: 'Moved to Shenzhen', zh: '迁入深圳' },
  peopleCount: { en: 'interviewees', zh: '位受访者' },
  sampleProfileNote: {
    en: 'These charts summarize profile data in the local interview dataset. They describe who is represented, not how groups use metro services.',
    zh: '图表汇总本地访谈数据集中的个人资料，反映样本构成，不代表不同群体的地铁使用情况。',
  },
  officialPreview: { en: 'Official benchmark · 2024 · temporary mockup', zh: '官方基准 · 2024 · 临时示例' },
  networkLength: { en: 'Reported operating network length', zh: '报告的运营线网里程' },
  dailyRidership: { en: 'Average daily passenger trips', zh: '日均客运量' },
  kilometers: { en: 'kilometers', zh: '公里' },
  millionPerDay: { en: 'million trips / day', zh: '百万人次 / 日' },
  sourceAndScope: { en: 'Sources and scope', zh: '来源与统计口径' },
  officialSource: { en: 'Official source', zh: '官方来源' },
  scopeNote: {
    en: 'Benchmark figures are temporary and come from official city reports. Network length and ridership definitions vary by system; see each source and the chart notes before comparing.',
    zh: '基准数据为临时示例，来自官方城市报告。各系统的运营里程与客流统计口径有所不同；比较前请参阅各来源及图表说明。',
  },
  explore: { en: 'Explore all city themes', zh: '浏览所有城市主题' },
} as const;

const modeDefinitions = [
  { key: 'metro', label: copy.metro, pattern: /\bsubways?\b/gi, color: 'var(--color-city)' },
  { key: 'bus', label: copy.bus, pattern: /\bbuses?\b/gi, color: mutedBarColor },
  { key: 'private-car', label: copy.privateCar, pattern: /\bprivate cars?\b/gi, color: mutedBarColor },
] as const;

function countMentions(paragraphs: Array<{ personId: string; text: string }>, pattern: RegExp) {
  return paragraphs.reduce((total, paragraph) => total + (paragraph.text.match(pattern)?.length ?? 0), 0);
}

function formatShare(value: number, total: number) {
  return `${value} · ${Math.round((value / total) * 100)}%`;
}

function getProfileDistributions(language: Language) {
  const genderCounts = people.reduce((counts, person) => {
    if (person.gender) counts[person.gender] = (counts[person.gender] ?? 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  const originCounts = people.reduce((counts, person) => {
    const key = person.shenzhenBorn === true ? 'born' : person.shenzhenBorn === false ? 'moved' : 'unknown';
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  const decadeCounts = people.reduce((counts, person) => {
    if (typeof person.yearOfBirth !== 'number') return counts;
    const decade = Math.floor(person.yearOfBirth / 10) * 10;
    counts[decade] = (counts[decade] ?? 0) + 1;
    return counts;
  }, {} as Record<number, number>);
  const share = (value: number) => formatShare(value, sourceInterviewSize);

  return [
    {
      key: 'gender',
      title: copy.gender[language],
      items: [
        { label: copy.female[language], value: genderCounts.female ?? 0, displayValue: share(genderCounts.female ?? 0) },
        { label: copy.male[language], value: genderCounts.male ?? 0, displayValue: share(genderCounts.male ?? 0) },
      ],
    },
    {
      key: 'origin',
      title: copy.origin[language],
      items: [
        { label: copy.shenzhenBorn[language], value: originCounts.born ?? 0, displayValue: share(originCounts.born ?? 0) },
        { label: copy.movedToShenzhen[language], value: originCounts.moved ?? 0, displayValue: share(originCounts.moved ?? 0) },
      ],
    },
    {
      key: 'generation',
      title: copy.generation[language],
      items: Object.entries(decadeCounts)
        .sort(([first], [second]) => Number(first) - Number(second))
        .map(([decade, value]) => ({
          label: language === 'zh' ? `${decade} 年代` : `${decade}s`,
          value,
          displayValue: share(value),
        })),
    },
  ];
}

function ComparisonBars({
  title,
  note,
  items,
  scale,
  axisLabel,
}: {
  title: string;
  note?: string;
  items: ComparisonItem[];
  scale: number;
  axisLabel: string;
}) {
  return (
    <figure className="rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-5 sm:p-6">
      <figcaption className="border-b border-[var(--color-hairline)] pb-4">
        <h3 className="text-base font-semibold text-[var(--color-ink)]">{title}</h3>
        {note && <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">{note}</p>}
      </figcaption>
      <ol className="mt-5 space-y-4">
        {items.map((item) => {
          const width = Math.min((item.value / scale) * 100, 100);

          return (
            <li key={item.label}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="font-medium text-[var(--color-ink)]">{item.label}</span>
                <span className="shrink-0 text-xs font-semibold tabular-nums text-[var(--color-text-muted)]">
                  {item.displayValue}
                </span>
              </div>
              <div
                className="relative mt-2 h-2.5 overflow-hidden rounded-full bg-[var(--color-canvas-soft)]"
                role="meter"
                aria-label={`${item.label}: ${item.displayValue}`}
                aria-valuemin={0}
                aria-valuemax={scale}
                aria-valuenow={item.value}
              >
                <span
                  aria-hidden="true"
                  className="block h-full rounded-full transition-[width] duration-500"
                  style={{ width: `${width}%`, backgroundColor: item.color || 'var(--color-city)' }}
                />
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 flex justify-between text-[0.65rem] font-medium uppercase tracking-[0.12em] text-[var(--color-text-faint)]">
        <span>0</span>
        <span>{axisLabel}</span>
      </p>
    </figure>
  );
}

function InterviewProfile({ personId }: { personId: string }) {
  const person = peopleById.get(personId);
  const displayName = person?.nickname || person?.name || personId;
  const initial = displayName.trim().slice(0, 1);

  return (
    <div className="flex items-center gap-3">
      {person?.profileImage?.src ? (
        <img
          src={person.profileImage.src}
          alt={person.profileImage.alt || displayName}
          className="h-11 w-11 rounded-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: person?.circleColor || 'var(--color-city)' }}
        >
          {initial}
        </span>
      )}
      <div>
        <p className="text-sm font-semibold text-[var(--color-ink)]">{displayName}</p>
        <p className="text-xs text-[var(--color-text-muted)]">{person?.occupation || personId}</p>
      </div>
    </div>
  );
}

function getLocalizedModeItems(paragraphs: Array<{ personId: string; text: string }>, language: Language): ComparisonItem[] {
  return modeDefinitions.map((mode) => {
    const value = countMentions(paragraphs, mode.pattern);
    return {
      label: mode.label[language],
      value,
      displayValue: `${value} ${language === 'zh' ? '次' : value === 1 ? 'mention' : 'mentions'}`,
      color: mode.color,
    };
  });
}

export default function ThematicCategoryPage() {
  const { language } = useAppLanguage('en');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedIndex = Number(searchParams.get('theme')) - 1;
  const categoryTopic = CATEGORY_TOPICS.find((topic) => topic.index === requestedIndex);
  const selectedIndex = categoryTopic?.index ?? null;
  const handleSelectTheme = (index: number) => navigate(getThemeRoute(index));

  const transportParagraphs = useMemo(
    () => getPersonStorySectionParagraphs('metro-vs-other-transport'),
    [],
  );
  const modeItems = useMemo(
    () => getLocalizedModeItems(transportParagraphs, language),
    [language, transportParagraphs],
  );
  const profileDistributions = useMemo(() => getProfileDistributions(language), [language]);

  if (!categoryTopic) {
    return (
      <PageShell theme={{ chapterColor: 'var(--color-city)' }} className="relative h-dvh w-full overflow-hidden">
        <div className="relative flex h-full w-full flex-col overflow-hidden lg:flex-row">
          <ThemeSidebar language={language} selectedIndex={null} onSelect={handleSelectTheme} layout="reserved" />
          <section className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-y-auto px-6 pt-20">
            <div className="max-w-lg text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-ink)]">{copy.invalid[language]}</h1>
              <Link
                to="/thematicmap"
                className="mt-6 inline-flex text-sm font-semibold text-[var(--color-city)] underline underline-offset-4"
              >
                {copy.explore[language]}
              </Link>
            </div>
          </section>
        </div>
      </PageShell>
    );
  }

  const topic = THEMATIC_TOPICS[categoryTopic.index];
  const transportInterviewCount = new Set(transportParagraphs.map(({ personId }) => personId)).size;

  return (
    <PageShell theme={{ chapterColor: 'var(--color-city)' }} className="relative h-dvh w-full overflow-hidden">
      <div className="relative flex h-full w-full flex-col overflow-hidden lg:flex-row">
        <ThemeSidebar language={language} selectedIndex={selectedIndex} onSelect={handleSelectTheme} layout="reserved" />
        <section className="min-h-0 min-w-0 flex-1 overflow-y-auto">
          <main className="mx-auto min-h-full w-full max-w-[1440px] px-5 pb-14 pt-24 sm:px-8 lg:px-14 lg:pt-32">
            <header className="max-w-5xl border-b border-[var(--color-hairline)] pb-8 sm:pb-10">
              <h1 className="type-page-heading text-[var(--color-ink)]">
                {topic[language]}
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--color-text-muted)] sm:text-lg sm:leading-8">
                {categoryTopic[language]}
              </p>
            </header>

            {categoryTopic.kind === 'transport' && (
              <section aria-labelledby="transport-comparison-heading" className="max-w-5xl pt-8 sm:pt-10">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 id="transport-comparison-heading" className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                      {copy.modeChart[language]}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{copy.modeChartNote[language]}</p>
                  </div>
                  <span className="rounded-sm border border-[var(--color-city)]/25 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[var(--color-city)]">
                    {transportInterviewCount} {copy.peopleCount[language]}
                  </span>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)]">
                  <ComparisonBars
                    title={copy.mode[language]}
                    note={copy.transportSampleNote[language]}
                    items={modeItems}
                    scale={Math.max(1, ...modeItems.map((item) => item.value))}
                    axisLabel={language === 'zh' ? '提及次数' : 'mentions'}
                  />
                  <article className="rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-canvas-soft)]/65 p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-hairline)] pb-4">
                      <h3 className="text-base font-semibold text-[var(--color-ink)]">{copy.interviewEvidence[language]}</h3>
                      {transportParagraphs[0] && <InterviewProfile personId={transportParagraphs[0].personId} />}
                    </div>
                    <div className="mt-5 space-y-4">
                      {transportParagraphs.length > 0 ? transportParagraphs.map((excerpt, index) => (
                        <blockquote key={`${excerpt.personId}-${index}`} className="border-l-2 border-[var(--color-city)]/55 pl-4 text-sm leading-7 text-[var(--color-text-muted)]">
                          “{excerpt.text}”
                        </blockquote>
                      )) : (
                        <p className="text-sm leading-6 text-[var(--color-text-muted)]">{copy.transportSampleNote[language]}</p>
                      )}
                    </div>
                    {transportParagraphs[0] && (
                      <p className="mt-4 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-faint)]">
                        {copy.excerptSource[language]} · {transportParagraphs[0].personId}
                      </p>
                    )}
                  </article>
                </div>
              </section>
            )}

            {categoryTopic.kind === 'groups' && (
              <section aria-labelledby="profile-composition-heading" className="max-w-5xl pt-8 sm:pt-10">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 id="profile-composition-heading" className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                      {copy.sampleProfile[language]}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{copy.sampleProfileNote[language]}</p>
                  </div>
                  <span className="text-xs font-semibold tabular-nums text-[var(--color-city)]">
                    {sourceInterviewSize} {copy.peopleCount[language]}
                  </span>
                </div>
                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  {profileDistributions.map((distribution) => (
                    <ComparisonBars
                      key={distribution.key}
                      title={distribution.title}
                      items={distribution.items}
                      scale={sourceInterviewSize}
                      axisLabel={`${sourceInterviewSize} ${copy.peopleCount[language]}`}
                    />
                  ))}
                </div>
              </section>
            )}

            {categoryTopic.kind === 'cities' && (
              <section aria-labelledby="city-benchmark-heading" className="max-w-5xl pt-8 sm:pt-10">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 id="city-benchmark-heading" className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                      {copy.officialPreview[language]}
                    </h2>
                  </div>
                  <span className="rounded-sm border border-[var(--color-city)]/25 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[var(--color-city)]">
                    2024
                  </span>
                </div>
                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  <ComparisonBars
                    title={copy.networkLength[language]}
                    items={METRO_CITY_BENCHMARKS.map((city) => ({
                      label: city.city[language],
                      value: city.networkKm,
                      displayValue: city.networkLabel,
                      color: city.city.en === 'Shenzhen' ? 'var(--color-city)' : mutedBarColor,
                    }))}
                    scale={900}
                    language={language}
                    axisLabel={copy.kilometers[language]}
                  />
                  <ComparisonBars
                    title={copy.dailyRidership[language]}
                    items={METRO_CITY_BENCHMARKS.map((city) => ({
                      label: city.city[language],
                      value: city.dailyRidershipMillions,
                      displayValue: city.dailyRidershipLabel,
                      color: city.city.en === 'Shenzhen' ? 'var(--color-city)' : mutedBarColor,
                    }))}
                    scale={11}
                    axisLabel={copy.millionPerDay[language]}
                  />
                </div>
                <p className="mt-4 border-l-2 border-[var(--color-city)]/55 pl-3 text-xs leading-6 text-[var(--color-text-muted)]">
                  {copy.scopeNote[language]} {METRO_CITY_SCOPE_NOTE[language]}
                </p>
                <section aria-labelledby="city-sources-heading" className="mt-8 border-t border-[var(--color-hairline)] pt-5">
                  <h3 id="city-sources-heading" className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                    {copy.sourceAndScope[language]}
                  </h3>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {METRO_CITY_BENCHMARKS.map((city) => (
                      <li key={city.city.en} className="border-l border-[var(--color-hairline)] pl-3">
                        <p className="text-sm font-semibold text-[var(--color-ink)]">{city.city[language]}</p>
                        <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">{city.ridershipBasis[language]}</p>
                        <a
                          href={city.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex text-xs font-semibold text-[var(--color-city)] underline decoration-[var(--color-city)]/35 underline-offset-2 hover:decoration-[var(--color-city)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-city)]"
                        >
                          {copy.officialSource[language]} · {city.sourceTitle[language]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              </section>
            )}
          </main>
        </section>
      </div>
    </PageShell>
  );
}
