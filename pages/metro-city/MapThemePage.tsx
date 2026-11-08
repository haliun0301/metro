import { lazy, Suspense, useMemo } from 'react';
import { CircleMarker, MapContainer, Polyline, Popup, Tooltip } from 'react-leaflet';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

import { useAppLanguage, type AppLanguage } from '../../hooks/useAppLanguage';
import ThemeSidebar from '../../components/metro-city/ThemeSidebar';
import PageShell from '../../components/ui/PageShell';
import { getThemeRoute, THEMATIC_TOPICS } from '../../data/metro-city/thematicTopics';
import { METRO_ROUTES } from '../../data/metro-stations/metroRoutes';
import { STATIONS } from '../../data/metro-stations/stations';
import { CITY_MAP_MARKER_COLOR, IMPACT_LEGEND_ITEMS, ImpactPlacesLayer, METRO_CITY_MAP_STYLES } from './ThematicMapPage';
const CityAtlasLayer = lazy(() => import('../../components/map/CityAtlasLayer'));

type MapThemeKind = 'fabric' | 'places' | 'nodes';

const MAP_THEME_KINDS: Record<number, MapThemeKind> = { 2: 'fabric', 3: 'places', 4: 'nodes' };

const copy = {
  fabric: {
    title: { en: 'Shenzhen Metro network: lines and stations', zh: '深圳地铁网络：线路与站点' },
    legend: { en: 'Lines', zh: '线路' },
  },
  places: {
    title: { en: 'Shenzhen Metro Development Impact Map', zh: '深圳地铁发展影响地点分布图' },
    legend: { en: 'Mentions', zh: '提及次数' },
  },
  nodes: {
    title: { en: 'Key nodes: interchange stations', zh: '核心节点：换乘站' },
    legend: { en: 'Lines served', zh: '服务线路数' },
  },
} as const;

const nodeCopy = {
  lines: { en: 'lines', zh: '条线路' },
  line: { en: 'Line', zh: '线路' },
  interchange: { en: 'Interchange', zh: '换乘站' },
} as const;

const NODE_LEGEND = [
  { label: '2', radius: 7 },
  { label: '3', radius: 11 },
  { label: '4+', radius: 15 },
];

const NODE_MAP_MARKER_COLOR = 'var(--color-people)';

function normalizeLine(line: string) {
  return line.replace(/\s*Branch$/i, '');
}

function useInterchanges() {
  return useMemo(() => {
    const byName = new Map<string, { name: string; nameCn?: string; lat: number; lng: number; lines: Set<string> }>();

    STATIONS.forEach((station) => {
      const key = station.nameCn ?? station.name;
      const entry = byName.get(key) ?? { name: station.name, nameCn: station.nameCn, lat: station.lat, lng: station.lng, lines: new Set<string>() };
      entry.lines.add(normalizeLine(station.line));
      byName.set(key, entry);
    });

    return Array.from(byName.entries())
      .filter(([, entry]) => entry.lines.size >= 2)
      .map(([key, entry]) => ({
        key,
        ...entry,
        lines: Array.from(entry.lines).sort((a, b) => parseInt(a.replace(/\D/g, ''), 10) - parseInt(b.replace(/\D/g, ''), 10)),
      }));
  }, []);
}

function FabricLayer({ language }: { language: AppLanguage }) {
  return (
    <>
      {METRO_ROUTES.map((route) => (
        <Polyline
          key={route.lineId}
          positions={route.coordinates.map((point) => [point.lat, point.lng] as [number, number])}
          pathOptions={{ color: route.color, weight: 4, opacity: 0.85 }}
        />
      ))}
      {STATIONS.map((station) => (
        <CircleMarker
          key={`${station.line}-${station.name}-${station.lat}`}
          center={[station.lat, station.lng]}
          radius={3.5}
          pathOptions={{ className: 'metro-city-circle-marker', color: station.lineColor ?? 'var(--color-ink)', fillColor: '#FFFFFF', fillOpacity: 1, weight: 2 }}
        >
          <Tooltip direction="top" opacity={1} className="metro-city-tooltip">
            <div className="py-0.5">
              <div className="font-semibold text-[var(--color-ink)]">{language === 'zh' ? station.nameCn ?? station.name : station.name}</div>
              <div className="mt-1 text-xs text-[var(--color-text-muted)]">{station.line}</div>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  );
}

function NodesLayer({ language }: { language: AppLanguage }) {
  const interchanges = useInterchanges();

  return (
    <>
      {interchanges.map((node) => {
        const displayName = language === 'zh' ? node.nameCn ?? node.name : node.name;

        return (
          <CircleMarker
            key={node.key}
            center={[node.lat, node.lng]}
            radius={Math.min(7 + (node.lines.length - 2) * 4, 15)}
            pathOptions={{ className: 'metro-city-circle-marker', stroke: false, fillColor: NODE_MAP_MARKER_COLOR, fillOpacity: 0.82 }}
            eventHandlers={{
              mouseover: (event) => event.target.setStyle({ fillOpacity: 1 }),
              mouseout: (event) => event.target.setStyle({ fillOpacity: 0.82 }),
            }}
          >
            <Tooltip sticky direction="top" opacity={1} className="metro-city-tooltip">
              <div className="py-0.5">
                <div className="font-semibold text-[var(--color-ink)]">{displayName}</div>
                <div className="mt-1 text-xs" style={{ color: NODE_MAP_MARKER_COLOR }}>{node.lines.length} {nodeCopy.lines[language]}</div>
              </div>
            </Tooltip>
            <Popup maxWidth={320} minWidth={220} className="metro-city-popup">
              <article>
                <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--color-city)]">{nodeCopy.interchange[language]}</div>
                <h2 className="mt-2 text-xl font-semibold leading-tight text-[var(--color-ink)]">{displayName}</h2>
                <div className="mt-3 h-px bg-[var(--color-city)]/45" />
                <ul className="mt-3 flex flex-wrap gap-1.5 text-xs font-semibold text-[var(--color-ink)]">
                  {node.lines.map((line) => (
                    <li key={line} className="rounded-[var(--radius-sm)] border border-[var(--color-hairline)] bg-[var(--color-canvas-soft)] px-2.5 py-1">{line}</li>
                  ))}
                </ul>
              </article>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}

function Legend({ kind, language }: { kind: MapThemeKind; language: AppLanguage }) {
  return (
    <aside className="metro-map-glass-surface pointer-events-none absolute bottom-5 right-5 z-[var(--z-overlay)] hidden max-h-[calc(100%-8rem)] overflow-y-auto rounded-[var(--radius-md)] p-4 text-white md:block">
      <div className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white">{copy[kind].legend[language]}</div>
      <div className="mt-3 space-y-2">
        {kind === 'fabric'
          ? METRO_ROUTES.map((route) => (
              <div key={route.lineId} className="flex items-center gap-3 text-xs text-white">
                <span className="h-1 w-6 rounded-full" style={{ backgroundColor: route.color }} aria-hidden="true" />
                <span className="tabular-nums">{nodeCopy.line[language]} {route.lineId}</span>
              </div>
            ))
          : (kind === 'places' ? IMPACT_LEGEND_ITEMS : NODE_LEGEND).map((item) => (
              <div key={item.label} className="flex items-center gap-3 text-xs text-white">
                  <span className="flex h-9 w-9 items-center justify-center" aria-hidden="true">
                  <span className="rounded-full border border-white/90" style={{ width: item.radius * 2, height: item.radius * 2, backgroundColor: kind === 'nodes' ? NODE_MAP_MARKER_COLOR : CITY_MAP_MARKER_COLOR }} />
                </span>
                <span>{item.label}</span>
              </div>
            ))}
      </div>
    </aside>
  );
}

export default function MapThemePage() {
  const { language } = useAppLanguage('en');
  const navigate = useNavigate();
  const { themeId } = useParams();
  const themeNumber = Number(themeId);
  const kind = MAP_THEME_KINDS[themeNumber];

  if (!kind) return <Navigate to="/thematicmap" replace />;

  const selectedIndex = themeNumber - 1;

  return (
    <PageShell theme={{ chapterColor: 'var(--color-city)' }} className="relative h-dvh w-full overflow-hidden">
      <main className="relative flex h-dvh w-full overflow-hidden bg-[var(--color-canvas)] text-[var(--color-ink)]">
        <ThemeSidebar language={language} selectedIndex={selectedIndex} onSelect={(index) => navigate(getThemeRoute(index))} variant="map" />

        <section className="relative min-w-0 flex-1 lg:[&_.leaflet-left]:left-[23rem]!">
          <MapContainer center={[22.58, 114.05]} zoom={11} minZoom={9} maxZoom={18} className="h-full w-full" zoomControl={false}>
            <Suspense fallback={null}><CityAtlasLayer language={language} /></Suspense>
            {kind === 'fabric' && <FabricLayer language={language} />}
            {kind === 'places' && <ImpactPlacesLayer language={language} />}
            {kind === 'nodes' && <NodesLayer language={language} />}
          </MapContainer>

          <section className="pointer-events-none absolute left-1/2 top-14 z-[var(--z-overlay)] w-[calc(100%-2rem)] -translate-x-1/2 text-center md:top-14 md:w-[min(80rem,calc(100%-8rem))]">
            <div className="metro-map-glass-surface inline-block max-w-full rounded-[var(--radius-md)] px-4 py-2.5 sm:px-6 sm:py-3">
              <h1 className="text-[clamp(1.5rem,2.2vw,2rem)] font-semibold leading-[1.15] tracking-[-0.025em] text-white drop-shadow-[0_2px_12px_rgb(0_0_0_/_0.28)]">{copy[kind].title[language]}</h1>
            </div>
          </section>

          <Legend kind={kind} language={language} />
          <style>{METRO_CITY_MAP_STYLES}</style>
        </section>
      </main>
    </PageShell>
  );
}
