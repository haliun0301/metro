import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import ThemeSidebar from '../../components/metro-city/ThemeSidebar';
import PageShell from '../../components/ui/PageShell';
import { useAppLanguage } from '../../hooks/useAppLanguage';
import { getThemeRoute, THEMATIC_TOPICS } from '../../data/metro-city/thematicTopics';

const essays = [
  {
    en: {
      introduction: 'A city’s transport story is also a story about changing distances: which journeys feel possible, how long they take, and what becomes part of an ordinary day.',
      chapters: [
        ['Distance becomes a daily decision', 'As the network reaches further across Shenzhen, a trip is measured by more than kilometres. Transfers, station access, and the rhythm of the day all shape whether a place feels near or far.'],
        ['A growing city, read through its journeys', 'Residents experience urban change at street level: in a familiar route that shifts, a new interchange, or a neighbourhood that becomes easier to reach. These journeys offer a human-scale way to read the city’s expansion.'],
        ['Mobility is more than movement', 'The question is not simply how quickly people can cross the city. It is also how transport connects work, home, family, and leisure—and whose everyday choices are widened by that connection.'],
      ],
    },
    zh: {
      introduction: '一座城市的交通故事，也是一段关于距离如何变化的故事：哪些出行变得可行、需要多久，以及什么逐渐融入日常。',
      chapters: [
        ['距离成为日常选择', '随着地铁网络延伸至深圳更多区域，出行不再只由公里数决定。换乘、车站接驳与一天的时间节奏，都会影响一处地方在人们心中是近还是远。'],
        ['沿着出行轨迹阅读成长中的城市', '居民在街道尺度上感受城市变化：熟悉的路线发生改变，新的换乘节点出现，或某个片区变得更容易抵达。日常出行让城市扩张有了可感知的尺度。'],
        ['流动不只是移动', '问题不仅是人们能多快穿越城市，也包括交通如何连接工作、居住、家庭与休闲，以及这种连接如何拓宽不同人群的日常选择。'],
      ],
    },
  },
  {
    en: {
      introduction: 'A metro carriage is more than a corridor between stations. For a few minutes, it is a shared interior where different routines meet in close proximity.',
      chapters: [
        ['A public room in motion', 'People bring fragments of the city into the carriage: a workday beginning, a school journey, a message answered, a quiet pause between destinations. The space belongs to everyone and no one for long.'],
        ['Small rituals, shared space', 'Where we stand, how we make room, and when we offer a seat are everyday negotiations. These small gestures help reveal how strangers learn to share a public environment.'],
        ['The journey between destinations', 'Looking closely at the ride itself shifts attention away from the map. The in-between time becomes part of city life: a place for observation, routine, and brief encounters.'],
      ],
    },
    zh: {
      introduction: '地铁车厢不只是连接车站的通道。在短短几分钟里，不同的生活节奏在这个共享的室内空间里相遇。',
      chapters: [
        ['一间移动中的公共房间', '人们把城市生活的片段带进车厢：开始一天的工作、上学路上的片刻、回复一条消息，或在抵达下一站前稍作停顿。这个空间属于每个人，却不会为任何人停留太久。'],
        ['共享空间里的日常默契', '站在哪里、如何让出空间、什么时候为他人让座，都是日常的协商。这些细微举动展现了陌生人如何共同使用公共空间。'],
        ['目的地之间的旅程', '当视线从地图移向乘车过程本身，旅途中的时间也成为城市生活的一部分：它是观察、重复日常与短暂相遇发生的地方。'],
      ],
    },
  },
  {
    en: {
      introduction: 'A first metro ride is an encounter with a city’s systems—and with the small decisions that turn an unfamiliar journey into a familiar one.',
      chapters: [
        ['Finding a way in', 'Before the train moves, a new rider reads signs, follows flows of people, and works out where to enter. The station is often the first lesson in how the city organizes movement.'],
        ['Learning the rhythm', 'The route becomes legible one choice at a time: which platform, when to transfer, and where to wait. Each step adds a little confidence to an unfamiliar trip.'],
        ['A journey becomes a memory', 'First rides are remembered through details as much as destinations—the sound of the doors, the view from the window, or the relief of finding the right exit. Together, these moments give a new place a human scale.'],
      ],
    },
    zh: {
      introduction: '第一次乘坐地铁，是与一座城市的运行系统相遇，也是把陌生旅程变成熟悉路线的过程。',
      chapters: [
        ['找到入口', '列车出发之前，初次乘客要读懂指引、观察人流，并判断从哪里进入。车站往往是理解这座城市如何组织出行的第一课。'],
        ['熟悉出行节奏', '路线通过一次次选择变得清晰：走向哪个站台、何时换乘、在哪里等候。每一步都为陌生旅程增加一点把握。'],
        ['旅程成为记忆', '第一次乘车常常被目的地以外的细节记住——车门的声音、窗外的景象，或终于找到正确出口时的安心。这些片段让新地方有了人的尺度。'],
      ],
    },
  },
  {
    en: {
      introduction: 'A useful network is not finished when a line opens. Looking at everyday friction—crowding, transfers, access, and clarity—helps turn experience into practical questions for improvement.',
      chapters: [
        ['Notice where the journey gets difficult', 'The whole trip matters, not only the time spent on the train. Getting to a station, moving between platforms, and finding the right exit all shape how accessible the network feels.'],
        ['Design for different everyday needs', 'A route that works for one passenger may be demanding for another. Clear information, step-free connections, comfortable transfers, and room to move are part of making a system usable across ages and abilities.'],
        ['Improve the experience, not just the map', 'Recommendations become more useful when they begin with specific moments in a journey. Listening to those experiences can guide changes that make the network easier to understand, navigate, and share.'],
      ],
    },
    zh: {
      introduction: '线路开通并不意味着网络体验已经完善。关注拥挤、换乘、接驳与信息指引中的日常阻碍，才能把乘车体验转化为具体的改进问题。',
      chapters: [
        ['留意旅程在哪些地方变得困难', '重要的不只是列车上的时间，完整旅程同样重要。如何到达车站、在站台之间移动、找到正确出口，都会影响人们感受到的可达性。'],
        ['回应不同的日常需要', '对一位乘客顺畅的路线，对另一位乘客可能并不轻松。清晰的信息、无障碍连接、舒适的换乘与充足的通行空间，都是让不同年龄与能力的人使用网络的重要部分。'],
        ['改善体验，而不只是地图', '从旅程中的具体时刻出发，建议才更容易落实。倾听这些体验，有助于找到让网络更容易理解、抵达与共同使用的改进方向。'],
      ],
    },
  },
] as const;

const essayTopicIndices = THEMATIC_TOPICS
  .map((topic, index) => topic.format === 'essay' ? index : -1)
  .filter((index) => index >= 0);

export default function ThematicEssayPage() {
  const { language } = useAppLanguage('en');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedIndex = Number(searchParams.get('theme')) - 1;
  const topicIndex = Number.isInteger(requestedIndex)
    && requestedIndex >= 0
    && THEMATIC_TOPICS[requestedIndex]?.format === 'essay'
    ? requestedIndex
    : -1;
  const handleSelectTheme = (index: number) => navigate(getThemeRoute(index));

  if (topicIndex < 0) {
    return (
      <PageShell theme={{ chapterColor: 'var(--color-city)' }} className="relative h-dvh w-full overflow-hidden">
        <div className="relative flex h-full w-full flex-col overflow-hidden lg:flex-row">
          <ThemeSidebar language={language} selectedIndex={null} onSelect={handleSelectTheme} layout="reserved" />
          <section className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-y-auto px-6 pt-20 lg:order-none">
            <div className="max-w-lg text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-city)]">
                {language === 'zh' ? '主题文章' : 'City essays'}
              </p>
                  <h1 className="mt-4 text-[var(--text-subtitle)] font-semibold leading-tight tracking-[0.04em] sm:text-[var(--text-title)]">
                {language === 'zh' ? '找不到这篇主题文章' : 'This essay could not be found'}
              </h1>
              <Link
                to="/thematicmap"
                className="mt-7 inline-flex min-h-11 items-center rounded-[var(--radius-sm)] bg-[var(--color-city)] px-5 text-sm font-semibold text-white transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-city)]"
              >
                {language === 'zh' ? '返回城市主题' : 'Back to city themes'}
              </Link>
            </div>
          </section>
        </div>
      </PageShell>
    );
  }

  const essayPosition = essayTopicIndices.indexOf(topicIndex);
  const topic = THEMATIC_TOPICS[topicIndex];
  const copy = essays[essayPosition][language];
  const previousTopicIndex = essayTopicIndices[essayPosition - 1];
  const nextTopicIndex = essayTopicIndices[essayPosition + 1];

  return (
    <PageShell theme={{ chapterColor: 'var(--color-city)' }} className="relative h-dvh w-full overflow-hidden">
      <div className="relative flex h-full w-full flex-col overflow-hidden lg:flex-row">
        <ThemeSidebar language={language} selectedIndex={topicIndex} onSelect={handleSelectTheme} layout="reserved" />
        <section className="min-h-0 min-w-0 flex-1 overflow-y-auto lg:order-none">
          <main className="mx-auto min-h-full w-full max-w-[1440px] px-5 pb-16 pt-24 sm:px-8 lg:px-14 lg:pt-32">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-20">
              <article className="min-w-0">
            <header className="border-b border-[var(--color-hairline)] pb-9 sm:pb-12">
              <h1 className="type-page-heading mt-6 max-w-5xl">
                {topic[language]}
              </h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-[var(--color-text-muted)] sm:text-xl sm:leading-9">
                {copy.introduction}
              </p>
            </header>

            <div className="grid gap-10 pt-10 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-14 sm:pt-14">
              <aside className="self-start sm:sticky sm:top-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-city)]">
                  {language === 'zh' ? '本文导读' : 'In this essay'}
                </p>
                <nav aria-label={language === 'zh' ? '本文章节' : 'Essay chapters'} className="mt-4">
                  <ol className="space-y-3">
                    {copy.chapters.map(([title], index) => (
                      <li key={title}>
                        <a
                          href={`#chapter-${index + 1}`}
                          className="group flex gap-3 text-sm leading-6 text-[var(--color-text-muted)] transition hover:text-[var(--color-city)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-city)]"
                        >
                          <span className="text-xs tabular-nums text-[var(--color-city)]">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span>{title}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
                <div className="mt-8 border-t border-[var(--color-hairline)] pt-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--color-text-faint)]">
                    {language === 'zh' ? '研究主题' : 'Research theme'}
                  </p>
                  <p className="mt-2 text-sm font-medium leading-6">{topic[language]}</p>
                </div>
              </aside>

              <div className="max-w-2xl">
                {copy.chapters.map(([title, body], index) => (
                  <section
                    key={title}
                    id={`chapter-${index + 1}`}
                    className="scroll-mt-10 border-t border-[var(--color-hairline)] py-8 first:border-0 first:pt-0 sm:py-10"
                  >
                    <p className="text-xs font-semibold tabular-nums tracking-[0.12em] text-[var(--color-city)]">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h2 className="type-section-heading mt-3">
                      {title}
                    </h2>
                    <p className="mt-5 text-base leading-8 text-[var(--color-text-muted)] sm:text-lg sm:leading-9">
                      {body}
                    </p>
                  </section>
                ))}
              </div>
            </div>

            <footer className="mt-6 flex flex-wrap items-center justify-between gap-5 border-t border-[var(--color-hairline)] pt-7">
              <Link
                to="/thematicmap"
                className="text-sm font-semibold text-[var(--color-city)] underline decoration-[var(--color-city)]/35 underline-offset-4 transition hover:decoration-[var(--color-city)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-city)]"
              >
                {language === 'zh' ? '浏览所有城市主题' : 'Explore all city themes'}
              </Link>
              <div className="flex items-center gap-3">
                {previousTopicIndex !== undefined && (
                  <Link
                    to={`/thematic-essay?theme=${previousTopicIndex + 1}`}
                    aria-label={language === 'zh' ? '上一篇文章' : 'Previous essay'}
                    className="grid h-11 w-11 place-items-center rounded-full border border-[var(--color-hairline)] text-lg transition hover:border-[var(--color-city)] hover:text-[var(--color-city)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-city)]"
                  >
                    ←
                  </Link>
                )}
                {nextTopicIndex !== undefined && (
                  <Link
                    to={`/thematic-essay?theme=${nextTopicIndex + 1}`}
                    aria-label={language === 'zh' ? '下一篇文章' : 'Next essay'}
                    className="grid h-11 w-11 place-items-center rounded-full border border-[var(--color-hairline)] text-lg transition hover:border-[var(--color-city)] hover:text-[var(--color-city)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-city)]"
                  >
                    →
                  </Link>
                )}
              </div>
            </footer>
              </article>
              <aside aria-hidden="true" className="hidden lg:block">
                <div className="sticky top-32 border-l border-[var(--color-city)]/35 pl-5">
                  <span className="block h-12 w-px -translate-x-[1.5px] bg-[var(--color-city)]" />
                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-city)]">
                    {language === 'zh' ? '深圳 · 城市观察' : 'Shenzhen · Urban observations'}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
                    {language === 'zh' ? '从日常出行重新理解城市变化。' : 'Reading urban change through everyday journeys.'}
                  </p>
                </div>
              </aside>
            </div>
          </main>
        </section>
      </div>
    </PageShell>
  );
}
