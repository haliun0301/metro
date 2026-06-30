// Column diagram: vertical axis is number of people, horizontal axis is decade
import React, {
    type CSSProperties,
    useMemo,
    useState,
    useEffect,
    startTransition,
    useRef,
} from "react"
import { motion, useInView } from "framer-motion"

export interface DataPoint {
    year: string
    total: number
}

export interface ColumnDiagramProps {
    data?: DataPoint[]
    maxPeople?: number
    showGrid?: boolean
    backgroundColor?: string
    axisColor?: string
    gridColor?: string
    columnColor?: string
    labelFontSize?: number
    labelFontWeight?: number | string
    axisFontSize?: number
    axisFontWeight?: number | string
    style?: CSSProperties
    gridSteps?: number
    columnSpacing?: number
    responsiveMode?: "auto" | "mobile" | "tablet" | "desktop"
    onColumnClick?: (dataPoint: DataPoint) => void
    labelGridSpacing?: number
    width?: number
    height?: number
    highlightedYear?: string | null
}

const defaultData: DataPoint[] = [
    { year: "1940s", total: 4 },
    { year: "1950s", total: 4 },
    { year: "1960s", total: 10 },
    { year: "1970s", total: 39 },
    { year: "1980s", total: 15 },
    { year: "1990s", total: 20 },
    { year: "2000s", total: 19 },
]

export const birthYearData: DataPoint[] = [
    { year: "1940s", total: 4 },
    { year: "1950s", total: 4 },
    { year: "1960s", total: 10 },
    { year: "1970s", total: 39 },
    { year: "1980s", total: 15 },
    { year: "1990s", total: 20 },
    { year: "2000s", total: 19 },
]

export const arrivalYearData: DataPoint[] = [
    { year: "1970s", total: 2 },
    { year: "1980s", total: 9 },
    { year: "1990s", total: 40 },
    { year: "2000s", total: 23 },
    { year: "2010s", total: 4 },
]

export default function ColumnDiagram({
    data = defaultData,
    maxPeople = 10,
    showGrid = true,
    backgroundColor = "#FFFFFF",
    axisColor = "#333333",
    gridColor = "#EEEEEE",
    columnColor = "#FFBB00",
    labelFontSize = 13,
    labelFontWeight = 500,
    axisFontSize = 12,
    axisFontWeight = 600,
    style,
    gridSteps = 4,
    columnSpacing = 16,
    responsiveMode = "auto",
    onColumnClick,
    labelGridSpacing = 4,
    width,
    height,
    highlightedYear = null,
}: ColumnDiagramProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const isInView = useInView(containerRef, {
        margin: "0px 0px -10% 0px",
        once: true,
    })

    const [breakpoint, setBreakpoint] = useState<"mobile" | "tablet" | "desktop">("desktop")
    const [hovered, setHovered] = useState<DataPoint | null>(null)
    const [animateIn, setAnimateIn] = useState(false)

    const safeMax = useMemo(() => {
        if (!data || data.length === 0) return Math.max(1, maxPeople)
        const maxFromData = Math.max(...data.map((d) => d.total), 0)
        return Math.max(maxFromData || 1, maxPeople || 1)
    }, [data, maxPeople])

    useEffect(() => {
        if (responsiveMode && responsiveMode !== "auto") {
            startTransition(() => setBreakpoint(responsiveMode))
            return
        }

        if (typeof window === "undefined") return

        const computeBreakpoint = () => {
            const w = window.innerWidth
            let bp: "mobile" | "tablet" | "desktop"

            if (w < 600) {
                bp = "mobile"
            } else if (w < 1024) {
                bp = "tablet"
            } else {
                bp = "desktop"
            }

            startTransition(() => setBreakpoint(bp))
        }

        computeBreakpoint()
        window.addEventListener("resize", computeBreakpoint)

        return () => {
            window.removeEventListener("resize", computeBreakpoint)
        }
    }, [responsiveMode])

    // Trigger animation when in view
    useEffect(() => {
        if (isInView && !animateIn) {
            const timer = setTimeout(() => {
                startTransition(() => setAnimateIn(true))
            }, 100)
            return () => clearTimeout(timer)
        }
    }, [isInView, animateIn])

    const containerPadding = breakpoint === "mobile" ? 8 : breakpoint === "tablet" ? 12 : 16
    const yAxisWidth = breakpoint === "mobile" ? 32 : 40
    const columnGap = columnSpacing
    const headerGap = breakpoint === "mobile" ? 4 : 8

    const containerStyle: CSSProperties = {
        position: "relative",
        width: width || "100%",
        height: height || "100%",
        backgroundColor,
        display: "flex",
        flexDirection: "column",
        padding: containerPadding,
        boxSizing: "border-box",
        minWidth: 320,
        minHeight: 220,
        gap: headerGap,
    }

    const axisLabelStyle: CSSProperties = {
        fontSize: axisFontSize,
        fontWeight: axisFontWeight,
        lineHeight: "1.2em",
        letterSpacing: "-0.01em",
        color: axisColor,
        whiteSpace: "nowrap",
    }

    const yearLabelStyle: CSSProperties = {
        fontSize: labelFontSize,
        fontWeight: labelFontWeight,
        lineHeight: "1.2em",
        letterSpacing: "-0.01em",
        color: axisColor,
        textAlign: "center",
        width: "max-content",
        margin: "0 auto",
    }

    const yTickLabelStyle: CSSProperties = {
        fontSize: axisFontSize - 2,
        fontWeight: axisFontWeight,
        lineHeight: "1.2em",
        letterSpacing: "-0.01em",
        color: axisColor,
        textAlign: "right",
        whiteSpace: "nowrap",
    }

    const peopleTicks = useMemo(() => {
        const steps = Math.max(1, gridSteps || 1)
        const stepValue = safeMax / steps
        const result: number[] = []
        for (let i = 0; i <= steps; i++) {
            const value = i === steps ? safeMax : Math.round(stepValue * i)
            result.push(value)
        }
        return result
    }, [safeMax, gridSteps])

    const getBarHeightPercent = (value: number) => {
        if (safeMax <= 0) return 0
        return (value / safeMax) * 100
    }

    return (
        <div ref={containerRef} style={{ ...containerStyle, ...style }}>
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "row",
                    gap: breakpoint === "mobile" ? 4 : 8,
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: yAxisWidth,
                        paddingRight: 4,
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        position: "relative",
                    }}
                />

                <div
                    style={{
                        position: "relative",
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0,
                        paddingTop: 8,
                        paddingRight: 8,
                        paddingLeft: 4,
                        paddingBottom: 0,
                        boxSizing: "border-box",
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            flex: 1,
                            display: "flex",
                            alignItems: "stretch",
                            justifyContent: "space-between",
                            gap: columnGap,
                            paddingBottom: 0,
                        }}
                    >
                        {showGrid && (
                            <div
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    pointerEvents: "none",
                                }}
                            >
                                {peopleTicks.map((tick, index) => {
                                    const percent =
                                        peopleTicks.length > 1
                                            ? (index / (peopleTicks.length - 1)) * 100
                                            : 0
                                    return (
                                        <React.Fragment key={`${tick}-${index}`}>
                                            <motion.div
                                                initial={{ opacity: 0, scaleX: 0 }}
                                                animate={animateIn ? { opacity: 0.4, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                                style={{
                                                    position: "absolute",
                                                    left: 0,
                                                    right: 0,
                                                    bottom: `${percent}%`,
                                                    borderBottom: `1px solid ${gridColor}`,
                                                    transformOrigin: "left",
                                                }}
                                            />
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={animateIn ? { opacity: 1 } : { opacity: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                                style={{
                                                    position: "absolute",
                                                    left: 0,
                                                    top: `${100 - percent}%`,
                                                    transform: `translate(${-labelGridSpacing}px, -50%)`,
                                                }}
                                            >
                                                <span style={yTickLabelStyle}>{peopleTicks[index]}</span>
                                            </motion.div>
                                        </React.Fragment>
                                    )
                                })}
                            </div>
                        )}

                        {data.map((d, index) => {
                            const isHighlighted = highlightedYear === d.year
                            const isDimmed = highlightedYear !== null && !isHighlighted

                            return (
                                <div
                                    key={d.year}
                                    style={{
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "stretch",
                                        justifyContent: "flex-end",
                                        gap: 2,
                                        position: "relative",
                                    }}
                                >
                                    <div
                                        style={{
                                            position: "relative",
                                            flex: 1,
                                            display: "flex",
                                            alignItems: "flex-end",
                                            justifyContent: "center",
                                            gap: 4,
                                        }}
                                    >
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={animateIn
                                                ? {
                                                    height: `${getBarHeightPercent(d.total)}%`,
                                                    opacity: isDimmed ? 0.3 : 1,
                                                    scale: isHighlighted ? 1.1 : 1,
                                                }
                                                : { height: 0, opacity: 0 }
                                            }
                                            transition={{
                                                duration: 0.8,
                                                delay: index * 0.15,
                                                ease: "easeOut",
                                            }}
                                            whileHover={{ y: -4, boxShadow: "0 4px 10px rgba(0,0,0,0.25)" }}
                                            style={{
                                                width: "40%",
                                                minHeight: 0,
                                                backgroundColor: isDimmed ? "#CCCCCC" : columnColor,
                                                borderRadius: 4,
                                                cursor: onColumnClick ? "pointer" : "default",
                                                boxShadow: isHighlighted ? "0 4px 12px rgba(0,0,0,0.3)" : undefined,
                                            }}
                                            aria-label={`Total in ${d.year}: ${d.total} people`}
                                            onClick={() => {
                                                if (onColumnClick) {
                                                    onColumnClick(d)
                                                }
                                            }}
                                            onMouseEnter={() => {
                                                startTransition(() => setHovered(d))
                                            }}
                                            onMouseLeave={() => {
                                                startTransition(() => setHovered(null))
                                            }}
                                        />
                                        {hovered?.year === d.year && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 0 }}
                                                animate={{ opacity: 1, y: -8 }}
                                                exit={{ opacity: 0 }}
                                                style={{
                                                    position: "absolute",
                                                    bottom: `${getBarHeightPercent(d.total)}%`,
                                                    padding: "4px 8px",
                                                    borderRadius: 4,
                                                    backgroundColor: "rgba(0,0,0,0.8)",
                                                    color: "#FFFFFF",
                                                    whiteSpace: "nowrap",
                                                    fontSize: 11,
                                                    pointerEvents: "none",
                                                }}
                                            >
                                                {`${d.year}: ${d.total}`}
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={animateIn ? { scaleX: 1 } : { scaleX: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            height: 1,
                            backgroundColor: axisColor,
                            marginTop: 0,
                            transformOrigin: "left",
                        }}
                    />

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginTop: 8,
                        }}
                    >
                        {data.map((d, index) => (
                            <motion.div
                                key={d.year}
                                initial={{ opacity: 0, y: 10 }}
                                animate={animateIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                                style={{
                                    flex: 1,
                                    textAlign: "center",
                                }}
                            >
                                <span style={yearLabelStyle}>{d.year}</span>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={animateIn ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 }}
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: 0,
                        }}
                    >
                        <span style={axisLabelStyle}>Year / decade</span>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
