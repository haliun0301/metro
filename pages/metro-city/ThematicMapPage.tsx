import { lazy, Suspense, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CircleMarker, MapContainer, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { useAppLanguage } from '../../hooks/useAppLanguage';
import { STATIONS } from '../../data/metro-stations/stations';
import { METRO_IMPACT_PLACES, type MetroImpactPlace } from '../../data/metro-city/metroImpactPlaces';
import { getThemeRoute, THEMATIC_TOPICS } from '../../data/metro-city/thematicTopics';
import PageShell from '../../components/ui/PageShell';
import ThemeSidebar from '../../components/metro-city/ThemeSidebar';
const CityAtlasLayer = lazy(() => import('../../components/map/CityAtlasLayer'));

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
  mentions: { en: 'mentions', zh: '次提及' },
  evidence: { en: 'Interview evidence', zh: '访谈记录' },
  more: { en: 'More details will be added.', zh: '更多内容待补充。' },
  legend: { en: 'Mentions', zh: '提及次数' },
} as const;

// Keep the impact map on its established orange theme. Size carries the
// mention scale; a light outline and hover lift separate overlapping places.
export const CITY_MAP_MARKER_COLOR = 'var(--primitive-orange)';

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

export function ImpactPlacesLayer({ language }: { language: 'en' | 'zh' }) {
  const numberFormatter = useMemo(() => new Intl.NumberFormat(language === 'zh' ? 'zh-CN' : 'en-US'), [language]);

  return (
    <>
      {METRO_IMPACT_PLACES.map((place) => {
        const displayName = language === 'zh' ? place.nameZh : getEnglishName(place.nameZh);
        const notes = getNotes(place, language);
        return (
          <CircleMarker
            key={place.id}
            center={place.coordinates}
            radius={place.radius}
            pathOptions={{
              className: 'metro-city-circle-marker',
              stroke: false,
              fillColor: CITY_MAP_MARKER_COLOR,
              fillOpacity: 0.78,
            }}
            eventHandlers={{
              mouseover: (event) => event.target.setStyle({ fillOpacity: 1 }),
              mouseout: (event) => event.target.setStyle({ fillOpacity: 0.78 }),
            }}
          >
            <Tooltip sticky direction="top" opacity={1} className="metro-city-tooltip">
              <div className="max-w-[20rem] py-1">
                <div className="font-semibold text-[var(--color-ink)]">{displayName}</div>
                  <div className="mt-1 text-xs" style={{ color: CITY_MAP_MARKER_COLOR }}>
                  {numberFormatter.format(place.mentions)} {uiCopy.mentions[language]}
                </div>
                <p className="mt-2 line-clamp-3 text-xs leading-5 text-[var(--color-text-muted)]">{notes[0]}</p>
              </div>
            </Tooltip>

            <Popup maxWidth={420} minWidth={260} className="metro-city-popup">
              <article className="max-h-[24rem] overflow-y-auto pr-1">
                <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--color-city)]">
                  {uiCopy.evidence[language]}
                </div>
                <h2 className="mt-2 text-xl font-semibold leading-tight text-[var(--color-ink)]">{displayName}</h2>
                <div className="mt-2 text-xs font-semibold text-[var(--color-text-muted)]">
                  {numberFormatter.format(place.mentions)} {uiCopy.mentions[language]}
                </div>
                <div className="mt-4 h-px bg-[var(--color-city)]/45" />
                <div className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-ink)]">
                  {notes.map((note, index) => <p key={`${place.id}-note-${index}`}>{note}</p>)}
                </div>
              </article>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}

export const IMPACT_LEGEND_ITEMS = legendItems;

export const METRO_CITY_MAP_STYLES = `
  .leaflet-container { font-family: var(--font-sans); background: var(--color-canvas); }
  .metro-city-circle-marker:focus { outline: none !important; }
  .metro-city-circle-marker:focus-visible { filter: drop-shadow(0 0 3px color-mix(in srgb, var(--color-city) 80%, transparent)); }
  .leaflet-top.leaflet-left { top: 3.5rem !important; left: auto !important; right: max(1rem, calc(50% - 22rem)) !important; }
  .leaflet-control-zoom { overflow: hidden; margin: 0 !important; border: 1px solid rgb(255 255 255 / .42) !important; border-radius: 12px !important; box-shadow: inset 0 1px 0 rgb(255 255 255 / .28), 0 18px 55px rgb(38 56 61 / .16) !important; backdrop-filter: blur(24px) saturate(140%); }
  .leaflet-control-zoom a { color: white !important; border-color: rgb(255 255 255 / .2) !important; background: rgb(38 56 61 / .3) !important; }
  .metro-city-tooltip { border: 0 !important; border-radius: 14px !important; box-shadow: 0 16px 45px rgba(38,56,61,.18) !important; padding: 10px 12px !important; }
  .metro-city-tooltip::before { border-top-color: var(--color-canvas) !important; }
  .metro-city-popup .leaflet-popup-content-wrapper { border-radius: 18px; box-shadow: 0 22px 60px rgba(38,56,61,.24); }
  .metro-city-popup .leaflet-popup-content { margin: 18px 20px; }
  .metro-city-popup .leaflet-popup-tip { box-shadow: none; }
`;

export default function ThematicMapPage() {
  const { language } = useAppLanguage('en');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const themeParam = Number(searchParams.get('theme'));
  const selectedThemeIndex = Number.isInteger(themeParam) && themeParam >= 1 && themeParam <= THEMATIC_TOPICS.length ? themeParam - 1 : null;
  const handleSelectTheme = (index: number) => navigate(getThemeRoute(index));

  return (
    <PageShell theme={{ chapterColor: 'var(--color-city)' }} className="relative h-dvh w-full overflow-hidden">
    <main className="relative flex h-dvh w-full overflow-hidden bg-[var(--color-canvas)] text-[var(--color-ink)]">
      <ThemeSidebar language={language} selectedIndex={selectedThemeIndex} onSelect={handleSelectTheme} variant="map" />

      <section className="relative min-w-0 flex-1 lg:[&_.leaflet-left]:left-[23rem]!">
        <MapContainer
          center={[22.58, 114.05]}
          zoom={11}
          minZoom={9}
          maxZoom={18}
          className="h-full w-full"
          zoomControl={false}
        >
        <Suspense fallback={null}><CityAtlasLayer language={language} /></Suspense>

        <ImpactPlacesLayer language={language} />
        </MapContainer>

      <section className="pointer-events-none absolute left-1/2 top-14 z-[var(--z-overlay)] w-[calc(100%-2rem)] -translate-x-1/2 text-center md:top-14 md:w-[min(44rem,calc(100%-8rem))]">
        <div className="metro-map-title-glass inline-block max-w-full rounded-[var(--radius-md)] px-6 py-4 sm:px-9 sm:py-5">
          <h1 className="text-[var(--text-subtitle)] font-semibold leading-tight tracking-[0.01em] text-white drop-shadow-[0_2px_12px_rgb(0_0_0_/_0.28)] sm:text-[var(--text-title)]">{uiCopy.title[language]}</h1>
        </div>
      </section>

      <aside className="metro-map-glass-panel pointer-events-none absolute bottom-5 right-5 z-[var(--z-overlay)] hidden rounded-[var(--radius-md)] p-4 text-white md:block">
        <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white">{uiCopy.legend[language]}</div>
        <div className="mt-3 space-y-2">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3 text-xs text-white">
              <span className="flex h-9 w-9 items-center justify-center" aria-hidden="true">
                  <span className="rounded-full border border-white/90" style={{ width: item.radius * 2, height: item.radius * 2, backgroundColor: CITY_MAP_MARKER_COLOR }} />
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </aside>

      <style>{METRO_CITY_MAP_STYLES}</style>
      </section>
    </main>
    </PageShell>
  );
}
