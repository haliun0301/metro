import { stationDetailMedia } from '../stationDetailMedia';
import type { AreaPageContentOverride } from './types';

export const shuibeiAreaPage: AreaPageContentOverride = {
  historyScrollMode: 'vertical',

  //Titles
  sectionTitles: {
    research: {
      en: 'Shuibei-Tianbei area',
      zh: '水贝-田贝片区',
    },
    history: {
      en: 'History of the area',
      zh: '片区历史',
    },
    thematic: {
      en: 'Area and thematic map relationships',
      zh: '片区与专题地图关系',
    },
    references: {
      en: 'References and notes',
      zh: '参考资料与注释',
    },
  },
  overviewImageSrc: '/assets/station-details/shuibeiArea/Overview/overview.png',
  overviewImage: {
    src: '/assets/station-details/shuibeiArea/Overview/overview.png',
    figureName: { en: 'Figure 11', zh: '图11' },
  },
  useInteractiveMap: true,

  //Section 1: Research area map
  overviewNotes: [
    {
      id: 'Shuibei-area',
      title: {
        en: 'Shuibei Area',
        zh: '水贝片区',
      },
      description: {
        en: 'Shuibei Metro Station is a vital transportation artery for Shenzhen\'s jewelry industry. It not only greatly facilitates the daily flow of industry professionals and customers to and from the Shuibei gold and jewelry commercial district, but also effectively connects Luohu District with other areas of the city, supporting the commercial vitality and efficiency of this globally renowned jewelry distribution center.',
        zh: '这一侧强调地铁如何连接填海形成的土地、物流通道与新的复合开发界面。',
      },
    },
    {
      id: 'Tianbei-area',
      title: {
        en: 'Tianbei Area',
        zh: '天北片区',
      },
      description: {
        en: 'Tianbei Metro Station primarily serves the surrounding large and historically established residential area, complementing the functions of the adjacent Shuibei Station, which mainly serves industrial passengers. Together, they support the transportation links between residential and industrial areas in northern Luohu.',
        zh: '中心站群可从换乘强度、客流分流，以及出行如何组织片区核心空间来进行描述。',
      },
    },
    {
      id: 'Honghu-area',
      title: {
        en: 'Honghu Area',
        zh: '洪湖片区',
      },
      description: {
        en: 'Honghu Metro Station is located in the core area of ​​Luohu District, adjacent to Honghu Park. The surrounding area boasts a strong residential atmosphere and is dotted with urban green spaces and children\'s playgrounds. Honghu Metro Station not only provides convenient travel options for nearby residents but also offers easy access to Honghu Park for citizens and tourists, becoming a vital hub connecting residential areas and recreational venues.',
        zh: '洪湖地铁站地处罗湖区核心区域，临近洪湖公园，周边居住氛围浓厚，布有城市绿化与儿童游乐设施。洪湖地铁站不仅为周边居民提供了便捷的出行选择，也为前往洪湖公园休闲游览的市民游客提供了交通便利，成为连接居住片区与休闲场所的重要枢纽。',
      },
    },
  ],

  //Section 1: Remote Sensing
  remoteSensingBeforeOptions: [
    {
      id: 'shuibei-before-1',
      label: { en: 'Before 2002', zh: '2002年前' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/1.png',
    },
    {
      id: 'shuibei-before-2',
      label: { en: 'Before 2010', zh: '2010年前' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/2.png',
    },
    {
      id: 'shuibei-before-3',
      label: { en: 'Before 2014', zh: '2014年前' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/3.png',
    },
    {
      id: 'shuibei-before-4',
      label: { en: 'Before 2016', zh: '2016年前' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/4.png',
    },
    {
      id: 'shuibei-before-5',
      label: { en: 'Before 2019', zh: '2019年前' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/5.png',
    },
    {
      id: 'shuibei-before-6',
      label: { en: 'Before 2024', zh: '2024年前' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/6.png',
    },
  ],
  remoteSensingAfterOptions: [
    {
      id: 'shuibei-after-1',
      label: { en: 'After 2002', zh: '2002年后' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/1.png',
    },
    {
      id: 'shuibei-after-2',
      label: { en: 'After 2010', zh: '2010年后' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/2.png',
    },
    {
      id: 'shuibei-after-3',
      label: { en: 'After 2014', zh: '2014年后' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/3.png',
    },
    {
      id: 'shuibei-after-4',
      label: { en: 'After 2016', zh: '2016年后' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/4.png',
    },
    {
      id: 'shuibei-after-5',
      label: { en: 'After 2019', zh: '2019年后' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/5.png',
    },
    {
      id: 'shuibei-after-6',
      label: { en: 'After 2024', zh: '2024年后' },
      src: '/assets/station-details/shuibeiArea/Remote sensing/6.png',
    },
  ],

  //Section 2: History of the Area
  historyCards: [

    //Station number 1
    {
      stationName: 'Shuibei',
      title: {
        en: 'Shuibei development timeline',
        zh: '前海湾发展时间线',
      },
      period: {
        en: 'history of the area',
        zh: '多阶段历史解读',
      },
      summary: {
        en: 'Shuibei development can be roughly divided into five stages: the village period; the "Three Comes and One Supplement" period after the reform and opening up; the jewelry industry development period; the urban transformation and functional landscape upgrade period; and the industrial digital transformation and comprehensive realization of old renovation period.',
        zh: '水贝片区的发展可以大致分为五个阶段，分别是：村落时期；改革开放后的三来一补时期；珠宝产业发展时期；城市改造与功能景观升级时期；产业数字化转型与旧改全面兑现时期。',
      },
   
      imageSrc: '/assets/station-details/shuibeiArea/Remote sensing/1.png',
      image: {
        src: '/assets/station-details/shuibeiArea/Remote sensing/1.png',
        figureName: { en: 'Figure 12', zh: '图12' },
      },
      stages: [
        {
          id: 'shuibei-stage-1',
          title: {
            en: 'Stage 1 · Land formation and coastal preparation',
            zh: '第一阶段：村落时期（-1983年）',
          },
          period: {
            en: '(Before 1983)',
            zh: '(-1983年）',
          },
          summary: {
            en: 'Shuibei Village was founded in the eighth year of the Yongle reign of the Ming Dynasty by the Zhang family ancestors. Because the village was built behind a pond, and "bei" (贝) is a homophone for "back" (背) and symbolizes wealth, it was named Shuibei Village. It was formerly known as Getang Village and Shuixi Village. From the first year of the Wanli reign of the Ming Dynasty, it belonged to Dongguan County. From the first year of the Wanli reign of the Ming Dynasty to the Qing Dynasty, it belonged to Xin\'an County. In 1914, it belonged to Bao\'an County. After the founding of the People\'s Republic of China, it underwent several administrative division adjustments. Since 1992, it has belonged to Cuizhu Street, Luohu District. The traditional economy is mainly based on the planting of rice, melons, fruits, and vegetables, and the raising of fish, chickens, ducks, and pigs, supplemented by simple commerce and family handicrafts. The villagers\' lifestyle is relatively closed. The landscape is mainly natural villages and farmland. The buildings are mostly low-rise farmhouses with traditional brick and wood structures. The layout is loose and lacks unified planning. [[Shenzhen Planning and Land Development Research Center. Overview of Shenzhen Villages: Volume 2, Luohu Yantian Volume [M]. Guangzhou: South China University of Technology Press, 2020.]].',
            zh: '水贝村始建于明永乐八年，由张姓先祖开基立村，因村落建在水塘背后，“贝” 与 “背” 同音且象征财富，得名水贝村，曾用名隔塘村、水溪村。建村至明万历元年属东莞县，明万历元年至清朝属新安县，1914 年属宝安县，中华人民共和国成立后历经多次行政区划调整，1992 年起属罗湖区翠竹街道。传统经济以种植水稻、瓜果、蔬菜，养殖鱼、鸡、鸭、猪等为主，辅以简单的商业和家庭手工业，村民生活方式相对封闭。景观以自然村落与农田为主，建筑多为传统砖木结构的低矮农舍，布局松散，缺乏统一规划[[[] 深圳市规划国土发展研究中心. 深圳村落概览：第二辑 罗湖盐田卷[M]. 广州: 华南理工大学出版社, 2020.]]。',
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
              id: 'shuibei-stage-1-media-rs-2002',
              src: '/assets/station-details/shuibeiArea/Remote sensing/2.png',
              caption: {
                en: 'Sample remote sensing image for Stage 1 (2002 baseline).',
                zh: '第一阶段遥感示例图（2002 年基线）。',
              },
              figureName: { en: 'Figure 13', zh: '图13' },
            },
          ],
        },
        {
          id: 'shubei-stage-2',
          title: {
            en: 'Stage 2 · Station-area growth and urban interface',
            zh: '第二阶段：改革开放后的三来一补时期',
          },
          period: {
            en: 'Structured growth period',
            zh: '（1978 年 - 1995 年）',
          },
          summary: {
            en: 'Leveraging the policy advantages of the Shenzhen Special Economic Zone, Shuibei Village established Shenzhen Shuibei Industrial Co., Ltd., a collectively owned enterprise, in November 1984. Nearly 600 villagers became shareholders, with businesses covering multiple sectors such as catering and property management. In the same year, large-scale construction of the Shuibei Industrial Zone began (Figure 7) [[[] A city surrounded by gold and jewelry - Shuibei Village [EB/OL]. (2017-08-23) [2024-03-24]. https://www.sohu.com/a/166723616_99950450.]], with industrial development focusing on machinery and building materials and petrochemicals. Among them, the representative enterprise in the machinery and building materials field is Shenzhen Machinery Industry Company, whose production and operation scope includes household appliances, general machinery, light industrial machinery, packaging machinery, mechanical molds, wires and cables, abrasives, instruments and meters, micro motors, etc. The petrochemical industrial zone covers an area of ​​320,000 square meters, organizing the production or import of petrochemical products needed by the Hong Kong market, such as plastic raw materials, chemical solvents, refined oil and various daily chemical products (Figure 8). During this period, the main form of industrial development in Shuibei Village was "processing with supplied materials, processing with supplied samples, processing with supplied parts, and compensation trade". Villagers transformed from farmers to factory workers or enterprise managers, and the area\'s appearance completely transformed from a rural village to an urban industrial zone. By 1987, the Shuibei Industrial Zone had reached a certain scale, with 75,000 square meters of factory buildings and 36,500 square meters of dormitories built, and urban roads such as Buxin Road and Cuizhu Road gradually improved. However, according to a report in 1998, the industrial zone had problems such as a dirty and chaotic environment and the presence of gangsters in the early days. The owners were worried and fearful. By June 1996, 40% of the 200,000 square meters of factory buildings in Shuibei had been "empty". [[Li Jie. Creating a beautiful world - a record of Shenzhen Shuibei Industrial Zone and its "head" Wu Yicheng [J]. China Talents, 1998(08):34-36.]].',
            zh: '依托深圳经济特区政策优势，水贝村在1984年11月成立集体性质的深圳市水贝实业股份有限公司，近 600 名村民转为股东，业务覆盖餐饮、物业等多个领域。同年，开启水贝工业区的大规模建设（图7）[[[] 一座被黄金珠宝包围的城——水贝村[EB/OL]. (2017-08-23)[2024-03-24]. https://www.sohu.com/a/166723616_99950450.]]，产业发展聚焦于机械建材与石油化工。其中，机械建材领域代表企业为深圳市机械工业公司，生产经营范围包括家用电器、通用机械、轻工机械、包装机械、机械模具、电线电缆、磨料磨具、仪器仪表、微型电机等。石化工业区占地 32 万平方米，组织生产或进口香港市场所需的石化产品，如塑料原料、化学溶剂、成品油及各类日用化工产品（图8）。在这一阶段，水贝村工业发展的主要形式是“三来一补”，村民从农户转型为工厂职工或企业管理人员，片区风貌从乡村彻底转型为城市工业区。1987 年，水贝工业区已具规模，建成厂房 7.5 万平方米、宿舍 3.65 万平方米，布心路、翠竹路等城市道路逐步完善。不过，据1998年的一篇报道称，工业区早期存在环境脏乱差、黑社会藏身等问题，广大业主提心吊胆，至 1996 年 6 月，水贝20 万平方米的厂房已有四成 “人去楼空”[[[] 李杰.创建一方美好的天地——记深圳市水贝工业区及其“当家人”吴沂城[J].中国人才,1998(08):34-36.]]。',
          },
      
          media: [
            {
              id: 'shuibei-stage-2-media-1',
              src: '/assets/station-details/shuibeiArea/Shuibei/Section 2/1.png',
              caption: {
                en: 'Image source: Editorial Committee of Shenzhen Special Economic Zone Yearbook. Shenzhen Special Economic Zone Yearbook [M]. Guangzhou: Guangdong People\'s Publishing House, [1992].',
                zh: '图像来源：深圳经济特区年鉴编辑委员会. 深圳经济特区年鉴[M]. 广州: 广东人民出版社, [1992].',
              },
                figureName: { en: 'Figure 2', zh: '图2' },
            },
            {
              id: 'shuibei-stage-2-media-2',
              src: '/assets/station-details/shuibeiArea/Shuibei/Section 2/2_1.png',
              caption: {
                en: 'Industrial map of the Shuibei area in 1999 (within the red dotted line), showing machinery and petrochemical enterprises.',
                zh: '1999年 水贝片区的工业地图（红色虚线内），其中可见机械与石化类企业',
              },
                figureName: { en: 'Figure 3', zh: '图3' },
            },
            {
              id: 'shuibei-stage-2-media-2',
              src: '/assets/station-details/shuibeiArea/Shuibei/Section 2/2_2.png',
              caption: {
                en: 'Industrial map of the Shuibei area in 2002 (within the red dotted line), showing machinery and petrochemical enterprises.',
                zh: '2002年 水贝片区的工业地图（红色虚线内），其中可见机械与石化类企业',
              },
                figureName: { en: 'Figure 4', zh: '图4' },
            },
          ],
        },
        {
          id: 'shuibei-stage-3',
          title: {
            en: 'Phase Three: The Development Period of the Jewelry Industry',
            zh: '第三阶段：珠宝产业发展时期',
          },
          period: {
            en: '(1995 - 2010)',
            zh: '（1995 年 - 2010 年）',
          },
          summary: {
            en: 'The origins of the Shuibei jewelry industry can be traced back to the late 1980s and early 1990s. Riding the wave of China\'s reform and opening up, a group of Chaoshan craftsmen, leveraging their geographical advantage of proximity to Hong Kong, met the jewelry industry\'s demands in the Hong Kong Special Administrative Region. They opened small, family-run workshops in the Shuibei Industrial Zone, a region in the Shenzhen Special Economic Zone with low costs, forming the most primitive "front shop, back factory" model. During this period, the industry was small-scale, scattered, and technologically rudimentary, mainly engaged in processing gold jewelry and simple wholesale, resulting in low added value and significant environmental pollution during production. The real turning point came in 1996. With newly established mainland brands such as "Chow Tai Fook" and "Daimengde" drawing on the experience of Hong Kong jewelry brands and opening brand counters in department stores nationwide, the demand for standardized, mass-produced jewelry in the mainland market increased dramatically. The small workshops in Shuibei seized this opportunity, quickly consolidating and upgrading the "front shop, back factory" model into a centralized wholesale and distribution center. This attracted buyers from all over the country, completing the first industrial leap from passively receiving orders to actively radiating influence nationwide. The standardization and upgrading of the industry benefited from key policy support. In 1998, the Shenzhen Special Economic Zone Branch of the People\'s Bank of China exclusively piloted the "gold consignment" business, significantly increasing the gold supply in the Shenzhen market and providing financial support for the industry\'s expansion and transaction upgrading. Simultaneously, the bank also relaxed the approval process for establishing gold jewelry sales enterprises (gold shops), greatly promoting the number and scale of gold and jewelry enterprises in Shuibei. Subsequently, from 2003 to 2004, the Shenzhen Municipal Government and Luohu District Government explicitly positioned Shuibei as the "Shenzhen Gold and Jewelry Industry Cluster Base," guiding upstream and downstream enterprises to settle in through specific policies. In 2004, the first professional jewelry procurement platform in China—the Shuibei International Jewelry Trading Center—was established, marking Shuibei\'s transition from a natural market to a new stage of government-led, platform-based operation. In 2005, Shuibei launched a renovation project to transform its old factory buildings, upgrading the industrial zone into an urban industrial park. Large jewelry trading platforms such as Shuibei International and Jinli International were built one after another, with the architectural style becoming more modern. The roads in the area continued to be widened and improved, and jewelry wholesale, testing services and other businesses gathered on both sides of the main roads such as Cuizhu Road and Buxin Road. Landscape nodes such as Crystal Plaza and Golden Walkway were also upgraded and transformed [Wang Zhan. "Industrial Transformation" Upgrading and Transformation Needs Breakthroughs [N]. Shenzhen Business Daily, 2009-05-06 (A02).]], which improved the business environment and cultural atmosphere. However, there are still problems in the area such as old buildings, narrow roads and mixed street shops (including car repair shops, decoration material shops, etc.) [Shenzhen spends tens of millions of yuan to build Shuibei "Treasure Basin" [N]. Guangzhou Daily, 2005-04-05.]], and the area is in a transitional state. Around 2010, affected by rising housing prices and increased production costs, most jewelry factories moved out of Shuibei and into the Lilang International Jewelry Industrial Park. The core function of the Shuibei area shrank to jewelry design, display and trading. [[Ancient yet rising, how did Shenzhen Shuibei Jewelry overcome the downturn? [Z/OL]. Jiemian News, 2019-05-11. (2019-05-11) [2024-03-24] https://www.jiemian.com/article/3117951.html]].',
            zh: '水贝珠宝产业的起源可追溯至上世纪80年代末至90年代初期。乘着改革开放的东风，一批潮汕籍工匠凭借毗邻香港的地缘优势，对接香港的珠宝产业需求，在深圳特区成本低廉的水贝工业区开设了家庭式小作坊，形成了最原始的 “前店后厂”模式。这一时期，产业规模小，分布零散，技术简陋，主要从事黄金饰品的来料加工与简单批发，产品附加值低，且生产环节给环境带来较大污染。真正的转折点发生在1996年。随着新成立不久的“潮宏基”、“戴梦得”等大陆本土品牌借鉴香港珠宝品牌的经验，在全国百货商场大规模开设品牌专柜，大陆市场对标准化、批量化珠宝货源的需求急剧增加。水贝的小作坊们敏锐地抓住了这一机遇，迅速聚合，将“前店后厂”模式升级为集中式的批发展销集散地，吸引了全国各地的采购商前来交易，完成了从被动接单到主动辐射全国的第一次产业跃升。产业的规范化与高端化得益于关键的政策赋能。1998年，中国人民银行深圳特区分行独家试点“黄金寄售”业务，大大提升了深圳市场的黄金供应量，为产业规模扩张和交易升级提供了金融血液。同时，该行也放开了金饰品销售企业（金店）的设立审批，极大地促进了水贝黄金珠宝企业的数量和规模。随后，在2003年至2004年，深圳市及罗湖区政府明确将水贝定位为“深圳市黄金珠宝产业集聚基地”，通过专项政策引导上下游企业进驻。2004年，国内首家专业珠宝采购平台——水贝国际珠宝交易中心应运而生，标志着水贝从自然集市迈入了政府主导、平台化运营的新阶段。2005 年，水贝启动旧厂房 “穿衣戴帽” 改造，工业区升级为都市产业园区，水贝国际、金丽国际等大型珠宝交易平台相继建成，建筑风格趋向现代化，区域道路继续拓宽完善，翠竹路、布心路等主干道两侧珠宝批发、检测服务等业态集聚，水晶广场、黄金步道等景观节点也完成升级改造[[[] 王湛. “工改工”z升级改造要有突破[N]. 深圳商报,2009-05-06(A02).]]，提升了商业环境与文化氛围。不过，片区内仍存在建筑陈旧、道路狭窄、临街商铺混杂（含汽车维修、装饰材料店等）的问题[[[] 深千万元打造水贝“聚宝盆”[N]. 广州日报,2005-04-05.]]，整体处于转型过渡状态。2010 年左右，受房价攀升推高生产成本的影响，多数珠宝工厂搬离水贝，迁入李朗国际珠宝产业园，水贝片区的核心功能收缩为珠宝设计、展示和交易[[[] 古老而朝阳，深圳水贝珠宝如何穿越低谷期[Z/OL]. 界面新闻, 2019-05-11.( 2019-05-11)[2024-03-24] https://www.jiemian.com/article/3117951.html]]。',
          },
        
        },
        {
          id: 'shuibei-stage-4',
          title: {
            en: 'Stage 3 Urban Renovation and Functional Landscape Upgrading Period',
            zh: '第四阶段：城市改造与功能景观升级时期',
          },
          period: {
            en: '(2010 - 2021)',
            zh: '（2010 年 - 2021 年）',
          },
          summary: {
            en: 'Although it is a hub for the jewelry industry, Shuibei Village has not become "glamorous" because of jewelry over the years. The streets are narrow and old, the population is chaotic, there are few high-rise buildings in the village, and security incidents occur frequently. In the face of the rapid development of the surrounding area, Shuibei Village appears "backward" and "outdated". In 2010, the Shenzhen Municipal Party Committee and Municipal Government designated Luohu as a pilot zone for the development of an international consumption center. [Proposal on Accelerating the Development of an International Consumption Center [EB/OL]. Shenzhen Municipal CPPCC, 2017-12-20. (2017-12-20) [2024-03-24] https://www.szzx.gov.cn/content/2017-12/20/content_18053790.htm] At the same time, Luohu District issued an action plan, planning nine urban renewal projects in the Shuibei-Buxin area, with a total investment of approximately RMB 12.28 billion, focusing on the development of gold and jewelry display, R&D design and headquarters functions. [Investing RMB 130 billion over 10 years to recreate "New Luohu" [EB/OL]. Shenzhen Business Daily, 2010-08-12. (2010-08-12) [2024-03-24]] In the following years, six urban renewal projects were mainly promoted in the Shuibei area, which is the focus of this study (Figure 9), including urban village and industrial area redevelopment, namely:',
            zh: '虽然是珠宝产业的集聚中心，但许多年来，水贝村并没有因珠宝而变得“光鲜”，街道狭窄而陈旧，人群杂乱，村里的高楼很少，治安事件屡屡发生。在周边日新月异的发展中，水贝村显得“落后”“陈旧”。2010 年，深圳市委市政府将罗湖定为国际消费中心先行先试区[[[] 关于加快打造国际消费中心的提案[EB/OL]. 深圳市政协, 2017-12-20.( 2017-12-20)[2024-03-24] https://www.szzx.gov.cn/content/2017-12/20/content_18053790.htm]]，罗湖区同步出台行动计划，在水贝—布心片区规划了9个旧改项目，总投资约 122.8 亿元，重点发展黄金珠宝的展示、研发设计和总部功能[[[]  10年投入1300亿再造“新罗湖”[EB/OL]. 深圳商报, 2010-08-12.( 2010-08-12)[2024-03-24]]]。此后数年，本研究关注的水贝片区内主要推进了六个旧改项目（图9），包含城中村与工业区旧改，分别是：',
          },
        
          media: [
            {
              id: 'liyumen-stage-1-media-1',
              src: '/assets/station-details/shuibeiArea/Shuibei/Section 4/1.png',
              caption: {
                en: 'Schematic diagram of the renovation project area (A: IBC Global Business Center, B: Dushu Village, C: Shuibei Village, D: Yuhongtian Plastics Factory, E: Jinli Jewelry Trading Center, F: Tefu Bonded Gold and Jewelry Industrial Center City)',
                zh: '改造项目区域示意图（A：IBC 环球商务中心，B：独树村，C：水贝村，D：宇宏天塑胶厂，E：金丽珠宝交易中心，F：特发保税黄金珠宝产业中心城市）',
              },
                figureName: { en: 'Figure 5', zh: '图5' },
            },
          ],
          remoteSensing: {
            figureName: { en: 'Figure 1', zh: '图1' },
            title: {
              en: 'Remote sensing pair for Stage 4',
              zh: '第四阶段遥感对照',
            },
            description: {
              en: 'Compare the area baseline and later urban density shift using paired remote sensing snapshots.',
              zh: '通过前后两期遥感影像对照，观察片区基线状态与后续密度变化。',
            },
            before: {
              src: '/assets/station-details/shuibeiArea/Remote sensing/1.png',
              caption: {
                en: 'Baseline remote sensing snapshot (2002).',
                zh: '基线遥感影像（2002）。',
              },
              options: [
                {
                  id: 'shuibei-stage-4-before-1',
                  label: { en: 'Before 2002', zh: '2002年前' },
                  src: '/assets/station-details/shuibeiArea/Remote sensing/1.png',
                },
                {
                  id: 'shuibei-stage-4-before-2',
                  label: { en: 'Before 2010', zh: '2010年前' },
                  src: '/assets/station-details/shuibeiArea/Remote sensing/2.png',
                },
                {
                  id: 'shuibei-stage-4-before-3',
                  label: { en: 'Before 2014', zh: '2014年前' },
                  src: '/assets/station-details/shuibeiArea/Remote sensing/3.png',
                },
                {
                  id: 'shuibei-stage-4-before-4',
                  label: { en: 'Before 2016', zh: '2016年前' },
                  src: '/assets/station-details/shuibeiArea/Remote sensing/4.png',
                },
                {
                    id: 'shuibei-stage-4-before-5',
                    label: { en: 'Before 2019', zh: '2019年前' },
                  src: '/assets/station-details/shuibeiArea/Remote sensing/5.png',
                },
                {
                  id: 'shuibei-stage-4-before-6',
                  label: { en: 'Before 2024', zh: '2024年前' },
                  src: '/assets/station-details/shuibeiArea/Remote sensing/6.png',
                },
              ],
            },
            after: {
              src: '/assets/station-details/shuibeiArea/Remote sensing/6.png',
              caption: {
                en: 'Later remote sensing snapshot (2024).',
                zh: '后期遥感影像（2024）。',
              },
              options: [
                {
                  id: 'shuibei-stage-4-after-1',
                  label: { en: 'After 2002', zh: '2002年后' },
                  src: '/assets/station-details/shuibeiArea/Remote sensing/1.png',
                },
                {
                  id: 'shuibei-stage-4-after-2',
                  label: { en: 'After 2010', zh: '2010年后' },
                  src: '/assets/station-details/shuibeiArea/Remote sensing/2.png',
                },
                {
                  id: 'shuibei-stage-4-after-3',
                  label: { en: 'After 2014', zh: '2014年后' },
                  src: '/assets/station-details/shuibeiArea/Remote sensing/3.png',
                },
                {
                  id: 'shuibei-stage-4-after-4',
                  label: { en: 'After 2016', zh: '2016年后' },
                  src: '/assets/station-details/shuibeiArea/Remote sensing/4.png',
                },
                {
                  id: 'shuibei-stage-4-after-5',
                  label: { en: 'After 2019', zh: '2019年后' },
                  src: '/assets/station-details/shuibeiArea/Remote sensing/5.png',
                },
                {
                  id: 'shuibei-stage-4-after-6',
                  label: { en: 'After 2024', zh: '2024年后' },
                  src: '/assets/station-details/shuibeiArea/Remote sensing/6.png',
                },
              ],
            },
          },
        },
      ],
    },

    //Station number 2
    {
      stationName: 'Tianbei',
      title: {
        en: 'Tianbei development timeline',
        zh: '天北发展时间线',
      },
      period: {
        en: 'history of the area',
        zh: '多阶段历史解读',
      },
      summary: {
        en: 'Tianbei development can be roughly divided into five stages: the village period; the "Three Comes and One Supplement" period after the reform and opening up; the jewelry industry development period; the urban transformation and functional landscape upgrade period; and the industrial digital transformation and comprehensive realization of old renovation period.',
        zh: '天北片区的发展可以大致分为五个阶段，分别是：村落时期；改革开放后的三来一补时期；珠宝产业发展时期；城市改造与功能景观升级时期；产业数字化转型与旧改全面兑现时期。',
      },
    
      imageSrc: '/assets/station-details/shuibeiArea/Tianbei/Section 2/1_2.png',
      image: {
        src: '/assets/station-details/shuibeiArea/Tianbei/Section 2/1_2.png',
        figureName: { en: 'Figure 14', zh: '图14' },
      },
      stages: [
        {
          id: 'shuibei-stage-1',
          title: {
            en: 'Stage 1 · Land formation and coastal preparation',
            zh: '第一阶段：村落时期（-1983年）',
          },
          period: {
            en: '(Before 1983)',
            zh: '(-1983年）',
          },
          summary: {
            en: 'Shuibei Village was founded in the eighth year of the Yongle reign of the Ming Dynasty by the Zhang family ancestors. Because the village was built behind a pond, and "bei" (贝) is a homophone for "back" (背) and symbolizes wealth, it was named Shuibei Village. It was formerly known as Getang Village and Shuixi Village. From the first year of the Wanli reign of the Ming Dynasty, it belonged to Dongguan County. From the first year of the Wanli reign of the Ming Dynasty to the Qing Dynasty, it belonged to Xin\'an County. In 1914, it belonged to Bao\'an County. After the founding of the People\'s Republic of China, it underwent several administrative division adjustments. Since 1992, it has belonged to Cuizhu Street, Luohu District. The traditional economy is mainly based on the planting of rice, melons, fruits, and vegetables, and the raising of fish, chickens, ducks, and pigs, supplemented by simple commerce and family handicrafts. The villagers\' lifestyle is relatively closed. The landscape is mainly natural villages and farmland. The buildings are mostly low-rise farmhouses with traditional brick and wood structures. The layout is loose and lacks unified planning. [[Shenzhen Planning and Land Development Research Center. Overview of Shenzhen Villages: Volume 2, Luohu Yantian Volume [M]. Guangzhou: South China University of Technology Press, 2020.]].',
            zh: '水贝村始建于明永乐八年，由张姓先祖开基立村，因村落建在水塘背后，“贝” 与 “背” 同音且象征财富，得名水贝村，曾用名隔塘村、水溪村。建村至明万历元年属东莞县，明万历元年至清朝属新安县，1914 年属宝安县，中华人民共和国成立后历经多次行政区划调整，1992 年起属罗湖区翠竹街道。传统经济以种植水稻、瓜果、蔬菜，养殖鱼、鸡、鸭、猪等为主，辅以简单的商业和家庭手工业，村民生活方式相对封闭。景观以自然村落与农田为主，建筑多为传统砖木结构的低矮农舍，布局松散，缺乏统一规划[[[] 深圳市规划国土发展研究中心. 深圳村落概览：第二辑 罗湖盐田卷[M]. 广州: 华南理工大学出版社, 2020.]]。',
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
              id: 'shuibei-stage-1-media-rs-2002',
              src: '/assets/station-details/shuibeiArea/Remote sensing/1.png',
              caption: {
                en: 'Sample remote sensing image for Stage 1 (2002 baseline).',
                zh: '第一阶段遥感示例图（2002 年基线）。',
              },
              figureName: { en: 'Figure 15', zh: '图15' },
            },
          ],
        },
        {
          id: 'shubei-stage-2',
          title: {
            en: 'Stage 2 · Station-area growth and urban interface',
            zh: '第二阶段：改革开放后的三来一补时期',
          },
          period: {
            en: 'Structured growth period',
            zh: '（1978 年 - 1995 年）',
          },
          summary: {
            en: 'Leveraging the policy advantages of the Shenzhen Special Economic Zone, Shuibei Village established Shenzhen Shuibei Industrial Co., Ltd., a collectively owned enterprise, in November 1984. Nearly 600 villagers became shareholders, with businesses covering multiple sectors such as catering and property management. In the same year, large-scale construction of the Shuibei Industrial Zone began (Figure 7) [[[] A city surrounded by gold and jewelry - Shuibei Village [EB/OL]. (2017-08-23) [2024-03-24]. https://www.sohu.com/a/166723616_99950450.]], with industrial development focusing on machinery and building materials and petrochemicals. Among them, the representative enterprise in the machinery and building materials field is Shenzhen Machinery Industry Company, whose production and operation scope includes household appliances, general machinery, light industrial machinery, packaging machinery, mechanical molds, wires and cables, abrasives, instruments and meters, micro motors, etc. The petrochemical industrial zone covers an area of ​​320,000 square meters, organizing the production or import of petrochemical products needed by the Hong Kong market, such as plastic raw materials, chemical solvents, refined oil and various daily chemical products (Figure 8). During this period, the main form of industrial development in Shuibei Village was "processing with supplied materials, processing with supplied samples, processing with supplied parts, and compensation trade". Villagers transformed from farmers to factory workers or enterprise managers, and the area\'s appearance completely transformed from a rural village to an urban industrial zone. By 1987, the Shuibei Industrial Zone had reached a certain scale, with 75,000 square meters of factory buildings and 36,500 square meters of dormitories built, and urban roads such as Buxin Road and Cuizhu Road gradually improved. However, according to a report in 1998, the industrial zone had problems such as a dirty and chaotic environment and the presence of gangsters in the early days. The owners were worried and fearful. By June 1996, 40% of the 200,000 square meters of factory buildings in Shuibei had been "empty". [[Li Jie. Creating a beautiful world - a record of Shenzhen Shuibei Industrial Zone and its "head" Wu Yicheng [J]. China Talents, 1998(08):34-36.]].',
            zh: '依托深圳经济特区政策优势，水贝村在1984年11月成立集体性质的深圳市水贝实业股份有限公司，近 600 名村民转为股东，业务覆盖餐饮、物业等多个领域。同年，开启水贝工业区的大规模建设（图7）[[[] 一座被黄金珠宝包围的城——水贝村[EB/OL]. (2017-08-23)[2024-03-24]. https://www.sohu.com/a/166723616_99950450.]]，产业发展聚焦于机械建材与石油化工。其中，机械建材领域代表企业为深圳市机械工业公司，生产经营范围包括家用电器、通用机械、轻工机械、包装机械、机械模具、电线电缆、磨料磨具、仪器仪表、微型电机等。石化工业区占地 32 万平方米，组织生产或进口香港市场所需的石化产品，如塑料原料、化学溶剂、成品油及各类日用化工产品（图8）。在这一阶段，水贝村工业发展的主要形式是“三来一补”，村民从农户转型为工厂职工或企业管理人员，片区风貌从乡村彻底转型为城市工业区。1987 年，水贝工业区已具规模，建成厂房 7.5 万平方米、宿舍 3.65 万平方米，布心路、翠竹路等城市道路逐步完善。不过，据1998年的一篇报道称，工业区早期存在环境脏乱差、黑社会藏身等问题，广大业主提心吊胆，至 1996 年 6 月，水贝20 万平方米的厂房已有四成 “人去楼空”[[[] 李杰.创建一方美好的天地——记深圳市水贝工业区及其“当家人”吴沂城[J].中国人才,1998(08):34-36.]]。',
          },
        
          media: [
            {
              id: 'shuibei-stage-2-media-1',
              src: '/assets/station-details/shuibeiArea/Shuibei/Section 2/1.png',
              caption: {
                en: 'Image source: Editorial Committee of Shenzhen Special Economic Zone Yearbook. Shenzhen Special Economic Zone Yearbook [M]. Guangzhou: Guangdong People\'s Publishing House, [1992].',
                zh: '图像来源：深圳经济特区年鉴编辑委员会. 深圳经济特区年鉴[M]. 广州: 广东人民出版社, [1992].',
              },
                figureName: { en: 'Figure 2', zh: '图2' },
            },
            {
              id: 'shuibei-stage-2-media-2',
              src: '/assets/station-details/shuibeiArea/Shuibei/Section 2/2_1.png',
              caption: {
                en: 'Industrial map of the Shuibei area in 1999 (within the red dotted line), showing machinery and petrochemical enterprises.',
                zh: '1999年 水贝片区的工业地图（红色虚线内），其中可见机械与石化类企业',
              },
                figureName: { en: 'Figure 3', zh: '图3' },
            },
            {
              id: 'shuibei-stage-2-media-2',
              src: '/assets/station-details/shuibeiArea/Shuibei/Section 2/2_2.png',
              caption: {
                en: 'Industrial map of the Shuibei area in 2002 (within the red dotted line), showing machinery and petrochemical enterprises.',
                zh: '2002年 水贝片区的工业地图（红色虚线内），其中可见机械与石化类企业',
              },
                figureName: { en: 'Figure 4', zh: '图4' },
            },
          ],
        },
        {
          id: 'shuibei-stage-3',
          title: {
            en: 'Stage 3 · The Development Period of the Jewelry Industry',
            zh: '第三阶段：珠宝产业发展时期',
          },
          period: {
            en: '(1995 - 2010)',
            zh: '（1995 年 - 2010 年）',
          },
          summary: {
            en: 'The origins of the Shuibei jewelry industry can be traced back to the late 1980s and early 1990s. Riding the wave of China\'s reform and opening up, a group of Chaoshan craftsmen, leveraging their geographical advantage of proximity to Hong Kong, met the jewelry industry\'s demands in the Hong Kong Special Administrative Region. They opened small, family-run workshops in the Shuibei Industrial Zone, a region in the Shenzhen Special Economic Zone with low costs, forming the most primitive "front shop, back factory" model. During this period, the industry was small-scale, scattered, and technologically rudimentary, mainly engaged in processing gold jewelry and simple wholesale, resulting in low added value and significant environmental pollution during production. The real turning point came in 1996. With newly established mainland brands such as "Chow Tai Fook" and "Daimengde" drawing on the experience of Hong Kong jewelry brands and opening brand counters in department stores nationwide, the demand for standardized, mass-produced jewelry in the mainland market increased dramatically. The small workshops in Shuibei seized this opportunity, quickly consolidating and upgrading the "front shop, back factory" model into a centralized wholesale and distribution center. This attracted buyers from all over the country, completing the first industrial leap from passively receiving orders to actively radiating influence nationwide. The standardization and upgrading of the industry benefited from key policy support. In 1998, the Shenzhen Special Economic Zone Branch of the People\'s Bank of China exclusively piloted the "gold consignment" business, significantly increasing the gold supply in the Shenzhen market and providing financial support for the industry\'s expansion and transaction upgrading. Simultaneously, the bank also relaxed the approval process for establishing gold jewelry sales enterprises (gold shops), greatly promoting the number and scale of gold and jewelry enterprises in Shuibei. Subsequently, from 2003 to 2004, the Shenzhen Municipal Government and Luohu District Government explicitly positioned Shuibei as the "Shenzhen Gold and Jewelry Industry Cluster Base," guiding upstream and downstream enterprises to settle in through specific policies. In 2004, the first professional jewelry procurement platform in China—the Shuibei International Jewelry Trading Center—was established, marking Shuibei\'s transition from a natural market to a new stage of government-led, platform-based operation. In 2005, Shuibei launched a renovation project to transform its old factory buildings, upgrading the industrial zone into an urban industrial park. Large jewelry trading platforms such as Shuibei International and Jinli International were built one after another, with the architectural style becoming more modern. The roads in the area continued to be widened and improved, and jewelry wholesale, testing services and other businesses gathered on both sides of the main roads such as Cuizhu Road and Buxin Road. Landscape nodes such as Crystal Plaza and Golden Walkway were also upgraded and transformed [Wang Zhan. "Industrial Transformation" Upgrading and Transformation Needs Breakthroughs [N]. Shenzhen Business Daily, 2009-05-06 (A02).]], which improved the business environment and cultural atmosphere. However, there are still problems in the area such as old buildings, narrow roads and mixed street shops (including car repair shops, decoration material shops, etc.) [Shenzhen spends tens of millions of yuan to build Shuibei "Treasure Basin" [N]. Guangzhou Daily, 2005-04-05.]], and the area is in a transitional state. Around 2010, affected by rising housing prices and increased production costs, most jewelry factories moved out of Shuibei and into the Lilang International Jewelry Industrial Park. The core function of the Shuibei area shrank to jewelry design, display and trading. [[Ancient yet rising, how did Shenzhen Shuibei Jewelry overcome the downturn? [Z/OL]. Jiemian News, 2019-05-11. (2019-05-11) [2024-03-24] https://www.jiemian.com/article/3117951.html]].',
            zh: '水贝珠宝产业的起源可追溯至上世纪80年代末至90年代初期。乘着改革开放的东风，一批潮汕籍工匠凭借毗邻香港的地缘优势，对接香港的珠宝产业需求，在深圳特区成本低廉的水贝工业区开设了家庭式小作坊，形成了最原始的 “前店后厂”模式。这一时期，产业规模小，分布零散，技术简陋，主要从事黄金饰品的来料加工与简单批发，产品附加值低，且生产环节给环境带来较大污染。真正的转折点发生在1996年。随着新成立不久的“潮宏基”、“戴梦得”等大陆本土品牌借鉴香港珠宝品牌的经验，在全国百货商场大规模开设品牌专柜，大陆市场对标准化、批量化珠宝货源的需求急剧增加。水贝的小作坊们敏锐地抓住了这一机遇，迅速聚合，将“前店后厂”模式升级为集中式的批发展销集散地，吸引了全国各地的采购商前来交易，完成了从被动接单到主动辐射全国的第一次产业跃升。产业的规范化与高端化得益于关键的政策赋能。1998年，中国人民银行深圳特区分行独家试点“黄金寄售”业务，大大提升了深圳市场的黄金供应量，为产业规模扩张和交易升级提供了金融血液。同时，该行也放开了金饰品销售企业（金店）的设立审批，极大地促进了水贝黄金珠宝企业的数量和规模。随后，在2003年至2004年，深圳市及罗湖区政府明确将水贝定位为“深圳市黄金珠宝产业集聚基地”，通过专项政策引导上下游企业进驻。2004年，国内首家专业珠宝采购平台——水贝国际珠宝交易中心应运而生，标志着水贝从自然集市迈入了政府主导、平台化运营的新阶段。2005 年，水贝启动旧厂房 “穿衣戴帽” 改造，工业区升级为都市产业园区，水贝国际、金丽国际等大型珠宝交易平台相继建成，建筑风格趋向现代化，区域道路继续拓宽完善，翠竹路、布心路等主干道两侧珠宝批发、检测服务等业态集聚，水晶广场、黄金步道等景观节点也完成升级改造[[[] 王湛. “工改工”z升级改造要有突破[N]. 深圳商报,2009-05-06(A02).]]，提升了商业环境与文化氛围。不过，片区内仍存在建筑陈旧、道路狭窄、临街商铺混杂（含汽车维修、装饰材料店等）的问题[[[] 深千万元打造水贝“聚宝盆”[N]. 广州日报,2005-04-05.]]，整体处于转型过渡状态。2010 年左右，受房价攀升推高生产成本的影响，多数珠宝工厂搬离水贝，迁入李朗国际珠宝产业园，水贝片区的核心功能收缩为珠宝设计、展示和交易[[[] 古老而朝阳，深圳水贝珠宝如何穿越低谷期[Z/OL]. 界面新闻, 2019-05-11.( 2019-05-11)[2024-03-24] https://www.jiemian.com/article/3117951.html]]。',
          },
         
        },
        {
          id: 'shuibei-stage-4',
          title: {
            en: 'Phase Four: Urban Renovation and Functional Landscape Upgrading Period',
            zh: '第四阶段：城市改造与功能景观升级时期',
          },
          period: {
            en: '(2010 - 2021)',
            zh: '（2010 年 - 2021 年）',
          },
          summary: {
            en: 'Although it is a hub for the jewelry industry, Shuibei Village has not become "glamorous" because of jewelry over the years. The streets are narrow and old, the population is chaotic, there are few high-rise buildings in the village, and security incidents occur frequently. In the face of the rapid development of the surrounding area, Shuibei Village appears "backward" and "outdated". In 2010, the Shenzhen Municipal Party Committee and Municipal Government designated Luohu as a pilot zone for the development of an international consumption center. [Proposal on Accelerating the Development of an International Consumption Center [EB/OL]. Shenzhen Municipal CPPCC, 2017-12-20. (2017-12-20) [2024-03-24] https://www.szzx.gov.cn/content/2017-12/20/content_18053790.htm] At the same time, Luohu District issued an action plan, planning nine urban renewal projects in the Shuibei-Buxin area, with a total investment of approximately RMB 12.28 billion, focusing on the development of gold and jewelry display, R&D design and headquarters functions. [Investing RMB 130 billion over 10 years to recreate "New Luohu" [EB/OL]. Shenzhen Business Daily, 2010-08-12. (2010-08-12) [2024-03-24]] In the following years, six urban renewal projects were mainly promoted in the Shuibei area, which is the focus of this study (Figure 9), including urban village and industrial area redevelopment, namely:',
            zh: '虽然是珠宝产业的集聚中心，但许多年来，水贝村并没有因珠宝而变得“光鲜”，街道狭窄而陈旧，人群杂乱，村里的高楼很少，治安事件屡屡发生。在周边日新月异的发展中，水贝村显得“落后”“陈旧”。2010 年，深圳市委市政府将罗湖定为国际消费中心先行先试区[[[] 关于加快打造国际消费中心的提案[EB/OL]. 深圳市政协, 2017-12-20.( 2017-12-20)[2024-03-24] https://www.szzx.gov.cn/content/2017-12/20/content_18053790.htm]]，罗湖区同步出台行动计划，在水贝—布心片区规划了9个旧改项目，总投资约 122.8 亿元，重点发展黄金珠宝的展示、研发设计和总部功能[[[]  10年投入1300亿再造“新罗湖”[EB/OL]. 深圳商报, 2010-08-12.( 2010-08-12)[2024-03-24]]]。此后数年，本研究关注的水贝片区内主要推进了六个旧改项目（图9），包含城中村与工业区旧改，分别是：',
          },
      
          media: [
            {
              id: 'liyumen-stage-1-media-1',
              src: '/assets/station-details/shuibeiArea/Shuibei/Section 4/1.png',
              caption: {
                en: 'Schematic diagram of the renovation project area (A: IBC Global Business Center, B: Dushu Village, C: Shuibei Village, D: Yuhongtian Plastics Factory, E: Jinli Jewelry Trading Center, F: Tefu Bonded Gold and Jewelry Industrial Center City)',
                zh: '改造项目区域示意图（A：IBC 环球商务中心，B：独树村，C：水贝村，D：宇宏天塑胶厂，E：金丽珠宝交易中心，F：特发保税黄金珠宝产业中心城市）',
              },
                figureName: { en: 'Figure 5', zh: '图5' },
            },
          ],
          remoteSensing: {
            figureName: { en: 'Figure 1', zh: '图1' },
            title: {
              en: 'Remote sensing pair for Stage 4',
              zh: '第四阶段遥感对照',
            },
            description: {
              en: 'Compare the area baseline and later urban density shift using paired remote sensing snapshots.',
              zh: '通过前后两期遥感影像对照，观察片区基线状态与后续密度变化。',
            },
            before: {
              src: '/assets/station-details/shuibeiArea/Remote sensing/1.png',
              caption: {
                en: 'Baseline remote sensing snapshot (2002).',
                zh: '基线遥感影像（2002）。',
              },
            },
            after: {
              src: '/assets/station-details/shuibeiArea/Remote sensing/6.png',
              caption: {
                en: 'Later remote sensing snapshot (2024).',
                zh: '后期遥感影像（2024）。',
              },
            },
          },
        },
      ],
    },

    //Station number 3
    {
      stationName: 'Honghu',
      title: {
        en: 'Honghu development timeline',
        zh: '洪湖发展时间线',
      },
      period: {
        en: 'history of the area',
        zh: '多阶段历史解读',
      },
      summary: {
        en: 'Shuibei development can be roughly divided into five stages: the village period; the "Three Comes and One Supplement" period after the reform and opening up; the jewelry industry development period; the urban transformation and functional landscape upgrade period; and the industrial digital transformation and comprehensive realization of old renovation period.',
        zh: '水贝片区的发展可以大致分为五个阶段，分别是：村落时期；改革开放后的三来一补时期；珠宝产业发展时期；城市改造与功能景观升级时期；产业数字化转型与旧改全面兑现时期。',
      },
      imageSrc: '/assets/station-details/shuibeiArea/Honghu/Section 3/1.png',
      image: {
        src: '/assets/station-details/shuibeiArea/Honghu/Section 3/1.png',
        figureName: { en: 'Figure 16', zh: '图16' },
      },
      stages: [
        {
          id: 'shuibei-stage-1',
          title: {
            en: 'Stage 1 · Land formation and coastal preparation',
            zh: '第一阶段：村落时期（-1983年）',
          },
          period: {
            en: '(Before 1983)',
            zh: '(-1983年）',
          },
          summary: {
            en: 'Shuibei Village was founded in the eighth year of the Yongle reign of the Ming Dynasty by the Zhang family ancestors. Because the village was built behind a pond, and "bei" (贝) is a homophone for "back" (背) and symbolizes wealth, it was named Shuibei Village. It was formerly known as Getang Village and Shuixi Village. From the first year of the Wanli reign of the Ming Dynasty, it belonged to Dongguan County. From the first year of the Wanli reign of the Ming Dynasty to the Qing Dynasty, it belonged to Xin\'an County. In 1914, it belonged to Bao\'an County. After the founding of the People\'s Republic of China, it underwent several administrative division adjustments. Since 1992, it has belonged to Cuizhu Street, Luohu District. The traditional economy is mainly based on the planting of rice, melons, fruits, and vegetables, and the raising of fish, chickens, ducks, and pigs, supplemented by simple commerce and family handicrafts. The villagers\' lifestyle is relatively closed. The landscape is mainly natural villages and farmland. The buildings are mostly low-rise farmhouses with traditional brick and wood structures. The layout is loose and lacks unified planning. [[Shenzhen Planning and Land Development Research Center. Overview of Shenzhen Villages: Volume 2, Luohu Yantian Volume [M]. Guangzhou: South China University of Technology Press, 2020.]].',
            zh: '水贝村始建于明永乐八年，由张姓先祖开基立村，因村落建在水塘背后，“贝” 与 “背” 同音且象征财富，得名水贝村，曾用名隔塘村、水溪村。建村至明万历元年属东莞县，明万历元年至清朝属新安县，1914 年属宝安县，中华人民共和国成立后历经多次行政区划调整，1992 年起属罗湖区翠竹街道。传统经济以种植水稻、瓜果、蔬菜，养殖鱼、鸡、鸭、猪等为主，辅以简单的商业和家庭手工业，村民生活方式相对封闭。景观以自然村落与农田为主，建筑多为传统砖木结构的低矮农舍，布局松散，缺乏统一规划[[[] 深圳市规划国土发展研究中心. 深圳村落概览：第二辑 罗湖盐田卷[M]. 广州: 华南理工大学出版社, 2020.]]。',
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
              id: 'shuibei-stage-1-media-rs-2002',
              src: '/assets/station-details/shuibeiArea/Remote sensing/1.png',
              caption: {
                en: 'Sample remote sensing image for Stage 1 (2002 baseline).',
                zh: '第一阶段遥感示例图（2002 年基线）。',
              },
              figureName: { en: 'Figure 17', zh: '图17' },
            },
          ],
        },
        {
          id: 'shubei-stage-2',
          title: {
            en: 'Stage 2 · Station-area growth and urban interface',
            zh: '第二阶段：改革开放后的三来一补时期',
          },
          period: {
            en: 'Structured growth period',
            zh: '（1978 年 - 1995 年）',
          },
          summary: {
            en: 'Leveraging the policy advantages of the Shenzhen Special Economic Zone, Shuibei Village established Shenzhen Shuibei Industrial Co., Ltd., a collectively owned enterprise, in November 1984. Nearly 600 villagers became shareholders, with businesses covering multiple sectors such as catering and property management. In the same year, large-scale construction of the Shuibei Industrial Zone began (Figure 7) [[[] A city surrounded by gold and jewelry - Shuibei Village [EB/OL]. (2017-08-23) [2024-03-24]. https://www.sohu.com/a/166723616_99950450.]], with industrial development focusing on machinery and building materials and petrochemicals. Among them, the representative enterprise in the machinery and building materials field is Shenzhen Machinery Industry Company, whose production and operation scope includes household appliances, general machinery, light industrial machinery, packaging machinery, mechanical molds, wires and cables, abrasives, instruments and meters, micro motors, etc. The petrochemical industrial zone covers an area of ​​320,000 square meters, organizing the production or import of petrochemical products needed by the Hong Kong market, such as plastic raw materials, chemical solvents, refined oil and various daily chemical products (Figure 8). During this period, the main form of industrial development in Shuibei Village was "processing with supplied materials, processing with supplied samples, processing with supplied parts, and compensation trade". Villagers transformed from farmers to factory workers or enterprise managers, and the area\'s appearance completely transformed from a rural village to an urban industrial zone. By 1987, the Shuibei Industrial Zone had reached a certain scale, with 75,000 square meters of factory buildings and 36,500 square meters of dormitories built, and urban roads such as Buxin Road and Cuizhu Road gradually improved. However, according to a report in 1998, the industrial zone had problems such as a dirty and chaotic environment and the presence of gangsters in the early days. The owners were worried and fearful. By June 1996, 40% of the 200,000 square meters of factory buildings in Shuibei had been "empty". [[Li Jie. Creating a beautiful world - a record of Shenzhen Shuibei Industrial Zone and its "head" Wu Yicheng [J]. China Talents, 1998(08):34-36.]].',
            zh: '依托深圳经济特区政策优势，水贝村在1984年11月成立集体性质的深圳市水贝实业股份有限公司，近 600 名村民转为股东，业务覆盖餐饮、物业等多个领域。同年，开启水贝工业区的大规模建设（图7）[[[] 一座被黄金珠宝包围的城——水贝村[EB/OL]. (2017-08-23)[2024-03-24]. https://www.sohu.com/a/166723616_99950450.]]，产业发展聚焦于机械建材与石油化工。其中，机械建材领域代表企业为深圳市机械工业公司，生产经营范围包括家用电器、通用机械、轻工机械、包装机械、机械模具、电线电缆、磨料磨具、仪器仪表、微型电机等。石化工业区占地 32 万平方米，组织生产或进口香港市场所需的石化产品，如塑料原料、化学溶剂、成品油及各类日用化工产品（图8）。在这一阶段，水贝村工业发展的主要形式是“三来一补”，村民从农户转型为工厂职工或企业管理人员，片区风貌从乡村彻底转型为城市工业区。1987 年，水贝工业区已具规模，建成厂房 7.5 万平方米、宿舍 3.65 万平方米，布心路、翠竹路等城市道路逐步完善。不过，据1998年的一篇报道称，工业区早期存在环境脏乱差、黑社会藏身等问题，广大业主提心吊胆，至 1996 年 6 月，水贝20 万平方米的厂房已有四成 “人去楼空”[[[] 李杰.创建一方美好的天地——记深圳市水贝工业区及其“当家人”吴沂城[J].中国人才,1998(08):34-36.]]。',
          },
         
          media: [
            {
              id: 'shuibei-stage-2-media-1',
              src: '/assets/station-details/shuibeiArea/Shuibei/Section 2/1.png',
              caption: {
                en: 'Image source: Editorial Committee of Shenzhen Special Economic Zone Yearbook. Shenzhen Special Economic Zone Yearbook [M]. Guangzhou: Guangdong People\'s Publishing House, [1992].',
                zh: '图像来源：深圳经济特区年鉴编辑委员会. 深圳经济特区年鉴[M]. 广州: 广东人民出版社, [1992].',
              },
                figureName: { en: 'Figure 2', zh: '图2' },
            },
            {
              id: 'shuibei-stage-2-media-2',
              src: '/assets/station-details/shuibeiArea/Shuibei/Section 2/2_1.png',
              caption: {
                en: 'Industrial map of the Shuibei area in 1999 (within the red dotted line), showing machinery and petrochemical enterprises.',
                zh: '1999年 水贝片区的工业地图（红色虚线内），其中可见机械与石化类企业',
              },
                figureName: { en: 'Figure 3', zh: '图3' },
            },
            {
              id: 'shuibei-stage-2-media-2',
              src: '/assets/station-details/shuibeiArea/Shuibei/Section 2/2_2.png',
              caption: {
                en: 'Industrial map of the Shuibei area in 2002 (within the red dotted line), showing machinery and petrochemical enterprises.',
                zh: '2002年 水贝片区的工业地图（红色虚线内），其中可见机械与石化类企业',
              },
                figureName: { en: 'Figure 4', zh: '图4' },
            },
          ],
        },
        {
          id: 'shuibei-stage-3',
          title: {
            en: 'Stage 3 · The Development Period of the Jewelry Industry',
            zh: '第三阶段：珠宝产业发展时期',
          },
          period: {
            en: '(1995 - 2010)',
            zh: '（1995 年 - 2010 年）',
          },
          summary: {
            en: 'The origins of the Shuibei jewelry industry can be traced back to the late 1980s and early 1990s. Riding the wave of China\'s reform and opening up, a group of Chaoshan craftsmen, leveraging their geographical advantage of proximity to Hong Kong, met the jewelry industry\'s demands in the Hong Kong Special Administrative Region. They opened small, family-run workshops in the Shuibei Industrial Zone, a region in the Shenzhen Special Economic Zone with low costs, forming the most primitive "front shop, back factory" model. During this period, the industry was small-scale, scattered, and technologically rudimentary, mainly engaged in processing gold jewelry and simple wholesale, resulting in low added value and significant environmental pollution during production. The real turning point came in 1996. With newly established mainland brands such as "Chow Tai Fook" and "Daimengde" drawing on the experience of Hong Kong jewelry brands and opening brand counters in department stores nationwide, the demand for standardized, mass-produced jewelry in the mainland market increased dramatically. The small workshops in Shuibei seized this opportunity, quickly consolidating and upgrading the "front shop, back factory" model into a centralized wholesale and distribution center. This attracted buyers from all over the country, completing the first industrial leap from passively receiving orders to actively radiating influence nationwide. The standardization and upgrading of the industry benefited from key policy support. In 1998, the Shenzhen Special Economic Zone Branch of the People\'s Bank of China exclusively piloted the "gold consignment" business, significantly increasing the gold supply in the Shenzhen market and providing financial support for the industry\'s expansion and transaction upgrading. Simultaneously, the bank also relaxed the approval process for establishing gold jewelry sales enterprises (gold shops), greatly promoting the number and scale of gold and jewelry enterprises in Shuibei. Subsequently, from 2003 to 2004, the Shenzhen Municipal Government and Luohu District Government explicitly positioned Shuibei as the "Shenzhen Gold and Jewelry Industry Cluster Base," guiding upstream and downstream enterprises to settle in through specific policies. In 2004, the first professional jewelry procurement platform in China—the Shuibei International Jewelry Trading Center—was established, marking Shuibei\'s transition from a natural market to a new stage of government-led, platform-based operation. In 2005, Shuibei launched a renovation project to transform its old factory buildings, upgrading the industrial zone into an urban industrial park. Large jewelry trading platforms such as Shuibei International and Jinli International were built one after another, with the architectural style becoming more modern. The roads in the area continued to be widened and improved, and jewelry wholesale, testing services and other businesses gathered on both sides of the main roads such as Cuizhu Road and Buxin Road. Landscape nodes such as Crystal Plaza and Golden Walkway were also upgraded and transformed [Wang Zhan. "Industrial Transformation" Upgrading and Transformation Needs Breakthroughs [N]. Shenzhen Business Daily, 2009-05-06 (A02).]], which improved the business environment and cultural atmosphere. However, there are still problems in the area such as old buildings, narrow roads and mixed street shops (including car repair shops, decoration material shops, etc.) [Shenzhen spends tens of millions of yuan to build Shuibei "Treasure Basin" [N]. Guangzhou Daily, 2005-04-05.]], and the area is in a transitional state. Around 2010, affected by rising housing prices and increased production costs, most jewelry factories moved out of Shuibei and into the Lilang International Jewelry Industrial Park. The core function of the Shuibei area shrank to jewelry design, display and trading. [[Ancient yet rising, how did Shenzhen Shuibei Jewelry overcome the downturn? [Z/OL]. Jiemian News, 2019-05-11. (2019-05-11) [2024-03-24] https://www.jiemian.com/article/3117951.html]].',
            zh: '水贝珠宝产业的起源可追溯至上世纪80年代末至90年代初期。乘着改革开放的东风，一批潮汕籍工匠凭借毗邻香港的地缘优势，对接香港的珠宝产业需求，在深圳特区成本低廉的水贝工业区开设了家庭式小作坊，形成了最原始的 “前店后厂”模式。这一时期，产业规模小，分布零散，技术简陋，主要从事黄金饰品的来料加工与简单批发，产品附加值低，且生产环节给环境带来较大污染。真正的转折点发生在1996年。随着新成立不久的“潮宏基”、“戴梦得”等大陆本土品牌借鉴香港珠宝品牌的经验，在全国百货商场大规模开设品牌专柜，大陆市场对标准化、批量化珠宝货源的需求急剧增加。水贝的小作坊们敏锐地抓住了这一机遇，迅速聚合，将“前店后厂”模式升级为集中式的批发展销集散地，吸引了全国各地的采购商前来交易，完成了从被动接单到主动辐射全国的第一次产业跃升。产业的规范化与高端化得益于关键的政策赋能。1998年，中国人民银行深圳特区分行独家试点“黄金寄售”业务，大大提升了深圳市场的黄金供应量，为产业规模扩张和交易升级提供了金融血液。同时，该行也放开了金饰品销售企业（金店）的设立审批，极大地促进了水贝黄金珠宝企业的数量和规模。随后，在2003年至2004年，深圳市及罗湖区政府明确将水贝定位为“深圳市黄金珠宝产业集聚基地”，通过专项政策引导上下游企业进驻。2004年，国内首家专业珠宝采购平台——水贝国际珠宝交易中心应运而生，标志着水贝从自然集市迈入了政府主导、平台化运营的新阶段。2005 年，水贝启动旧厂房 “穿衣戴帽” 改造，工业区升级为都市产业园区，水贝国际、金丽国际等大型珠宝交易平台相继建成，建筑风格趋向现代化，区域道路继续拓宽完善，翠竹路、布心路等主干道两侧珠宝批发、检测服务等业态集聚，水晶广场、黄金步道等景观节点也完成升级改造[[[] 王湛. “工改工”z升级改造要有突破[N]. 深圳商报,2009-05-06(A02).]]，提升了商业环境与文化氛围。不过，片区内仍存在建筑陈旧、道路狭窄、临街商铺混杂（含汽车维修、装饰材料店等）的问题[[[] 深千万元打造水贝“聚宝盆”[N]. 广州日报,2005-04-05.]]，整体处于转型过渡状态。2010 年左右，受房价攀升推高生产成本的影响，多数珠宝工厂搬离水贝，迁入李朗国际珠宝产业园，水贝片区的核心功能收缩为珠宝设计、展示和交易[[[] 古老而朝阳，深圳水贝珠宝如何穿越低谷期[Z/OL]. 界面新闻, 2019-05-11.( 2019-05-11)[2024-03-24] https://www.jiemian.com/article/3117951.html]]。',
          },
          highlights: [
            { en: 'Cross-district movement stabilized by station corridor', zh: '站点走廊支撑跨片区流动稳定化' },
            { en: 'Public-facing programs and streetscape quality improved', zh: '面向公众的功能与街道品质持续提升' },
          ],
        },
        {
          id: 'shuibei-stage-4',
          title: {
            en: 'Phase Four: Urban Renovation and Functional Landscape Upgrading Period',
            zh: '第四阶段：城市改造与功能景观升级时期',
          },
          period: {
            en: '(2010 - 2021)',
            zh: '（2010 年 - 2021 年）',
          },
          summary: {
            en: 'Although it is a hub for the jewelry industry, Shuibei Village has not become "glamorous" because of jewelry over the years. The streets are narrow and old, the population is chaotic, there are few high-rise buildings in the village, and security incidents occur frequently. In the face of the rapid development of the surrounding area, Shuibei Village appears "backward" and "outdated". In 2010, the Shenzhen Municipal Party Committee and Municipal Government designated Luohu as a pilot zone for the development of an international consumption center. [Proposal on Accelerating the Development of an International Consumption Center [EB/OL]. Shenzhen Municipal CPPCC, 2017-12-20. (2017-12-20) [2024-03-24] https://www.szzx.gov.cn/content/2017-12/20/content_18053790.htm] At the same time, Luohu District issued an action plan, planning nine urban renewal projects in the Shuibei-Buxin area, with a total investment of approximately RMB 12.28 billion, focusing on the development of gold and jewelry display, R&D design and headquarters functions. [Investing RMB 130 billion over 10 years to recreate "New Luohu" [EB/OL]. Shenzhen Business Daily, 2010-08-12. (2010-08-12) [2024-03-24]] In the following years, six urban renewal projects were mainly promoted in the Shuibei area, which is the focus of this study (Figure 9), including urban village and industrial area redevelopment, namely:',
            zh: '虽然是珠宝产业的集聚中心，但许多年来，水贝村并没有因珠宝而变得“光鲜”，街道狭窄而陈旧，人群杂乱，村里的高楼很少，治安事件屡屡发生。在周边日新月异的发展中，水贝村显得“落后”“陈旧”。2010 年，深圳市委市政府将罗湖定为国际消费中心先行先试区[[[] 关于加快打造国际消费中心的提案[EB/OL]. 深圳市政协, 2017-12-20.( 2017-12-20)[2024-03-24] https://www.szzx.gov.cn/content/2017-12/20/content_18053790.htm]]，罗湖区同步出台行动计划，在水贝—布心片区规划了9个旧改项目，总投资约 122.8 亿元，重点发展黄金珠宝的展示、研发设计和总部功能[[[]  10年投入1300亿再造“新罗湖”[EB/OL]. 深圳商报, 2010-08-12.( 2010-08-12)[2024-03-24]]]。此后数年，本研究关注的水贝片区内主要推进了六个旧改项目（图9），包含城中村与工业区旧改，分别是：',
          },
          
          
          // highlights: [
          //   { en: 'Cross-district movement stabilized by station corridor', zh: '站点走廊支撑跨片区流动稳定化' },
          //   { en: 'Public-facing programs and streetscape quality improved', zh: '面向公众的功能与街道品质持续提升' },
          // ],
        
          media: [
            {
              id: 'liyumen-stage-1-media-1',
              src: '/assets/station-details/shuibeiArea/Shuibei/Section 4/1.png',
              caption: {
                en: 'Schematic diagram of the renovation project area (A: IBC Global Business Center, B: Dushu Village, C: Shuibei Village, D: Yuhongtian Plastics Factory, E: Jinli Jewelry Trading Center, F: Tefu Bonded Gold and Jewelry Industrial Center City)',
                zh: '改造项目区域示意图（A：IBC 环球商务中心，B：独树村，C：水贝村，D：宇宏天塑胶厂，E：金丽珠宝交易中心，F：特发保税黄金珠宝产业中心城市）',
              },
                figureName: { en: 'Figure 5', zh: '图5' },
            },
          ],
          remoteSensing: {
            figureName: { en: 'Figure 1', zh: '图1' },
            title: {
              en: 'Remote sensing pair for Stage 4',
              zh: '第四阶段遥感对照',
            },
            description: {
              en: 'Compare the area baseline and later urban density shift using paired remote sensing snapshots.',
              zh: '通过前后两期遥感影像对照，观察片区基线状态与后续密度变化。',
            },
            before: {
              src: '/assets/station-details/shuibeiArea/Remote sensing/1.png',
              caption: {
                en: 'Baseline remote sensing snapshot (2002).',
                zh: '基线遥感影像（2002）。',
              },
            },
            after: {
              src: '/assets/station-details/shuibeiArea/Remote sensing/6.png',
              caption: {
                en: 'Later remote sensing snapshot (2024).',
                zh: '后期遥感影像（2024）。',
              },
            },
          },
        },
      ],
    },
  ],

  //Section 3: Area and thematic map relationships
  thematicRelations: [
    {
      id: 'shuibeiArea-concepts',
      title: {
        en: 'Concepts and considerations during subway planning',
        zh: '地铁规划中的概念与考量',
      },
      summary: {
        en: 'This card can explain how station access supports business concentration, waterfront programs, and cross-district movement in the Qianhaiwan area.',
        zh: '该卡片可说明站点可达性如何支撑前海湾片区的商务集聚、滨水功能与跨片区流动。',
      },
      tags: [
        { en: 'Waterfront mobility', zh: '滨水出行' },
        { en: 'Business district', zh: '商务片区' },
        { en: 'Cross-district reach', zh: '跨片区触达' },
      ],
      paragraphs: [
        {
          en: 'The "Shenzhen Urban Master Plan (1996-2010)" proposed that the urban spatial structure should shift from early sprawling expansion to a "linear cluster" development, urgently requiring high-capacity rail transit to connect the city center, alleviate cross-district commuting, and guide functional optimization. In the first edition of the Shenzhen Rail Transit Plan in 1996, Line 3 was positioned as a dedicated radial line for Luohu District. Its initial route started at Caiwuwei, passed through what is now Honghu Station, turned onto Wenjin North Road, and ran along National Highway G205, with approximately 80% of its route overlapping with existing transportation corridors in the area. During the planning stage, a route comparison was conducted between "building a station at what is now Honghu Station" and "building a station at what is now Tianbei Station," with the core consideration being to match the development axis formed along the national highway and meet the potentially huge passenger flow demand in the Shuibei-Tianbei area. It is worth noting that Line 3 was explicitly planned as a high-capacity line at that time, a stark contrast to Lines 5 and 6, which were positioned as light rail at the same time. This also indirectly confirms the important position of this area in Shenzhen\'s overall urban transportation network. By 2000, with the implementation of the second phase of the Shenzhen Metro construction plan, Line 3\'s Luohu section underwent significant adjustments: the starting point was changed to Laojie Station, and the line extended to Caopu via Dongmen Middle Road, Cuizhu Road, and Buxin Road.',
          zh: '该专题条目可按博客章节方式编写：先从站点服务范围切入，再说明滨水就业、休闲目的地与换乘逻辑如何叠合为同一出行场域。',
        },
        {
          en: 'The final station layout was as follows: Tianbei Station was arranged north-south along Cuizhu Road, Honghu Station served as a key turning point, and Shuibei Station served the industrial area north of Buxin Road. This adjustment aligns with the "Review and Countermeasures of Shenzhen\'s Urban Master Plan," which positions the eastern development axis as "the gateway connecting the Pearl River Delta to eastern Guangdong and an important industrial base." It also closely matches the actual conditions of each area: Shuibei area was explicitly planned by the government as a "gold and jewelry industry cluster base" in the late 1990s and incorporated into Shenzhen\'s strategy for the transformation and upgrading of its advantageous traditional industries; Tianbei area spontaneously formed a "building materials street" in the 1980s, taking advantage of the special economic zone\'s construction boom, and was positioned as a professional trade distribution center serving the city\'s construction needs; while Honghu Park, the core of Honghu area, has had its public attributes as an "urban ecological green lung and municipal leisure park" continuously strengthened in urban planning over the years.',
          zh: '该专题条目可按博客章节方式编写：先从站点服务范围切入，再说明滨水就业、休闲目的地与换乘逻辑如何叠合为同一出行场域。',
        },
        {
          en: 'This also indirectly confirms the important position of this area in Shenzhen\'s overall urban transportation network. By 2000, with the implementation of the second phase of the Shenzhen Metro construction plan, Line 3\'s Luohu section underwent significant adjustments: the starting point was changed to Laojie Station, and the line extended to Caopu via Dongmen Middle Road, Cuizhu Road, and Buxin Road. The final station layout was as follows: Tianbei Station was arranged north-south along Cuizhu Road, Honghu Station served as a key turning point, and Shuibei Station served the industrial area north of Buxin Road. This adjustment aligns with the "Review and Countermeasures of Shenzhen\'s Urban Master Plan," which positions the eastern development axis as "the gateway connecting the Pearl River Delta to eastern Guangdong and an important industrial base." It also closely matches the actual conditions of each area: Shuibei area was explicitly planned by the government as a "gold and jewelry industry cluster base" in the late 1990s and incorporated into Shenzhen\'s strategy for the transformation and upgrading of its advantageous traditional industries; Tianbei area spontaneously formed a \'building materials street\' in the 1980s, taking advantage of the special economic zone\'s construction boom, and was positioned as a professional trade distribution center serving the city\'s construction needs; while Honghu Park, the core of Honghu area, has had its public attributes as an \'urban ecological green lung and municipal leisure park\' continuously strengthened in urban planning over the years.. ',
          zh: '图表与影像建议结合阅读：柱条体现相对强度，地图图解则解释这些峰值在空间上的发生位置。',
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
      id: 'shuibeiArea-significance',
      title: {
        en: 'The significance and impact of the subway opening on the area',
        zh: '地铁开通对片区的意义与影响',
      },
      summary: {
        en: 'Use this thematic card for mapping the transition from infrastructure-led land preparation to denser urban programming around the station corridor.',
        zh: '该专题卡可用于绘制从基础设施主导的土地准备阶段，到站点走廊周边更高密度城市功能形成的过程。',
      },
      tags: [
        { en: 'Land transition', zh: '用地转型' },
        { en: 'Density growth', zh: '密度增长' },
        { en: 'Station corridor', zh: '站点走廊' },
      ],
      paragraphs: [
        {
          en: 'The opening of the subway has had a transformative impact. The opening of the Shuibei and Tianbei subway stations has reduced the rail travel time between this area and major transportation hubs such as Luohu Port and Shenzhen North Railway Station to within 20 minutes. This has led to an accelerated restructuring of urban functions. Shuibei Station, through a "railway + property" model, has transformed the former old industrial area into a cluster of urban landmarks, including the IBC Building and the Shuibei International Center, among other high-rise buildings. The IBC Global Business Center, which opened in 2017, has attracted the headquarters of numerous listed jewelry companies such as Chow Tai Fook and Aidi\'er, forming a complete industrial chain encompassing "design and R&D - exhibition and trading - brand operation." Meanwhile, the area surrounding Tianbei Station is exhibiting a mixed and diversified transformation path: on the one hand, traditional building materials and home furnishing businesses have not completely disappeared under the impact of e-commerce, but have instead upgraded and iterated towards experiential and service-oriented directions such as high-end building materials display and whole-house customized design; on the other hand, a more significant trend is that, under the planning radiation of the "Shuibei-Buxin International Jewelry Industry Cluster Area," the Tianbei area, with its convenience of being only one stop away from Shuibei Station, has begun to undertake the extension and supporting functions of the jewelry industry chain. Newly built community commercial buildings (such as the commercial podium of Tianbei Garden) and renovated spaces have attracted a large number of jewelry design studios, e-commerce live streaming, supporting processing, and small showrooms, forming an industrial extension belt that complements the core area.',
          zh: '地铁开通后带来的影响是变革性的。水贝地铁站和田贝地铁站的开通，使该片区与罗湖口岸、深圳北站等重要枢纽的轨道连接时间缩短至20分钟内。随之而来的是城市功能的加速重构。水贝站通过“轨道+物业”模式，将原老旧工业区改造为包括IBC大厦、水贝国际中心等超高层建筑组成的城市地标群。其中IBC环球商务中心于2017年投入使用，吸引了周大生、爱迪尔等众多上市珠宝企业总部入驻，形成了“设计研发-展示交易-品牌运营”的完整产业链。与此同时，田贝站周边则呈现出一种混合而多元的转型路径：一方面，传统的建材家居业态在电商冲击下并未完全消失，而是向着高端建材展示、全屋定制设计等体验式、服务型方向升级迭代；另一方面，更显著的趋势是，在“水贝-布心国际珠宝产业集聚区”的规划辐射下，田贝片区凭借与水贝站仅一站之隔的便利，开始承接珠宝产业链的延伸与配套功能。新建的社区商业（如田贝花园商业裙楼）及更新后的空间，吸引了大量珠宝设计工作室、电商直播、配套加工及小型展厅入驻，形成了与核心区互补的产业延伸带。',
        },
        {
          en: 'The opening of Metro Line 3 directly boosted property prices in the Shuibei and Tianbei areas. Taking the area around Shuibei Station as an example, the average price of secondhand homes was approximately 20,000 yuan per square meter in 2010, before the metro opened. With the metro\'s operation starting in 2011 and the upgrading and transformation of the area\'s jewelry industry, the average price rapidly rose to approximately 40,000 yuan per square meter by 2014, more than doubling in four years (Figure 25). The neighboring Tianbei Station area also showed a similar appreciation trajectory, with property prices more than doubling from a low point in 2010 to 2017 (Figure 26). This clearly demonstrates that the metro is not only a transportation artery but also a key engine driving the functional transformation and asset value reassessment of the area.',
          zh: '地铁3号线的开通对水贝、田贝片区房价产生了直接的提升效应。以水贝站周边为例，其二手房均价在地铁开通前的2010年约为每平方米2万元。随着地铁在2011年开通运营，以及片区珠宝产业的升级转型，至2014年，均价已快速上涨至约每平方米4万元，四年内实现翻倍增长（图25）。邻近的田贝站片区也表现出相似的增值轨迹，其房价从2010年的低位，至2017年上涨超过两倍（图26）。这清晰地印证了，地铁不仅是交通动脉，更是推动片区功能转型与资产价值重估的关键引擎。',
        },
        {
          en: 'The opening of Metro Line 3 directly boosted property prices in the Shuibei and Tianbei areas. Taking the area around Shuibei Station as an example, the average price of secondhand homes was approximately 20,000 yuan per square meter in 2010, before the metro opened. With the metro\'s operation starting in 2011 and the upgrading and transformation of the area\'s jewelry industry, the average price rapidly rose to approximately 40,000 yuan per square meter by 2014, more than doubling in four years (Figure 25). The neighboring Tianbei Station area also showed a similar appreciation trajectory, with property prices more than doubling from a low point in 2010 to 2017 (Figure 26). This clearly demonstrates that the metro is not only a transportation artery but also a key engine driving the functional transformation and asset value reassessment of the area.',
          zh: '地铁3号线的开通对水贝、田贝片区房价产生了直接的提升效应。以水贝站周边为例，其二手房均价在地铁开通前的2010年约为每平方米2万元。随着地铁在2011年开通运营，以及片区珠宝产业的升级转型，至2014年，均价已快速上涨至约每平方米4万元，四年内实现翻倍增长（图25）。邻近的田贝站片区也表现出相似的增值轨迹，其房价从2010年的低位，至2017年上涨超过两倍（图26）。这清晰地印证了，地铁不仅是交通动脉，更是推动片区功能转型与资产价值重估的关键引擎。',
        },
      ],
      galleries: [
        {
          id: 'shuibeiArea-change-gallery-group-1',
          items: [
            {
              id: 'shuibeiArea-change-gallery-1',
              src: '/assets/station-details/shuibeiArea/Comparison/Section 2/1_1.png',
              caption: {
                en: 'Densified urban blocks near station corridor',
                zh: '站点走廊周边增密后的城市街区',
              },
                figureName: { en: 'Figure 6', zh: '图6' },
            },
            {
              id: 'shuibeiArea-change-gallery-2',
              src: '/assets/station-details/shuibeiArea/Comparison/Section 2/1_2.png',
              caption: {
                en: 'Earlier land structure before densification',
                zh: '增密前的早期土地结构',
              },
                figureName: { en: 'Figure 7', zh: '图7' },
            },
          ],
        },
        {
          id: 'shuibeiArea-change-gallery-group-2',
          items: [
            {
              id: 'shuibeiArea-change-gallery-3',
              src: '/assets/station-details/shuibeiArea/Comparison/Section 2/2_1.png',
              caption: {
                en: 'Densified urban blocks near station corridor',
                zh: '站点走廊周边增密后的城市街区',
              },
                figureName: { en: 'Figure 8', zh: '图8' },
            },
            {
              id: 'shuibeiArea-change-gallery-4',
              src: '/assets/station-details/shuibeiArea/Comparison/Section 2/2_2.png',
              caption: {
                en: 'Earlier land structure before densification',
                zh: '增密前的早期土地结构',
              },
                figureName: { en: 'Figure 9', zh: '图9' },
            },
          ],
        },
        {
          id: 'shuibeiArea-change-gallery-group-3',
          items: [
            {
              id: 'shuibeiArea-change-gallery-5',
              src: '/assets/station-details/shuibeiArea/Comparison/Section 2/3.png',
              caption: {
                en: 'Densified urban blocks near station corridor',
                zh: '站点走廊周边增密后的城市街区',
              },
                figureName: { en: 'Figure 10', zh: '图10' },
            },
          ],
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

  //Sextion 4: References and further reading
  references: [
    {
      id: 'shuibeiArea-references',
      title: {
        en: 'References and further reading',
        zh: '田野观察路线',
      },
      detail: {
        en: '[] Shenzhen Planning and Land Development Research Center. Overview of Shenzhen Villages: Volume 2, Luohu and Yantian [M]. Guangzhou: South China University of Technology Press, 2020. [] A city surrounded by gold and jewels - Shuibei Village [EB/OL]. (2017-08-23) [2024-03-24]. https://www.sohu.com/a/166723616_99950450. [] Li Jie. Creating a beautiful world - a record of Shenzhen Shuibei Industrial Zone and its "head" Wu Yicheng [J]. China Talents, 1998(08):34-36. [] Wang Zhan. "Industrial transformation" upgrade and transformation must make breakthroughs [N]. Shenzhen Business Daily, 2009-05-06 (A02). [] Shenzhen invests tens of millions of yuan to build Shuibei "treasure trove" [N]. Guangzhou Daily, 2005-04-05. [] Ancient yet rising, how Shenzhen Shuibei Jewelry overcame its downturn [Z/OL]. Jiemian News, 2019-05-11. (2019-05-11) [2024-03-24] https://www.jiemian.com/article/3117951.html [] Proposal on accelerating the construction of an international consumption center [EB/OL]. Shenzhen Municipal CPPCC, 2017-12-20. (2017-12-20) [2024-03-24] https://www.szzx.gov.cn/content/2017-12/20/content_18053790.htm [] 10 years of investment of 130 billion yuan to rebuild "New Luohu" [EB/OL]. Shenzhen Business Daily, 2010-08-12. (2010-08-12) [2024-03-24] [] It\'s so difficult! After 8 years and 3 years of construction, the 180,000-square-meter urban renewal project in Luohu is finally nearing completion [Z/OL]. Sohu News, 2020-09-12. (2020-09-12) [2024-03-24] https://www.sohu.com/a/418030320_664214 [] Dushu Sunshine Lane launches 445 residential units, starting at 64,900 yuan/㎡ [EB/OL]. (2021-12-10) [2024-03-24]. https://sz.leju.com/news/2021-11-26/10206869822081627115927.shtml. [] Shenzhen Shuibei: The "besieged on all sides" and "not seeking fame" of the golden "Huaqiangbei" [EB/OL]. Tencent.com, 2022-07-06.( 2022-07-06)[2024-03-24]https://new.qq.com/rain/a/20220706A02LYD00 [] Shenzhen Planning and Land Development Research Center. Overview of Shenzhen Villages - Luohu and Yantian Volume [M]. Guangzhou: South China University of Technology Press, 2020. [] Urban New Village - Tianbei [J]. Economic Frontier, 2002, (06):80-81. [] Huanran. Everyone should start building materials along the coast quickly [J]. China Building Materials, 1985, (05):7.DOI:10.16291/j.cnki.zgjc.1985.05.003. [] Huanran. Everyone should start building materials in coastal areas quickly [J]. China Building Materials, 1985, (05):7. DOI:10.16291/j.cnki.zgjc.1985.05.003. [] Chen Huanzhi. An effective way to develop building materials in special economic zones is to introduce foreign investment and combine domestic and industrial trade [J]. China Building Materials, 1985, (12):27-28. DOI:10.16291/j.cnki.zgjc.1985.12.022. [] Yuan Lianggang, Fan Peng, Ye Haitang. The foundation stone laying ceremony for the reconstruction and renovation project of Tianbei New Village was held [N]. Shenzhen Special Zone Daily, 2007-02-12 (A10). [] Securities Times. 25 years of memories come to an end! The first Walmart in mainland China "exits" the market, what is the reason? Sam\'s Club continues to expand [EB/OL]. (2021-11-24) [2024-03-24]. https://baijiahao.baidu.com/s?id=1717316017958985394. [] Tianbei Garden successfully topped out yesterday [N/OL]. Shenzhen Special Zone Daily, 2008-09-18 [2024-03-24]. https://news.sina.com.cn/o/2008-09-18/072414464283s.shtml. [] Southern Daily. Thirty Years of Harmony and Happiness: Deciphering the "Tianbei Model" [EB/OL]. (2010-08-18) [2024-03-24]. https://news.sina.com.cn/s/2010-08-18/082417982555s.shtml. [] Effectively drives the upgrading of the industrial structure of the area [N/OL]. Shenzhen Special Zone Daily, 2007-02-12 [2024-03-24]. https://news.sina.com.cn/s/2007-02-12/053011220703s.shtml. [] Wang Doutian, Wan Hongtao. Shenzhen Tianbei Building Materials Village to be transformed into Jewelry Village after obtaining a 500 million yuan credit line from commercial banks [N]. China Mining News, 2007-07-07 (C01). [] Wang Doutian, Wan Hongtao. Shenzhen Tianbei Building Materials Village to be transformed into Jewelry Village after obtaining a 500 million yuan credit line from commercial banks [N]. China Mining News, 2007-07-07 (C01). [] Mature market and complete supporting facilities [N/OL]. Shenzhen Special Zone Daily, 2012-02-24 [2024-03-24]. https://news.ifeng.com/c/7fbWaaNX0Gt. [] Niu Haosi - Pioneer of Urban Renewal. The implementing entity for the Luohu "Industrial to Commercial" project is announced; Country Garden is expanding into Shenzhen\'s core area! [EB/OL]. (2018-04-09)[2024-03-24]. https://news.szhome.com/276434.html. [] Jinzuan Haoyuan Urban Renewal Project Achieves New Progress: Phase I Signing Rate Reaches 100% [EB/OL]. (2018-03-08)[2024-03-24]. https://dc.sznews.com/content/mb/2018-03/08/content_18611691.htm. [] Jinzuan Haoyuan, One of the First Batch of Urban Renewal Projects in Shenzhen, Will Build Shenzhen\'s Tallest Residential Building [EB/OL]. (2018-03-09)[2024-03-24]. https://news.ycwb.com/2018-03/09/content_26089354.htm. [] Shenzhen Luohu District Economic Promotion Bureau. Luohu plans to improve the quality of Shuibei-Buxin area and create a jewelry ecological creative city [EB/OL]. 2016-05-19. https://www.szlh.gov.cn/qgbmxxgkml/qgyhxxhj/zwxx/tzgg/content/post_4513135.html. [] Yang Jiafei. Waterlogging, siltation, pollution and its treatment in Honghu [J]. Environment, 1995, (03): 22-23. Liu Xinyu. A study on the socio-natural evolution of urban parks in Shenzhen (1980-2020) [D]. Southeast University, 2024. DOI:10.27014/d.cnki.gdnau.2024.000413. [] Shenzhen Yearbook 1985, p. 363 [] Shenzhen Yearbook 1985, p. 456 Liu Xinyu. A Study on the Socio-Natural Evolution of Urban Parks in Shenzhen (1980-2020) [D]. Southeast University, 2024. DOI:10.27014/d.cnki.gdnau.2024.000413.[] Yang Jiafei. Flooding, Siltation, Pollution and Remediation of Honghu Lake [J]. Environment, 1995, (03):22-23.[] Yang Jiafei. Practice and Experience in Building Parks Using Flood Detention Areas [J]. Guangdong Landscape Architecture, 1994, (04):45-46.[] Li Shangzhi. Research on Ecological Restoration of Polluted Water Bodies Using Aquatic Plants [J]. Flower and Bonsai (Flower and Horticulture), 2006, (05):8-10.[] Li Shangzhi. Green Grass Grows on Blue Waves Again - Pollution Control of Landscape Water Bodies in Honghu Park, Shenzhen [J]. Landscape Architecture, 2010, (08):12-16.[] Nansha Original Architectural Design Studio. Shenzhen Lotus Culture Base: Upper Landscape of Honghu Park Water Purification Plant, Shenzhen, Guangdong, China [J]. World Architecture, 2024, (12): 26-31. DOI:10.16414/j.wa.2024.12.014.[] Tang Yongqiong, Han Xu, Zhu Ruisong, et al. Evaluation Report on the Usage Status of Honghu Park, Shenzhen [J]. Guangdong Forestry Science and Technology, 2009, 25(04):44-50.[] Zhao Xinming, Zhang Ming. Honghu Park “International Lotus Party” Welcomes 60,000 Visitors in Three Days [N]. Shenzhen Special Zone Daily, 2025-06-16(A05).DOI:10.28776/n.cnki.nsztq.2025.004524.',
        zh: '[] 深圳市规划国土发展研究中心. 深圳村落概览：第二辑 罗湖盐田卷[M]. 广州: 华南理工大学出版社, 2020. [] 一座被黄金珠宝包围的城——水贝村[EB/OL]. (2017-08-23)[2024-03-24]. https://www.sohu.com/a/166723616_99950450. [] 李杰.创建一方美好的天地——记深圳市水贝工业区及其“当家人”吴沂城[J].中国人才,1998(08):34-36.[] 王湛. “工改工”z升级改造要有突破[N]. 深圳商报,2009-05-06(A02). [] 深千万元打造水贝“聚宝盆”[N]. 广州日报,2005-04-05. [] 古老而朝阳，深圳水贝珠宝如何穿越低谷期[Z/OL]. 界面新闻, 2019-05-11.( 2019-05-11)[2024-03-24] https://www.jiemian.com/article/3117951.html [] 关于加快打造国际消费中心的提案[EB/OL]. 深圳市政协, 2017-12-20.( 2017-12-20)[2024-03-24] https://www.szzx.gov.cn/content/2017-12/20/content_18053790.htm []  10年投入1300亿再造“新罗湖”[EB/OL]. 深圳商报, 2010-08-12.( 2010-08-12)[2024-03-24] [] 太难了！历经8年，开工3年，罗湖18万平旧改终于快出地面[Z/OL]. 搜狐新闻, 2020-09-12.( 2020-09-12)[2024-03-24]https://www.sohu.com/a/418030320_664214 [] 独树阳光里推445套住宅，单价6.49万/㎡起[EB/OL]. (2021-12-10)[2024-03-24]. https://sz.leju.com/news/2021-11-26/10206869822081627115927.shtml. [] 深圳水贝：黄金界“华强北”的“腹背受敌”与“不求闻达”[EB/OL]. 腾讯网, 2022-07-06.( 2022-07-06)[2024-03-24]https://new.qq.com/rain/a/20220706A02LYD00 [] 深圳市规划国土发展研究中心. 深圳村落概览——罗湖盐田卷[M]. 广州: 华南理工大学出版社, 2020. [] 都市新村——田贝[J].经济前沿,2002,(06):80-81. [] 焕然.大家办建材沿海要快上[J].中国建材,1985,(05):7.DOI:10.16291/j.cnki.zgjc.1985.05.003. [] 焕然.大家办建材沿海要快上[J].中国建材,1985,(05):7.DOI:10.16291/j.cnki.zgjc.1985.05.003. [] 陈焕志.发展特区建材的有效途径外引内联工贸结合[J].中国建材, 1985,(12):27-28.DOI:10.16291/j.cnki.zgjc.1985.12.022. [] 袁粮钢,樊鹏,叶海棠.田贝新村重建改造工程隆重奠基[N].深圳特区报,2007-02-12(A10). [] 证券时报. 25年回忆终结！内地首家沃尔玛“退场”，什么原因？山姆店却在持续扩张[EB/OL]. (2021-11-24)[2024-03-24]. https://baijiahao.baidu.com/s?id=1717316017958985394. [] 田贝花园昨日顺利封顶[N/OL]. 深圳特区报, 2008-09-18[2024-03-24]. https://news.sina.com.cn/o/2008-09-18/072414464283s.shtml. [] 南方日报. 和谐幸福三十年: 解密“田贝模式”[EB/OL]. (2010-08-18)[2024-03-24]. https://news.sina.com.cn/s/2010-08-18/082417982555s.shtml. [] 有效带动片区产业结构升级[N/OL]. 深圳特区报, 2007-02-12[2024-03-24]. https://news.sina.com.cn/s/2007-02-12/053011220703s.shtml. [] 王斗天,万鸿涛.获商业银行5亿元信贷额度深圳田贝建材村将转型珠宝村[N].中国矿业报,2007-07-07(C01). [] 王斗天,万鸿涛.获商业银行5亿元信贷额度深圳田贝建材村将转型珠宝村[N].中国矿业报,2007-07-07(C01). [] 市场成熟 配套齐全[N/OL]. 深圳特区报, 2012-02-24[2024-03-24]. https://news.ifeng.com/c/7fbWaaNX0Gt. [] 牛浩思-旧改先锋. 罗湖“工改商”项目实施主体公示，碧桂园布局深圳核心区域！[EB/OL]. (2018-04-09)[2024-03-24]. https://news.szhome.com/276434.html. [] 金钻豪园旧改迎来新进展 项目一期签约“双100%”[EB/OL]. (2018-03-08)[2024-03-24]. https://dc.sznews.com/content/mb/2018-03/08/content_18611691.htm. [] 深圳城市更新首批旧改项目 金钻豪园将建深圳最高住宅楼[EB/OL]. (2018-03-09)[2024-03-24]. https://news.ycwb.com/2018-03/09/content_26089354.htm. [] 深圳市罗湖区经济促进局。罗湖拟提质水贝 - 布心片区打造珠宝生态创意城区 [EB/OL]. 2016-05-19. https://www.szlh.gov.cn/qgbmxxgkml/qgyhxxhj/zwxx/tzgg/content/post_4513135.html. [] 杨家飞.洪湖内涝、淤积、污染及其整治[J].环境,1995,(03):22-23. 刘新宇. 深圳市城市公园中的社会-自然演变研究（1980-2020）[D]. 东南大学, 2024. DOI:10.27014/d.cnki.gdnau.2024.000413.[] 《深圳年鉴 1985》，第363页 [] 《深圳年鉴 1985》，第456页刘新宇. 深圳市城市公园中的社会-自然演变研究（1980-2020）[D]. 东南大学, 2024. DOI:10.27014/d.cnki.gdnau.2024.000413.[] 杨家飞.洪湖内涝、淤积、污染及其整治[J].环境,1995,(03):22-23.[] 杨家飞.利用滞洪区建造公园的实践与体会[J].广东园林,1994,(04):45-46.[] 李尚志.利用水生植物对污染水体进行生态修复的研究[J].花木盆景(花卉园艺),2006,(05):8-10. [] 李尚志.又见青草生碧波——深圳洪湖公园景观水体的污染控制[J].园林,2010,(08):12-16.[] 南沙原创建筑设计工作室. 深圳荷水文化基地：洪湖公园水质净化厂上部景观，深圳，广东，中国 [J]. 世界建筑, 2024, (12): 26-31. DOI:10.16414/j.wa.2024.12.014.[] 唐永琼,韩旭,祝瑞松,等.深圳市洪湖公园使用状况评价报告[J].广东林业科技,2009,25(04):44-50.[] 赵新明,张铭.洪湖公园“国际荷花派对”三天迎客六万[N].深圳特区报,2025-06-16(A05).DOI:10.28776/n.cnki.nsztq.2025.004524.',
      },
    },
  ],
};
