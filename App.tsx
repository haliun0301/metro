/*
  App.tsx
  - Top-level React router for the single-page application.
  - Defines routes and maps them to page components so you can
    quickly find where each major view is rendered.
*/
import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import GlobalTopBar from './components/GlobalTopBar';
import MetroMapPage from './pages/metro-stations/MetroMapPage';
import ThematicMapPage from './pages/metro-city/ThematicMapPage';
import MapThemePage from './pages/metro-city/MapThemePage';

const LandingPage = lazy(() => import('./components/LandingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const MetroPeoplePage = lazy(() => import('./pages/metro-people/MetroPeoplePage'));
const ThematicEssayPage = lazy(() => import('./pages/metro-city/ThematicEssayPage'));
const StationDetailPage = lazy(() => import('./pages/metro-stations/StationDetailPage'));
const PersonDetailPage = lazy(() => import('./pages/metro-people/PersonDetailPage'));

function AppShell() {
  const location = useLocation();
  const isEmbeddedMapPanel = new URLSearchParams(location.search).get('embedded') === 'map-panel';
  const isFullStationDetailPage = location.pathname.startsWith('/stations/') && !isEmbeddedMapPanel;

  useEffect(() => {
    document.documentElement.classList.toggle('station-detail-full-page', isFullStationDetailPage);

    return () => {
      document.documentElement.classList.remove('station-detail-full-page');
    };
  }, [isFullStationDetailPage]);

  return (
    <>
      <style>{`
        html.station-detail-cover-passed [data-global-top-bar],
        html.station-detail-cover-passed [data-station-section-nav],
        html.map-panel-detail-cover-passed [data-global-top-bar],
        html.map-panel-detail-cover-passed [data-detail-panel-controls] {
          opacity: 0;
          transform: translateY(-10px);
          transition: opacity 180ms ease, transform 180ms ease;
        }

        html.station-detail-cover-passed [data-global-top-bar]:hover,
        html.station-detail-cover-passed [data-global-top-bar]:focus-within,
        html.station-detail-cover-passed [data-station-section-nav]:hover,
        html.station-detail-cover-passed [data-station-section-nav]:focus-within,
        html.map-panel-detail-cover-passed [data-global-top-bar]:hover,
        html.map-panel-detail-cover-passed [data-global-top-bar]:focus-within,
        html.map-panel-detail-cover-passed [data-detail-panel-controls]:hover,
        html.map-panel-detail-cover-passed [data-detail-panel-controls]:focus-within {
          opacity: 1;
          transform: translateY(0);
        }

        html.map-left-controls-map-surface [data-global-top-bar] > button,
        html.map-left-controls-map-surface [data-global-top-bar] > div {
          background: rgba(249, 234, 225, 0.95);
        }

        html.station-detail-full-page [data-global-top-bar] > button,
        html.station-detail-full-page [data-global-top-bar] > div,
        html.station-detail-full-page [data-global-top-bar] > button:hover,
        html.map-panel-detail-full-width [data-global-top-bar] > button,
        html.map-panel-detail-full-width [data-global-top-bar] > div,
        html.map-panel-detail-full-width [data-global-top-bar] > button:hover {
          background: transparent !important;
          box-shadow: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
      `}</style>
      {!isEmbeddedMapPanel && <GlobalTopBar variant="v2" />}
      <Suspense fallback={<div role="status" className="fixed inset-0 flex items-center justify-center bg-[var(--color-canvas)] text-[var(--color-ink)]">Loading...</div>}>
      <Routes>
        {/*
          Routes:
          - "/" -> Landing page
          - "/map" -> Main interactive metro map
          - "/people" -> Metro people visualization
          - "/thematicmap" -> Thematic map view
          - "/stations/:stationSlug" -> Station detail page (slug param)
        */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/map" element={<MetroMapPage />} />
        <Route path="/people/:personId?" element={<MetroPeopleRoute />} />
        <Route path="/thematicmap" element={<ThematicMapPage />} />
        <Route path="/thematicmap/:themeId" element={<MapThemePage />} />
        <Route path="/thematic-essay" element={<ThematicEssayPage />} />
        <Route path="/thematic-word-cloud" element={<LegacyEssayRedirect />} />
        <Route path="/thematic-category" element={<LegacyEssayRedirect />} />
        <Route path="/stations/:stationSlug" element={<StationDetailPage />} />
      </Routes>
      </Suspense>
    </>
  );
}

function LegacyEssayRedirect() {
  const location = useLocation();

  return <Navigate to={`/thematic-essay${location.search || '?theme=1'}`} replace />;
}

function MetroPeopleRoute() {
  const { personId } = useParams();

  return (
    <>
      <MetroPeoplePage />
      {personId && <Suspense fallback={null}><PersonDetailPage /></Suspense>}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

export default App;
