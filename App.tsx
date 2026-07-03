/*
  App.tsx
  - Top-level React router for the single-page application.
  - Defines routes and maps them to page components so you can
    quickly find where each major view is rendered.
*/
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalTopBar from './components/GlobalTopBar';
import LandingPage from './components/LandingPage';
import MetroMapPage from './components/metro-stations/MetroMapPage';
import MetroPeople from "./components/metro-people/MetroPeople";
import ThematicMap from './components/metro-city/ThematicMap';
import StationDetailPage from './pages/StationDetailPage';

function AppShell() {
  return (
    <>
      <GlobalTopBar />
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
