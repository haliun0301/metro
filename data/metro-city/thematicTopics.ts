export const THEMATIC_TOPICS = [
  {
    format: 'essay',
    contentType: 'narrative',
    zh: '深圳居民移动性范式的跨时代变迁',
    en: 'The Epochal Shift in Mobility Paradigms among Shenzhen Residents',
    introduction: {
      en: 'A city’s transport story is also a story about changing distances: which journeys feel possible, how long they take, and what becomes part of an ordinary day.',
      zh: '一座城市的交通故事，也是一段关于距离如何变化的故事：哪些出行变得可行、需要多久，以及什么逐渐融入日常。',
    },
  },
  {
    format: 'map',
    zh: '深圳城市格局的演化：增长的空间叙事',
    en: 'The Evolution of Shenzhen\'s Urban Fabric: A Spatial Narrative of Growth',
  },
  {
    format: 'map',
    zh: '因地铁建设与开通而转变的地方',
    en: 'Places Transformed by the Advent of the Metro',
  },
  {
    format: 'map',
    zh: '深圳地铁网络的核心节点',
    en: 'Key Nodes in the Shenzhen Metro Network',
  },
  {
    format: 'essay',
    contentType: 'narrative',
    zh: '在地铁上：公共空间中的日常生活',
    en: 'On the Metro: Everyday Life in a Public Space',
    introduction: {
      en: 'A metro carriage is more than a corridor between stations. For a few minutes, it is a shared interior where different routines meet in close proximity.',
      zh: '地铁车厢不只是连接车站的通道。在短短几分钟里，不同的生活节奏在这个共享的室内空间里相遇。',
    },
  },
  {
    format: 'essay',
    contentType: 'narrative',
    zh: '第一次乘坐地铁！',
    en: 'My First Metro Ride!',
    introduction: {
      en: 'A first metro ride is an encounter with a city’s systems, and with the small decisions that turn an unfamiliar journey into a familiar one.',
      zh: '第一次乘坐地铁，是与一座城市的运行系统相遇，也是把陌生旅程变成熟悉路线的过程。',
    },
  },
  {
    format: 'essay',
    contentType: 'comparison-transport',
    zh: '地铁与其他交通方式的比较',
    en: 'The metro vs. Other Modes of Transport',
    introduction: {
      en: 'Compare the metro with buses and private cars through one interview account. Mode references are text mentions, not ridership or modal share.',
      zh: '通过一位受访者的叙述比较地铁、公交车与私家车。图表统计的是文本提及次数，不代表客流或出行分担率。',
    },
  },
  {
    format: 'essay',
    contentType: 'comparison-groups',
    zh: '不同人群与地铁的关系',
    en: 'Diverse Interactions between Social Groups and the Metro',
    introduction: {
      en: 'Explore who is represented in the interview sample by gender, place of origin, and generation. These profile counts do not measure how groups use the metro.',
      zh: '按性别、来源地与出生年代比较受访者样本构成。这些个人资料统计不代表不同群体的地铁使用情况。',
    },
  },
  {
    format: 'essay',
    contentType: 'word-cloud-life',
    zh: '不只是交通！：地铁对个人生活的影响',
    en: 'More than Transportation: The Metro\'s Impact on Individual Lives',
    introduction: {
      en: 'What changes when distance becomes easier to cross? Explore the words one interviewee used to describe the metro’s impact on everyday life.',
      zh: '当跨越距离变得容易，日常生活会如何改变？通过一位受访者的原文，了解地铁如何影响个人生活。',
    },
  },
  {
    format: 'essay',
    contentType: 'word-cloud-city',
    zh: '不只是交通！：地铁对深圳城市的整体影响',
    en: 'More than Transportation: The Metro\'s Overall Impact on Shenzhen as a City',
    introduction: {
      en: 'From property and population to the places people visit, explore how one interviewee describes the metro’s wider influence on Shenzhen.',
      zh: '从房价与人口到人们到访的地点，通过一位受访者的原文，了解地铁对深圳城市发展的影响。',
    },
  },
  {
    format: 'essay',
    contentType: 'comparison-cities',
    zh: '深圳地铁与其他城市地铁的比较',
    en: 'Shenzhen Metro in Comparison with Metro Systems in Other Cities',
    introduction: {
      en: 'A temporary comparison mockup using official 2024 figures for four city rail systems. Replace these benchmarks when the project dataset is ready.',
      zh: '使用四座城市官方 2024 年数据制作的临时比较示例。项目数据准备好后，可替换这些基准数据。',
    },
  },
  {
    format: 'essay',
    contentType: 'narrative',
    zh: '深圳地铁存在的问题与改进建议',
    en: 'Existing Issues within the Shenzhen Metro and Recommendations for Improvement',
    introduction: {
      en: 'A useful network is not finished when a line opens. Looking at everyday friction, including crowding, transfers, access, and clarity, helps turn experience into practical questions for improvement.',
      zh: '线路开通并不意味着网络体验已经完善。关注拥挤、换乘、接驳与信息指引中的日常阻碍，才能把乘车体验转化为具体的改进问题。',
    },
  },
] as const;

export function getThemeRoute(index: number) {
  const topic = THEMATIC_TOPICS[index];

  if (!topic) return '/thematicmap';
  return topic.format === 'map'
    ? `/thematicmap/${index + 1}`
    : `/thematic-essay?theme=${index + 1}`;
}

export const THEMATIC_TOPIC_FORMATS = [
  { id: 'map', en: 'Map', zh: '地图' },
  { id: 'essay', en: 'Essay', zh: '文章' },
] as const;
