import React from 'react';
import GisMap from './GisMap';
import { METRO_ROUTES } from '../data/metroRoutes';
import { STATIONS } from '../data/stations';

export default function MetroMapPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col">
      <div className="w-full max-w-7xl mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Interactive Metro Map</h2>
        <div className="w-full h-[70vh] rounded-2xl overflow-hidden shadow-xl">
          <GisMap
            initialLat={22.5431}
            initialLng={114.0579}
            zoom={12}
            metroStations={STATIONS}
            metroRoutes={METRO_ROUTES}
            mapStyle="streets"
            showControls={true}
            showMetroStations={true}
            markerSize={24}
            enableClustering={false}
            clusterDistance={50}
            markers={[]}
          />
        </div>
      </div>
      <footer className="w-full bg-gray-900 text-white py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="text-lg font-semibold">Shenzhen Metro AI Map</div>
          <div className="text-sm text-gray-400">&copy; 2026 Powered by React, Vite, and Gemini AI</div>
        </div>
      </footer>
    </div>
  );
}
