export const THEMATIC_TOPICS = [
  {
    format: 'essay',
    zh: '深圳居民移动性范式的跨时代变迁',
    en: 'The Epochal Shift in Mobility Paradigms among Shenzhen Residents',
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
    zh: '在地铁上：公共空间中的日常生活',
    en: 'On the Metro: Everyday Life in a Public Space',
  },
  {
    format: 'essay',
    zh: '第一次乘坐地铁！',
    en: 'My First Metro Ride!',
  },
  {
    format: 'category',
    zh: '地铁与其他交通方式的比较',
    en: 'The metro vs. Other Modes of Transport',
  },
  {
    format: 'category',
    zh: '不同人群与地铁的关系',
    en: 'Diverse Interactions between Social Groups and the Metro',
  },
  {
    format: 'word-cloud',
    zh: '不只是交通！：地铁对个人生活的影响',
    en: 'More than Transportation: The Metro\'s Impact on Individual Lives',
  },
  {
    format: 'word-cloud',
    zh: '不只是交通！：地铁对深圳城市的整体影响',
    en: 'More than Transportation: The Metro\'s Overall Impact on Shenzhen as a City',
  },
  {
    format: 'category',
    zh: '深圳地铁与其他城市地铁的比较',
    en: 'Shenzhen Metro in Comparison with Metro Systems in Other Cities',
  },
  {
    format: 'essay',
    zh: '深圳地铁存在的问题与改进建议',
    en: 'Existing Issues within the Shenzhen Metro and Recommendations for Improvement',
  },
] as const;

export function getThemeRoute(index: number) {
  const topic = THEMATIC_TOPICS[index];

  if (topic?.format === 'map') {
    return `/thematicmap/${index + 1}`;
  }

  if (topic?.format === 'essay') {
    return `/thematic-essay?theme=${index + 1}`;
  }

  if (topic?.format === 'word-cloud') {
    return `/thematic-word-cloud?theme=${index + 1}`;
  }

  if (topic?.format === 'category') {
    return `/thematic-category?theme=${index + 1}`;
  }

  return `/thematicmap?theme=${index + 1}`;
}

export const THEMATIC_TOPIC_FORMATS = [
  { id: 'essay', en: 'Essay-based', zh: '文章叙事' },
  { id: 'map', en: 'Map-based navigation', zh: '地图导航' },
  { id: 'category', en: 'Category-based', zh: '分类浏览' },
  { id: 'word-cloud', en: 'Word-cloud data display', zh: '词云数据展示' },
] as const;
