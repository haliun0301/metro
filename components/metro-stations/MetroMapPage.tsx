/*
  MetroMapPage.tsx
  - Page wrapper that renders the `GisMap` component with default data.
  - Uses `useAppLanguage` to let the user switch language and passes `STATIONS`/`METRO_ROUTES` into the map.
*/
import React from 'react';
import GisMap from './GisMap';
import { useAppLanguage } from '../../hooks/useAppLanguage';
import { METRO_ROUTES } from '../../data/metro-stations/metroRoutes';
import { STATIONS } from '../../data/metro-stations/stations';

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
    <div className="relative w-full min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full max-w-7xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{pageCopy.title[language]}</h2>
        <div className="w-full h-[70vh] rounded-2xl overflow-hidden shadow-xl relative">
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
      </div>
      <footer className="w-full bg-gray-900 text-white py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="text-lg font-semibold">{pageCopy.footerTitle[language]}</div>
          <div className="text-sm text-gray-400">{pageCopy.footerCredit[language]}</div>
        </div>
      </footer>
    </div>
  );
}