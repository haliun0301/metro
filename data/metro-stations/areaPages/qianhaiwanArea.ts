import { stationDetailMedia } from '../stationDetailMedia';
import type { AreaPageContentOverride } from './types';

export const qianhaiwanAreaPage: AreaPageContentOverride = {
  overviewImageSrc: stationDetailMedia.afterUrbanFabric,
  overviewNotes: [
    {
      id: 'west-corridor',
      title: {
        en: 'West corridor',
        zh: '西部走廊',
      },
      description: {
        en: 'Haha This edge reads the metro as a connector between reclaimed land, logistics routes, and new mixed-use development fronts.',
        zh: '这一侧强调地铁如何连接填海形成的土地、物流通道与新的复合开发界面。',
      },
    },
    {
      id: 'interchange-core',
      title: {
        en: 'Interchange core',
        zh: '换乘核心',
      },
      description: {
        en: 'The central station cluster can be described through transfer intensity, passenger sorting, and the way movement organizes the district core.',
        zh: '中心站群可从换乘强度、客流分流，以及出行如何组织片区核心空间来进行描述。',
      },
    },
    {
      id: 'waterfront-growth',
      title: {
        en: 'Waterfront growth',
        zh: '滨水增长',
      },
      description: {
        en: 'This note can focus on coastal redevelopment, office expansion, and the way station access supports new public-facing urban programs.',
        zh: '该注释可聚焦滨海更新、办公扩张，以及站点可达性如何支撑新的面向公众的城市功能。',
      },
    },
  ],
  overviewPoints: [
    {
      en: 'Qianhaiwan area can carry a stronger area-specific narrative about transport-led waterfront transformation, rather than relying on the generic shared template text.',
      zh: '前海湾片区可以承载更明确的片区叙事，例如交通驱动的滨海转型，而不仅仅依赖通用模板文字。',
    },
    {
      en: 'Use this section to describe how station placement, reclaimed land, business districts, and public-space systems relate to each other spatially.',
      zh: '此部分可用于说明站点布局、填海土地、商务片区与公共空间系统之间的空间关系。',
    },
    {
      en: 'Each point here is now area-specific, so you can replace it with real field observations, planning references, or geospatial analysis findings.',
      zh: '这里的每条内容现在都可按片区单独编写，因此可以进一步替换为真实调研、规划资料或空间分析结论。',
    },
  ],
  remoteSensingIntro: {
    en: 'This comparison set can highlight coastal edge adjustment, land formation, and the densification of station-linked urban blocks in Qianhaiwan area.',
    zh: '该对比组可用于强调前海湾片区的海岸线调整、土地整备，以及站点周边城市街区的增密过程。',
  },
  remoteSensingBeforeOptions: [
    {
      id: 'qianhai-before-1',
      label: { en: 'Before 2002', zh: '2002年前' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/2002.png',
    },
    {
      id: 'qianhai-before-2',
      label: { en: 'Before 2010', zh: '2010年前' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/2010.png',
    },
    {
      id: 'qianhai-before-3',
      label: { en: 'Before 2014', zh: '2014年前' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/2010.png',
    },
    {
      id: 'qianhai-before-4',
      label: { en: 'Before 2016', zh: '2016年前' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/2016.png',
    },
    {
      id: 'qianhai-before-5',
      label: { en: 'Before 2019', zh: '2019年前' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/2019.png',
    },
    {
      id: 'qianhai-before-6',
      label: { en: 'Before 2024', zh: '2024年前' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/2024.png',
    },
  ],
  remoteSensingAfterOptions: [
    {
      id: 'qianhai-after-1',
      label: { en: 'After 2002', zh: '2002年后' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/2002.png',
    },
    {
      id: 'qianhai-after-2',
      label: { en: 'After 2010', zh: '2010年后' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/2010.png',
    },
    {
      id: 'qianhai-after-3',
      label: { en: 'After 2014', zh: '2014年后' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/2010.png',
    },
    {
      id: 'qianhai-after-4',
      label: { en: 'After 2016', zh: '2016年后' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/2016.png',
    },
    {
      id: 'qianhai-after-5',
      label: { en: 'After 2019', zh: '2019年后' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/2019.png',
    },
    {
      id: 'qianhai-after-6',
      label: { en: 'After 2024', zh: '2024年后' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/2024.png',
    },
  ],
  historyCards: [
    {
      stationName: 'Qianhaiwan',
      title: {
        en: 'Qianhaiwan development timeline',
        zh: '前海湾发展时间线',
      },
      period: {
        en: 'Multi-stage historical reading',
        zh: '多阶段历史解读',
      },
      summary: {
        en: 'Qianhaiwan can be read through multiple sequential stages, each combining imagery and field narrative around coastal restructuring and station-area urbanization.',
        zh: '前海湾可按连续阶段来解读，每个阶段结合影像与田野叙事，呈现滨海重构与站区城市化过程。',
      },
      highlights: [
        { en: 'Coastal engineering and land readjustment', zh: '海岸工程与土地调整' },
        { en: 'Station-linked densification and public interface growth', zh: '站点带动增密与公共界面形成' },
      ],
      imageSrc: stationDetailMedia.beforeUrbanFabric,
      stages: [
        {
          id: 'qianhaiwan-stage-1',
          title: {
            en: 'Stage 1 · Land formation and coastal preparation',
            zh: '阶段 1 · 土地整备与滨海准备',
          },
          period: {
            en: 'Early restructuring period',
            zh: '早期重构期',
          },
          summary: {
            en: 'This stage highlights shoreline engineering and infrastructure groundwork before major mixed-use build-out around Qianhaiwan.',
            zh: '该阶段强调大规模复合开发前的海岸工程与基础设施铺垫。',
          },
          highlights: [
            { en: 'Shoreline edge adjustment and reclamation sequence', zh: '海岸边界调整与填海序列' },
            { en: 'Primary road and utility backbone prepared first', zh: '优先建设主路网与市政骨架' },
          ],
          notes: [
            {
              en: 'Field notes can focus on early edge conditions and limited public-facing programs.',
              zh: '田野记录可聚焦早期边界条件与有限的公共功能界面。',
            },
          ],
          media: [
            {
              id: 'qianhaiwan-stage-1-media-1',
              src: stationDetailMedia.beforeUrbanFabric,
              caption: {
                en: 'Early urban fabric and shoreline condition',
                zh: '早期城市肌理与海岸条件',
              },
            },
            {
              id: 'qianhaiwan-stage-1-media-2',
              src: stationDetailMedia.beforeTransitEdge,
              caption: {
                en: 'Initial station-edge access structure',
                zh: '初期站点边缘可达结构',
              },
            },
          ],
        },
        {
          id: 'qianhaiwan-stage-2',
          title: {
            en: 'Stage 2 · Station-area growth and urban interface',
            zh: '阶段 2 · 站区增长与城市界面形成',
          },
          period: {
            en: 'Structured growth period',
            zh: '结构化增长期',
          },
          summary: {
            en: 'The station area transitions into a denser mixed-use urban front with stronger pedestrian flows and public-facing edges.',
            zh: '站区逐步转向更高密度的复合城市界面，并形成更强的人行流线与公共界面。',
          },
          highlights: [
            { en: 'Business and office concentration around station access', zh: '站点可达范围内的商务办公集聚' },
            { en: 'Expanded public-space frontage at key exits', zh: '重点出入口周边公共界面扩展' },
          ],
          media: [
            {
              id: 'qianhaiwan-stage-2-media-1',
              src: stationDetailMedia.afterUrbanFabric,
              caption: {
                en: 'Later urban form around Qianhaiwan',
                zh: '前海湾周边后期城市形态',
              },
            },
            {
              id: 'qianhaiwan-stage-2-media-2',
              src: stationDetailMedia.afterTransitEdge,
              caption: {
                en: 'Later station-edge and movement corridors',
                zh: '后期站点边界与出行廊道',
              },
            },
          ],
        },
        {
          id: 'qianhaiwan-stage-3',
          title: {
            en: 'Stage 3 · Maturing waterfront district network',
            zh: '阶段 3 · 滨水片区网络成熟',
          },
          period: {
            en: 'Consolidation period',
            zh: '整合成熟期',
          },
          summary: {
            en: 'Transit access, public interfaces, and district programs consolidate into a mature waterfront network with clearer urban identity.',
            zh: '轨道可达、公共界面与片区功能进一步整合，形成识别度更高的成熟滨水网络。',
          },
          highlights: [
            { en: 'Cross-district movement stabilized by station corridor', zh: '站点走廊支撑跨片区流动稳定化' },
            { en: 'Public-facing programs and streetscape quality improved', zh: '面向公众的功能与街道品质持续提升' },
          ],
          media: [
            {
              id: 'qianhaiwan-stage-3-media-1',
              src: stationDetailMedia.thematicConnection,
              caption: {
                en: 'Thematic synthesis of station and waterfront network',
                zh: '站点与滨水网络的专题综合图',
              },
            },
          ],
        },
      ],
    },
    {
      stationName: 'Liyumen',
      title: {
        en: 'Liyumen development timeline',
        zh: '鲤鱼门发展时间线',
      },
      period: {
        en: 'Multi-stage historical reading',
        zh: '多阶段历史解读',
      },
      summary: {
        en: 'Liyumen can be structured as progressive stages that document access hierarchy, district build-out, and station-linked public-space maturation.',
        zh: '鲤鱼门可按递进阶段组织，记录可达层级、片区建设与站点相关公共空间的成熟过程。',
      },
      highlights: [
        { en: 'New urban blocks around transit', zh: '轨道周边的新城市街区' },
        { en: 'Access hierarchy between station and district', zh: '站点与片区之间的可达层级' },
        { en: 'Public-space maturation across stages', zh: '分阶段公共空间成熟过程' },
      ],
      imageSrc: stationDetailMedia.afterTransitEdge,
      stages: [
        {
          id: 'liyumen-stage-1',
          title: {
            en: 'Stage 1 · Access framework initialization',
            zh: '阶段 1 · 可达框架初始化',
          },
          period: {
            en: 'Initial connectivity setup',
            zh: '初始连通搭建期',
          },
          summary: {
            en: 'Road hierarchy and station exits begin to establish the base movement logic between transit and surrounding parcels.',
            zh: '道路层级与站点出入口开始建立轨道与周边地块之间的基础流动逻辑。',
          },
          highlights: [
            { en: 'Primary transfer paths from exits to district spine', zh: '从出入口到片区主轴的首要接驳路径' },
            { en: 'Transit edge still dominated by infrastructure frontage', zh: '站点边缘仍以基础设施界面为主' },
          ],
          media: [
            {
              id: 'liyumen-stage-1-media-1',
              src: stationDetailMedia.beforeTransitEdge,
              caption: {
                en: 'Early station-edge movement framework',
                zh: '早期站点边缘流动框架',
              },
            },
          ],
        },
        {
          id: 'liyumen-stage-2',
          title: {
            en: 'Stage 2 · District formation and interface refinement',
            zh: '阶段 2 · 片区成形与界面优化',
          },
          period: {
            en: 'Structured growth period',
            zh: '结构化增长期',
          },
          summary: {
            en: 'Station access integrates with completed urban blocks, resulting in stronger public-space continuity and clearer district identity.',
            zh: '站点可达性与已成形街区融合，形成更连续的公共空间与更清晰的片区识别。',
          },
          highlights: [
            { en: 'Mixed-use blocks aligned with station corridors', zh: '复合功能街区与站点廊道对齐' },
            { en: 'Public interface and pedestrian sequence improved', zh: '公共界面与步行序列优化' },
          ],
          media: [
            {
              id: 'liyumen-stage-2-media-1',
              src: stationDetailMedia.afterTransitEdge,
              caption: {
                en: 'Later station-edge and district integration',
                zh: '后期站点边缘与片区整合',
              },
            },
            {
              id: 'liyumen-stage-2-media-2',
              src: stationDetailMedia.afterUrbanFabric,
              caption: {
                en: 'Later urban fabric around Liyumen',
                zh: '鲤鱼门周边后期城市肌理',
              },
            },
          ],
        },
        {
          id: 'liyumen-stage-3',
          title: {
            en: 'Stage 3 · Network consolidation and public-space maturity',
            zh: '阶段 3 · 网络整合与公共空间成熟',
          },
          period: {
            en: 'Consolidation period',
            zh: '整合成熟期',
          },
          summary: {
            en: 'The station-area system reaches a mature state with stronger pedestrian continuity, clearer frontage hierarchy, and stable district identity.',
            zh: '站区系统进入成熟阶段，步行连续性、界面层级与片区识别度进一步稳定。',
          },
          highlights: [
            { en: 'Station exits integrated into complete urban frontage', zh: '站点出入口融入完整城市界面' },
            { en: 'Daily movement and public-space use become balanced', zh: '日常流动与公共空间使用更加均衡' },
          ],
          media: [
            {
              id: 'liyumen-stage-3-media-1',
              src: stationDetailMedia.thematicConnection,
              caption: {
                en: 'Mature station-district relationship mapping',
                zh: '成熟阶段站点—片区关系图',
              },
            },
          ],
        },
      ],
    },
  ],
  thematicRelations: [
    {
      id: 'qianhai-access',
      title: {
        en: 'Metro-led waterfront accessibility',
        zh: '地铁驱动的滨水可达性',
      },
      summary: {
        en: 'This card can explain how station access supports business concentration, waterfront programs, and cross-district movement in the Qianhaiwan area.',
        zh: '该卡片可说明站点可达性如何支撑前海湾片区的商务集聚、滨水功能与跨片区流动。',
      },
      imageSrc: stationDetailMedia.thematicConnection,
      tags: [
        { en: 'Waterfront mobility', zh: '滨水出行' },
        { en: 'Business district', zh: '商务片区' },
        { en: 'Cross-district reach', zh: '跨片区触达' },
      ],
      paragraphs: [
        {
          en: 'This thematic entry can be written like a blog chapter: start from station catchment, then explain how waterfront jobs, leisure destinations, and transfer logic overlap in one mobility field.',
          zh: '该专题条目可按博客章节方式编写：先从站点服务范围切入，再说明滨水就业、休闲目的地与换乘逻辑如何叠合为同一出行场域。',
        },
        {
          en: 'The diagram and image set should be read together: bars indicate comparative intensity while map graphics explain where those peaks spatially occur.',
          zh: '图表与影像建议结合阅读：柱条体现相对强度，地图图解则解释这些峰值在空间上的发生位置。',
        },
      ],
      gallery: [
        {
          id: 'qianhai-access-gallery-1',
          src: stationDetailMedia.thematicConnection,
          caption: {
            en: 'Waterfront mobility linkage map',
            zh: '滨水出行连接关系图',
          },
        },
        {
          id: 'qianhai-access-gallery-2',
          src: stationDetailMedia.afterTransitEdge,
          caption: {
            en: 'Station-edge circulation and business interface',
            zh: '站点边界流线与商务界面',
          },
        },
      ],
      diagram: {
        title: {
          en: 'Interactive waterfront accessibility diagram',
          zh: '交互式滨水可达性图',
        },
        description: {
          en: 'Click each column to inspect phase-based intensity of cross-district accessibility.',
          zh: '点击柱条可查看分阶段的跨片区可达强度。',
        },
        data: [
          { year: 'P1', total: 14 },
          { year: 'P2', total: 23 },
          { year: 'P3', total: 35 },
          { year: 'P4', total: 42 },
        ],
        highlightedYear: 'P4',
      },
    },
    {
      id: 'qianhai-change',
      title: {
        en: 'Land-use transition around stations',
        zh: '站点周边的用地转型',
      },
      summary: {
        en: 'Use this thematic card for mapping the transition from infrastructure-led land preparation to denser urban programming around the station corridor.',
        zh: '该专题卡可用于绘制从基础设施主导的土地准备阶段，到站点走廊周边更高密度城市功能形成的过程。',
      },
      imageSrc: stationDetailMedia.afterUrbanFabric,
      tags: [
        { en: 'Land transition', zh: '用地转型' },
        { en: 'Density growth', zh: '密度增长' },
        { en: 'Station corridor', zh: '站点走廊' },
      ],
      paragraphs: [
        {
          en: 'This section can narrate how station corridors move from infrastructure preparation to denser mixed urban programmes, with each phase showing different frontage and block activation.',
          zh: '该部分可叙述站点走廊如何从基础设施准备走向更高密度复合城市功能，不同阶段对应不同界面与街区激活模式。',
        },
        {
          en: 'Use image subsets for before/after block conditions, and let the column diagram summarize the cumulative growth trend.',
          zh: '可用影像子集展示街区前后条件变化，并由柱状图总结累积增长趋势。',
        },
      ],
      gallery: [
        {
          id: 'qianhai-change-gallery-1',
          src: stationDetailMedia.afterUrbanFabric,
          caption: {
            en: 'Densified urban blocks near station corridor',
            zh: '站点走廊周边增密后的城市街区',
          },
        },
        {
          id: 'qianhai-change-gallery-2',
          src: stationDetailMedia.beforeUrbanFabric,
          caption: {
            en: 'Earlier land structure before densification',
            zh: '增密前的早期土地结构',
          },
        },
      ],
      diagram: {
        title: {
          en: 'Interactive land-transition column map',
          zh: '交互式用地转型柱状图',
        },
        description: {
          en: 'Columns track mixed-use growth in station influence zones across the transition timeline.',
          zh: '柱状图追踪站点影响圈内复合功能在转型时间线中的增长。',
        },
        data: [
          { year: '2008', total: 11 },
          { year: '2012', total: 18 },
          { year: '2016', total: 30 },
          { year: '2022', total: 46 },
        ],
        highlightedYear: '2022',
      },
    },
  ],
  references: [
    {
      id: 'qianhai-fieldwork',
      title: {
        en: 'Field observation route',
        zh: '田野观察路线',
      },
      detail: {
        en: 'Use this slot to list waterfront walks, station exit observations, and notes about changing urban fronts in the Qianhaiwan area.',
        zh: '此处可记录前海湾片区的滨水步行线路、站点出口观察，以及城市界面变化的调研说明。',
      },
    },
    {
      id: 'qianhai-imagery',
      title: {
        en: 'Imagery and shoreline evidence',
        zh: '影像与海岸证据',
      },
      detail: {
        en: 'Reserve this item for shoreline imagery dates, remote sensing sources, and notes on land formation visible in the area.',
        zh: '该项可用于记录海岸影像日期、遥感来源，以及片区土地整备过程中的空间证据。',
      },
    },
  ],
};
