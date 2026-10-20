/*
  MetroMapPage.tsx
  - Page wrapper that renders the `GisMap` component with default data.
  - Uses `useAppLanguage` to let the user switch language and passes `STATIONS`/`METRO_ROUTES` into the map.
*/
import GisMap from '../../components/metro-stations/GisMap';
import { useAppLanguage } from '../../hooks/useAppLanguage';
import { METRO_ROUTES } from '../../data/metro-stations/metroRoutes';
import { STATIONS } from '../../data/metro-stations/stations';
import PageShell from '../../components/ui/PageShell';
import PageContainer from '../../components/ui/PageContainer';
import PageHeader from '../../components/ui/PageHeader';

const pageCopy = {
  title: {
    en: 'Interactive Metro Map',
    zh: '深圳地铁交互地图',
  },
  footerTitle: {
    en: 'Shenzhen Metro',
    zh: '深圳地铁',
  },
  footerCredit: {
    en: '© 2026 Powered by React, Vite',
    zh: '© 2026 由 React 和 Vite 提供支持',
  },
} as const;

export default function MetroMapPage() {
  // Hook controlling app-level language. Passed down to `GisMap`.
  const { language } = useAppLanguage('en');

  return (
    <PageShell theme={{ chapterColor: 'var(--color-stations)' }} className="relative h-screen w-full overflow-hidden">
      <div className="relative flex h-full w-full flex-col overflow-y-auto bg-[var(--color-canvas)]">
      <PageContainer className="max-w-7xl py-12">
        <PageHeader
          eyebrow="Metro & Stations"
          title={pageCopy.title[language]}
          chapterColor="var(--color-stations)"
          className="!py-0 text-center"
        />
        <div className="relative h-[70vh] w-full overflow-hidden rounded-[var(--radius-md)] shadow-[var(--shadow-panel)]">
          {/* Main map component. Update props here to change default map behavior for this page. */}
          <GisMap
            initialLat={22.5431}
            initialLng={114.0579}
            zoom={12}
            language={language}
            metroStations={STATIONS}
            metroRoutes={METRO_ROUTES}
            mapStyle="streets"
            showControls={true}
            showMetroStations={true}
            modernPlain={false}
            monochrome={false}
            mapSaturation={1}
            mapBrightness={1}
            mapContrast={1}
            mapHue={0}
            markerSize={24}
            enableClustering={false}
            clusterDistance={50}
            markers={[]}
          />
        </div>
      </PageContainer>
      <footer className="mt-auto w-full bg-[var(--color-ink)] py-8 text-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="text-lg font-semibold">{pageCopy.footerTitle[language]}</div>
          <div className="text-sm text-white/70">{pageCopy.footerCredit[language]}</div>
        </div>
      </footer>
      </div>
    </PageShell>
  );
}
