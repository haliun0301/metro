import { startTransition, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react"
import { motion, useInView } from "framer-motion"

type Language = "en" | "zh"

export interface OccupationItem {
    label: string
    value: number
    category?: string
}

export interface OccupationCloudProps {
    data?: OccupationItem[]
    backgroundColor?: string
    highlightedLabel?: string | null
    onHoverOccupation?: (label: string | null) => void
    language?: Language
    categoryColorMap?: Record<string, string>
    showLegend?: boolean
    showSummary?: boolean
    animateOnMount?: boolean
    renderHoverContent?: (item: OccupationItem) => ReactNode
    hoverAvoidSelector?: string
    style?: CSSProperties
}

const uiCopy = {
    totalPeople: { en: "Total People", zh: "总人数" },
    occupations: { en: "Occupations", zh: "职业数" },
    categories: { en: "Categories", zh: "类别数" },
    ofTotal: { en: "of total", zh: "占总数" },
} as const

// Category colors
const categoryColors: Record<string, string> = {
    "Business & Enterprise": "#2196F3",
    "Non-Working / Other": "#9E9E9E",
    "Finance & Commerce": "#4CAF50",
    "STEM": "#FF9800",
    "Education & Academia": "#9C27B0",
    "Public Sector": "#E91E63",
    "Operations & Logistics": "#00BCD4",
    "Professional Services": "#795548",
    "Personal & Retail": "#607D8B",
}

// Default occupation data with categories
const defaultOccupationData: OccupationItem[] = [
    // Non-Working / Other Status
    { label: "Student", value: 19, category: "Non-Working / Other" },
    { label: "Retiree", value: 5, category: "Non-Working / Other" },
    { label: "Full-time housewife", value: 2, category: "Non-Working / Other" },
    { label: "Underemployment", value: 1, category: "Non-Working / Other" },
    
    // Business & Enterprise
    { label: "Self-employed", value: 10, category: "Business & Enterprise" },
    { label: "Enterprise manager", value: 9, category: "Business & Enterprise" },
    { label: "Enterprise employee", value: 8, category: "Business & Enterprise" },
    { label: "Sales", value: 1, category: "Business & Enterprise" },
    { label: "Trade union manager", value: 1, category: "Business & Enterprise" },
    { label: "Director of homeowners' committee", value: 1, category: "Business & Enterprise" },
    
    // Finance & Commerce
    { label: "Finance", value: 5, category: "Finance & Commerce" },
    { label: "Banking industry", value: 3, category: "Finance & Commerce" },
    { label: "Financial industry", value: 2, category: "Finance & Commerce" },
    { label: "Real estate", value: 1, category: "Finance & Commerce" },
    { label: "Cross-border e-commerce", value: 1, category: "Finance & Commerce" },
    
    // STEM
    { label: "Engineer", value: 3, category: "STEM" },
    { label: "IT industry", value: 2, category: "STEM" },
    { label: "Communication industry", value: 2, category: "STEM" },
    { label: "Mechanical manufacturing", value: 1, category: "STEM" },
    { label: "Construction industry", value: 1, category: "STEM" },
    { label: "Electric power", value: 1, category: "STEM" },
    { label: "Designer", value: 1, category: "STEM" },
    
    // Education & Academia
    { label: "University teacher", value: 7, category: "Education & Academia" },
    { label: "Middle school teacher", value: 3, category: "Education & Academia" },
    { label: "Education and training", value: 1, category: "Education & Academia" },
    
    // Public Sector
    { label: "Staff of state-owned enterprises", value: 3, category: "Public Sector" },
    { label: "Government agency", value: 2, category: "Public Sector" },
    
    // Operations & Logistics
    { label: "Logistics industry", value: 3, category: "Operations & Logistics" },
    { label: "Service industry", value: 1, category: "Operations & Logistics" },
    
    // Professional Services
    { label: "Lawyer", value: 1, category: "Professional Services" },
    { label: "Pharmacist", value: 1, category: "Professional Services" },
    
    // Personal & Retail
    { label: "Beautician", value: 1, category: "Personal & Retail" },
    { label: "Migrant worker", value: 1, category: "Personal & Retail" },
]

// Generate lighter shade
function lightenColor(hex: string, percent: number): string {
    const cleanHex = hex.replace('#', '')
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    const newR = Math.min(255, Math.round(r + (255 - r) * percent))
    const newG = Math.min(255, Math.round(g + (255 - g) * percent))
    const newB = Math.min(255, Math.round(b + (255 - b) * percent))
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

export default function OccupationCloud({
    data = defaultOccupationData,
    backgroundColor = "transparent",
    highlightedLabel,
    onHoverOccupation,
    language = "en",
    categoryColorMap,
    showLegend = true,
    showSummary = true,
    animateOnMount = false,
    renderHoverContent,
    hoverAvoidSelector,
    style,
}: OccupationCloudProps) {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)
    const [hoverPosition, setHoverPosition] = useState<{ left: number; top: number; maxHeight: number; placement: "above" | "below" } | null>(null)
    const [animateIn, setAnimateIn] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const isInView = useInView(containerRef, { margin: "0px 0px -10% 0px", once: true })

    useEffect(() => {
        if ((!isInView && !animateOnMount) || animateIn) return
        const timer = window.setTimeout(() => {
            startTransition(() => setAnimateIn(true))
        }, 100)
        return () => window.clearTimeout(timer)
    }, [isInView, animateIn, animateOnMount])
    
    const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data])
    const maxValue = useMemo(() => Math.max(...data.map((d) => d.value)), [data])
    const minValue = useMemo(() => Math.min(...data.map((d) => d.value)), [data])

    // Sort by value for visual hierarchy
    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => b.value - a.value)
    }, [data])

    // Calculate font size based on value
    const getFontSize = (value: number): number => {
        const minSize = 11
        const maxSize = 32
        if (maxValue === minValue) return (minSize + maxSize) / 2
        const normalized = (value - minValue) / (maxValue - minValue)
        return minSize + normalized * (maxSize - minSize)
    }

    // Get padding based on value
    const getPadding = (value: number): string => {
        const fontSize = getFontSize(value)
        const horizontal = Math.max(6, fontSize * 0.5)
        const vertical = Math.max(4, fontSize * 0.3)
        return `${vertical}px ${horizontal}px`
    }

    const isAnyHighlighted = highlightedLabel !== null || hoveredItem !== null
    const activeHighlight = hoveredItem || highlightedLabel
    const resolvedCategoryColors = { ...categoryColors, ...categoryColorMap }

    const handleMouseEnter = (label: string, element: HTMLElement) => {
        const rect = element.getBoundingClientRect()
        const maxWidth = Math.min(renderHoverContent ? 680 : 360, window.innerWidth - 32)
        const minCenter = maxWidth / 2 + 16
        const maxCenter = window.innerWidth - maxWidth / 2 - 16
        let left = Math.max(minCenter, Math.min(rect.left + rect.width / 2, maxCenter))
        let safeTop = 8
        let safeBottom = window.innerHeight - 8
        const avoidRect = hoverAvoidSelector
            ? document.querySelector(hoverAvoidSelector)?.getBoundingClientRect()
            : null

        const overlapsAvoidArea = avoidRect
            && left - maxWidth / 2 < avoidRect.right
            && left + maxWidth / 2 > avoidRect.left

        if (avoidRect && overlapsAvoidArea) {
            const rightCenter = avoidRect.right + maxWidth / 2 + 8
            const leftCenter = avoidRect.left - maxWidth / 2 - 8
            if (rightCenter + maxWidth / 2 <= window.innerWidth - 8) {
                left = Math.max(minCenter, rightCenter)
            } else if (leftCenter - maxWidth / 2 >= 8) {
                left = Math.min(maxCenter, leftCenter)
            } else {
                const anchorCenter = (rect.top + rect.bottom) / 2
                if (anchorCenter <= avoidRect.top) {
                    safeBottom = Math.min(safeBottom, avoidRect.top - 8)
                } else if (anchorCenter >= avoidRect.bottom) {
                    safeTop = Math.max(safeTop, avoidRect.bottom + 8)
                } else if (avoidRect.top - safeTop >= safeBottom - avoidRect.bottom) {
                    safeBottom = avoidRect.top - 8
                } else {
                    safeTop = avoidRect.bottom + 8
                }
            }
        }

        const aboveSpace = rect.top - 10 - safeTop
        const belowSpace = safeBottom - rect.bottom - 10
        const placement = aboveSpace >= belowSpace ? "above" : "below"
        const availableHeight = Math.max(0, placement === "above" ? aboveSpace : belowSpace)

        setHoveredItem(label)
        setHoverPosition({
            left,
            top: placement === "above"
                ? Math.max(safeTop, Math.min(rect.top - 10, safeBottom))
                : Math.max(safeTop, Math.min(rect.bottom + 10, safeBottom)),
            maxHeight: Math.max(1, Math.min(560, window.innerHeight * 0.75, availableHeight)),
            placement,
        })
        onHoverOccupation?.(label)
    }

    const handleMouseLeave = () => {
        setHoveredItem(null)
        setHoverPosition(null)
        onHoverOccupation?.(null)
    }

    // Group by category for legend
    const categories = useMemo(() => {
        const cats = new Map<string, number>()
        data.forEach(item => {
            const cat = item.category || "Other"
            cats.set(cat, (cats.get(cat) || 0) + item.value)
        })
        return Array.from(cats.entries()).sort((a, b) => b[1] - a[1])
    }, [data])

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                backgroundColor,
                display: "flex",
                flexDirection: "column",
                gap: 20,
                ...style,
            }}
        >
            {/* Word Cloud Area */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 16,
                    minHeight: 200,
                }}
            >
                {sortedData.map((item, index) => {
                    const isHighlighted = activeHighlight === item.label
                    const isGreyedOut = isAnyHighlighted && !isHighlighted
                    const fontSize = getFontSize(item.value)
                    const color = resolvedCategoryColors[item.category || "Other"] || "#666"
                    const displayColor = isGreyedOut ? "#D1D5DB" : color
                    const bgColor = isHighlighted 
                        ? lightenColor(color, 0.85)
                        : isGreyedOut 
                            ? "rgba(0,0,0,0.03)"
                            : lightenColor(color, 0.9)

                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 12, scale: 0.92 }}
                            animate={animateIn
                                ? { opacity: isGreyedOut ? 0.5 : 1, y: 0, scale: isHighlighted ? 1.1 : 1 }
                                : { opacity: 0, y: 12, scale: 0.92 }}
                            transition={{ duration: 0.45, delay: Math.min(index * 0.035, 0.7), ease: "easeOut" }}
                            style={{
                                fontSize,
                                fontWeight: item.value >= 5 ? 600 : item.value >= 3 ? 500 : 400,
                                color: displayColor,
                                padding: getPadding(item.value),
                                borderRadius: 8,
                                backgroundColor: bgColor,
                                border: isHighlighted 
                                    ? `2px solid ${color}` 
                                    : "2px solid transparent",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                boxShadow: isHighlighted 
                                    ? `0 4px 12px ${lightenColor(color, 0.5)}` 
                                    : "none",
                                whiteSpace: "nowrap",
                            }}
                            onMouseEnter={(event) => handleMouseEnter(item.label, event.currentTarget)}
                            onMouseLeave={handleMouseLeave}
                            title={`${item.label}: ${item.value} (${((item.value / total) * 100).toFixed(1)}%)`}
                        >
                            {item.label}
                            {item.value >= 3 && (
                                <span
                                    style={{
                                        marginLeft: 4,
                                        fontSize: fontSize * 0.7,
                                        opacity: 0.7,
                                        fontWeight: 700,
                                    }}
                                >
                                    {item.value}
                                </span>
                            )}
                        </motion.div>
                    )
                })}
            </div>

            {/* Category Legend */}
            {showLegend && (
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 12,
                        justifyContent: "center",
                        padding: "12px 16px",
                        borderTop: "1px solid rgba(0,0,0,0.08)",
                    }}
                >
                    {categories.map(([category, count]) => {
                        const color = resolvedCategoryColors[category] || "#666"
                        return (
                            <div
                                key={category}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    fontSize: 11,
                                    color: "#555",
                                }}
                            >
                                <div
                                    style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 3,
                                        backgroundColor: color,
                                    }}
                                />
                                <span style={{ fontWeight: 500 }}>{category}</span>
                                <span style={{ color: "#999" }}>({count})</span>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Hover Detail Card */}
            {hoveredItem && !renderHoverContent && (
                <div
                    style={{
                        padding: 16,
                        background: "rgba(255,255,255,0.95)",
                        borderRadius: 12,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                        border: "1px solid rgba(0,0,0,0.08)",
                    }}
                >
                    {(() => {
                        const item = data.find(d => d.label === hoveredItem)
                        if (!item) return null
                        const color = resolvedCategoryColors[item.category || "Other"] || "#666"
                        const percentage = ((item.value / total) * 100).toFixed(1)
                        
                        return (
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 12,
                                        backgroundColor: lightenColor(color, 0.85),
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 20,
                                        fontWeight: 700,
                                        color: color,
                                    }}
                                >
                                    {item.value}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
                                        {item.label}
                                    </div>
                                    <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>
                                        <span style={{ 
                                            display: "inline-block",
                                            padding: "2px 8px",
                                            borderRadius: 4,
                                            backgroundColor: lightenColor(color, 0.9),
                                            color: color,
                                            fontWeight: 500,
                                            marginRight: 8,
                                        }}>
                                            {item.category}
                                        </span>
                                        {percentage}% {uiCopy.ofTotal[language]}
                                    </div>
                                </div>
                                {/* Mini bar */}
                                <div style={{ width: 80 }}>
                                    <div
                                        style={{
                                            height: 8,
                                            backgroundColor: "rgba(0,0,0,0.08)",
                                            borderRadius: 4,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: `${(item.value / maxValue) * 100}%`,
                                                height: "100%",
                                                backgroundColor: color,
                                                borderRadius: 4,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })(                    )}

                </div>
            )}

            {hoveredItem && renderHoverContent && hoverPosition && (
                <div
                    role="tooltip"
                    className={`pointer-events-none fixed z-[var(--z-floating)] ${renderHoverContent ? 'w-[min(42.5rem,calc(100vw-2rem))]' : 'w-[min(22.5rem,calc(100vw-2rem))]'} overflow-y-auto rounded-[var(--radius-sm)] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-4 text-[var(--color-ink)] shadow-[var(--shadow-panel)]`}
                    style={{
                        left: hoverPosition.left,
                        top: hoverPosition.top,
                        maxHeight: hoverPosition.maxHeight,
                        transform: hoverPosition.placement === "above" ? "translate(-50%, -100%)" : "translateX(-50%)",
                    }}
                >
                    {(() => {
                        const item = data.find((entry) => entry.label === hoveredItem)
                        return item ? renderHoverContent(item) : null
                    })()}
                </div>
            )}

            {/* Summary Stats */}
            {showSummary && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        gap: 16,
                        paddingTop: 12,
                        borderTop: "1px solid rgba(0,0,0,0.08)",
                    }}
                >
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 28, fontWeight: 700, color: "#333" }}>{total}</div>
                        <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase" }}>{uiCopy.totalPeople[language]}</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 28, fontWeight: 700, color: "#2196F3" }}>{data.length}</div>
                        <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase" }}>{uiCopy.occupations[language]}</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 28, fontWeight: 700, color: "#4CAF50" }}>{categories.length}</div>
                        <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase" }}>{uiCopy.categories[language]}</div>
                    </div>
                </div>
            )}
        </div>
    )
}
