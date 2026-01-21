
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MetroMapPage from './components/MetroMapPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/map" element={<MetroMapPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;