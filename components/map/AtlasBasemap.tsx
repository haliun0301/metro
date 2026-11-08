import { useEffect, useRef } from 'react';
import { Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { ATLAS_ATTRIBUTION, atlasLabelExpression, atlasStyle } from './atlasStyle';

interface AtlasBasemapProps {
  lat: number;
  lng: number;
  zoom: number;
  language: 'en' | 'zh';
  showAttribution: boolean;
  onStatusChange: (status: 'loading' | 'ready' | 'error') => void;
}

export default function AtlasBasemap({ lat, lng, zoom, language, showAttribution, onStatusChange }: AtlasBasemapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const cameraRef = useRef({ lat, lng, zoom });
  const languageRef = useRef(language);
  cameraRef.current = { lat, lng, zoom };
  languageRef.current = language;

  useEffect(() => {
    if (!containerRef.current) return;
    onStatusChange('loading');
    let map: MapLibreMap;
    try {
      const camera = cameraRef.current;
      map = new MapLibreMap({
        container: containerRef.current,
        style: atlasStyle(languageRef.current),
        center: [camera.lng, camera.lat],
        zoom: camera.zoom - 1,
        interactive: false,
        attributionControl: false,
      });
    } catch (error) {
      console.error('Unable to initialize the atlas basemap:', error);
      onStatusChange('error');
      return;
    }

    mapRef.current = map;
    map.getContainer().style.opacity = '0';
    let failed = false;
    const handleError = (event: { error: Error }) => {
      console.error('Atlas basemap error:', event.error);
      failed = true;
      map.getContainer().style.opacity = '0';
      onStatusChange('error');
    };
    map.on('error', handleError);
    map.on('load', () => {
      if (!failed) {
        const label = atlasLabelExpression(languageRef.current);
        map.setLayoutProperty('places', 'text-field', label);
        map.setLayoutProperty('road-names', 'text-field', label);
        map.getContainer().style.opacity = '1';
        onStatusChange('ready');
      }
    });
    const observer = new ResizeObserver(() => map.resize());
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      map.off('error', handleError);
      map.remove();
      mapRef.current = null;
    };
  }, [onStatusChange]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getLayer('places')) return;
    const label = atlasLabelExpression(language);
    map.setLayoutProperty('places', 'text-field', label);
    map.setLayoutProperty('road-names', 'text-field', label);
  }, [language]);

  useEffect(() => {
    mapRef.current?.jumpTo({ center: [lng, lat], zoom: zoom - 1 });
  }, [lat, lng, zoom]);

  return (
    <>
      <div ref={containerRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }} />
      {showAttribution && <div className="atlas-attribution" onMouseDown={(event) => event.stopPropagation()} dangerouslySetInnerHTML={{ __html: ATLAS_ATTRIBUTION }} />}
    </>
  );
}
