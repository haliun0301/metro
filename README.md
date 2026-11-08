# Shenzhen Metro

## Development

1. Install dependencies: `npm install`
2. Run the app: `npm run dev`
3. Build: `npm run build`

## Map basemaps

The station and city maps use a custom MapLibre vector style backed by
[OpenFreeMap](https://openfreemap.org/) and OpenStreetMap data. No API key is
required. The city variant uses a quieter palette so research layers remain
prominent. If the vector basemap cannot load, the maps show an OpenStreetMap
raster fallback and a notice. Satellite and terrain views use their existing
providers. If vector tiles are slow to load, a raster map appears temporarily
after a short delay while the custom map continues loading.

The vector service is hosted externally; availability, coverage, and language
labels depend on OpenFreeMap and OpenStreetMap. Test access from the deployment
region, including mainland China, before relying on it in production.

## People images

The selected direction is **black-and-white doodles**. User style references are pending. See [the image direction and path guide](design/people-images/README.md).

Existing doodles are provisional. Missing images use placeholders. Retired experiments are preserved in `archive/image-experiments-2026-09-12/`; their generation commands have been removed.
