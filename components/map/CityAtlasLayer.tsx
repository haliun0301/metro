import { useEffect, useRef, useState } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { TileLayer, useMap } from 'react-leaflet';
import { maplibreGL } from '@maplibre/maplibre-gl-leaflet';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ATLAS_ATTRIBUTION, atlasLabelExpression, atlasStyle } from './atlasStyle';

export default function CityAtlasLayer({ language }: { language: 'en' | 'zh' }) {
  const map = useMap();
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [showLoadingTiles, setShowLoadingTiles] = useState(false);
  const vectorMapRef = useRef<MapLibreMap | null>(null);
  const languageRef = useRef(language);
  languageRef.current = language;

  useEffect(() => {
    setStatus('loading');
    let layer: ReturnType<typeof maplibreGL>;
    try {
      layer = maplibreGL({ style: atlasStyle(languageRef.current, true), attributionControl: false });
      layer.addTo(map);
    } catch (error) {
      console.error('Unable to initialize the city atlas basemap:', error);
      setStatus('error');
      return;
    }

    const vectorMap = layer.getMaplibreMap();
    vectorMapRef.current = vectorMap;
    layer.getContainer().style.opacity = '0';
    let failed = false;
    const updateLabels = () => {
      if (failed) return;
      const label = atlasLabelExpression(languageRef.current);
      vectorMap.setLayoutProperty('places', 'text-field', label);
      vectorMap.setLayoutProperty('road-names', 'text-field', label);
      layer.getContainer().style.opacity = '1';
      map.attributionControl.addAttribution(ATLAS_ATTRIBUTION);
      setStatus('ready');
    };
    const handleError = (event: { error: Error }) => {
      console.error('City atlas basemap error:', event.error);
      failed = true;
      layer.getContainer().style.opacity = '0';
      map.attributionControl.removeAttribution(ATLAS_ATTRIBUTION);
      setStatus('error');
    };
    vectorMap.on('error', handleError);
    vectorMap.on('load', updateLabels);
    return () => {
      vectorMap.off('error', handleError);
      vectorMap.off('load', updateLabels);
      vectorMapRef.current = null;
      map.removeLayer(layer);
      map.attributionControl.removeAttribution(ATLAS_ATTRIBUTION);
    };
  }, [map]);

  useEffect(() => {
    if (status !== 'loading') {
      setShowLoadingTiles(false);
      return;
    }
    const timer = window.setTimeout(() => setShowLoadingTiles(true), 1200);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    const vectorMap = vectorMapRef.current;
    if (!vectorMap?.getLayer('places')) return;
    const label = atlasLabelExpression(language);
    vectorMap.setLayoutProperty('places', 'text-field', label);
    vectorMap.setLayoutProperty('road-names', 'text-field', label);
  }, [language]);

  return status === 'error' || (status === 'loading' && showLoadingTiles) ? (
    <>
    <TileLayer
      className="city-atlas-fallback"
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {status === 'error' && <div role="status" className="atlas-error">
      {language === 'zh' ? '自定义底图不可用，现显示备用地图。' : 'Custom basemap unavailable. Showing the fallback map.'}
    </div>}
    </>
  ) : null;
}
