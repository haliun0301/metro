type LocalizedText = {
  en: string;
  zh: string;
};

export type MetroCityBenchmark = {
  city: LocalizedText;
  networkKm: number;
  networkLabel: string;
  dailyRidershipMillions: number;
  dailyRidershipLabel: string;
  ridershipBasis: LocalizedText;
  sourceTitle: LocalizedText;
  sourceUrl: string;
};

export const METRO_CITY_BENCHMARKS: MetroCityBenchmark[] = [
  {
    city: { en: 'Beijing', zh: '北京' },
    networkKm: 879,
    networkLabel: '879 km',
    dailyRidershipMillions: 3.62 * 1000 / 366,
    dailyRidershipLabel: '9.89 million / day',
    ridershipBasis: {
      en: 'Calculated from 3.62 billion annual trips ÷ 366 days.',
      zh: '按全年客运量 36.2 亿人次 ÷ 366 天计算。',
    },
    sourceTitle: {
      en: 'Beijing 2024 Statistical Communiqué',
      zh: '北京市 2024 年国民经济和社会发展统计公报',
    },
    sourceUrl: 'https://www.beijing.gov.cn/renwen/bjgk/csjs/202503/t20250325_4044025.html',
  },
  {
    city: { en: 'Shanghai', zh: '上海' },
    networkKm: 831,
    networkLabel: '831 km',
    dailyRidershipMillions: 10,
    dailyRidershipLabel: '>10 million / day',
    ridershipBasis: {
      en: 'Official report states average daily passenger flow exceeded 10 million.',
      zh: '官方报告注明日均客流量超过 1,000 万人次。',
    },
    sourceTitle: {
      en: 'Shanghai 2024 Metro Service Quality Review',
      zh: '上海市 2024 年城市轨道交通服务质量评价',
    },
    sourceUrl: 'https://www.shanghai.gov.cn/nw31406/20250214/322b4a278d4040118a6892df2f3c9492.html',
  },
  {
    city: { en: 'Guangzhou', zh: '广州' },
    networkKm: 727.1,
    networkLabel: '727.1 km',
    dailyRidershipMillions: 8.9051,
    dailyRidershipLabel: '8.91 million / day',
    ridershipBasis: {
      en: 'Official average for urban rail, including metro and tram.',
      zh: '官方城市轨道交通日均客运量，包含地铁与有轨电车。',
    },
    sourceTitle: {
      en: 'Guangzhou 2024 Urban Rail Service Quality Review',
      zh: '广州 2024 年度城市轨道交通服务质量评价结果',
    },
    sourceUrl: 'https://jtj.gz.gov.cn/xwdt/gzdt/content/post_10225093.html',
  },
  {
    city: { en: 'Shenzhen', zh: '深圳' },
    networkKm: 595.1,
    networkLabel: '595.1 km',
    dailyRidershipMillions: 3.097 * 1000 / 366,
    dailyRidershipLabel: '8.46 million / day',
    ridershipBasis: {
      en: 'Calculated from 3.097 billion annual trips ÷ 366 days.',
      zh: '按全年客运量 30.97 亿人次 ÷ 366 天计算。',
    },
    sourceTitle: {
      en: 'Shenzhen 2024 Activity Data',
      zh: '深圳 2024 年活力数据',
    },
    sourceUrl: 'https://www.sz.gov.cn/cn/xxgk/zfxxgj/zwdt/content/post_11974284.html',
  },
];

export const METRO_CITY_SCOPE_NOTE: LocalizedText = {
  en: 'Network-length definitions follow each city report. Shanghai includes the Maglev line; Guangzhou and Shenzhen include tram lines. Beijing and Shenzhen daily averages are derived from annual trips over 366 days; Shanghai is shown as a published lower bound.',
  zh: '运营里程沿用各城市报告口径：上海包含磁浮线，广州与深圳包含有轨电车。北京与深圳日均客流由全年客运量除以 366 天计算；上海采用官方公布的下限值。',
};
