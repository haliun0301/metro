/*
  types.ts
  - Central TypeScript interfaces used across the app.
  - Edit here to adjust data shapes (stations, routes, map props).
*/
import { CSSProperties } from 'react';

// Simple pin/marker shape used by the in-map UI
export interface Marker {
    lat: number
    lng: number
    label: string
    color: string
}

// Core station data used by the map and detail pages
export interface MetroStation {
    lat: number
    lng: number
    name: string
    nameCn?: string
    line: string
    info: string
    lineColor?: string
    isTransfer?: boolean
    isDetail?: boolean
    area?: string
    areaCn?: string
    areaPageKey?: string
    routes?: Array<{
        toStation: string
        coordinates: Array<{ lat: number; lng: number }>
    }>
}

// Polyline for a metro line
export interface MetroLineRoute {
    lineId: string;
    color: string;
    coordinates: Array<{ lat: number; lng: number }>;
}

// Props that drive the GisMap component (many options for customization)
export interface GisMapProps {
    initialLat: number
    initialLng: number
    zoom: number
    markers: Marker[]
    metroStations: MetroStation[]
    metroRoutes?: MetroLineRoute[]
    mapStyle: "streets" | "satellite" | "terrain"
    showControls: boolean
    markerSize: number
    enableClustering: boolean
    clusterDistance: number
    showMetroStations: boolean
    style?: CSSProperties
    stationsJson?: string
    lineWidth?: number
    showLegend?: boolean
    buttonPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
    buttonColor?: string
    buttonSize?: number
    mapSaturation?: number
    mapBrightness?: number
    mapContrast?: number
    mapHue?: number
    language?: "en" | "zh"
    defaultLanguage?: "en" | "zh"
    routesJson?: string
    modernPlain?: boolean
    plainTint?: string
    monochrome?: boolean
}