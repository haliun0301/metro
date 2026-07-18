import { useEffect, useMemo, useRef, useState } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { useAppLanguage } from '../../hooks/useAppLanguage';
import { STATIONS } from '../../data/metro-stations/stations';
import { METRO_IMPACT_PLACES, type MetroImpactPlace } from '../../data/metro-city/metroImpactPlaces';
import { THEMATIC_TOPICS } from '../../data/metro-city/thematicTopics';

const customPlaceTranslations: Record<string, string> = {
  '东门/老街': 'Dongmen / Laojie',
  '布吉站/布吉关/深圳东站': 'Buji Station / Buji Checkpoint / Shenzhen East Railway Station',
  深圳北站: 'Shenzhen North Station',
  坂田站: 'Bantian Station',
  车公庙站: 'Chegongmiao Station',
  '观澜/观澜老街': 'Guanlan / Guanlan Old Street',
  前海: 'Qianhai',
  '会展中心（原泰然工业区）': 'Convention & Exhibition Center (Former Tairan Industrial Zone)',
  '机场/机场东站': 'Airport / Airport East Station',
  盐田: 'Yantian',
  '益田/益田假日广场': 'Yitian / Yitian Holiday Plaza',
  百鸽笼站: 'Baigelong Station',
  '海岸城（南山）': 'Coastal City (Nanshan)',
  红山站: 'Hongshan Station',
  '罗湖火车站/罗湖口岸': 'Luohu Railway Station / Luohu Port',
  壹方城: 'Yifang City',
  布心站: 'Buxin Station',
  '大冲村/华润万象天地': 'Dachong Village / China Resources MixC World',
  大新村: 'Daxin Village',
  福田保税区: 'Futian Free Trade Zone',
  '横岗/横岗工业区': 'Henggang / Henggang Industrial Zone',
  华新站: 'Huaxin Station',
  龙岗中心城: 'Longgang Central City',
  龙华中心区: 'Longhua Central Area',
  梅林: 'Meilin',
  梅林一村: 'Meilin No. 1 Village',
  坪地: 'Pingdi',
  蛇口: 'Shekou',
  总部基地: 'Headquarters Base',
  春茧: 'Spring Cocoon',
  丰盛町: 'Fengshengting',
  '福田口岸/高铁站': 'Futian Port / High-Speed Rail Station',
  '福田CBD（原田面村）': 'Futian CBD (Former Tianmian Village)',
  公明: 'Gongming',
  海山站: 'Haishan Station',
  '海雅缤纷城（宝安）': "Haiya Mega Mall (Bao'an)",
  黄木岗站: 'Huangmugang Station',
  荔枝公园: 'Lizhi Park',
  莲花山: 'Lianhuashan Park',
  龙岗同乐高速口: 'Longgang Tongle Expressway Exit',
  罗沙路: 'Luosha Road',
  南山万象天地: 'Nanshan MixC World',
  坪山高铁站: 'Pingshan High-Speed Rail Station',
  坪山新区: 'Pingshan New District',
  深业上城: 'UpperHills',
  深云村: 'Shenyun Village',
  生态公园: 'Ecological Park',
  石龙仔: 'Shilongzai',
  石岩: 'Shiyan',
  松元公园: 'Songyuan Park',
  '桃园路（南山）': 'Taoyuan Road (Nanshan)',
  桃园站: 'Taoyuan Station',
  万象城: 'MixC',
  蔚蓝海岸: 'Blue Coast',
  西站: 'West Station',
  仙湖: 'Fairy Lake',
  盐田外国语高中部: 'Yantian Foreign Language High School',
  怡景路: 'Yijing Road',
  渔农村: 'Yucun Village',
  粤海门站: 'Yuehaimen Station',
  中心公园A区: 'Central Park Area A',
  卓悦汇: 'Zhuoyue Hui',
};

const stationTranslations = new Map(
  STATIONS.filter((station) => station.nameCn).map((station) => [station.nameCn, station.name])
);

const uiCopy = {
  title: { en: 'Shenzhen Metro Development Impact Map', zh: '深圳地铁发展影响地点分布图' },
  instruction: { en: 'Hover to preview · select a circle for interview notes', zh: '悬停预览 · 点击圆点查看访谈记录' },
  themeMenu: { en: 'Theme options', zh: '主题菜单' },
  mentions: { en: 'mentions', zh: '次提及' },
  evidence: { en: 'Interview evidence', zh: '访谈记录' },
  more: { en: 'More details will be added.', zh: '更多内容待补充。' },
  legend: { en: 'Mentions', zh: '提及次数' },
} as const;

const legendItems = [
  { label: '1–3', radius: 6 },
  { label: '4–7', radius: 12 },
  { label: '8–12', radius: 18 },
];

function getEnglishName(nameZh: string) {
  return customPlaceTranslations[nameZh] ?? stationTranslations.get(nameZh) ?? nameZh;
}

function getNotes(place: MetroImpactPlace, language: 'en' | 'zh') {
  if (language === 'zh') return place.notesZh.map((note) => note === 'More' ? uiCopy.more.zh : note);

  if (place.nameZh === '东门/老街') {
    return [
      'Metro construction initially made the Dongmen–Liantang corridor difficult to use; the completed streets are now wider and easier to travel.',
      'Interview accounts describe both increased access and footfall, and a later dispersal of commerce to other district centres.',
    ];
  }

  if (place.nameZh === '布吉站/布吉关/深圳东站') {
    return [
      'Interview accounts connect Line 3 with rapid development, rising property values, and major improvements to the former checkpoint area.',
      'The metro relieved road congestion and strengthened Buji as an interchange, while also increasing crowding around the station.',
    ];
  }

  return place.notesZh.map((note) => note === 'More' ? uiCopy.more.en : note);
}

export default function ThematicMap() {
  const { language } = useAppLanguage('en');
  const [selectedThemeIndex, setSelectedThemeIndex] = useState(2);
  const themeButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedTheme = THEMATIC_TOPICS[selectedThemeIndex];
  const numberFormatter = useMemo(() => new Intl.NumberFormat(language === 'zh' ? 'zh-CN' : 'en-US'), [language]);

  useEffect(() => {
    themeButtonRefs.current[selectedThemeIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [selectedThemeIndex]);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#e9efec] text-[#23332d]">
      <MapContainer
        center={[22.58, 114.05]}
        zoom={11}
        minZoom={9}
        maxZoom={18}
        className="h-full w-full"
        zoomControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />

        {METRO_IMPACT_PLACES.map((place) => {
          const displayName = language === 'zh' ? place.nameZh : getEnglishName(place.nameZh);
          const notes = getNotes(place, language);

          return (
            <CircleMarker
              key={place.id}
              center={place.coordinates}
              radius={place.radius}
              pathOptions={{
                color: '#d84a3a',
                fillColor: '#e55a49',
                fillOpacity: 0.36,
                opacity: 0.78,
                weight: 2,
              }}
            >
              <Tooltip sticky direction="top" opacity={1} className="metro-city-tooltip">
                <div className="max-w-[20rem] py-1">
                  <div className="font-semibold text-[#24342e]">{displayName}</div>
                  <div className="mt-1 text-xs text-[#d84a3a]">
                    {numberFormatter.format(place.mentions)} {uiCopy.mentions[language]}
                  </div>
                  <p className="mt-2 line-clamp-3 text-xs leading-5 text-[#59665f]">{notes[0]}</p>
                </div>
              </Tooltip>

              <Popup maxWidth={420} minWidth={260} className="metro-city-popup">
                <article className="max-h-[24rem] overflow-y-auto pr-1">
                  <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#d84a3a]">
                    {uiCopy.evidence[language]}
                  </div>
                  <h2 className="mt-2 text-xl font-semibold leading-tight text-[#24342e]">{displayName}</h2>
                  <div className="mt-2 text-xs font-semibold text-[#68756f]">
                    {numberFormatter.format(place.mentions)} {uiCopy.mentions[language]}
                  </div>
                  <div className="mt-4 h-px bg-[#d84a3a]/35" />
                  <div className="mt-4 space-y-3 text-sm leading-6 text-[#46544e]">
                    {notes.map((note, index) => <p key={`${place.id}-note-${index}`}>{note}</p>)}
                  </div>
                </article>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <section className="pointer-events-none absolute left-1/2 top-5 z-[800] w-[min(38rem,calc(100%-8rem))] -translate-x-1/2 text-center">
        <div className="inline-block rounded-2xl border border-white/70 bg-white/90 px-6 py-3 shadow-[0_18px_45px_rgba(28,45,37,0.14)] backdrop-blur-xl">
          <h1 className="text-base font-semibold tracking-[-0.01em] text-[#26382f] md:text-lg">{uiCopy.title[language]}</h1>
          <p className="mt-1 text-xs text-[#68756f]">{uiCopy.instruction[language]}</p>
        </div>
      </section>

      <aside className="pointer-events-none absolute bottom-[12rem] right-5 z-[800] hidden rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[0_18px_45px_rgba(28,45,37,0.14)] backdrop-blur-xl md:block">
        <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#68756f]">{uiCopy.legend[language]}</div>
        <div className="mt-3 space-y-2">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3 text-xs text-[#46544e]">
              <span className="flex h-9 w-9 items-center justify-center" aria-hidden="true">
                <span className="rounded-full border-2 border-[#d84a3a] bg-[#e55a49]/35" style={{ width: item.radius * 2, height: item.radius * 2 }} />
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </aside>

      <section className="pointer-events-none absolute inset-x-0 bottom-0 z-[900] px-3 pb-3 md:px-6 md:pb-6">
        <div className="pointer-events-auto mx-auto max-w-7xl rounded-[1.75rem] border border-white/30 bg-[#263831]/78 p-4 shadow-[0_22px_70px_rgba(20,34,28,0.3)] backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-4 px-1">
            <div>
              <div className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-[#6fd0a5]">{uiCopy.themeMenu[language]}</div>
              <div className="mt-1 line-clamp-1 text-sm font-medium text-white/85">{selectedTheme[language]}</div>
            </div>
            <div className="shrink-0 text-xs tabular-nums text-white/45">{String(selectedThemeIndex + 1).padStart(2, '0')} / {THEMATIC_TOPICS.length}</div>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {THEMATIC_TOPICS.map((topic, index) => {
              const isActive = index === selectedThemeIndex;
              return (
                <button
                  key={topic.en}
                  ref={(element) => { themeButtonRefs.current[index] = element; }}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setSelectedThemeIndex(index)}
                  className={`h-[5.25rem] w-[15rem] shrink-0 rounded-2xl border px-4 py-3 text-left transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#78d7ae] focus:ring-offset-2 focus:ring-offset-[#263831] md:w-[18rem] ${
                    isActive
                      ? 'border-[#5ec698] bg-[#3eb181] text-white shadow-[0_10px_30px_rgba(62,177,129,0.28)]'
                      : 'border-white/12 bg-white/[0.07] text-white/72 hover:border-white/25 hover:bg-white/[0.12] hover:text-white'
                  }`}
                >
                  <div className="text-[0.65rem] font-bold tracking-[0.16em] opacity-60">{String(index + 1).padStart(2, '0')}</div>
                  <div className="mt-1.5 line-clamp-2 text-sm font-semibold leading-5">{topic[language]}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        .leaflet-container { font-family: var(--font-sans); background: #e9efec; }
        .leaflet-control-zoom { border: 0 !important; box-shadow: 0 12px 35px rgba(28,45,37,.16) !important; }
        .leaflet-control-zoom a { color: #31453b !important; border-color: rgba(49,69,59,.1) !important; }
        .metro-city-tooltip { border: 0 !important; border-radius: 14px !important; box-shadow: 0 16px 45px rgba(28,45,37,.18) !important; padding: 10px 12px !important; }
        .metro-city-tooltip::before { border-top-color: white !important; }
        .metro-city-popup .leaflet-popup-content-wrapper { border-radius: 18px; box-shadow: 0 22px 60px rgba(28,45,37,.24); }
        .metro-city-popup .leaflet-popup-content { margin: 18px 20px; }
        .metro-city-popup .leaflet-popup-tip { box-shadow: none; }
      `}</style>
    </main>
  );
}
