import React, {
    useEffect,
    useRef,
    useState,
    startTransition,
    useMemo,
    useCallback,
    type CSSProperties,
} from "react"
import type { GisMapProps, MetroStation } from "../types";

const GAP_PX = 14 // space between popup and dot
const ARROW_PX = 8 // little triangle height

// Mock useIsStaticRenderer for standard React
const useIsStaticRenderer = () => false;

function GisMap(props: GisMapProps) {
    const {
        initialLat = 22.5431,
        initialLng = 114.0579,
        zoom = 12,
        metroStations = [],
        metroRoutes = [],
        mapStyle = "streets",
        showControls = true,
        showMetroStations = true,
        stationsJson = "",
        lineWidth = 4,
        showLegend = true,
        buttonPosition = "bottom-right",
        buttonColor = "#3EB181",
        buttonSize = 60,
        mapSaturation = 1.2,
        mapBrightness = 1.05,
        mapContrast = 1.1,
        mapHue = -10,
        routesJson = "",
        modernPlain = true,
        plainTint = "linear-gradient(180deg, rgba(72,45,95,0.06), rgba(15,15,20,0.12))",
        monochrome = true,
    } = props

    const mapRef = useRef<HTMLDivElement>(null)
    const isStatic = useIsStaticRenderer()

    const [currentZoom, setCurrentZoom] = useState(zoom)
    const [centerLat, setCenterLat] = useState(initialLat)
    const [centerLng, setCenterLng] = useState(initialLng)
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0, lat: 0, lng: 0 })
    const [containerDimensions, setContainerDimensions] = useState({
        width: 800,
        height: 600,
    })
    const [hoveredStation, setHoveredStation] = useState<number | null>(null)
    const [showDetailPanel, setShowDetailPanel] = useState(false)
    const [isFullWidth, setIsFullWidth] = useState(false)
    const [cmsUrl, setCmsUrl] = useState<string>("")
    const [isExpanded, setIsExpanded] = useState(true)
    const [visibleLines, setVisibleLines] = useState<Set<string>>(new Set())
    const [showLegendWindow, setShowLegendWindow] = useState(false)
    const [hoveredMapStyle, setHoveredMapStyle] = useState<string | null>(null)
    const [currentMapStyle, setCurrentMapStyle] = useState<
        "streets" | "satellite" | "terrain"
    >(mapStyle)
    const [language, setLanguage] = useState<"en" | "zh">(
        props.defaultLanguage || "en"
    )

    // Area menu state
    const [showAreaMenu, setShowAreaMenu] = useState(false)
    const [selectedArea, setSelectedArea] = useState<string | null>(null)
    const [areaBounds, setAreaBounds] = useState<{
        minLat: number
        maxLat: number
        minLng: number
        maxLng: number
    } | null>(null)

    // Area menu auto-scroll state
    const areaMenuRef = useRef<HTMLDivElement | null>(null)
    const [isUserScrolling, setIsUserScrolling] = useState(false)
    const resumeTimerRef = useRef<number | null>(null)
    const rafRef = useRef<number | null>(null)
    const AUTO_SCROLL_SPEED = 0.45 // px per frame
    const AUTO_SCROLL_INACTIVITY = 2200 // ms to wait before resuming

    const clearResumeTimer = useCallback(() => {
        if (resumeTimerRef.current !== null) {
            window.clearTimeout(resumeTimerRef.current)
            resumeTimerRef.current = null
        }
    }, [])

    const startResumeTimer = useCallback(() => {
        clearResumeTimer()
        resumeTimerRef.current = window.setTimeout(() => {
            resumeTimerRef.current = null
            setIsUserScrolling(false)
        }, AUTO_SCROLL_INACTIVITY)
    }, [clearResumeTimer])

    // RAF loop for auto-scrolling the area menu
    useEffect(() => {
        const loop = () => {
            const el = areaMenuRef.current
            if (el && !isUserScrolling && !selectedArea) {
                el.scrollLeft += AUTO_SCROLL_SPEED
                if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
                    el.scrollLeft = 0
                }
            }
            rafRef.current = requestAnimationFrame(loop)
        }

        rafRef.current = requestAnimationFrame(loop)
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            clearResumeTimer()
        }
    }, [isUserScrolling, selectedArea, clearResumeTimer])

    // Touch/pinch zoom state
    const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(
        null
    )

    // Search state
    const [searchQuery, setSearchQuery] = useState("")
    const [showSearchResults, setShowSearchResults] = useState(false)

    // Scale factor for in-map UI when side panel is open (map shrinks to 2/3)
    const mapScale = showDetailPanel && !isFullWidth ? 2 / 3 : 1

    // Animation state for station clicks
    const [animatingStationIndex, setAnimatingStationIndex] = useState<
        number | null
    >(null)
    const [circleAnimation, setCircleAnimation] = useState(0)

    // Hover grace so you can move into the popup
    const hoverHideTimer = useRef<number | null>(null)
    const cancelHoverHide = useCallback(() => {
        if (hoverHideTimer.current !== null) {
            window.clearTimeout(hoverHideTimer.current)
            hoverHideTimer.current = null
        }
    }, [])

    const scheduleHoverHide = useCallback(() => {
        cancelHoverHide()
        hoverHideTimer.current = window.setTimeout(() => {
            startTransition(() => setHoveredStation(null))
        }, 220)
    }, [cancelHoverHide])

    const tileUrls = useMemo(
        () => ({
            streets: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            satellite:
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            terrain:
                "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
        }),
        []
    )

    const latLngToPixel = useCallback(
        (lat: number, lng: number, zoom: number) => {
            // Clamp latitude to avoid projection blowup at poles
            const clampedLat = Math.max(-85, Math.min(85, lat));
            // Clamp longitude to valid range
            const clampedLng = Math.max(-180, Math.min(180, lng));
            // Smooth zoom at very low levels to avoid extreme compression
            const effectiveZoom = Math.max(12, Math.min(zoom, 20));
            const scale = Math.pow(2, effectiveZoom);
            // Web Mercator projection
            const worldCoordX = ((clampedLng + 180) / 360) * 256 * scale;
            const sinLat = Math.sin((clampedLat * Math.PI) / 180);
            // Clamp sinLat to avoid NaN at poles
            const safeSinLat = Math.max(-0.9999, Math.min(0.9999, sinLat));
            const worldCoordY =
                (0.5 -
                    Math.log((1 + safeSinLat) / (1 - safeSinLat)) /
                        (4 * Math.PI)) *
                256 * scale;
            return { x: worldCoordX, y: worldCoordY };
        },
        []
    )

    const handleZoomIn = useCallback(
        () => startTransition(() => setCurrentZoom((p) => Math.min(p + 1, 18))),
        []
    )
    const handleZoomOut = useCallback(
        () => startTransition(() => setCurrentZoom((p) => Math.max(p - 1, 12))),
        []
    )

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (isStatic) return
            setIsDragging(true)
            setDragStart({
                x: e.clientX,
                y: e.clientY,
                lat: centerLat,
                lng: centerLng,
            })
        },
        [isStatic, centerLat, centerLng]
    )

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!isDragging || isStatic) return
            const deltaX = e.clientX - dragStart.x
            const deltaY = e.clientY - dragStart.y
            const scale = Math.pow(2, currentZoom)
            const metersPerPixel =
                (156543.03392 * Math.cos((centerLat * Math.PI) / 180)) / scale
            const deltaLng = -(deltaX * metersPerPixel) / 111320
            const deltaLat = (deltaY * metersPerPixel) / 110540
            const newLat = Math.max(-85, Math.min(85, dragStart.lat + deltaLat))
            const newLng = ((dragStart.lng + deltaLng + 180) % 360) - 180
            startTransition(() => {
                setCenterLat(newLat)
                setCenterLng(newLng)
            })
        },
        [isDragging, isStatic, dragStart, currentZoom, centerLat]
    )

    const handleMouseUp = useCallback(() => setIsDragging(false), [])

    // Handle mouse wheel zoom
    const handleWheel = useCallback(
        (e: React.WheelEvent) => {
            if (isStatic) return
            e.preventDefault()

            const delta = -e.deltaY
            const zoomChange = delta > 0 ? 0.5 : -0.5

            startTransition(() => {
                setCurrentZoom((prevZoom) =>
                    Math.max(12, Math.min(18, prevZoom + zoomChange))
                )
            })
        },
        [isStatic]
    )

    // Calculate distance between two touch points
    const getTouchDistance = useCallback((touches: React.TouchList) => {
        if (touches.length < 2) return null
        const touch1 = touches[0]
        const touch2 = touches[1]
        const dx = touch1.clientX - touch2.clientX
        const dy = touch1.clientY - touch2.clientY
        return Math.sqrt(dx * dx + dy * dy)
    }, [])

    // Handle touch start for pinch zoom
    const handleTouchStart = useCallback(
        (e: React.TouchEvent) => {
            if (isStatic) return
            if (e.touches.length === 2) {
                const distance = getTouchDistance(e.touches)
                setLastTouchDistance(distance)
            }
        },
        [isStatic, getTouchDistance]
    )

    // Handle touch move for pinch zoom
    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => {
            if (isStatic) return
            if (e.touches.length === 2 && lastTouchDistance !== null) {
                e.preventDefault()
                const distance = getTouchDistance(e.touches)
                if (distance !== null) {
                    const delta = distance - lastTouchDistance
                    const zoomChange = delta > 0 ? 0.1 : -0.1

                    startTransition(() => {
                        setCurrentZoom((prevZoom) =>
                            Math.max(1, Math.min(18, prevZoom + zoomChange))
                        )
                        setLastTouchDistance(distance)
                    })
                }
            }
        },
        [isStatic, lastTouchDistance, getTouchDistance]
    )

    // Handle touch end
    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (isStatic) return
        setLastTouchDistance(null)
    }, [isStatic])

    useEffect(() => {
        if (isStatic) return
        const handleGlobalMouseUp = () => setIsDragging(false)
        window.addEventListener("mouseup", handleGlobalMouseUp)
        return () => window.removeEventListener("mouseup", handleGlobalMouseUp)
    }, [isStatic])

    useEffect(() => {
        if (isStatic || !mapRef.current) return
        const updateDimensions = () => {
            if (mapRef.current) {
                startTransition(() => {
                    setContainerDimensions({
                        width: mapRef.current?.offsetWidth || 800,
                        height: mapRef.current?.offsetHeight || 600,
                    })
                })
            }
        }
        updateDimensions()
        if (typeof window !== "undefined") {
            window.addEventListener("resize", updateDimensions)
            return () => window.removeEventListener("resize", updateDimensions)
        }
    }, [isStatic])

    // When the detail panel opens/closes the map element width changes (CSS transition).
    // Ensure containerDimensions reflect the updated inner map size so area framing
    // calculations center the frame inside the visible (2/3) map. Run an immediate
    // update and a delayed one to catch the end of the CSS transition.
    useEffect(() => {
        if (isStatic || !mapRef.current) return
        const doUpdate = () => {
            if (mapRef.current) {
                startTransition(() => {
                    setContainerDimensions({
                        width: mapRef.current.offsetWidth || 800,
                        height: mapRef.current.offsetHeight || 600,
                    })
                })
            }
        }

        doUpdate()
        const t = window.setTimeout(doUpdate, 360)
        return () => window.clearTimeout(t)
    }, [showDetailPanel, isFullWidth, isStatic])

    // ESC closes drawer
    useEffect(() => {
        if (isStatic) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                startTransition(() => {
                    setHoveredStation(null)
                    setShowSearchResults(false)
                    setSearchQuery("")
                })
            }
        }
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [isStatic])

    const centerPixel = useMemo(() => {
        if (isStatic) {
            return latLngToPixel(initialLat, initialLng, zoom)
        }
        return latLngToPixel(centerLat, centerLng, currentZoom)
    }, [
        isStatic,
        centerLat,
        centerLng,
        currentZoom,
        initialLat,
        initialLng,
        zoom,
        latLngToPixel,
    ])

    const { width: containerWidth, height: containerHeight } =
        containerDimensions

    const visibleTiles = useMemo(() => {
        const tiles: Array<{ x: number; y: number; url: string }> = []
        const currentZ = isStatic ? zoom : currentZoom
        const currentStyle = isStatic ? mapStyle : currentMapStyle
        const scale = Math.pow(2, currentZ)
        const maxTile = scale - 1
        const centerTileX = Math.floor(centerPixel.x / 256)
        const centerTileY = Math.floor(centerPixel.y / 256)

        if (isStatic) {
            // Only render center tile for static
            const url = tileUrls[currentStyle]
                .replace("{z}", currentZ.toString())
                .replace("{x}", centerTileX.toString())
                .replace("{y}", centerTileY.toString())
            tiles.push({ x: centerTileX * 256, y: centerTileY * 256, url })
        } else {
            const tilesX = Math.min(Math.ceil(containerWidth / 256) + 2, 10)
            const tilesY = Math.min(Math.ceil(containerHeight / 256) + 2, 10)

            for (let dy = -tilesY; dy <= tilesY; dy++) {
                for (let dx = -tilesX; dx <= tilesX; dx++) {
                    let tileX = centerTileX + dx
                    const tileY = centerTileY + dy
                    tileX = ((tileX % scale) + scale) % scale
                    if (tileY < 0 || tileY > maxTile) continue
                    const url = tileUrls[currentStyle]
                        .replace("{z}", currentZ.toString())
                        .replace("{x}", tileX.toString())
                        .replace("{y}", tileY.toString())
                    tiles.push({
                        x: (centerTileX + dx) * 256,
                        y: tileY * 256,
                        url,
                    })
                }
            }
        }
        return tiles
    }, [
        isStatic,
        centerPixel.x,
        centerPixel.y,
        currentZoom,
        zoom,
        containerWidth,
        containerHeight,
        currentMapStyle,
        mapStyle,
        tileUrls,
    ])

    // Parse bulk stations (JSON or GeoJSON) and merge with manual list
    const parsedStations: MetroStation[] = useMemo(() => {
        if (!stationsJson?.trim()) return []
        try {
            const data = JSON.parse(stationsJson)
            if (Array.isArray(data)) {
                return data
                    .filter(
                        (d) =>
                            d &&
                            typeof d === "object" &&
                            Number.isFinite(Number(d?.lat)) &&
                            Number.isFinite(Number(d?.lng))
                    )
                    .map((d) => ({
                        lat: Number(d.lat),
                        lng: Number(d.lng),
                        name: String(d.name ?? "Station"),
                        nameCn: d.nameCn ? String(d.nameCn) : undefined,
                        line: String(d.line ?? "Unknown Line"),
                        info: String(d.info ?? ""),
                        lineColor: d.lineColor || "#E91E63",
                    }))
            }
            if (
                data?.type === "FeatureCollection" &&
                Array.isArray(data.features)
            ) {
                return data.features
                    .filter(
                        (f: any) =>
                            f?.geometry?.type === "Point" &&
                            Array.isArray(f.geometry.coordinates) &&
                            f.geometry.coordinates.length >= 2
                    )
                    .map((f: any) => {
                        const [lng, lat] = f.geometry.coordinates
                        const p = f.properties || {}
                        return {
                            lat: Number(lat),
                            lng: Number(lng),
                            name: String(p.name ?? "Station"),
                            nameCn: p.nameCn ? String(p.nameCn) : undefined,
                            line: String(p.line ?? "Unknown Line"),
                            info: String(p.info ?? ""),
                            lineColor: p.lineColor || "#E91E63",
                        }
                    })
            }
        } catch (error) {
            console.error("Error parsing stations JSON:", error)
        }
        return []
    }, [stationsJson])

    const stations = useMemo(() => {
        return [...metroStations, ...parsedStations]
    }, [metroStations, parsedStations])

    // Create a map of routes for quick lookup
    const routesMap = useMemo(() => {
        if (isStatic) return new Map()
        const map = new Map<string, Array<{ lat: number; lng: number }>>()

        // First, parse and add routes from routesJson
        if (routesJson?.trim()) {
            try {
                const routesData = JSON.parse(routesJson)
                if (Array.isArray(routesData)) {
                    routesData.forEach((route) => {
                        if (
                            route &&
                            typeof route === "object" &&
                            route.fromStation &&
                            route.toStation &&
                            Array.isArray(route.coordinates)
                        ) {
                            // Normalize station names for matching (trim and lowercase)
                            const fromName = String(route.fromStation)
                                .trim()
                                .toLowerCase()
                            const toName = String(route.toStation)
                                .trim()
                                .toLowerCase()
                            const key = `${fromName}-${toName}`
                            const reverseKey = `${toName}-${fromName}`

                            const coordinates = route.coordinates
                                .filter(
                                    (coord: any) =>
                                        coord &&
                                        Number.isFinite(Number(coord.lat)) &&
                                        Number.isFinite(Number(coord.lng))
                                )
                                .map((coord: any) => ({
                                    lat: Number(coord.lat),
                                    lng: Number(coord.lng),
                                }))
                            if (coordinates.length > 0) {
                                map.set(key, coordinates)
                                map.set(reverseKey, [...coordinates].reverse())
                            }
                        }
                    })
                }
            } catch (error) {
                console.error("Error parsing routes JSON:", error)
            }
        }

        // Then, add routes from individual stations
        stations.forEach((station) => {
            if (station.routes) {
                station.routes.forEach((route) => {
                    const fromName = station.name.trim().toLowerCase()
                    const toName = route.toStation.trim().toLowerCase()
                    const key = `${fromName}-${toName}`
                    const reverseKey = `${toName}-${fromName}`
                    if (!map.has(key) && !map.has(reverseKey)) {
                        map.set(key, route.coordinates)
                        map.set(reverseKey, [...route.coordinates].reverse())
                    }
                })
            }
        })

        return map
    }, [stations, routesJson, isStatic])

    // Get unique lines with their colors for the legend
    const uniqueLines = useMemo(() => {
        if (isStatic) return []
        const linesMap = new Map<string, string>()
        stations.forEach((station) => {
            const lines = station.line.split("&").map((l) => l.trim())
            lines.forEach((line) => {
                if (!linesMap.has(line)) {
                    linesMap.set(line, station.lineColor || "#E91E63")
                }
            })
        })
        return Array.from(linesMap.entries()).map(([name, color]) => ({
            name,
            color,
        }))
    }, [stations, isStatic])

    // Initialize visible lines when uniqueLines changes
    useEffect(() => {
        if (isStatic) return
        if (uniqueLines.length > 0 && visibleLines.size === 0) {
            // Always include '6B' in visible lines
            const initialLines = new Set(uniqueLines.map((line) => line.name))
            initialLines.add('6B')
            initialLines.add('Line 6B')
            startTransition(() => {
                setVisibleLines(initialLines)
            })
        }
    }, [uniqueLines, visibleLines.size, isStatic])

    // Filter stations based on visible lines
    const visibleStations = useMemo(() => {
        if (isStatic) return stations.slice(0, 5)
        if (visibleLines.size === 0) return []
        return stations.filter((station) => {
            const stationLines = station.line.split("&").map((l) => l.trim())
            const lineVisible = stationLines.some((line) => visibleLines.has(line))
            if (!lineVisible) return false

            // If an area is selected and bounds are set, only include stations inside those bounds
            if (areaBounds) {
                if (
                    station.lat < areaBounds.minLat ||
                    station.lat > areaBounds.maxLat ||
                    station.lng < areaBounds.minLng ||
                    station.lng > areaBounds.maxLng
                ) {
                    return false
                }
            }

            return true
        })
    }, [stations, visibleLines, isStatic, areaBounds])

    // Search results based on query
    const searchResults = useMemo(() => {
        if (isStatic || !searchQuery.trim()) return []
        const query = searchQuery.toLowerCase()
        return stations
            .filter(
                (station) =>
                    station.name.toLowerCase().includes(query) ||
                    (station.nameCn && station.nameCn.includes(query)) ||
                    station.line.toLowerCase().includes(query)
            )
            .slice(0, 10)
    }, [searchQuery, stations, isStatic])

    // Update showSearchResults when searchQuery changes
    useEffect(() => {
        if (isStatic) return
        startTransition(() => {
            setShowSearchResults(searchQuery.trim().length > 0)
        })
    }, [searchQuery, isStatic])

    // Function to move to a station and trigger animation
    const moveToStation = useCallback(
        (station: MetroStation, globalIndex: number) => {
            startTransition(() => {
                setCenterLat(station.lat)
                setCenterLng(station.lng)
                setCurrentZoom(15)
                setSearchQuery("")
                setShowSearchResults(false)
                setAnimatingStationIndex(globalIndex)
                setCircleAnimation(0)
            })

            // Animate the circle
            let animationFrame = 0
            const animate = () => {
                animationFrame++
                const progress = animationFrame / 30
                if (progress < 1) {
                    startTransition(() => setCircleAnimation(progress))
                    requestAnimationFrame(animate)
                } else {
                    startTransition(() => {
                        setCircleAnimation(0)
                        setAnimatingStationIndex(null)
                    })
                }
            }
            requestAnimationFrame(animate)
        },
        []
    )

    // Detect transfer stations
    const transferStations = useMemo(() => {
        if (isStatic) return new Set()
        const transferCoords = new Set<string>()
        stations.forEach((station) => {
            if (station.isTransfer) {
                const key = `${station.lat.toFixed(4)},${station.lng.toFixed(4)}`
                transferCoords.add(key)
            }
        })
        return transferCoords
    }, [stations, isStatic])

    // Memoize line segments
    const lineSegments = useMemo(() => {
        if (isStatic || !showMetroStations || visibleLines.size === 0) return []

        const segments: Array<{
            lineName: string
            points: Array<{ x: number; y: number }>
            color: string
        }> = []

        // Method 1: Draw full lines from metroRoutes
        if (metroRoutes.length > 0) {
            // To prevent overlapping, keep track of rendered coordinate sets
            const renderedRanges = new Set();
            metroRoutes.forEach(route => {
                // Normalize line ID to match visibleLines set (e.g., "1" -> "Line 1")
                const lineNameVariant1 = route.lineId;
                const lineNameVariant2 = `Line ${route.lineId}`;
                const lineNameVariant3 = route.lineId.replace("Line ", "");

                const isVisible = visibleLines.has(lineNameVariant1) ||
                                  visibleLines.has(lineNameVariant2) ||
                                  visibleLines.has(lineNameVariant3);
                if (!isVisible) return;

                // Create a unique key for this route's coordinates
                const coordKey = route.coordinates.map(c => `${c.lat},${c.lng}`).join("|");
                if (renderedRanges.has(coordKey)) {
                    // Already rendered by another line, skip to avoid overlap
                    return;
                }
                renderedRanges.add(coordKey);

                const points = route.coordinates.map(coord => {
                    const pixel = latLngToPixel(coord.lat, coord.lng, currentZoom);
                    return {
                        x: pixel.x - centerPixel.x + containerWidth / 2,
                        y: pixel.y - centerPixel.y + containerHeight / 2,
                    };
                });

                if (points.length >= 2) {
                    segments.push({
                        lineName: `line-${route.lineId}`,
                        points,
                        color: route.color
                    });
                }
            });
        }

        // Method 2: Draw routes from routesMap (exact coordinates from JSON/Station routes)
        // This is supplementary to Method 1, used if specific segments are defined instead of full lines.
        routesMap.forEach((coordinates, routeKey) => {
            const [fromStationLower, toStationLower] = routeKey.split("-")

            // Find stations with case-insensitive matching
            const fromStationData = stations.find(
                (s) => s.name.trim().toLowerCase() === fromStationLower
            )
            const toStationData = stations.find(
                (s) => s.name.trim().toLowerCase() === toStationLower
            )

            if (!fromStationData || !toStationData) {
                return
            }

            // Get all lines for both stations
            const fromLines = fromStationData.line
                .split("&")
                .map((l) => l.trim())
            const toLines = toStationData.line.split("&").map((l) => l.trim())
            const commonLines = fromLines.filter((line) =>
                toLines.includes(line)
            )

            if (commonLines.length === 0) {
                return
            }

            const lineName = commonLines[0]

            // Check if this line is visible
            if (!visibleLines.has(lineName)) {
                return
            }

            const lineColor =
                fromStationData.lineColor ||
                toStationData.lineColor ||
                "#E91E63"

            // Convert all coordinates to screen pixels
            const points = coordinates.map((coord) => {
                const pixel = latLngToPixel(coord.lat, coord.lng, currentZoom)
                return {
                    x: pixel.x - centerPixel.x + containerWidth / 2,
                    y: pixel.y - centerPixel.y + containerHeight / 2,
                }
            })

            if (points.length >= 2) {
                segments.push({
                    lineName: `route-${routeKey}`,
                    points,
                    color: lineColor,
                })
            }
        })

        return segments
    }, [
        showMetroStations,
        isStatic,
        visibleLines,
        routesMap,
        metroRoutes,
        currentZoom,
        centerPixel.x,
        centerPixel.y,
        containerWidth,
        containerHeight,
        latLngToPixel,
        stations,
    ])

    // Helper function to create URL slug from station name
    const createSlug = useCallback((name: string): string => {
        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
        return slug
    }, [])

    // Helper function to translate line names to Chinese
    const translateLineName = useCallback(
        (lineName: string, lang: "en" | "zh"): string => {
            if (lang === "en") return lineName

            const lineNumberMatch = lineName.match(/Line\s+(\d+)/i)
            if (lineNumberMatch) {
                return `${lineNumberMatch[1]}号线`
            }

            return lineName
        },
        []
    )

    // Fit map view to all stations in a given area (frames multiple stations)
    const fitArea = useCallback(
        (areaName: string) => {
            if (isStatic) return
            const normalize = (str: string) =>
                str
                    .toLowerCase()
                    .trim()
                    .replace(/\(.*?\)/g, "")
                    // normalize various dash characters to space
                    .replace(/[–—‒−‑]/g, " ")
                    .replace(/[^\w\s\u4e00-\u9fff-]/g, " ")
                    .replace(/\b(area|片区|区)\b/g, " ")
                    .replace(/[-_]+/g, " ")
                    .replace(/\s+/g, " ")
                    .trim()

            const target = normalize(areaName)

            const matches = stations.filter((s) => {
                const a = normalize(String(s.area || ""))
                const aCn = normalize(String(s.areaCn || ""))
                if (!a && !aCn) return false

                if (a === target || a.includes(target) || target.includes(a)) return true
                if (aCn === target || aCn.includes(target) || target.includes(aCn)) return true


                const tTokens = Array.from(new Set(target.split(" ").filter(Boolean)))
                const aTokens = Array.from(new Set(a.split(" ").filter(Boolean)))
                const aCnTokens = Array.from(new Set(aCn.split(" ").filter(Boolean)))
                const intersectCount = (arr1: string[], arr2: string[]) =>
                    arr1.filter((tok) => arr2.includes(tok) && tok.length > 2).length

                const matchedCountA = intersectCount(tTokens, aTokens)
                const matchedCountACn = intersectCount(tTokens, aCnTokens)

                // Require at least two matching tokens to avoid broad single-token matches
                // unless the target itself is a single token (user clicked a short area label)
                const tTokenCount = tTokens.length
                if (
                    matchedCountA >= 2 ||
                    matchedCountACn >= 2 ||
                    (tTokenCount === 1 && (matchedCountA === 1 || matchedCountACn === 1))
                ) {
                    return true
                }

                return false
            })

            if (!matches || matches.length === 0) {
                // fallback: set search and show results
                startTransition(() => {
                    setSearchQuery(areaName)
                    setShowSearchResults(true)
                    setSelectedArea(areaName)
                })
                return
            }

            const lats = matches.map((m) => m.lat)
            const lngs = matches.map((m) => m.lng)
            const minLat = Math.min(...lats)
            const maxLat = Math.max(...lats)
            const minLng = Math.min(...lngs)
            const maxLng = Math.max(...lngs)

            const centerLatFit = (minLat + maxLat) / 2
            const centerLngFit = (minLng + maxLng) / 2

            // Choose maximum zoom that still fits all points into container with padding
            const padding = 120
            let chosenZoom = Math.max(12, Math.min(18, currentZoom))
            for (let z = 18; z >= 12; z -= 0.5) {
                const pixels = matches.map((pt) =>
                    latLngToPixel(pt.lat, pt.lng, z)
                )
                const xs = pixels.map((p) => p.x)
                const ys = pixels.map((p) => p.y)
                const widthNeeded = Math.max(...xs) - Math.min(...xs)
                const heightNeeded = Math.max(...ys) - Math.min(...ys)

                if (
                    widthNeeded <= containerWidth - padding * 2 &&
                    heightNeeded <= containerHeight - padding * 2
                ) {
                    chosenZoom = z
                    break
                }
            }
            // Zoom in slightly so the area appears at a larger scale
            chosenZoom = Math.min(14, chosenZoom + 1)

            startTransition(() => {
                setCenterLat(centerLatFit)
                setCenterLng(centerLngFit)
                setCurrentZoom(chosenZoom)
                setSearchQuery(areaName)
                setShowSearchResults(true)
                setSelectedArea(areaName)
                setAreaBounds({ minLat, maxLat, minLng, maxLng })
            })
        },
        [isStatic, stations, latLngToPixel, containerWidth, containerHeight, currentZoom]
    )

    // Deduplicated list of service areas (derived from provided areas list)
    const areaList = useMemo(() => {
        const areas = [
            "Bitou area",
            "Chegongmiao area",
            "Xiangmi Lake area",
            "Buji area",
            "Biyan-Guangming Farm area",
            "Nanyou area",
            "Shatian area",
            "Shuibei–Tianbei area",
            "University Town area",
            "Huangbeiling area",
            "Qianhaiwan area",
            "Huaqiang North area",
            "Baiwang (Baimang) area",
            "Fanshen area",
            "Shekou area",
            "Tanglang–Changlingpi area",
            "Shenzhen University–High-tech Park area",
            "Houhai area",
            "Futian CBD area",
            "Xixiang area",
            "Meilin Checkpoint area",
            "Longcheng Square area",
            "Fenghuang Town–Guangming Town area",
            "Shatoujiao area",
            "Universiade area",
            "Tongle area",
            "Hongshan area",
        ]

        // Normalize and dedupe while preserving order
        const seen = new Set<string>()
        const dedup: string[] = []
        for (const a of areas) {
            const key = a.trim().toLowerCase()
            if (!seen.has(key)) {
                seen.add(key)
                dedup.push(a)
            }
        }
        return dedup
    }, [])

    // Navigate to CMS page for station
    const navigateToStation = useCallback(
        (station: MetroStation) => {
            // Do not open detail page if station explicitly has no detail
            if (station.isDetail === false) return

            // Updated to use real website if available, otherwise just use as ID
            const slug = createSlug(station.name)
            const fullUrl = `https://shenzhen-subway.framer.website/stations/${slug}`

            startTransition(() => {
                setCmsUrl(fullUrl)
                setShowDetailPanel(true)
                setIsFullWidth(false)
            })
        },
        [createSlug]
    )

    // Helper function to position the floating button
    const getButtonPositionStyles = useCallback((): CSSProperties => {
        const margin = 20
        switch (buttonPosition) {
            case "top-left":
                return { top: margin, left: margin }
            case "top-right":
                return { top: margin, right: margin }
            case "bottom-left":
                return { bottom: margin, left: margin }
            case "bottom-right":
            default:
                return { bottom: margin, right: margin }
        }
    }, [buttonPosition])

    // Helper function to toggle line visibility
    const toggleLineVisibility = useCallback((lineName: string) => {
        startTransition(() => {
            setVisibleLines((prev) => {
                const newSet = new Set(prev)
                if (newSet.has(lineName)) {
                    newSet.delete(lineName)
                } else {
                    newSet.add(lineName)
                }
                return newSet
            })
        })
    }, [])

    // Collapsed state - floating circle button
    if (!isExpanded) {
        return (
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                }}
            >
                <button
                    onClick={() => startTransition(() => setIsExpanded(true))}
                    style={{
                        position: "absolute",
                        ...getButtonPositionStyles(),
                        width: buttonSize,
                        height: buttonSize,
                        borderRadius: "50%",
                        border: "none",
                        backgroundColor: buttonColor,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10000,
                        transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.1)"
                        e.currentTarget.style.boxShadow =
                            "0 6px 20px rgba(0,0,0,0.4)"
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)"
                        e.currentTarget.style.boxShadow =
                            "0 4px 16px rgba(0,0,0,0.3)"
                    }}
                    title="Open Map"
                >
                    <svg
                        width={buttonSize * 0.5}
                        height={buttonSize * 0.5}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                </button>
            </div>
        )
    }

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                zIndex: 0,
            }}
        >
            <div
                ref={mapRef}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: showDetailPanel && !isFullWidth ? "66.6666667%" : "100%",
                    height: "100%",
                    overflow: "hidden",
                    backgroundColor: "#F5F5F5",
                    cursor: isDragging ? "grabbing" : "grab",
                    userSelect: "none",
                    zIndex: 0,
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={e => { e.preventDefault(); e.stopPropagation(); handleWheel(e); }}
                onTouchStart={e => { e.stopPropagation(); handleTouchStart(e); }}
                onTouchMove={e => { e.stopPropagation(); handleTouchMove(e); }}
                onTouchEnd={e => { e.stopPropagation(); handleTouchEnd(e as React.TouchEvent); }}
            >
            {/* ========== COMPONENT: System Background - Metro Map Style ========== */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#FAFAFA",
                    backgroundImage: `
                        linear-gradient(rgba(200, 200, 200, 0.15) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(200, 200, 200, 0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                    pointerEvents: "none",
                    opacity: currentMapStyle === "streets" ? 0.3 : 0,
                    zIndex: 0,
                }}
            />
            
            {/* ========== COMPONENT: Ocean/Border Areas ========== */}
            <svg
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    zIndex: 0,
                    opacity: currentMapStyle === "streets" ? 1 : 0,
                }}
            >
                <defs>
                    <pattern
                        id="waterPattern"
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                    >
                        <rect width="20" height="20" fill="#E8F4F8" />
                        <path
                            d="M0 10 Q 5 8, 10 10 T 20 10"
                            stroke="#D0E8F0"
                            strokeWidth="0.5"
                            fill="none"
                        />
                    </pattern>
                </defs>
                <rect x="0" y="0" width="100%" height="2" fill="#D0D0D0" />
                <rect x="0" y="0" width="2" height="100%" fill="#D0D0D0" />
                <rect
                    x="0"
                    y="calc(100% - 2px)"
                    width="100%"
                    height="2"
                    fill="#D0D0D0"
                />
                <rect
                    x="calc(100% - 2px)"
                    y="0"
                    width="2"
                    height="100%"
                    fill="#D0D0D0"
                />
            </svg>

            {/* ========== COMPONENT: Map tiles ========== */}
            {visibleTiles.map((tile) => {
                const offsetX = tile.x - centerPixel.x + containerWidth / 2
                const offsetY = tile.y - centerPixel.y + containerHeight / 2
                return (
                    <div
                        key={`${tile.x}-${tile.y}`}
                        style={{
                            position: "absolute",
                            left: offsetX,
                            top: offsetY,
                            width: 256,
                            height: 256,
                            backgroundImage: `url(${tile.url})`,
                            backgroundSize: "cover",
                            pointerEvents: "none",
                                    filter: (monochrome
                                        ? "grayscale(1) contrast(1.05) brightness(0.95)"
                                        : currentMapStyle === "streets"
                                        ? `saturate(${mapSaturation}) contrast(${mapContrast}) brightness(${mapBrightness}) hue-rotate(${mapHue}deg)`
                                        : "none"),
                            opacity: 0.88,
                            transition: "opacity 200ms ease",
                            zIndex: 1,
                        }}
                    />
                )
            })}

            {/* Modern plain color overlay for a muted, contemporary look */}
            {modernPlain && (
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                        zIndex: 2,
                        background: currentMapStyle === "satellite"
                            ? "linear-gradient(180deg, rgba(20,22,28,0.06), rgba(10,12,16,0.12))"
                            : plainTint,
                        mixBlendMode: "overlay",
                        filter: `grayscale(${Math.max(0, 0.05)}) saturate(${Math.max(0.6, 0.6)}) contrast(${Math.max(0.95, 0.95)})`,
                    }}
                />
            )}

            {/* ========== COMPONENT: Metro lines ========== */}
            {showMetroStations && lineSegments.length > 0 && (
                <svg
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                        zIndex: 500,
                    }}
                >
                            {lineSegments.map((segment) => {
                        if (segment.points.length === 2) {
                            // Simple line segment
                            return (
                                <line
                                    key={segment.lineName}
                                    x1={segment.points[0].x}
                                    y1={segment.points[0].y}
                                    x2={segment.points[1].x}
                                    y2={segment.points[1].y}
                                            stroke={segment.color}
                                            strokeOpacity={0.78}
                                    strokeWidth={lineWidth}
                                    strokeLinecap="round"
                                />
                            )
                        } else {
                            // Polyline for exact route
                            const pathData = segment.points
                                .map(
                                    (point, i) =>
                                        `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`
                                )
                                .join(" ")
                                return (
                                <path
                                    key={segment.lineName}
                                    d={pathData}
                                    stroke={segment.color}
                                    strokeOpacity={0.78}
                                    strokeWidth={lineWidth}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    fill="none"
                                />
                            )
                        }
                    })}
                </svg>
            )}

            {/* ========== COMPONENT: Route Coordinate Dots (Supplementary) ========== */}
            {showMetroStations && routesMap.size > 0 && currentZoom >= 9 && (
                <svg
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                        zIndex: 600,
                    }}
                >
                    {Array.from(routesMap.entries()).map(
                        ([routeKey, coordinates]) => {
                            const [fromStationLower, toStationLower] = routeKey.split("-")
                            const fromStationData = stations.find(
                                (s) =>
                                    s.name.trim().toLowerCase() ===
                                    fromStationLower
                            )

                            if (!fromStationData) return null

                            const fromLines = fromStationData.line
                                .split("&")
                                .map((l) => l.trim())
                            const isLineVisible = fromLines.some((line) =>
                                visibleLines.has(line)
                            )

                            if (!isLineVisible) return null

                            const lineColor =
                                fromStationData.lineColor || "#E91E63"

                                            return coordinates.map((coord, index) => {
                                const pixel = latLngToPixel(
                                    coord.lat,
                                    coord.lng,
                                    currentZoom
                                )
                                const x =
                                    pixel.x - centerPixel.x + containerWidth / 2
                                const y =
                                    pixel.y -
                                    centerPixel.y +
                                    containerHeight / 2

                                const isDotOutside = areaBounds
                                    ? coord.lat < areaBounds.minLat ||
                                      coord.lat > areaBounds.maxLat ||
                                      coord.lng < areaBounds.minLng ||
                                      coord.lng > areaBounds.maxLng
                                    : false

                                        return (
                                    <circle
                                        key={`${routeKey}-dot-${index}`}
                                        cx={x}
                                        cy={y}
                                        r={3}
                                                fill={isDotOutside ? "#9CA3AF" : lineColor}
                                                opacity={isDotOutside ? 0.38 : 0.72}
                                        stroke="#FFFFFF"
                                        strokeOpacity={isDotOutside ? 0.7 : 1}
                                        strokeWidth={1}
                                    />
                                )
                            })
                        }
                    )}
                </svg>
            )}

            {/* Area bounding frame (highlights selected area containing stations) */}
            {areaBounds && (
                <svg
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        pointerEvents: "none",
                        zIndex: 650,
                    }}
                >
                    {(() => {
                        try {
                            const corners = [
                                latLngToPixel(areaBounds.minLat, areaBounds.minLng, currentZoom),
                                latLngToPixel(areaBounds.minLat, areaBounds.maxLng, currentZoom),
                                latLngToPixel(areaBounds.maxLat, areaBounds.minLng, currentZoom),
                                latLngToPixel(areaBounds.maxLat, areaBounds.maxLng, currentZoom),
                            ]
                            const xs = corners.map((c) => c.x)
                            const ys = corners.map((c) => c.y)
                            const minX = Math.min(...xs)
                            const maxX = Math.max(...xs)
                            const minY = Math.min(...ys)
                            const maxY = Math.max(...ys)

                            // World-space center of the bounds
                            const centerWorldX = (minX + maxX) / 2
                            const centerWorldY = (minY + maxY) / 2

                            // Determine if this area contains effectively a single point
                            const isPoint = (maxX - minX) < 2 && (maxY - minY) < 2

                            let x, y, width, height
                            if (isPoint) {
                                // Expand to a reasonable square so the station sits centered
                                const displaySize = Math.min(220, Math.max(80, Math.min(containerWidth, containerHeight) * 0.18))
                                width = displaySize
                                height = displaySize
                                x = centerWorldX - width / 2 - centerPixel.x + containerWidth / 2
                                y = centerWorldY - height / 2 - centerPixel.y + containerHeight / 2
                            } else {
                                x = minX - centerPixel.x + containerWidth / 2
                                y = minY - centerPixel.y + containerHeight / 2
                                width = Math.max(2, maxX - minX)
                                height = Math.max(2, maxY - minY)
                            }

                            // Outside dimming rectangles (top, left, right, bottom)
                            const topH = Math.max(0, y)
                            const leftW = Math.max(0, x)
                            const rightW = Math.max(0, containerWidth - (x + width))
                            const bottomH = Math.max(0, containerHeight - (y + height))

                            return (
                                <g>
                                    <rect x={0} y={0} width={containerWidth} height={topH} fill={selectedArea ? "rgba(0,0,0,0.56)" : "rgba(0,0,0,0.36)"} />
                                    <rect x={0} y={y} width={leftW} height={height} fill={selectedArea ? "rgba(0,0,0,0.56)" : "rgba(0,0,0,0.36)"} />
                                    <rect x={x + width} y={y} width={rightW} height={height} fill={selectedArea ? "rgba(0,0,0,0.56)" : "rgba(0,0,0,0.36)"} />
                                    <rect x={0} y={y + height} width={containerWidth} height={bottomH} fill={selectedArea ? "rgba(0,0,0,0.56)" : "rgba(0,0,0,0.36)"} />

                                    {/* inner clear frame stroke */}
                                    <rect
                                        x={x}
                                        y={y}
                                        width={width}
                                        height={height}
                                        rx={8}
                                        ry={8}
                                        fill="transparent"
                                        stroke="#3EB181"
                                        strokeWidth={2}
                                    />

                                    {/* Close (X) button */}
                                    {(() => {
                                        const btnSize = 18
                                        const padding = 8
                                        // place button just outside the top-right of the frame
                                        let btnX = x + width + padding
                                        // keep inside container if near edge
                                        btnX = Math.min(btnX, containerWidth - btnSize - padding)
                                        const btnY = y - btnSize / 2
                                        const cx = btnX + btnSize / 2
                                        const cy = btnY + btnSize / 2
                                        return (
                                            <g
                                                pointerEvents="all"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setAreaBounds(null)
                                                    setSelectedArea(null)
                                                }}
                                            >
                                                <circle
                                                    cx={cx}
                                                    cy={cy}
                                                    r={btnSize / 2}
                                                    fill="transparent"
                                                    stroke="rgba(255,255,255,0.08)"
                                                />
                                                <g transform={`translate(${cx}, ${cy})`}>
                                                    <line x1={-4} y1={-4} x2={4} y2={4} stroke="#FFFFFF" strokeWidth={1.4} strokeLinecap="round" />
                                                    <line x1={4} y1={-4} x2={-4} y2={4} stroke="#FFFFFF" strokeWidth={1.4} strokeLinecap="round" />
                                                </g>
                                            </g>
                                        )
                                    })()}
                                </g>
                            )
                        } catch (err) {
                            return null
                        }
                    })()}
                </svg>
            )}

            {/* ========== COMPONENT: Metro stations ========== */}
            {showMetroStations && currentZoom <= 15 &&
                visibleStations.map((station, index) => {
                    const stationPixel = latLngToPixel(
                        station.lat,
                        station.lng,
                        currentZoom
                    )
                    const offsetX =
                        stationPixel.x - centerPixel.x + containerWidth / 2
                    const offsetY =
                        stationPixel.y - centerPixel.y + containerHeight / 2
                                        const isHovered = hoveredStation === index
                                        const stationColor = station.lineColor || "#E91E63"
                                        const isOutside = areaBounds
                                                ? station.lat < areaBounds.minLat ||
                                                    station.lat > areaBounds.maxLat ||
                                                    station.lng < areaBounds.minLng ||
                                                    station.lng > areaBounds.maxLng
                                                : false
                                        const effectiveBorderColor = isOutside ? "#9CA3AF" : stationColor
                                        const effectiveBg = isOutside ? "#FFFFFF" : "#FFFFFF"
                                        const effectiveLabelBg = isOutside ? "#F1F5F9" : stationColor
                                        const effectiveLabelColor = isOutside ? "#6b7280" : "#FFFFFF"
                                        const effectiveShadow = isOutside
                                                ? "0 1px 4px rgba(0,0,0,0.06)"
                                                : isHovered
                                                ? `0 0 20px ${stationColor}80, 0 4px 12px rgba(0,0,0,0.2)`
                                                : `0 0 8px ${stationColor}40, 0 2px 6px rgba(0,0,0,0.1)`
                    const stationKey = `${station.lat.toFixed(4)},${station.lng.toFixed(4)}`
                    const isTransferStation = transferStations.has(stationKey)
                    const isAnimating = animatingStationIndex === index
                    const hasDetail = station.isDetail !== false

                    return (
                        <div
                            key={`station-${index}`}
                            style={{
                                position: "absolute",
                                left: offsetX,
                                top: offsetY,
                                pointerEvents: "auto",
                                cursor: "pointer",
                                zIndex: isHovered ? 2000 : 1000,
                                width: 0,
                                height: 0,
                            }}
                            onMouseEnter={() => {
                                cancelHoverHide()
                                startTransition(() => setHoveredStation(index))
                            }}
                            onMouseLeave={() => {
                                scheduleHoverHide()
                            }}
                            onDoubleClick={(e) => {
                                e.stopPropagation()
                                navigateToStation(station)
                            }}
                        >
                            {/* Animated expanding circle */}
                            {isAnimating && circleAnimation > 0 && (
                                <div
                                    style={{
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                        transform: "translate(-50%, -50%)",
                                        width: (hasDetail ? 12 : 8) + circleAnimation * (hasDetail ? 40 : 28),
                                        height: (hasDetail ? 12 : 8) + circleAnimation * (hasDetail ? 40 : 28),
                                        borderRadius: "50%",
                                        border: `${Math.max(1, (hasDetail ? 3 : 2) - circleAnimation * (hasDetail ? 2 : 1.5))}px solid ${stationColor}`,
                                        opacity: 1 - circleAnimation,
                                        pointerEvents: "none",
                                        transition: "all 0.05s linear",
                                    }}
                                />
                            )}

                            {/* anchor at map point */}
                            <div
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                {isTransferStation ? (
                                    <div
                                        style={{
                                            width: hasDetail ? (currentZoom < 12 ? 16 : 24) : (currentZoom < 12 ? 10 : 14),
                                            height: hasDetail ? (currentZoom < 12 ? 16 : 24) : (currentZoom < 12 ? 10 : 14),
                                            borderRadius: "50%",
                                            backgroundColor: isOutside ? "#E9ECEF" : "#9E9E9E",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow: effectiveShadow,
                                            opacity: isOutside ? 0.7 : 1,
                                            transition: "all 0.3s ease",
                                            transform: isHovered
                                                ? "scale(1.25)"
                                                : "scale(1)",
                                            position: "relative",
                                        }}
                                    >
                                        {/* Line number above icon */}
                                        {/*
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: -18,
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                backgroundColor: stationColor,
                                                color: "#fff",
                                                padding: "2px 6px",
                                                borderRadius: 4,
                                                fontSize: 12,
                                                fontWeight: 600,
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {station.line}
                                        </div>
                                        */}
                                        <svg
                                            width={hasDetail ? (currentZoom < 12 ? "8" : "12") : (currentZoom < 12 ? "6" : "8")}
                                            height={hasDetail ? (currentZoom < 12 ? "8" : "12") : (currentZoom < 12 ? "6" : "8")}
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#FFFFFF"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="17 1 21 5 17 9" />
                                            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                                            <polyline points="7 23 3 19 7 15" />
                                            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div
                                        style={{
                                            width: hasDetail ? (currentZoom < 12 ? 8 : 12) : (currentZoom < 12 ? 6 : 8),
                                            height: hasDetail ? (currentZoom < 12 ? 10 : 12) : (currentZoom < 12 ? 6 : 8),
                                            borderRadius: "50%",
                                            backgroundColor: hasDetail ? effectiveBg : stationColor,
                                            border: hasDetail ? `${currentZoom < 12 ? 1 : 2}px solid ${effectiveBorderColor}` : "none",
                                            boxShadow: effectiveShadow,
                                            opacity: isOutside ? 0.75 : 1,
                                            transition: "all 0.3s ease",
                                            transform: isHovered
                                                ? "scale(1.15)"
                                                : "scale(1)",
                                        }}
                                    />
                                )}

                                {currentZoom >= 12 && !isOutside && (hasDetail || currentZoom >= 14) && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: 18,
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            backgroundColor: effectiveLabelBg,
                                            color: effectiveLabelColor,
                                            padding: "4px 8px",
                                            borderRadius: 4,
                                            fontSize:
                                                currentZoom >= 14
                                                    ? 10
                                                    : currentZoom > 12
                                                      ? 10 *
                                                        ((currentZoom - 12) / 2)
                                                      : 0,
                                            fontWeight: 600,
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            boxShadow: isOutside
                                                ? "0 1px 4px rgba(0,0,0,0.06)"
                                                : "0 2px 6px rgba(0,0,0,0.12)",
                                            opacity:
                                                currentZoom >= 14
                                                    ? 1
                                                    : currentZoom > 12
                                                      ? (currentZoom - 12) / 2
                                                      : 0,
                                            transition: "all 0.2s ease",
                                        }}
                                    >
                                        {language === "zh" && station.nameCn
                                            ? station.nameCn
                                            : station.name}
                                    </div>
                                )}

                                {isHovered && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: `${GAP_PX + ARROW_PX}px`,
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            backgroundColor: "#FFFFFF",
                                            borderRadius: 8,
                                            padding: "12px 16px",
                                            boxShadow:
                                                "0 4px 20px rgba(0,0,0,0.15)",
                                            minWidth: 180,
                                            zIndex: 3000,
                                            pointerEvents: "auto",
                                        }}
                                        onMouseEnter={cancelHoverHide}
                                        onMouseLeave={scheduleHoverHide}
                                    >
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: `-${ARROW_PX}px`,
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                width: 0,
                                                height: 0,
                                                borderLeft: `${ARROW_PX}px solid transparent`,
                                                borderRight: `${ARROW_PX}px solid transparent`,
                                                borderTop: `${ARROW_PX}px solid #FFFFFF`,
                                            }}
                                        />

                                        <div
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 700,
                                                color: "#1a1a1a",
                                                marginBottom: 8,
                                                textAlign: "center",
                                            }}
                                        >
                                            {language === "zh" && station.nameCn
                                                ? station.nameCn
                                                : station.name}
                                        </div>
                                        <div
                                            style={{
                                                fontSize: 13,
                                                fontWeight: 500,
                                                color: stationColor,
                                                marginBottom: 8,
                                                textAlign: "center",
                                            }}
                                        >
                                            {station.line}
                                        </div>
                                        {hasDetail && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    navigateToStation(station)
                                                }}
                                                style={{
                                                    width: "100%",
                                                    padding: "8px 12px",
                                                    backgroundColor: stationColor,
                                                    color: "#FFFFFF",
                                                    border: "none",
                                                    borderRadius: 6,
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                    cursor: "pointer",
                                                    transition: "all 0.2s ease",
                                                    boxShadow: `0 2px 8px ${stationColor}40`,
                                                }}
                                            >
                                                {language === "en"
                                                    ? "View Details"
                                                    : "查看详情"}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}

            {/* ========== COMPONENT: Language Toggle Buttons ========== */}
            <div
                style={{
                    position: "absolute",
                    top: 50,
                    right: 50,
                    display: "flex",
                    gap: 8,
                    zIndex: 1000,
                }}
            >
                <button
                    onClick={() => startTransition(() => setLanguage("en"))}
                    style={{
                        padding: "8px 16px",
                        backgroundColor:
                            language === "en" ? "#3EB181" : "#FFFFFF",
                        color: language === "en" ? "#FFFFFF" : "#333",
                        border:
                            language === "en" ? "none" : "1px solid #e0e0e0",
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        transition: "all 0.2s ease",
                    }}
                >
                    EN
                </button>
                <button
                    onClick={() => startTransition(() => setLanguage("zh"))}
                    style={{
                        padding: "8px 16px",
                        backgroundColor:
                            language === "zh" ? "#3EB181" : "#FFFFFF",
                        color: language === "zh" ? "#FFFFFF" : "#333",
                        border:
                            language === "zh" ? "none" : "1px solid #e0e0e0",
                        borderRadius: 6,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        transition: "all 0.2s ease",
                    }}
                >
                    中文
                </button>
            </div>

            {/* ========== COMPONENT: Zoom controls ========== */}
            {showControls && (
                <div
                    style={{
                        position: "absolute",
                        top: 120,
                        right: 50,
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        zIndex: 1000,
                    }}
                >
                    <button
                        onClick={handleZoomIn}
                        className="flex items-center justify-center bg-white rounded-lg shadow text-gray-800 hover:scale-105 transition-transform"
                        style={{ width: 40, height: 40 }}
                    >
                        +
                    </button>
                    <button
                        onClick={handleZoomOut}
                        className="flex items-center justify-center bg-white rounded-lg shadow text-gray-800 hover:scale-105 transition-transform"
                        style={{ width: 40, height: 40 }}
                    >
                        −
                    </button>
                </div>
            )}

            {/* ========== COMPONENT: Map Style Selector (bottom-right, compact) ========== */}
            <div
                style={{
                    position: "absolute",
                    bottom: 60,
                    right: 50,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    zIndex: 1000,
                    pointerEvents: "auto",
                    alignItems: 'center'
                }}
            >
                {['streets', 'satellite', 'terrain'].map((style) => (
                    <button
                        key={style}
                        onClick={() => startTransition(() => setCurrentMapStyle(style as any))}
                        onMouseEnter={() => startTransition(() => setHoveredMapStyle(style))}
                        onMouseLeave={() => startTransition(() => setHoveredMapStyle(null))}
                        aria-label={style}
                        title={style}
                        style={{
                            width: hoveredMapStyle === style ? 40 : 36,
                            height: hoveredMapStyle === style ? 40 : 36,
                            borderRadius: 999,
                            border: currentMapStyle === style ? "3px solid #3EB181" : "2px solid rgba(0,0,0,0.06)",
                            background: 'rgba(255,255,255,0.95)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                        }}
                    >
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                borderRadius: 999,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundImage: `url(${tileUrls[style as keyof typeof tileUrls].replace("{z}", "12").replace("{x}", "3423").replace("{y}", "1790")})`
                            }}
                        />
                    </button>
                ))}
            </div>

            {/* ========== COMPONENT: Component Container Frame ========== */}
            <div
                style={{
                    position: "absolute",
                    top: 50,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    zIndex: 1000,
                    pointerEvents: "none",
                }}
            >
                {/* ========== COMPONENT: Search Bar ========== */}
                <div style={{ position: "relative", width: 860 * mapScale, maxWidth: showDetailPanel && !isFullWidth ? `calc((100vw - 160px) * ${mapScale})` : "calc(100vw - 160px)", pointerEvents: "auto" }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={language === "en" ? "Search metro stations..." : "搜索地铁站..."}
                        style={{
                            width: "100%",
                            padding: "12px 44px 12px 16px",
                            borderRadius: 999,
                            border: "1px solid rgba(42,56,62,0.06)",
                            backgroundColor: "rgba(255,255,255,0.78)",
                            color: "#2A383E",
                            fontSize: 15,
                            fontWeight: 600,
                            outline: "none",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                        }}
                    />

                    {/* ========== COMPONENT: Areas Menu (centered below search) ========== */}
                    <div style={{ marginTop: 12, display: "flex", justifyContent: "center", pointerEvents: "auto", width: "100%" }}>
                            <div
                            ref={areaMenuRef}
                            onMouseDown={(e) => e.stopPropagation()}
                            onMouseMove={(e) => e.stopPropagation()}
                            onMouseUp={(e) => e.stopPropagation()}
                            onTouchEnd={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                            onTouchStart={(e) => {
                                e.stopPropagation()
                                setIsUserScrolling(true)
                                clearResumeTimer()
                            }}
                            onWheel={(e) => {
                                e.stopPropagation();
                                // Scroll the area menu horizontally with wheel and treat as user interaction
                                const el = e.currentTarget as HTMLDivElement;
                                el.scrollLeft += e.deltaY;
                                setIsUserScrolling(true)
                                startResumeTimer()
                            }}
                            onScroll={() => {
                                setIsUserScrolling(true)
                                startResumeTimer()
                            }}
                            onPointerDown={() => {
                                setIsUserScrolling(true)
                                clearResumeTimer()
                            }}
                            style={{
                                width: 980 * mapScale,
                                maxWidth: showDetailPanel && !isFullWidth ? `calc((100vw - 80px) * ${mapScale})` : "calc(100vw - 80px)",
                                overflowX: "auto",
                                display: "flex",
                                gap: 8,
                                padding: "8px",
                                backgroundColor: "transparent",
                                backdropFilter: "none",
                                WebkitBackdropFilter: "none",
                                border: "none",
                                borderRadius: 12,
                                boxShadow: "none",
                                touchAction: "pan-y",
                                // Thin transparent scrollbar where supported
                                scrollbarWidth: "thin",
                                scrollbarColor: "transparent transparent",
                            }}
                        >
                            {areaList.map((area) => (
                                <button
                                    key={area}
                                    onClick={() => {
                                        // Pause auto-scroll immediately when user activates a button
                                        setIsUserScrolling(true)
                                        clearResumeTimer()
                                        // select area and fit
                                        setSelectedArea(area)
                                        fitArea(area)
                                    }}
                                    style={{
                                        flex: "0 0 auto",
                                        padding: "8px 12px",
                                        // Active state when explicitly selected via the area button
                                        backgroundColor: selectedArea === area ? "#3EB181" : (searchQuery === area ? "rgba(62,177,129,0.08)" : "rgba(255,255,255,0.72)"),
                                        color: selectedArea === area ? "#FFFFFF" : "#2A383E",
                                        border: selectedArea === area ? "1px solid rgba(255,255,255,0.08)" : (searchQuery === area ? "1px solid rgba(62,177,129,0.12)" : "1px solid rgba(42,56,62,0.06)"),
                                        backdropFilter: "blur(8px)",
                                        WebkitBackdropFilter: "blur(8px)",
                                        borderRadius: 999,
                                        fontSize: 13,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        boxShadow: selectedArea === area ? "0 12px 36px rgba(62,177,129,0.16)" : (searchQuery === area ? "0 8px 24px rgba(62,177,129,0.08)" : "0 4px 12px rgba(0,0,0,0.06)"),
                                    }}
                                >
                                    {area}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search Results Dropdown */}
                    {showSearchResults && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl max-h-96 overflow-y-auto z-50">
                            {searchResults.map((station, index) => {
                                const globalIndex = stations.findIndex(
                                    (s) => s.lat === station.lat && s.lng === station.lng && s.name === station.name
                                )
                                return (
                                    <div
                                        key={`search-result-${index}`}
                                        onClick={() => {
                                            if (globalIndex !== -1) {
                                                moveToStation(station, globalIndex)
                                            }
                                        }}
                                        className="p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
                                    >
                                        <div className="font-semibold text-gray-900 mb-1">
                                            {language === "zh" && station.nameCn ? station.nameCn : station.name}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <div style={{ width: 20, height: 4, backgroundColor: station.lineColor || "#E91E63", borderRadius: 2 }} />
                                            {station.line}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Map Style Selector moved near zoom controls */}
            </div>

            {/* ========== COMPONENT: METRO SYSTEM Title ========== */}
            <div
    style={{
        position: "absolute",
        bottom: 150,
        left: 50,
        fontSize: 96,
        fontWeight: 900,
        fontFamily: language === "zh" ? "'Noto Sans SC', sans-serif" : "Inter",
        color: selectedArea ? "#FFFFFF" : "#2A383E",
        letterSpacing: "0.05em",
        pointerEvents: "none",
        zIndex: 1000,
        lineHeight: language === "zh" ? "1em" : "0.85em",
        textRendering: "optimizeLegibility",
        backdropFilter: "blur(0.5px)", // Optional: adds subtle blur effect
        WebkitBackdropFilter: "blur(0.5px)", // For Safari
        textShadow: selectedArea ? "0 6px 20px rgba(0,0,0,0.45)" : "0 1px 6px rgba(0,0,0,0.06)",
    }}
>
    {language === "zh" ? (
        <div>地铁系统</div>
    ) : (
        <>
            <div>Shenzhen</div>
            <div>Subway</div>
        </>
    )}
</div>

            {/* ========== COMPONENT: Legend Window ========== */}
            {showLegend && showMetroStations && uniqueLines.length > 0 && showLegendWindow && (
                <div className="absolute top-1/2 -translate-y-1/2 bg-white rounded-xl p-5 shadow-xl z-50 min-w-[200px] max-w-sm" style={{ right: 50 }}>
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                        <div className="font-bold text-gray-900">{language === "en" ? "Metro Lines" : "地铁线路"}</div>
                        <button 
                            onClick={() => startTransition(() => setShowLegendWindow(false))}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {uniqueLines.map((line, index) => {
                            const isVisible = visibleLines.has(line.name)
                            return (
                                <div
                                    key={index}
                                    onClick={() => toggleLineVisibility(line.name)}
                                    className="flex items-center gap-2 cursor-pointer p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${isVisible ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                                       {isVisible && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                    </div>
                                    <div
                                        style={{ backgroundColor: line.color, opacity: isVisible ? 1 : 0.3 }}
                                        className="w-6 h-1.5 rounded-full transition-opacity"
                                    />
                                    <div className={`text-xs font-medium truncate ${isVisible ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {translateLineName(line.name, language)}
                                    </div>
                                </div>
                            )
                        })}
                        </div>
                    </div>
                )}
    
            {/* Duplicate horizontal area menu removed - use central menu only */}

            {/* ========== COMPONENT: Legend Toggle Button ========== */}
            {showLegend && showMetroStations && uniqueLines.length > 0 && !showLegendWindow && (
                <button
                    onClick={() => startTransition(() => setShowLegendWindow(true))}
                    className="absolute top-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/95 shadow-lg flex items-center justify-center text-xs font-semibold text-gray-800 hover:scale-110 transition-transform z-50 p-2 text-center"
                    title="Show Metro Lines"
                    style={{ right: 50 }}
                >
                    {language === "en" ? "Lines" : "线路"}
                </button>
            )}

            </div>

            {/* ========== COMPONENT: Side Panel for CMS Content ========== */}
            {showDetailPanel && (
                // External controls: when details are full-width, place the two-button
                // stack inside a left-centered white frame with asymmetric curvy corners.
                (isFullWidth) ? (
                    <div
                        style={{
                            position: 'fixed',
                            left: 0,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 7000,
                            pointerEvents: 'auto',
                        }}
                    >
                        <div
                            style={{
                                background: 'rgba(255,255,255,0.64)',
                                backdropFilter: 'blur(6px)',
                                WebkitBackdropFilter: 'blur(6px)',
                                padding: '6px 8px',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                borderRadius: '0 18px 18px 0',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 8,
                                alignItems: 'center',
                            }}
                        >
                            <button
                                onClick={() => startTransition(() => setIsFullWidth((s) => !s))}
                                aria-label={language === 'en' ? (isFullWidth ? 'Collapse details' : 'Expand details') : (isFullWidth ? '收起详情' : '展开详情')}
                                title={language === 'en' ? (isFullWidth ? 'Collapse' : 'Expand') : (isFullWidth ? '收起' : '展开')}
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 999,
                                    background: 'transparent',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#111111'
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
                            </button>

                            <button
                                onClick={() => startTransition(() => { setShowDetailPanel(false); setIsFullWidth(false); setCmsUrl('') })}
                                aria-label={language === 'en' ? 'Close details' : '关闭详情'}
                                title={language === 'en' ? 'Close' : '关闭'}
                                style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 999,
                                    background: 'transparent',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: '#111111'
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>
                ) : (
                    // original right-side stack when not full-width
                    <div
                        style={{
                            position: 'absolute',
                            right: 'calc(33.3333333% + 10px)',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            alignItems: 'center',
                            zIndex: 7000,
                            pointerEvents: 'auto',
                        }}
                    >
                        <button
                            onClick={() => startTransition(() => setIsFullWidth((s) => !s))}
                            aria-label={language === 'en' ? (isFullWidth ? 'Collapse details' : 'Expand details') : (isFullWidth ? '收起详情' : '展开详情')}
                            title={language === 'en' ? (isFullWidth ? 'Collapse' : 'Expand') : (isFullWidth ? '收起' : '展开')}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 999,
                                background: isFullWidth ? '#FFFFFF' : '#111111',
                                border: isFullWidth ? '1px solid rgba(0,0,0,0.06)' : 'none',
                                boxShadow: isFullWidth ? '0 6px 18px rgba(0,0,0,0.12)' : '0 6px 18px rgba(0,0,0,0.24)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: isFullWidth ? '#111111' : '#FFFFFF'
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isFullWidth ? '#111111' : '#FFFFFF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
                        </button>

                        <button
                            onClick={() => startTransition(() => { setShowDetailPanel(false); setIsFullWidth(false); setCmsUrl('') })}
                            aria-label={language === 'en' ? 'Close details' : '关闭详情'}
                            title={language === 'en' ? 'Close' : '关闭'}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 999,
                                background: isFullWidth ? '#FFFFFF' : '#111111',
                                border: isFullWidth ? '1px solid rgba(0,0,0,0.06)' : 'none',
                                boxShadow: isFullWidth ? '0 6px 18px rgba(0,0,0,0.12)' : '0 6px 18px rgba(0,0,0,0.24)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: isFullWidth ? '#111111' : '#FFFFFF'
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isFullWidth ? '#111111' : '#FFFFFF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                    </div>
                )
            )}

            {showDetailPanel && (
                <div
                    style={{ width: isFullWidth ? "100%" : "33.3333333%" }}
                    className="absolute top-0 right-0 h-full bg-white shadow-2xl z-[5000] flex flex-col transition-[width] duration-300 ease-in-out"
                >
                    {/* topbar removed per UX request */}

                    <div className="flex-1 relative w-full h-full">
                         <iframe
                            src={cmsUrl}
                            className="w-full h-full border-0"
                            title="Station Details"
                            style={{ zIndex: 6000, position: "relative" }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default GisMap;