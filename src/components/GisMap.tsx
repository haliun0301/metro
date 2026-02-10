import React from 'react';
import { Station } from '../types';
import { getStationDetails } from '../services';
import { useNavigate } from 'react-router-dom';

const GisMap = ({ stations }: { stations: Station[] }) => {
  const navigate = useNavigate();
  const [selectedStation, setSelectedStation] = React.useState<Station | null>(null);

  const handleStationClick = (station: Station) => {
    setSelectedStation(station);
    navigate(`/station/${station.id}`);
  };

  const stationDetails = selectedStation ? getStationDetails(selectedStation) : null;

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-4 left-4 z-10 w-80 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
        {selectedStation && (
          <>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedStation.name}</h2>
                <p className="text-sm">{selectedStation.address}</p>
              </div>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedStation(null)}
              >
                Close
              </button>
            </div>
            <div>
              <p className="text-sm">{stationDetails?.description}</p>
              <p className="text-sm">{stationDetails?.details}</p>
            </div>
          </>
        )}
      </div>
      {stations.map(station => (
        <div
          key={station.id}
          className="relative w-full h-screen"
          onClick={() => handleStationClick(station)}
        >
          <div className="absolute top-4 left-4 z-10 w-80 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
            {selectedStation && (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{selectedStation.name}</h2>
                    <p className="text-sm">{selectedStation.address}</p>
                  </div>
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setSelectedStation(null)}
                  >
                    Close
                  </button>
                </div>
                <div>
                  <p className="text-sm">{stationDetails?.description}</p>
                  <p className="text-sm">{stationDetails?.details}</p>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GisMap;