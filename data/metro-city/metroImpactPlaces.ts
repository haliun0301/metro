export interface MetroImpactPlace {
  id: string;
  nameZh: string;
  coordinates: [number, number];
  mentions: number;
  radius: number;
  notesZh: string[];
}

export const METRO_IMPACT_PLACES: MetroImpactPlace[] = [
  {
    "id": "impact-001",
    "nameZh": "东门/老街",
    "coordinates": [
      22.5470489,
      114.1158592
    ],
    "mentions": 12,
    "radius": 35,
    "notesZh": [
      "1.\t东门到莲塘线路（东门中路-怡景路-罗沙路）修地铁时路难走，现在路况宽敞好走。—— sustech_LHY_2",
      "2.\t老东门因地铁更方便，人流增加。—— SUSTech_LJS_小江",
      "3.\t东门仍繁华但商场被地铁上盖取代。—— SZTU_CXY_1",
      "4.\t东门/国贸：人变多了。—— SZTU_TJF_1",
      "5.\t东门：人流减少，商业衰落(被分散)。—— szulys_乔麦",
      "6.\t东门：1985年楼房不高，办公楼无电梯、无空调；现在高楼林立。—— SZTU_LX_何爷爷",
      "7.\t东门/老街：早期地铁刚建好时\"更拥挤\"（受访者2004前在老街开服装店，生意好，后因非典/租金贵等退出）。后期\"地铁越建越多，来老街的人少了\"。在交通层面，过去大家坐巴士/开车来，东门路况差、常堵车、停车难，地铁改善了这一情况。—— SZUH_YUNWEI",
      "8.\t各区形成自己的商业体系（如龙岗coco park、万象汇），不再为特定的店铺跨区去东门；罗湖（东门）作为单一的商业中心\"慢慢退了\"。—— SZUH_LEI",
      "9.\t罗湖东门：地铁开通后愿意去罗湖买菜，老市中心街道窄、停车难，地铁解决了停车问题。—— PKU+DYE_Xin",
      "10.\t\"地铁经过能带动经济/商业流通/人员流通/物业升值\"，例如东门、华强北，这些重要的商业区都有站点，方便购物/旅游（尤其提到香港人来东门购物休闲）。—— SZU_XZA_HE",
      "11.\t地铁开通后，以前繁华的老商业区（例如国贸、老街）现在变得静悄悄了。—— SZTU_CXY_2",
      "12.\t地铁建成后，老街人流激增。—— hkust_wdq_q"
    ]
  },
  {
    "id": "impact-002",
    "nameZh": "布吉站/布吉关/深圳东站",
    "coordinates": [
      22.6053412,
      114.1165708
    ],
    "mentions": 11,
    "radius": 32.55,
    "notesZh": [
      "1.\t关外，尤其是龙岗大道一带，修3号线前更\"破旧\"，出布吉关后外面像农村，地铁的规划/建设带来沿线房价翻倍与快速发展。—— wu-jiang_小z和他的父亲",
      "2.\t布吉：地铁建设前后，工业区/烂尾楼被拆除了。—— WZY_麦",
      "3.\t布吉/坂田: 地铁缓解了严重的交通拥堵 (以前关口非常堵)。—— JNU_LLW_RRAY",
      "4.\t布吉 (百鸽笼/东站): 以前脏乱差，通地铁后市容改善很多。—— JNU_LLW_DB",
      "5.\t布吉/百鸽笼: 地铁通了，万象汇建成了，人流变多，带动了经济发展。—— SZTUWWX_陈女士",
      "6.\t布吉站: 人流量巨大，换乘拥挤。百鸽笼万象汇开业带动了偏僻区域的发展，但也带来噪音/粉尘。—— SZTUWWX_许女士",
      "7.\t布吉站：随着地铁开通，老旧房子拆迁改建成高楼和商圈，环境得到翻新升级。—— UT_LJY_XW",
      "8.\t布吉: 以前脏乱差（出关），现在通地铁后改善很多。—— SZTU+CS+尤老师",
      "9.\t5号线打通了关内关外（布吉—罗湖—宝安），跨区便捷性提升。—— SZTULJK_LJP",
      "10.\t布吉：地铁线路扩张后，从有检查亭[布吉关]、脏乱杂、分散着大量小工厂，变为生活更便利、配套丰富，作为交通枢纽吸引年轻务工者居住（房租较便宜+通达性）。—— SZTULJK_LDH",
      "11.\t布吉：[跟撤关之前比]仍旧拥挤，地铁使其交通发达，人群密集度极高。——PKU+DYE_Suning"
    ]
  },
  {
    "id": "impact-003",
    "nameZh": "华强北",
    "coordinates": [
      22.5456566,
      114.0816792
    ],
    "mentions": 9,
    "radius": 27.64,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-004",
    "nameZh": "深圳北站",
    "coordinates": [
      22.6120365,
      114.0239469
    ],
    "mentions": 7,
    "radius": 22.73,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-005",
    "nameZh": "大运",
    "coordinates": [
      22.6983619,
      114.2156531
    ],
    "mentions": 6,
    "radius": 20.27,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-006",
    "nameZh": "坂田站",
    "coordinates": [
      22.6302982,
      114.0666359
    ],
    "mentions": 5,
    "radius": 17.82,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-007",
    "nameZh": "宝安中心",
    "coordinates": [
      22.5576373,
      113.8823152
    ],
    "mentions": 5,
    "radius": 17.82,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-008",
    "nameZh": "车公庙站",
    "coordinates": [
      22.538495,
      114.0232773
    ],
    "mentions": 5,
    "radius": 17.82,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-009",
    "nameZh": "观澜/观澜老街",
    "coordinates": [
      22.7176742,
      114.0490565
    ],
    "mentions": 5,
    "radius": 17.82,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-010",
    "nameZh": "莲塘",
    "coordinates": [
      22.5668762,
      114.1688677
    ],
    "mentions": 5,
    "radius": 17.82,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-011",
    "nameZh": "前海",
    "coordinates": [
      22.5267078,
      113.8929787
    ],
    "mentions": 5,
    "radius": 17.82,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-012",
    "nameZh": "世界之窗",
    "coordinates": [
      22.5375058,
      113.9686115
    ],
    "mentions": 5,
    "radius": 17.82,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-013",
    "nameZh": "会展中心（原泰然工业区）",
    "coordinates": [
      22.5374546,
      114.0559371
    ],
    "mentions": 4,
    "radius": 15.36,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-014",
    "nameZh": "机场/机场东站",
    "coordinates": [
      22.6503143,
      113.8170998
    ],
    "mentions": 4,
    "radius": 15.36,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-015",
    "nameZh": "后海",
    "coordinates": [
      22.521189,
      113.9386365
    ],
    "mentions": 4,
    "radius": 15.36,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-016",
    "nameZh": "盐田",
    "coordinates": [
      22.5590503,
      114.2324407
    ],
    "mentions": 4,
    "radius": 15.36,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-017",
    "nameZh": "益田/益田假日广场",
    "coordinates": [
      22.5401147,
      113.9705796
    ],
    "mentions": 4,
    "radius": 15.36,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-018",
    "nameZh": "百鸽笼站",
    "coordinates": [
      22.598003,
      114.1252688
    ],
    "mentions": 3,
    "radius": 12.91,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-019",
    "nameZh": "海岸城（南山）",
    "coordinates": [
      22.5199728,
      113.9320455
    ],
    "mentions": 3,
    "radius": 12.91,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-020",
    "nameZh": "红山站",
    "coordinates": [
      22.624764,
      114.0182466
    ],
    "mentions": 3,
    "radius": 12.91,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-021",
    "nameZh": "罗湖火车站/罗湖口岸",
    "coordinates": [
      22.5344874,
      114.1121107
    ],
    "mentions": 3,
    "radius": 12.91,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-022",
    "nameZh": "沙井",
    "coordinates": [
      22.7335893,
      113.8194007
    ],
    "mentions": 3,
    "radius": 12.91,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-023",
    "nameZh": "水贝",
    "coordinates": [
      22.5721534,
      114.119439
    ],
    "mentions": 3,
    "radius": 12.91,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-024",
    "nameZh": "西丽",
    "coordinates": [
      22.5836964,
      113.9494105
    ],
    "mentions": 3,
    "radius": 12.91,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-025",
    "nameZh": "壹方城",
    "coordinates": [
      22.5566076,
      113.883064
    ],
    "mentions": 3,
    "radius": 12.91,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-026",
    "nameZh": "布心站",
    "coordinates": [
      22.5839143,
      114.1329533
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-027",
    "nameZh": "大冲村/华润万象天地",
    "coordinates": [
      22.5473083,
      113.9512006
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-028",
    "nameZh": "大梅沙",
    "coordinates": [
      22.5969907,
      114.3030268
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-029",
    "nameZh": "大新村",
    "coordinates": [
      22.5353057,
      113.9131429
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-030",
    "nameZh": "福田保税区",
    "coordinates": [
      22.5077547,
      114.0463849
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-031",
    "nameZh": "福永",
    "coordinates": [
      22.674226,
      113.8177246
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-032",
    "nameZh": "岗厦",
    "coordinates": [
      22.5375885,
      114.0629464
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-033",
    "nameZh": "购物公园",
    "coordinates": [
      22.5384584,
      114.0486868
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-034",
    "nameZh": "国贸",
    "coordinates": [
      22.5424182,
      114.113907
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-035",
    "nameZh": "横岗/横岗工业区",
    "coordinates": [
      22.6512666,
      114.2041621
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-036",
    "nameZh": "华新站",
    "coordinates": [
      22.5519329,
      114.0808997
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-037",
    "nameZh": "深圳湾公园",
    "coordinates": [
      22.524511,
      113.9879908
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-038",
    "nameZh": "龙岗中心城",
    "coordinates": [
      22.7214745,
      114.2428036
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-039",
    "nameZh": "龙华中心区",
    "coordinates": [
      22.6245,
      114.0368
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-040",
    "nameZh": "梅林",
    "coordinates": [
      22.5731907,
      114.0469156
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-041",
    "nameZh": "梅林一村",
    "coordinates": [
      22.5692075,
      114.0319886
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-042",
    "nameZh": "坪地",
    "coordinates": [
      22.7772427,
      114.3046179
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-043",
    "nameZh": "上梅林",
    "coordinates": [
      22.5734691,
      114.0540993
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-044",
    "nameZh": "蛇口",
    "coordinates": [
      22.4793679,
      113.9062275
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-045",
    "nameZh": "市民中心",
    "coordinates": [
      22.5433288,
      114.0567044
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-046",
    "nameZh": "双龙",
    "coordinates": [
      22.7321795,
      114.2724238
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-047",
    "nameZh": "田贝",
    "coordinates": [
      22.5697945,
      114.1240869
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-048",
    "nameZh": "总部基地",
    "coordinates": [
      22.527994,
      113.9633397
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-049",
    "nameZh": "八卦岭",
    "coordinates": [
      22.5633758,
      114.0887947
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-050",
    "nameZh": "白石龙",
    "coordinates": [
      22.6039648,
      114.0373472
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-051",
    "nameZh": "白石洲",
    "coordinates": [
      22.5424968,
      113.9622543
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-052",
    "nameZh": "宝华",
    "coordinates": [
      22.544709,
      114.0823011
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-053",
    "nameZh": "碧头",
    "coordinates": [
      22.7859976,
      113.8183326
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-054",
    "nameZh": "春茧",
    "coordinates": [
      22.5216399,
      113.9459577
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-055",
    "nameZh": "大剧院",
    "coordinates": [
      22.5440073,
      114.102858
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-056",
    "nameZh": "大学城",
    "coordinates": [
      22.5852379,
      113.9609892
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-057",
    "nameZh": "丹竹头",
    "coordinates": [
      22.6222477,
      114.1426367
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-058",
    "nameZh": "丰盛町",
    "coordinates": [
      22.5381808,
      114.0197324
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-059",
    "nameZh": "福田口岸/高铁站",
    "coordinates": [
      22.5408927,
      114.0515417
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-060",
    "nameZh": "福田CBD（原田面村）",
    "coordinates": [
      22.5425993,
      114.0545869
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-061",
    "nameZh": "岗厦北",
    "coordinates": [
      22.5427932,
      114.0628443
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-062",
    "nameZh": "高新园",
    "coordinates": [
      22.5432309,
      113.9491278
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-063",
    "nameZh": "公明",
    "coordinates": [
      22.7808982,
      113.8861069
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-064",
    "nameZh": "固戍",
    "coordinates": [
      22.6023009,
      113.8431182
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-065",
    "nameZh": "海山站",
    "coordinates": [
      22.5583521,
      114.2328389
    ],
    "mentions": 2,
    "radius": 10.45,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-066",
    "nameZh": "海上世界",
    "coordinates": [
      22.4881293,
      113.9101589
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-067",
    "nameZh": "海雅缤纷城（宝安）",
    "coordinates": [
      22.5626768,
      113.9013128
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-068",
    "nameZh": "华侨城",
    "coordinates": [
      22.5364467,
      113.9804886
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-069",
    "nameZh": "黄贝岭",
    "coordinates": [
      22.5488036,
      114.1313834
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-070",
    "nameZh": "黄木岗站",
    "coordinates": [
      22.5585292,
      114.0816498
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-071",
    "nameZh": "科学馆",
    "coordinates": [
      22.5434997,
      114.0897618
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-072",
    "nameZh": "荔枝公园",
    "coordinates": [
      22.547729,
      114.0974321
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-073",
    "nameZh": "莲花山",
    "coordinates": [
      22.5561333,
      114.0543242
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-074",
    "nameZh": "留仙洞",
    "coordinates": [
      22.5847809,
      113.9390448
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-075",
    "nameZh": "龙岗同乐高速口",
    "coordinates": [
      22.7237774,
      114.2934921
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-076",
    "nameZh": "罗沙路",
    "coordinates": [
      22.5553134,
      114.1461694
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-077",
    "nameZh": "梅林关",
    "coordinates": [
      22.5972109,
      114.0480647
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-078",
    "nameZh": "民乐",
    "coordinates": [
      22.596962,
      114.0435655
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-079",
    "nameZh": "南山万象天地",
    "coordinates": [
      22.5449333,
      113.9511274
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-080",
    "nameZh": "南头古城",
    "coordinates": [
      22.5403527,
      113.9194304
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-081",
    "nameZh": "南油",
    "coordinates": [
      22.5135563,
      113.9212265
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-082",
    "nameZh": "南约",
    "coordinates": [
      22.6907639,
      114.272893
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-083",
    "nameZh": "坪山高铁站",
    "coordinates": [
      22.7083348,
      114.3227832
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-084",
    "nameZh": "坪山新区",
    "coordinates": [
      22.7113827,
      114.3461882
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-085",
    "nameZh": "前海湾",
    "coordinates": [
      22.5403059,
      113.8927681
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-086",
    "nameZh": "清湖",
    "coordinates": [
      22.6667447,
      114.0314394
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-087",
    "nameZh": "深业上城",
    "coordinates": [
      22.5601574,
      114.0651169
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-088",
    "nameZh": "深云村",
    "coordinates": [
      22.5574697,
      113.9878342
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-089",
    "nameZh": "生态公园",
    "coordinates": [
      22.5235728,
      113.9891747
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-090",
    "nameZh": "石龙仔",
    "coordinates": [
      22.7018371,
      113.9631704
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-091",
    "nameZh": "石岩",
    "coordinates": [
      22.6831561,
      113.9334539
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-092",
    "nameZh": "松岗",
    "coordinates": [
      22.7751914,
      113.8246153
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-093",
    "nameZh": "松元公园",
    "coordinates": [
      22.7237695,
      114.0596364
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-094",
    "nameZh": "塘朗",
    "coordinates": [
      22.5929153,
      113.994706
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-095",
    "nameZh": "桃园路（南山）",
    "coordinates": [
      22.5348512,
      113.9198665
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-096",
    "nameZh": "桃园站",
    "coordinates": [
      22.5348512,
      113.9198665
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-097",
    "nameZh": "桃源村",
    "coordinates": [
      22.5628537,
      113.9769577
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-098",
    "nameZh": "体育中心",
    "coordinates": [
      22.5610637,
      114.0865483
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-099",
    "nameZh": "万象城",
    "coordinates": [
      22.5422,
      114.1056
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-100",
    "nameZh": "蔚蓝海岸",
    "coordinates": [
      22.5131138,
      113.9303202
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-101",
    "nameZh": "西乡",
    "coordinates": [
      22.5784094,
      113.8577943
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-102",
    "nameZh": "西站",
    "coordinates": [
      22.5309237,
      113.9025318
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-103",
    "nameZh": "下沙",
    "coordinates": [
      22.5318034,
      114.0194736
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-104",
    "nameZh": "仙湖",
    "coordinates": [
      22.5790091,
      114.1770472
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-105",
    "nameZh": "盐田外国语高中部",
    "coordinates": [
      22.5847217,
      114.2413867
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-106",
    "nameZh": "怡景路",
    "coordinates": [
      22.5618819,
      114.131792
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-107",
    "nameZh": "渔农村",
    "coordinates": [
      22.5190595,
      114.0675251
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-108",
    "nameZh": "粤海门站",
    "coordinates": [
      22.5352661,
      113.944632
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-109",
    "nameZh": "中心公园A区",
    "coordinates": [
      22.5351775,
      114.0702403
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  },
  {
    "id": "impact-110",
    "nameZh": "卓悦汇",
    "coordinates": [
      22.5731072,
      114.0550764
    ],
    "mentions": 1,
    "radius": 8,
    "notesZh": [
      "More"
    ]
  }
];
