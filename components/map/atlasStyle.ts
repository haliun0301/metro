import type { ExpressionSpecification, StyleSpecification } from 'maplibre-gl';

export const ATLAS_ATTRIBUTION = '<a href="https://openfreemap.org" target="_blank" rel="noopener noreferrer">OpenFreeMap</a> | &copy; <a href="https://www.openmaptiles.org/" target="_blank" rel="noopener noreferrer">OpenMapTiles</a> | &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';

export function atlasLabelExpression(language: 'en' | 'zh'): ExpressionSpecification {
  return ['coalesce', ['get', language === 'zh' ? 'name:zh' : 'name:en'], ['get', 'name']];
}

export function atlasStyle(language: 'en' | 'zh', dimmed = false): StyleSpecification {
  const colors = dimmed
    ? { land: '#d9dfdb', park: '#c4d2c8', water: '#aebfbe', building: '#c7ceca', minor: '#e5e9e5', major: '#f1f0e9', outline: '#c1c9c4', label: '#596c67' }
    : { land: '#eef1eb', park: '#d9e8d9', water: '#c7dddf', building: '#dde3db', minor: '#fafaf5', major: '#ffffff', outline: '#d4dcd4', label: '#536763' };
  const name = atlasLabelExpression(language);

  return {
    version: 8,
    glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
    sources: {
      atlas: { type: 'vector', url: 'https://tiles.openfreemap.org/planet' },
    },
    layers: [
      { id: 'land', type: 'background', paint: { 'background-color': colors.land } },
      { id: 'parks', type: 'fill', source: 'atlas', 'source-layer': 'park', paint: { 'fill-color': colors.park, 'fill-opacity': 0.75 } },
      { id: 'woods', type: 'fill', source: 'atlas', 'source-layer': 'landcover', filter: ['==', ['get', 'class'], 'wood'], paint: { 'fill-color': colors.park, 'fill-opacity': 0.65 } },
      { id: 'water', type: 'fill', source: 'atlas', 'source-layer': 'water', paint: { 'fill-color': colors.water } },
      { id: 'waterways', type: 'line', source: 'atlas', 'source-layer': 'waterway', paint: { 'line-color': colors.water, 'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.5, 16, 3] } },
      { id: 'buildings', type: 'fill', source: 'atlas', 'source-layer': 'building', minzoom: 14, paint: { 'fill-color': colors.building, 'fill-opacity': 0.75 } },
      { id: 'minor-roads', type: 'line', source: 'atlas', 'source-layer': 'transportation', minzoom: 12, filter: ['in', ['get', 'class'], ['literal', ['minor', 'service', 'path', 'track']]], layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': colors.minor, 'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.5, 16, 4] } },
      { id: 'major-road-outline', type: 'line', source: 'atlas', 'source-layer': 'transportation', filter: ['in', ['get', 'class'], ['literal', ['primary', 'secondary', 'tertiary', 'trunk', 'motorway']]], layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': colors.outline, 'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1, 16, 8] } },
      { id: 'major-roads', type: 'line', source: 'atlas', 'source-layer': 'transportation', filter: ['in', ['get', 'class'], ['literal', ['primary', 'secondary', 'tertiary', 'trunk', 'motorway']]], layout: { 'line-cap': 'round', 'line-join': 'round' }, paint: { 'line-color': colors.major, 'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.5, 16, 5] } },
      { id: 'places', type: 'symbol', source: 'atlas', 'source-layer': 'place', minzoom: 8, layout: { 'text-field': name, 'text-font': ['Noto Sans Regular'], 'text-size': ['interpolate', ['linear'], ['zoom'], 9, 11, 15, 15], 'text-max-width': 8 }, paint: { 'text-color': colors.label, 'text-halo-color': colors.land, 'text-halo-width': 1.5 } },
      { id: 'road-names', type: 'symbol', source: 'atlas', 'source-layer': 'transportation_name', minzoom: 14, layout: { 'symbol-placement': 'line', 'text-field': name, 'text-font': ['Noto Sans Regular'], 'text-size': 11 }, paint: { 'text-color': colors.label, 'text-halo-color': colors.major, 'text-halo-width': 1.2 } },
    ],
  };
}
