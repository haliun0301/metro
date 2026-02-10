import { CSSProperties } from 'react';

export interface Marker {
    lat: number
    lng: number
    label: string
    color: string
}

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
    routes?: Array<{
        toStation: string
        coordinates: Array<{ lat: number; lng: number }>
    }>
}

export interface MetroLineRoute {
    lineId: string;
    color: string;
    coordinates: Array<{ lat: number; lng: number }>;
}

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
    defaultLanguage?: "en" | "zh"
    routesJson?: string
    modernPlain?: boolean
    plainTint?: string
    monochrome?: boolean
}