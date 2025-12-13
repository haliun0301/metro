import React from 'react';
import GisMap from './components/GisMap';
import ChatWidget from './components/ChatWidget';
import { METRO_ROUTES } from './data/metroRoutes';
import { STATIONS } from './data/stations';

function App() {
  return (
    <div className="w-full h-screen bg-gray-50">
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
      <ChatWidget context={`The user is currently viewing the Shenzhen Metro map. Available stations: ${STATIONS.length}.`} />
    </div>
  );
}

export default App;