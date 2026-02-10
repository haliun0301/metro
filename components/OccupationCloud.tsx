import { useMemo, useState, type CSSProperties } from "react"

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
    style?: CSSProperties
}

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
    style,
}: OccupationCloudProps) {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null)
    
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

    const handleMouseEnter = (label: string) => {
        setHoveredItem(label)
        onHoverOccupation?.(label)
    }

    const handleMouseLeave = () => {
        setHoveredItem(null)
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
                    const color = categoryColors[item.category || "Other"] || "#666"
                    const displayColor = isGreyedOut ? "#D1D5DB" : color
                    const bgColor = isHighlighted 
                        ? lightenColor(color, 0.85)
                        : isGreyedOut 
                            ? "rgba(0,0,0,0.03)"
                            : lightenColor(color, 0.9)

                    return (
                        <div
                            key={index}
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
                                opacity: isGreyedOut ? 0.5 : 1,
                                transform: isHighlighted ? "scale(1.1)" : "scale(1)",
                                boxShadow: isHighlighted 
                                    ? `0 4px 12px ${lightenColor(color, 0.5)}` 
                                    : "none",
                                whiteSpace: "nowrap",
                            }}
                            onMouseEnter={() => handleMouseEnter(item.label)}
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
                        </div>
                    )
                })}
            </div>

            {/* Category Legend */}
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
                    const color = categoryColors[category] || "#666"
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

            {/* Hover Detail Card */}
            {hoveredItem && (
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
                        const color = categoryColors[item.category || "Other"] || "#666"
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
                                        {percentage}% of total
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
                    })()}
                </div>
            )}

            {/* Summary Stats */}
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
                    <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase" }}>Total People</div>
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: "#2196F3" }}>{data.length}</div>
                    <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase" }}>Occupations</div>
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: "#4CAF50" }}>{categories.length}</div>
                    <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase" }}>Categories</div>
                </div>
            </div>
        </div>
    )
}
