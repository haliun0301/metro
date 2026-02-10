import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MetroMapPage from './components/MetroMapPage';
import MetroPeople from "./components/MetroPeople";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/map" element={<MetroMapPage />} />
        <Route path="/people" element={<MetroPeople />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;