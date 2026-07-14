import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { PeopleData } from '../data/metro-people/people';
import { useAppLanguage } from '../hooks/useAppLanguage';
import type { Person } from '../components/metro-people/PeopleCircles';

const CURRENT_YEAR = 2026;
const people = PeopleData as Person[];
const storySections = [
  'LIFE TRAJECTORY',
  'MOBILITY PATTERN',
  'MY FIRST METRO RIDE',
  'MOMENTS',
  'THE METRO VS OTHER TRANSPORT',
  'PLACES TRANSFORMED BY THE ADVENT METRO',
  'KEY NODES IN THE SHENZHEN METRO NETWORK',
  "THE METRO'S IMPACT ON MY LIFE",
  "THE METRO'S IMPACT ON SHENZHEN",
] as const;

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
  },
} as const;

function ProfilePortrait({ person }: { person: Person }) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageSrc = person.imageFile || person.image?.src;
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
      alt={person.image?.alt || person.name}
      className="aspect-square w-full rounded-full border-[10px] border-white/30 object-cover shadow-[0_24px_70px_rgba(22,37,34,0.25)]"
      onError={() => setImageFailed(true)}
    />
  );
}

export default function PersonDetailPage() {
  const { personId } = useParams();
  const { language } = useAppLanguage();
  const text = copy[language];
  const personIndex = people.findIndex((person) => person.id === personId);
  const person = personIndex >= 0 ? people[personIndex] : undefined;

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
  const displayName = language === 'zh' ? person.nickname || person.name : person.nickname || person.name;
  const facts = [
    { label: text.occupation, value: language === 'zh' ? person.occupationCn || person.occupation : person.occupation || person.occupationCn },
    { label: text.born, value: person.yearOfBirth?.toString() },
    { label: text.age, value: age?.toString() },
    { label: text.residence, value: residenceYears === null ? undefined : `${residenceYears} ${text.years}` },
    { label: text.origin, value: person.shenzhenBorn ? text.bornInShenzhen : text.movedToShenzhen },
  ];

  return (
    <main className="min-h-screen bg-[#f4f6f4] text-[#243136] md:h-screen md:overflow-hidden">
      <div className="flex min-h-screen flex-col md:grid md:h-screen md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <aside className="bg-[#dfe9e0] md:overflow-hidden md:border-r md:border-[#243136]/10">
          <div className="flex h-full flex-col px-6 pb-10 pt-28 md:px-10 md:pb-12 md:pt-36">
            <Link to="/people" className="text-sm font-bold text-[#25855f] underline underline-offset-4">
              {text.back}
            </Link>
            <div className="mt-10 w-36 md:w-44">
              <ProfilePortrait person={person} />
            </div>
            <p className="mt-10 text-xs font-bold uppercase tracking-[0.22em] text-[#25855f]">{text.record}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">{displayName}</h1>
            <p className="mt-5 text-lg leading-8 text-[#243136]/72">
              {language === 'zh' ? person.occupationCn || person.occupation : person.occupation || person.occupationCn || text.unknown}
            </p>
          </div>
        </aside>

        <section className="min-w-0 bg-[#f4f6f4] md:h-screen md:overflow-y-auto" aria-label={text.record}>
          <div className="mx-auto max-w-4xl px-6 pb-12 pt-12 md:px-12 md:pb-20 md:pt-36">
            <div className="divide-y divide-[#243136]/12 border-y border-[#243136]/12">
              {facts.map((fact) => (
                <div key={fact.label} className="grid gap-2 py-6 sm:grid-cols-[minmax(10rem,0.8fr)_minmax(0,1.2fr)] sm:gap-8">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#243136]/48">{fact.label}</p>
                  <p className="text-xl font-semibold leading-snug">{fact.value || text.unknown}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 border-t border-[#243136]/12">
              {storySections.map((title, index) => (
                <section key={title} className="grid gap-4 border-b border-[#243136]/12 py-10 md:grid-cols-[4rem_minmax(0,1fr)] md:gap-8 md:py-14">
                  <span className="text-xs font-bold tracking-[0.16em] text-[#25855f]">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h2 className="max-w-2xl text-2xl font-semibold leading-tight md:text-4xl">{title}</h2>
                    <p className="mt-4 text-sm font-medium text-[#243136]/48">{text.storyPending}</p>
                  </div>
                </section>
              ))}
            </div>

            <nav className="mt-16 border-y border-[#243136]/10 bg-white" aria-label="Participant navigation">
              <div className="grid grid-cols-2 divide-x divide-[#243136]/10">
                <Link to={`/people/${previousPerson.id}`} className="min-w-0 py-7 pr-4 transition hover:bg-[#e8f4ed] focus:bg-[#e8f4ed] focus:outline-none">
                  <span className="block text-xs font-bold uppercase tracking-[0.14em] text-[#25855f]">{text.previous}</span>
                  <span className="mt-2 block truncate text-lg font-semibold">{previousPerson.nickname || previousPerson.name}</span>
                </Link>
                <Link to={`/people/${nextPerson.id}`} className="min-w-0 py-7 pl-4 text-right transition hover:bg-[#e8f4ed] focus:bg-[#e8f4ed] focus:outline-none">
                  <span className="block text-xs font-bold uppercase tracking-[0.14em] text-[#25855f]">{text.next}</span>
                  <span className="mt-2 block truncate text-lg font-semibold">{nextPerson.nickname || nextPerson.name}</span>
                </Link>
              </div>
            </nav>
          </div>
        </section>
      </div>
    </main>
  );
}
