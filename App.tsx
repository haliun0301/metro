/*
  App.tsx
  - Top-level React router for the single-page application.
  - Defines routes and maps them to page components so you can
    quickly find where each major view is rendered.
*/
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import GlobalTopBar from './components/GlobalTopBar';
import LandingPage from './components/LandingPage';
import MetroMapPage from './components/metro-stations/MetroMapPage';
import MetroPeople from "./components/metro-people/MetroPeople";
import ThematicMap from './components/metro-city/ThematicMap';
import StationDetailPage from './pages/StationDetailPage';

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
          background: rgba(255, 255, 255, 0.95);
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
        <Route path="/map" element={<MetroMapPage />} />
        <Route path="/people" element={<MetroPeople />} />
        <Route path="/thematicmap" element={<ThematicMap />} />
        <Route path="/stations/:stationSlug" element={<StationDetailPage />} />
      </Routes>
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
