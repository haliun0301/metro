import { useMemo } from 'react';

import OccupationCloud from '../../components/metro-people/OccupationCloud';
import type { Person } from '../../components/metro-people/PeopleCircles';
import { PeopleData } from '../../data/metro-people/people';
import { getPersonStorySectionParagraphs } from '../../data/metro-people/personStories';

type Language = 'en' | 'zh';

const WORD_CLOUD_TOPICS = [
  {
    index: 8,
    sectionId: 'metro-impact-on-my-life',
    en: {
      empty: 'No interview text is available for this theme yet.',
    },
    zh: {
      empty: '此主题目前没有可用的访谈文本。',
    },
  },
  {
    index: 9,
    sectionId: 'metro-impact-on-shenzhen',
    en: {
      empty: 'No interview text is available for this theme yet.',
    },
    zh: {
      empty: '此主题目前没有可用的访谈文本。',
    },
  },
] as const;

const peopleById = new Map((PeopleData as Person[]).map((person) => [person.id, person]));
// POS-checked adjective forms in the current interview excerpts.
const adjectiveVocabulary = new Set([
  'afraid', 'convenient', 'dense', 'far', 'limited', 'round', 'soaring',
]);
const sentencePattern = /(?:[^.!?。！？]+[.!?。！？]+["'”’)\]]*|[^.!?。！？]+$)/gu;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getAdjectiveCounts(paragraphs: Array<{ personId: string; text: string }>) {
  const counts = new Map<string, number>();

  paragraphs.forEach(({ text }) => {
    const words = text.toLowerCase().match(/[a-z]+(?:'[a-z]+)?/g) ?? [];
    words.forEach((word) => {
      if (!adjectiveVocabulary.has(word)) return;
      counts.set(word, (counts.get(word) ?? 0) + 1);
    });
  });

  return [...counts.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
}

function getMatchingInterviews(word: string, paragraphs: Array<{ personId: string; text: string }>) {
  const escapedWord = escapeRegExp(word);
  const wordPattern = new RegExp(`\\b${escapedWord}\\b`, 'i');
  const matchesByPerson = new Map<string, string[]>();

  paragraphs.forEach(({ personId, text }) => {
    const matchingSentences = (text.match(sentencePattern) ?? [text])
      .map((sentence) => sentence.trim())
      .filter((sentence) => wordPattern.test(sentence));
    if (matchingSentences.length === 0) return;

    const quotes = matchesByPerson.get(personId) ?? [];
    matchingSentences.forEach((sentence) => {
      if (!quotes.includes(sentence)) quotes.push(sentence);
    });
    matchesByPerson.set(personId, quotes);
  });

  return [...matchesByPerson].map(([personId, quotes]) => ({
    personId,
    person: peopleById.get(personId),
    quotes,
  }));
}

function highlightWord(text: string, word: string) {
  const pattern = new RegExp(`(\\b${escapeRegExp(word)}\\b)`, 'gi');
  return text.split(pattern).map((part, index) => (
    index % 2 === 1
      ? <mark key={index} className="rounded-sm bg-[var(--color-city)]/15 px-0.5 font-semibold text-[var(--color-city)]">{part}</mark>
      : part
  ));
}

const uiCopy = {
  interviews: { en: 'Interviewees', zh: '受访者' },
  excerpts: { en: 'Interview excerpts', zh: '访谈片段' },
  adjectives: { en: 'Adjectives', zh: '形容词' },
  cloudLabel: { en: 'Interview word cloud', zh: '访谈词云' },
  cloudNote: {
    en: 'Only adjectives are shown. Word size reflects how often each adjective appears in the available interview text.',
    zh: '词云仅展示形容词。词语大小对应其在当前访谈文本中的出现次数。',
  },
  occurrences: { en: 'mentions in the available text', zh: '次出现于现有文本' },
  participant: { en: 'participant', zh: '位受访者' },
  participants: { en: 'participants', zh: '位受访者' },
  quote: { en: 'Interview perspective', zh: '访谈观点' },
  unnamedParticipant: { en: 'Interview participant', zh: '访谈受访者' },
  sourceDisclosure: {
    en: 'Current sample: one participant. Counts reflect the adjectives found in the available excerpts.',
    zh: '当前样本：1 位受访者。词频仅统计现有访谈片段中的形容词。',
  },
} as const;

export function ThematicWordCloudContent({
  topicIndex,
  language,
}: {
  topicIndex: number;
  language: Language;
}) {
  const cloudTopic = WORD_CLOUD_TOPICS.find((topic) => topic.index === topicIndex);
  const paragraphs = useMemo(
    () => cloudTopic
      ? getPersonStorySectionParagraphs(cloudTopic.sectionId)
      : [],
    [cloudTopic],
  );
  const adjectives = useMemo(() => getAdjectiveCounts(paragraphs), [paragraphs]);
  const categoryLabel = language === 'zh' ? '访谈形容词' : 'Interview adjectives';
  const cloudData = useMemo(
    () => adjectives.map((adjective) => ({ label: adjective.word, value: adjective.count, category: categoryLabel })),
    [adjectives, categoryLabel],
  );
  const cloudColorMap = useMemo(() => ({ [categoryLabel]: '#28A873' }), [categoryLabel]);
  const interviewCount = new Set(paragraphs.map(({ personId }) => personId)).size;

  if (!cloudTopic) return null;

  return (
    <section aria-labelledby="word-cloud-heading" className="max-w-5xl pt-7 sm:pt-9">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 id="word-cloud-heading" className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    {uiCopy.cloudLabel[language]}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
                    {uiCopy.cloudNote[language]}
                  </p>
                </div>
                <p className="text-xs font-semibold text-[var(--color-city)]">{uiCopy.sourceDisclosure[language]}</p>
              </div>

              <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--color-hairline)] bg-[var(--color-canvas-soft)]/55">
                {adjectives.length > 0 ? (
                  <div role="group" aria-label={uiCopy.cloudLabel[language]} className="px-4 py-5 sm:px-8">
                    <OccupationCloud
                      key={cloudTopic.index}
                      data={cloudData}
                      backgroundColor="transparent"
                      categoryColorMap={cloudColorMap}
                      highlightedLabel={null}
                      language={language}
                      showLegend={false}
                      showSummary={false}
                      animateOnMount
                      hoverAvoidSelector="[data-theme-sidebar]"
                      renderHoverContent={(item) => (
                        <article className="space-y-4">
                          {(() => {
                            const interviews = getMatchingInterviews(item.label, paragraphs);
                            return (
                              <>
                                <header className="border-b border-[var(--color-hairline)] pb-3 text-center">
                                  <h3 className="text-lg font-semibold leading-6 text-[var(--color-ink)]">{item.label}</h3>
                                  <p className="mt-1 text-xs font-medium text-[var(--color-text-muted)]">
                                    {item.value} {uiCopy.occurrences[language]} · {interviews.length}{' '}
                                    {interviews.length === 1 ? uiCopy.participant[language] : uiCopy.participants[language]}
                                  </p>
                                </header>
                                <div className={`grid gap-3 ${interviews.length > 1 ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
                                  {interviews.map(({ personId, person, quotes }) => {
                                    const displayName = language === 'zh'
                                      ? person?.nicknameCn || person?.nickname || person?.name
                                      : person?.nickname || person?.name;
                                    const occupation = language === 'zh'
                                      ? person?.occupationCn || person?.occupation
                                      : person?.occupation || person?.occupationCn;
                                    const avatarInitial = (person?.nickname || person?.name || personId).trim().slice(0, 1);

                                    return (
                                      <section
                                        key={personId}
                                        className="rounded-[var(--radius-sm)] border border-[var(--color-hairline)] bg-[var(--color-canvas-soft)]/75 p-3"
                                      >
                                        <header className="flex items-center gap-3">
                                          {person?.profileImage?.src ? (
                                            <img
                                              src={person.profileImage.src}
                                              alt={person.profileImage.alt || displayName || personId}
                                              className="h-11 w-11 shrink-0 rounded-full object-cover"
                                            />
                                          ) : (
                                            <span
                                              aria-hidden="true"
                                              className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-sm font-semibold text-white"
                                              style={{ backgroundColor: person?.circleColor || 'var(--color-city)' }}
                                            >
                                              {avatarInitial}
                                            </span>
                                          )}
                                          <div className="min-w-0">
                                            <h4 className="truncate text-sm font-semibold text-[var(--color-ink)]">
                                              {displayName || uiCopy.unnamedParticipant[language]}
                                            </h4>
                                            {occupation && (
                                              <p className="mt-0.5 truncate text-xs text-[var(--color-text-muted)]">{occupation}</p>
                                            )}
                                          </div>
                                        </header>
                                        <div className="mt-3 space-y-3">
                                          {quotes.map((text, index) => (
                                            <blockquote
                                              key={`${personId}-${index}`}
                                              className="border-l-2 border-[var(--color-city)]/55 pl-3 text-sm leading-6 text-[var(--color-text-muted)]"
                                            >
                                              <span className="mb-1 block text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-city)]">
                                                {uiCopy.quote[language]}
                                              </span>
                                              “{highlightWord(text, item.label)}”
                                            </blockquote>
                                          ))}
                                        </div>
                                        <p className="mt-3 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-faint)]">
                                          {personId}
                                        </p>
                                      </section>
                                    );
                                  })}
                                </div>
                              </>
                            );
                          })()}
                        </article>
                      )}
                    />
                  </div>
                ) : (
                  <p className="grid min-h-[20rem] place-items-center px-6 text-sm text-[var(--color-text-muted)]">
                    {cloudTopic[language].empty}
                  </p>
                )}
              </div>

              <div className="mt-5 grid grid-cols-3 border-y border-[var(--color-hairline)] py-4">
                {[
                  { label: uiCopy.interviews[language], value: interviewCount },
                  { label: uiCopy.excerpts[language], value: paragraphs.length },
                  { label: uiCopy.adjectives[language], value: adjectives.length },
                ].map((stat) => (
                  <div key={stat.label} className="pr-2">
                    <p className="text-2xl font-semibold tabular-nums text-[var(--color-ink)]">{stat.value}</p>
                    <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">{stat.label}</p>
                  </div>
                ))}
              </div>
    </section>
  );
}
