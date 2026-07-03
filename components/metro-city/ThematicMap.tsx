import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useAppLanguage, type AppLanguage } from '../../hooks/useAppLanguage';
import { STATIONS } from '../../data/metro-stations/stations';
import { THEMATIC_TOPICS } from '../../data/metro-city/thematicTopics';
import thematicMapHtml from '../../my-app/public/shenzhen_metro_impact_map.html?raw';

const customPlaceTranslations: Record<string, string> = {
  '东门/老街': 'Dongmen / Laojie',
  '布吉站/布吉关/深圳东站': 'Buji Station / Buji Checkpoint / Shenzhen East Railway Station',
  '深圳北站': 'Shenzhen North Station',
  '坂田站': 'Bantian Station',
  '车公庙站': 'Chegongmiao Station',
  '观澜/观澜老街': 'Guanlan / Guanlan Old Street',
  '前海': 'Qianhai',
  '会展中心（原泰然工业区）': 'Convention & Exhibition Center (Former Tairan Industrial Zone)',
  '机场/机场东站': 'Airport / Airport East Station',
  '盐田': 'Yantian',
  '益田/益田假日广场': 'Yitian / Yitian Holiday Plaza',
  '百鸽笼站': 'Baigelong Station',
  '海岸城（南山）': 'Coastal City (Nanshan)',
  '红山站': 'Hongshan Station',
  '罗湖火车站/罗湖口岸': 'Luohu Railway Station / Luohu Port',
  '壹方城': 'Yifang City',
  '布心站': 'Buxin Station',
  '大冲村/华润万象天地': 'Dachong Village / China Resources MixC World',
  '大新村': 'Daxin Village',
  '福田保税区': 'Futian Free Trade Zone',
  '横岗/横岗工业区': 'Henggang / Henggang Industrial Zone',
  '华新站': 'Huaxin Station',
  '龙岗中心城': 'Longgang Central City',
  '龙华中心区': 'Longhua Central Area',
  '梅林': 'Meilin',
  '梅林一村': 'Meilin No. 1 Village',
  '坪地': 'Pingdi',
  '蛇口': 'Shekou',
  '总部基地': 'Headquarters Base',
  '春茧': 'Spring Cocoon',
  '丰盛町': 'Fengshengting',
  '福田口岸/高铁站': 'Futian Port / High-Speed Rail Station',
  '福田CBD（原田面村）': 'Futian CBD (Former Tianmian Village)',
  '公明': 'Gongming',
  '海山站': 'Haishan Station',
  '海雅缤纷城（宝安）': "Haiya Mega Mall (Bao'an)",
  '黄木岗站': 'Huangmugang Station',
  '荔枝公园': 'Lizhi Park',
  '莲花山': 'Lianhuashan Park',
  '龙岗同乐高速口': 'Longgang Tongle Expressway Exit',
  '罗沙路': 'Luosha Road',
  '南山万象天地': 'Nanshan MixC World',
  '坪山高铁站': 'Pingshan High-Speed Rail Station',
  '坪山新区': 'Pingshan New District',
  '深业上城': 'UpperHills',
  '深云村': 'Shenyun Village',
  '生态公园': 'Ecological Park',
  '石龙仔': 'Shilongzai',
  '石岩': 'Shiyan',
  '松元公园': 'Songyuan Park',
  '桃园路（南山）': 'Taoyuan Road (Nanshan)',
  '桃园站': 'Taoyuan Station',
  '万象城': 'MixC',
  '蔚蓝海岸': 'Blue Coast',
  '西站': 'West Station',
  '仙湖': 'Fairy Lake',
  '盐田外国语高中部': 'Yantian Foreign Language High School',
  '怡景路': 'Yijing Road',
  '渔农村': 'Yucun Village',
  '粤海门站': 'Yuehaimen Station',
  '中心公园A区': 'Central Park Area A',
  '卓悦汇': 'Zhuoyue Hui',
};

const dongmenPopupZh = '1.\t东门到莲塘线路（东门中路-怡景路-罗沙路）修地铁时路难走，现在路况宽敞好走。—— sustech_LHY_2<br>2.\t老东门因地铁更方便，人流增加。—— SUSTech_LJS_小江<br>3.\t东门仍繁华但商场被地铁上盖取代。—— SZTU_CXY_1<br>4.\t东门/国贸：人变多了。—— SZTU_TJF_1<br>5.\t东门：人流减少，商业衰落(被分散)。—— szulys_乔麦<br>6.\t东门：1985年楼房不高，办公楼无电梯、无空调；现在高楼林立。—— SZTU_LX_何爷爷<br>7.\t东门/老街：早期地铁刚建好时&quot;更拥挤&quot;（受访者2004前在老街开服装店，生意好，后因非典/租金贵等退出）。后期&quot;地铁越建越多，来老街的人少了&quot;。在交通层面，过去大家坐巴士/开车来，东门路况差、常堵车、停车难，地铁改善了这一情况。—— SZUH_YUNWEI<br>8.\t各区形成自己的商业体系（如龙岗coco park、万象汇），不再为特定的店铺跨区去东门；罗湖（东门）作为单一的商业中心&quot;慢慢退了&quot;。—— SZUH_LEI<br>9.\t罗湖东门：地铁开通后愿意去罗湖买菜，老市中心街道窄、停车难，地铁解决了停车问题。—— PKU+DYE_Xin<br>10.\t&quot;地铁经过能带动经济/商业流通/人员流通/物业升值&quot;，例如东门、华强北，这些重要的商业区都有站点，方便购物/旅游（尤其提到香港人来东门购物休闲）。—— SZU_XZA_HE<br>11.\t地铁开通后，以前繁华的老商业区（例如国贸、老街）现在变得静悄悄了。—— SZTU_CXY_2<br>12.\t地铁建成后，老街人流激增。—— hkust_wdq_q';

const dongmenPopupEn = '1. When the line to Liantang (Dongmen Middle Road - Yijing Road - Luosha Road) was under construction, the roads were difficult to use; now they are much wider and easier to travel. — sustech_LHY_2<br>2. Old Dongmen became more accessible because of the metro, and foot traffic increased. — SUSTech_LJS_小江<br>3. Dongmen is still lively, but shopping malls have been replaced by metro over-site developments. — SZTU_CXY_1<br>4. Dongmen / Guomao: there are more people now. — SZTU_TJF_1<br>5. Dongmen: foot traffic declined and commercial activity weakened as it was dispersed elsewhere. — szulys_乔麦<br>6. Dongmen: in 1985 the buildings were not tall, offices had no elevators or air conditioning; now high-rises are everywhere. — SZTU_LX_何爷爷<br>7. Dongmen / Laojie: when the metro had just opened, it felt &quot;more crowded&quot; (the interviewee ran a clothing shop in Laojie before 2004 and later left because of SARS, high rent, and other reasons). Later, &quot;as more metro lines were built, fewer people came to Laojie.&quot; In transport terms, people used to come by bus or car, traffic conditions were poor, congestion was common, and parking was difficult. The metro improved this situation. — SZUH_YUNWEI<br>8. Each district developed its own commercial system (such as Longgang COCO Park and MixC One), so people no longer crossed districts for specific shops in Dongmen; Luohu (Dongmen) gradually declined as a single commercial center. — SZUH_LEI<br>9. Luohu Dongmen: after the metro opened, people were more willing to go to Luohu to buy groceries; the old city center had narrow streets and difficult parking, and the metro solved that problem. — PKU+DYE_Xin<br>10. &quot;Where the metro goes, it can boost the economy, commercial circulation, people flows, and property values,&quot; for example in Dongmen and Huaqiangbei. These important commercial areas all have stations, making shopping and tourism easier, especially for Hong Kong visitors coming to Dongmen. — SZU_XZA_HE<br>11. After the metro opened, formerly bustling old commercial districts such as Guomao and Laojie became much quieter. — SZTU_CXY_2<br>12. After the metro was completed, foot traffic in Laojie surged. — hkust_wdq_q';

const dongmenTooltipZh = '1.\t东门到莲塘线路（东门中路-怡景路-罗沙路）修地铁时路难走，现在路况宽敞好走。—— sustech_LHY_2<br>2.\t老东门因地铁更方便，人流增加。—— SUSTech_LJS_小江<br><br>... 共12条，点击查看全部';
const dongmenTooltipEn = '1. When the line to Liantang (Dongmen Middle Road - Yijing Road - Luosha Road) was under construction, the roads were difficult to use; now they are much wider and easier to travel. — sustech_LHY_2<br>2. Old Dongmen became more accessible because of the metro, and foot traffic increased. — SUSTech_LJS_小江<br><br>... 12 total, click to view all';

const bujiPopupZh = '1.\t关外，尤其是龙岗大道一带，修3号线前更&quot;破旧&quot;，出布吉关后外面像农村，地铁的规划/建设带来沿线房价翻倍与快速发展。—— wu-jiang_小z和他的父亲<br>2.\t布吉：地铁建设前后，工业区/烂尾楼被拆除了。—— WZY_麦<br>3.\t布吉/坂田: 地铁缓解了严重的交通拥堵 (以前关口非常堵)。—— JNU_LLW_RRAY<br>4.\t布吉 (百鸽笼/东站): 以前脏乱差，通地铁后市容改善很多。—— JNU_LLW_DB<br>5.\t布吉/百鸽笼: 地铁通了，万象汇建成了，人流变多，带动了经济发展。—— SZTUWWX_陈女士<br>6.\t布吉站: 人流量巨大，换乘拥挤。百鸽笼万象汇开业带动了偏僻区域的发展，但也带来噪音/粉尘。—— SZTUWWX_许女士<br>7.\t布吉站：随着地铁开通，老旧房子拆迁改建成高楼和商圈，环境得到翻新升级。—— UT_LJY_XW<br>8.\t布吉: 以前脏乱差（出关），现在通地铁后改善很多。—— SZTU+CS+尤老师<br>9.\t5号线打通了关内关外（布吉—罗湖—宝安），跨区便捷性提升。—— SZTULJK_LJP<br>10.\t布吉：地铁线路扩张后，从有检查亭[布吉关]、脏乱杂、分散着大量小工厂，变为生活更便利、配套丰富，作为交通枢纽吸引年轻务工者居住（房租较便宜+通达性）。—— SZTULJK_LDH<br>11.\t布吉：[跟撤关之前比]仍旧拥挤，地铁使其交通发达，人群密集度极高。——PKU+DYE_Suning';

const bujiPopupEn = '1. Outside the former checkpoint, especially along Longgang Avenue, the area was much more run-down before Line 3 was built; beyond Buji Checkpoint it felt almost rural. Metro planning and construction doubled housing prices along the corridor and accelerated development. — wu-jiang_小z和他的父亲<br>2. Buji: before and after metro construction, industrial zones and unfinished buildings were demolished. — WZY_麦<br>3. Buji / Bantian: the metro relieved severe traffic congestion; the checkpoint area used to be extremely jammed. — JNU_LLW_RRAY<br>4. Buji (Baigelong / East Station): it used to be dirty and chaotic, and the cityscape improved a lot after the metro arrived. — JNU_LLW_DB<br>5. Buji / Baigelong: after the metro opened and MixC One was built, foot traffic increased and economic development was stimulated. — SZTUWWX_陈女士<br>6. Buji Station: passenger volumes are huge and transfers are crowded. The opening of MixC One at Baigelong helped develop a previously remote area, but also brought noise and dust. — SZTUWWX_许女士<br>7. Buji Station: with the metro opening, old housing was demolished and rebuilt into high-rises and commercial districts, upgrading the environment. — UT_LJY_XW<br>8. Buji: it used to be dirty and chaotic outside the checkpoint, but improved significantly once the metro arrived. — SZTU+CS+尤老师<br>9. Line 5 connected areas inside and outside the former checkpoint (Buji - Luohu - Baoan), greatly improving cross-district access. — SZTULJK_LJP<br>10. Buji: after metro expansion, an area once known for checkpoint booths, disorder, and many scattered small factories became more convenient and better served, attracting young migrant workers because of lower rents and good connectivity. — SZTULJK_LDH<br>11. Buji: compared with the period before the checkpoint was removed, it is still crowded; the metro made transport highly developed and population density extremely high. — PKU+DYE_Suning';

const bujiTooltipZh = '1.\t关外，尤其是龙岗大道一带，修3号线前更&quot;破旧&quot;，出布吉关后外面像农村，地铁的规划/建设带来沿线房价翻倍与快速发展。—— wu-jiang_小z和他的父亲<br>2.\t布吉：地铁建设前后，工业区/烂尾楼被拆除了。—— WZY_麦<br><br>... 共11条，点击查看全部';
const bujiTooltipEn = '1. Outside the former checkpoint, especially along Longgang Avenue, the area was much more run-down before Line 3 was built; beyond Buji Checkpoint it felt almost rural. Metro planning and construction doubled housing prices along the corridor and accelerated development. — wu-jiang_小z和他的父亲<br>2. Buji: before and after metro construction, industrial zones and unfinished buildings were demolished. — WZY_麦<br><br>... 11 total, click to view all';

function injectRuntimeTranslations(html: string) {
  const placeTranslations = getPlaceTranslations();
  const runtimeScript = `
    <script>
      (function () {
        const placeTranslations = ${JSON.stringify(placeTranslations)};
        const regexReplacements = [
          {
            pattern: /1\.\s*东门到莲塘线路（东门中路-怡景路-罗沙路）修地铁时路难走，现在路况宽敞好走。——\s*sustech_LHY_2/g,
            replacement: '1. When the line to Liantang (Dongmen Middle Road - Yijing Road - Luosha Road) was under construction, the roads were difficult to use; now they are much wider and easier to travel. — sustech_LHY_2'
          },
          {
            pattern: /2\.\s*老东门因地铁更方便，人流增加。——\s*SUSTech_LJS_小江/g,
            replacement: '2. Old Dongmen became more accessible because of the metro, and foot traffic increased. — SUSTech_LJS_小江'
          },
          {
            pattern: /1\.\s*关外，尤其是龙岗大道一带，修3号线前更&quot;破旧&quot;，出布吉关后外面像农村，地铁的规划\/建设带来沿线房价翻倍与快速发展。——\s*wu-jiang_小z和他的父亲/g,
            replacement: '1. Outside the former checkpoint, especially along Longgang Avenue, the area was much more run-down before Line 3 was built; beyond Buji Checkpoint it felt almost rural. Metro planning and construction doubled housing prices along the corridor and accelerated development. — wu-jiang_小z和他的父亲'
          },
          {
            pattern: /2\.\s*布吉：地铁建设前后，工业区\/烂尾楼被拆除了。——\s*WZY_麦/g,
            replacement: '2. Buji: before and after metro construction, industrial zones and unfinished buildings were demolished. — WZY_麦'
          },
          {
            pattern: /\.\.\.\s*共(\d+)条，点击查看全部/g,
            replacement: '... $1 total, click to view all'
          },
          {
            pattern: /(\d+)次提及/g,
            replacement: '$1 mentions'
          }
        ];

        const placeKeys = Object.keys(placeTranslations).sort((a, b) => b.length - a.length);
        function escapeForRegex(value) {
          return value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        }
        const placePattern = new RegExp(placeKeys.map((key) => escapeForRegex(key)).join('|'), 'g');

        function translateFragment(fragment) {
          let translated = fragment;
          regexReplacements.forEach(({ pattern, replacement }) => {
            translated = translated.replace(pattern, replacement);
          });
          translated = translated.replace(placePattern, (match) => placeTranslations[match] || match);
          translated = translated.replace(/>More</g, '>More details<');
          return translated;
        }

        function translateElement(element) {
          if (!element || !element.innerHTML) return;
          const translated = translateFragment(element.innerHTML);
          if (translated !== element.innerHTML) {
            element.innerHTML = translated;
          }
        }

        function translateVisibleMapUi(root) {
          if (!root || !root.querySelectorAll) return;
          root.querySelectorAll('.leaflet-tooltip, .leaflet-popup-content, .leaflet-popup-content-wrapper').forEach(translateElement);
        }

        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType !== Node.ELEMENT_NODE) return;
              const element = node;
              if (element.matches && (element.matches('.leaflet-tooltip') || element.matches('.leaflet-popup-content') || element.matches('.leaflet-popup-content-wrapper'))) {
                translateElement(element);
              }
              translateVisibleMapUi(element);
            });
          });
        });

        document.addEventListener('DOMContentLoaded', function () {
          translateVisibleMapUi(document.body);
          observer.observe(document.body, { childList: true, subtree: true });
        });
      })();
    </script>
  `;

  return html.replace('</html>', `${runtimeScript}</html>`);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getPlaceTranslations() {
  const stationTranslations = STATIONS.reduce<Record<string, string>>((acc, station) => {
    if (station.nameCn && station.name) {
      acc[station.nameCn] = station.name;
    }
    return acc;
  }, {});

  return {
    ...stationTranslations,
    ...customPlaceTranslations,
  };
}

function translateHtml(html: string, language: AppLanguage) {
  if (language === 'zh') {
    return html;
  }

  let translated = html;

  translated = translated
    .replace('深圳地铁发展影响地点分布图', 'Shenzhen Metro Development Impact Map')
    .replace('鼠标悬停预览 | 点击查看完整内容', 'Hover to preview | Click to view full details')
    .replace('图例 - 提及次数', 'Legend - Mentions')
    .replace(/>1-3次</g, '>1-3 mentions<')
    .replace(/>4-7次</g, '>4-7 mentions<')
    .replace(/>8-12次</g, '>8-12 mentions<')
    .replace(/(\d+)次提及/g, '$1 mentions')
    .replace(/\.\.\. 共(\d+)条，点击查看全部/g, '... $1 total, click to view all')
    .replace(/>More</g, '>More details<')
    .replace(dongmenPopupZh, dongmenPopupEn)
    .replace(dongmenTooltipZh, dongmenTooltipEn)
    .replace(bujiPopupZh, bujiPopupEn)
    .replace(bujiTooltipZh, bujiTooltipEn);

  const placeTranslations = getPlaceTranslations();
  const placeKeys = Object.keys(placeTranslations).sort((a, b) => b.length - a.length);
  const placePattern = new RegExp(placeKeys.map(escapeRegExp).join('|'), 'g');

  translated = translated.replace(placePattern, (match) => placeTranslations[match] ?? match);

  return injectRuntimeTranslations(translated);
}

const uiCopy = {
  menuTitle: {
    en: 'Theme Options',
    zh: '主题菜单',
  },
  selected: {
    en: 'Selected theme',
    zh: '当前主题',
  },
  hint: {
    en: 'Select a theme to browse the thematic structure.',
    zh: '选择主题以浏览专题结构。',
  },
} as const;

export default function ThematicMap() {
  const { language } = useAppLanguage('en');
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(0);
  const themeButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const translatedHtml = useMemo(() => translateHtml(thematicMapHtml, language), [language]);
  const selectedTheme = THEMATIC_TOPICS[selectedThemeIndex];

  useEffect(() => {
    const selectedButton = themeButtonRefs.current[selectedThemeIndex];
    selectedButton?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [selectedThemeIndex]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white">
      <iframe
        key={language}
        title="Shenzhen Metro Impact Map"
        srcDoc={translatedHtml}
        className="h-full w-full border-0"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pb-4 md:px-6 md:pb-6">
        <div className="pointer-events-auto mx-auto max-w-7xl rounded-3xl border border-white/20 bg-white/18 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3EB181]">
                {uiCopy.menuTitle[language]}
              </div>
            </div>

            
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {THEMATIC_TOPICS.map((topic, index) => {
              const isActive = index === selectedThemeIndex;

              return (
                <button
                  key={topic.en}
                  ref={(element) => {
                    themeButtonRefs.current[index] = element;
                  }}
                  type="button"
                  onClick={() => setSelectedThemeIndex(index)}
                  className="h-[120px] w-[260px] flex-shrink-0 rounded-2xl border px-4 py-3 text-left transition-all duration-200 md:h-[132px] md:w-[320px]"
                  style={{
                    backgroundColor: isActive ? 'rgba(62, 177, 129, 0.92)' : 'rgba(255,255,255,0.18)',
                    borderColor: isActive ? 'rgba(62, 177, 129, 0.96)' : 'rgba(255,255,255,0.24)',
                    color: isActive ? '#FFFFFF' : '#F8FAFC',
                    boxShadow: isActive ? '0 12px 32px rgba(62, 177, 129, 0.28)' : '0 8px 24px rgba(15, 23, 42, 0.12)',
                    backdropFilter: 'blur(14px)',
                  }}
                >
                  <div className="text-xs font-semibold opacity-80">{index + 1}</div>
                  <div className="mt-2 line-clamp-4 whitespace-normal break-words text-sm font-semibold leading-6 md:text-base">
                    {topic[language]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
