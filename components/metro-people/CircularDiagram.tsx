// Circular shaped diagram (donut chart) with configurable segments, colors, and fonts
import {
    useMemo,
    useState,
    startTransition,
    type CSSProperties,
    type MouseEvent,
    useEffect,
    useRef,
} from "react"
import { motion, useInView } from "framer-motion"

export interface Segment {
    label: string
    value: number
    color: string
}

export interface CircularDiagramProps {
    segments?: Segment[]
    backgroundColor?: string
    showCenterTotal?: boolean
    showLegend?: boolean
    centerLabel?: string
    centerFontSize?: number
    centerFontWeight?: number | string
    legendFontSize?: number
    legendFontWeight?: number | string
    textColor?: string
    title?: string
    size?: number
    style?: CSSProperties
    highlightedLabel?: string | null
}

const defaultSegments: Segment[] = [
    { label: "One", value: 40, color: "#FF5588" },
    { label: "Two", value: 30, color: "#0099FF" },
    { label: "Three", value: 20, color: "#22CC66" },
    { label: "Four", value: 10, color: "#FFBB00" },
]

export default function CircularDiagram({
    segments = defaultSegments,
    backgroundColor = "#FFFFFF",
    showCenterTotal = true,
    showLegend = true,
    centerLabel = "Total",
    centerFontSize = 18,
    centerFontWeight = 700,
    legendFontSize = 12,
    legendFontWeight = 500,
    textColor = "#000000",
    title = "",
    size,
    style,
    highlightedLabel = null,
}: CircularDiagramProps) {
    const [hoverIndex, setHoverIndex] = useState<number | null>(null)
    const [hasAnimated, setHasAnimated] = useState(false)
    const [hasScrolled, setHasScrolled] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const isInView = useInView(containerRef, {
        margin: "0px 0px -10% 0px",
        once: true,
    })

    // Trigger animation when component comes into view
    useEffect(() => {
        if (isInView && !hasAnimated) {
            // Small delay to ensure smooth animation start
            const timer = setTimeout(() => {
                startTransition(() => {
                    setHasAnimated(true)
                })
            }, 100)
            return () => clearTimeout(timer)
        }
    }, [isInView, hasAnimated])

    useEffect(() => {
        if (typeof window === "undefined") return

        const handleScroll = () => {
            startTransition(() => {
                setHasScrolled(true)
            })
        }

        window.addEventListener("scroll", handleScroll, { passive: true })

        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    const { total, normalizedSegments } = useMemo(() => {
        const safeSegments = Array.isArray(segments) ? segments : []
        const sum = safeSegments.reduce(
            (acc, s) => acc + (isFinite(s.value) ? Math.max(s.value, 0) : 0),
            0
        )
        const norm =
            sum > 0
                ? safeSegments.map((s) => ({
                      ...s,
                      value: Math.max(s.value, 0),
                  }))
                : safeSegments.map((s) => ({
                      ...s,
                      value: 0,
                  }))
        return { total: sum, normalizedSegments: norm }
    }, [segments])

    const radius = 40
    const strokeWidth = 16
    const circumference = 2 * Math.PI * radius

    const segmentRenderData = useMemo(() => {
        const data: { path: string; color: string }[] = []

        if (!normalizedSegments.length || total <= 0) return data

        let offsetAccumulator = 0

        for (const segment of normalizedSegments) {
            const fraction = segment.value / total
            const segmentLength = fraction * circumference
            const startLength = offsetAccumulator
            const endLength = offsetAccumulator + segmentLength
            offsetAccumulator = endLength

            const path = describeArcPath(50, 50, radius, startLength, endLength)
            data.push({ path, color: segment.color })
        }

        return data
    }, [normalizedSegments, total, circumference])

    const handleMouseEnter = (index: number) => {
        startTransition(() => setHoverIndex(index))
    }

    const handleMouseLeave = (_e: MouseEvent<SVGPathElement>) => {
        startTransition(() => setHoverIndex(null))
    }

    const centerText = showCenterTotal && total > 0 ? `${total}` : centerLabel

    const shouldAnimatePaths = hasAnimated

    const centerFontStyle: CSSProperties = {
        fontSize: centerFontSize,
        fontWeight: centerFontWeight,
        letterSpacing: "-0.02em",
        lineHeight: "1.1em",
        textAlign: "center",
    }

    const legendFontStyle: CSSProperties = {
        fontSize: legendFontSize,
        fontWeight: legendFontWeight,
        letterSpacing: "-0.01em",
        lineHeight: "1.2em",
    }

    return (
        <div
            ref={containerRef}
            style={{
                position: "relative",
                width: size || "100%",
                height: size || "100%",
                boxSizing: "border-box",
                backgroundColor,
                borderRadius: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: 16,
                ...(style || {}),
            }}
        >
            {title && (
                <div
                    style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        marginBottom: 8,
                        color: textColor,
                        ...legendFontStyle,
                    }}
                >
                    {title}
                </div>
            )}
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: showLegend ? "70%" : "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <svg
                    viewBox="0 0 100 100"
                    style={{
                        width: "100%",
                        height: "100%",
                        transform: "rotate(-90deg)",
                        overflow: "visible",
                    }}
                    aria-label="Circular diagram"
                    role="img"
                >
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke="#EEEEEE"
                        strokeWidth={strokeWidth}
                    />
                    {segmentRenderData.map((segment, index) => {
                        const isHovered = hoverIndex === index
                        const segmentLabel = normalizedSegments[index]?.label
                        const isHighlighted = highlightedLabel === segmentLabel
                        const isDimmed = highlightedLabel !== null && !isHighlighted
                        const effectiveStrokeWidth = isHovered || isHighlighted
                            ? strokeWidth + 2
                            : strokeWidth

                        return (
                            <motion.path
                                key={index}
                                d={segment.path}
                                fill="none"
                                stroke={isDimmed ? "#CCCCCC" : segment.color}
                                strokeWidth={effectiveStrokeWidth}
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{
                                    pathLength: shouldAnimatePaths ? 1 : 0,
                                    opacity: isDimmed ? 0.4 : 1,
                                }}
                                transition={
                                    shouldAnimatePaths
                                        ? {
                                              duration: 0.8,
                                              delay: index * 0.15,
                                              ease: "easeOut",
                                          }
                                        : { duration: 0 }
                                }
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={handleMouseLeave}
                                style={{
                                    filter: isHighlighted ? "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" : undefined,
                                }}
                            />
                        )
                    })}
                </svg>

                {centerText && (
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            textAlign: "center",
                            minWidth: "max-content",
                            pointerEvents: "none",
                            color: textColor,
                            ...centerFontStyle,
                        }}
                    >
                        <span>{centerText}</span>
                    </div>
                )}
            </div>

            {showLegend && normalizedSegments.length > 0 && (
                <div
                    style={{
                        width: "100%",
                        marginTop: 12,
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 8,
                        color: textColor,
                        ...legendFontStyle,
                    }}
                    aria-label="Diagram legend"
                >
                    {normalizedSegments.map((segment, index) => {
                        const fraction = total > 0 ? segment.value / total : 0
                        const percentage = Math.round(fraction * 100)
                        const isHovered = hoverIndex === index
                        const isHighlighted = highlightedLabel === segment.label
                        const isDimmed = highlightedLabel !== null && !isHighlighted

                        return (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    padding: "2px 6px",
                                    borderRadius: 999,
                                    backgroundColor: isHovered || isHighlighted
                                        ? "#F5F5F5"
                                        : "transparent",
                                    cursor: "default",
                                    opacity: isDimmed ? 0.4 : 1,
                                }}
                            >
                                <span
                                    aria-hidden="true"
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: "50%",
                                        backgroundColor: isDimmed ? "#CCCCCC" : segment.color,
                                        flexShrink: 0,
                                    }}
                                />
                                <span
                                    style={{
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {segment.label}
                                    {total > 0 ? ` • ${percentage}%` : ""}
                                </span>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function describeArcPath(
    cx: number,
    cy: number,
    r: number,
    startLength: number,
    endLength: number
): string {
    const startAngle = (startLength / (2 * Math.PI * r)) * 360
    const endAngle = (endLength / (2 * Math.PI * r)) * 360

    const start = polarToCartesian(cx, cy, r, endAngle)
    const end = polarToCartesian(cx, cy, r, startAngle)

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1"

    return [
        "M",
        start.x,
        start.y,
        "A",
        r,
        r,
        0,
        largeArcFlag,
        0,
        end.x,
        end.y,
    ].join(" ")
}

function polarToCartesian(
    cx: number,
    cy: number,
    r: number,
    angleInDegrees: number
) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
    return {
        x: cx + r * Math.cos(angleInRadians),
        y: cy + r * Math.sin(angleInRadians),
    }
}
