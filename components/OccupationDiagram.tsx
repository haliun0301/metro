import { useMemo, useState, type CSSProperties } from "react"

export interface SubCategory {
    label: string
    value: number
}

export interface OccupationData {
    label: string
    value: number
    color: string
    subCategories?: SubCategory[]
}

export interface OccupationDiagramProps {
    data?: OccupationData[]
    height?: number
    backgroundColor?: string
    highlightedLabel?: string | null
    onHoverOccupation?: (label: string | null) => void
    style?: CSSProperties
}

const defaultOccupationData: OccupationData[] = [
    { 
        label: "Business & Enterprise", 
        value: 30, 
        color: "#2196F3", // Blue
        subCategories: [
            { label: "Self-employed", value: 10 },
            { label: "Enterprise manager", value: 9 },
            { label: "Enterprise employee", value: 8 },
            { label: "Sales", value: 1 },
            { label: "Trade union manager", value: 1 },
            { label: "Director of homeowners' committee", value: 1 },
        ]
    },
    { 
        label: "Non-Working / Other Status", 
        value: 27, 
        color: "#9E9E9E", // Grey
        subCategories: [
            { label: "Student", value: 19 },
            { label: "Retiree", value: 5 },
            { label: "Full-time housewife", value: 2 },
            { label: "Underemployment", value: 1 },
        ]
    },
    { 
        label: "Finance & Commerce", 
        value: 12, 
        color: "#4CAF50", // Green
        subCategories: [
            { label: "Finance", value: 5 },
            { label: "Banking industry", value: 3 },
            { label: "Financial industry", value: 2 },
            { label: "Real estate", value: 1 },
            { label: "Cross-border e-commerce", value: 1 },
        ]
    },
    { 
        label: "STEM", 
        value: 11, 
        color: "#FF9800", // Orange
        subCategories: [
            { label: "Engineer", value: 3 },
            { label: "IT industry", value: 2 },
            { label: "Communication industry", value: 2 },
            { label: "Mechanical manufacturing", value: 1 },
            { label: "Construction industry", value: 1 },
            { label: "Electric power", value: 1 },
            { label: "Designer", value: 1 },
        ]
    },
    { 
        label: "Education & Academia", 
        value: 11, 
        color: "#9C27B0", // Purple
        subCategories: [
            { label: "University teacher", value: 7 },
            { label: "Middle school teacher", value: 3 },
            { label: "Education and training", value: 1 },
        ]
    },
    { 
        label: "Public Sector & State-Owned", 
        value: 5, 
        color: "#E91E63", // Pink
        subCategories: [
            { label: "State-owned enterprises", value: 3 },
            { label: "Government agency", value: 2 },
        ]
    },
    { 
        label: "Operations & Logistics", 
        value: 4, 
        color: "#00BCD4", // Cyan
        subCategories: [
            { label: "Logistics industry", value: 3 },
            { label: "Service industry", value: 1 },
        ]
    },
    { 
        label: "Professional Services", 
        value: 2, 
        color: "#795548", // Brown
        subCategories: [
            { label: "Lawyer", value: 1 },
            { label: "Pharmacist", value: 1 },
        ]
    },
    { 
        label: "Personal & Retail Services", 
        value: 2, 
        color: "#607D8B", // Blue Grey
        subCategories: [
            { label: "Beautician", value: 1 },
            { label: "Migrant worker", value: 1 },
        ]
    },
]

// Category color mapping for word cloud
const categoryColorMap: Record<string, string> = {
    "Business & Enterprise": "#2196F3",
    "Non-Working / Other Status": "#9E9E9E",
    "Finance & Commerce": "#4CAF50",
    "STEM": "#FF9800",
    "Education & Academia": "#9C27B0",
    "Public Sector & State-Owned": "#E91E63",
    "Operations & Logistics": "#00BCD4",
    "Professional Services": "#795548",
    "Personal & Retail Services": "#607D8B",
}

// All individual occupations for word cloud with category and English labels
const allOccupations = [
    { label: "Student", value: 19, labelCN: "学生", category: "Non-Working / Other Status" },
    { label: "Self-employed", value: 10, labelCN: "自营业者", category: "Business & Enterprise" },
    { label: "Enterprise manager", value: 9, labelCN: "企业高管", category: "Business & Enterprise" },
    { label: "Enterprise employee", value: 8, labelCN: "企业员工", category: "Business & Enterprise" },
    { label: "University teacher", value: 7, labelCN: "大学教师", category: "Education & Academia" },
    { label: "Finance", value: 5, labelCN: "金融行业", category: "Finance & Commerce" },
    { label: "Retiree", value: 5, labelCN: "退休工人", category: "Non-Working / Other Status" },
    { label: "Engineer", value: 3, labelCN: "工程师", category: "STEM" },
    { label: "State-owned enterprises", value: 3, labelCN: "国企职员", category: "Public Sector & State-Owned" },
    { label: "Logistics industry", value: 3, labelCN: "物流行业", category: "Operations & Logistics" },
    { label: "Banking industry", value: 3, labelCN: "银行业", category: "Finance & Commerce" },
    { label: "Middle school teacher", value: 3, labelCN: "中学老师", category: "Education & Academia" },
    { label: "IT industry", value: 2, labelCN: "IT行业", category: "STEM" },
    { label: "Financial industry", value: 2, labelCN: "财务", category: "Finance & Commerce" },
    { label: "Communication industry", value: 2, labelCN: "通信行业", category: "STEM" },
    { label: "Full-time housewife", value: 2, labelCN: "家庭主妇", category: "Non-Working / Other Status" },
    { label: "Government agency", value: 2, labelCN: "政府机关", category: "Public Sector & State-Owned" },
    { label: "Beautician", value: 1, labelCN: "美容师", category: "Personal & Retail Services" },
    { label: "Restaurant owner", value: 1, labelCN: "餐饮老板", category: "Business & Enterprise" },
    { label: "Sales", value: 1, labelCN: "销售行业", category: "Business & Enterprise" },
    { label: "Ride-hailing driver", value: 1, labelCN: "网约车司机", category: "Operations & Logistics" },
    { label: "Lawyer", value: 1, labelCN: "律师", category: "Professional Services" },
    { label: "Pharmacist", value: 1, labelCN: "药师", category: "Professional Services" },
    { label: "Designer", value: 1, labelCN: "设计行业", category: "STEM" },
    { label: "Real estate", value: 1, labelCN: "房地产行业", category: "Finance & Commerce" },
    { label: "Service industry", value: 1, labelCN: "服务行业", category: "Operations & Logistics" },
    { label: "Migrant worker", value: 1, labelCN: "务工", category: "Personal & Retail Services" },
]

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

function darkenColor(hex: string, percent: number): string {
    const cleanHex = hex.replace('#', '')
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    const newR = Math.max(0, Math.round(r * (1 - percent)))
    const newG = Math.max(0, Math.round(g * (1 - percent)))
    const newB = Math.max(0, Math.round(b * (1 - percent)))
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

// Word Cloud Component - now showing English occupation names
function WordCloud({ 
    hoveredOccupation, 
    onHover 
}: { 
    hoveredOccupation: string | null
    onHover: (label: string | null) => void 
}) {
    const maxValue = Math.max(...allOccupations.map(o => o.value))
    
    // Generate stable positions for word cloud effect using seeded randomness
    const wordPositions = useMemo(() => {
        const positions: { x: number; y: number; rotation: number }[] = []
        
        // Seeded pseudo-random function for consistent positioning
        const seededRandom = (seed: number) => {
            const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
            return x - Math.floor(x)
        }
        
        for (let i = 0; i < allOccupations.length; i++) {
            const angle = (i * 137.508) * (Math.PI / 180) // Golden angle
            const radius = 15 + (i % 6) * 12
            const randomX = seededRandom(i * 7 + 1)
            const randomY = seededRandom(i * 13 + 5)
            const x = 50 + Math.cos(angle) * radius * (0.6 + randomX * 0.4)
            const y = 50 + Math.sin(angle) * radius * (0.4 + randomY * 0.3)
            const rotation = (seededRandom(i * 3) - 0.5) * 20 // -10 to +10 degrees
            
            positions.push({ 
                x: Math.max(8, Math.min(92, x)), 
                y: Math.max(12, Math.min(88, y)),
                rotation
            })
        }
        return positions
    }, [])

    const isAnyHovered = hoveredOccupation !== null

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: 320,
                background: "linear-gradient(135deg, #fafafa 0%, #f5f5f5 50%, #f0f0f0 100%)",
                borderRadius: 12,
                overflow: "hidden",
                marginTop: 16,
            }}
        >
            {allOccupations.map((occupation, index) => {
                const pos = wordPositions[index]
                const isHighlighted = hoveredOccupation === occupation.label
                const isGreyedOut = isAnyHovered && !isHighlighted
                
                const minSize = 9
                const maxSize = 36
                const sizeRatio = Math.log(occupation.value + 1) / Math.log(maxValue + 1)
                const fontSize = minSize + (maxSize - minSize) * sizeRatio
                
                // Get color from category
                const baseColor = categoryColorMap[occupation.category] || "#666"
                const opacity = 0.6 + (sizeRatio * 0.4)
                
                return (
                    <div
                        key={occupation.label}
                        style={{
                            position: "absolute",
                            left: `${pos.x}%`,
                            top: `${pos.y}%`,
                            transform: `translate(-50%, -50%) rotate(${pos.rotation}deg) scale(${isHighlighted ? 1.15 : 1})`,
                            fontSize: fontSize,
                            fontWeight: occupation.value > 5 ? 700 : occupation.value > 2 ? 600 : 500,
                            color: isGreyedOut ? "#ccc" : baseColor,
                            opacity: isGreyedOut ? 0.3 : opacity,
                            whiteSpace: "nowrap",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            textShadow: isHighlighted ? `0 2px 8px ${lightenColor(baseColor, 0.5)}` : "none",
                            zIndex: isHighlighted ? 10 : occupation.value,
                            letterSpacing: fontSize > 20 ? "-0.5px" : "0",
                        }}
                        onMouseEnter={() => onHover(occupation.label)}
                        onMouseLeave={() => onHover(null)}
                        title={`${occupation.label} (${occupation.labelCN}): ${occupation.value} people`}
                    >
                        {occupation.label}
                    </div>
                )
            })}
            
            {/* Hover tooltip */}
            {hoveredOccupation && (() => {
                const occ = allOccupations.find(o => o.label === hoveredOccupation)
                if (!occ) return null
                const color = categoryColorMap[occ.category] || "#666"
                return (
                    <div
                        style={{
                            position: "absolute",
                            bottom: 12,
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "rgba(255,255,255,0.95)",
                            padding: "8px 16px",
                            borderRadius: 8,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            zIndex: 20,
                        }}
                    >
                        <div
                            style={{
                                width: 12,
                                height: 12,
                                borderRadius: 3,
                                backgroundColor: color,
                            }}
                        />
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>
                                {occ.label} ({occ.labelCN})
                            </div>
                            <div style={{ fontSize: 11, color: "#666" }}>
                                {occ.category} • {occ.value} {occ.value === 1 ? "person" : "people"}
                            </div>
                        </div>
                    </div>
                )
            })()}
            
            {/* Legend hint */}
            {!hoveredOccupation && (
                <div style={{
                    position: "absolute",
                    bottom: 8,
                    right: 12,
                    fontSize: 10,
                    color: "#999",
                    fontStyle: "italic",
                }}>
                    Hover for details • Size = frequency
                </div>
            )}
        </div>
    )
}

export default function OccupationDiagram({
    data = defaultOccupationData,
    backgroundColor = "transparent",
    highlightedLabel,
    onHoverOccupation,
    style,
}: OccupationDiagramProps) {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
    const [wordCloudHover, setWordCloudHover] = useState<string | null>(null)
    
    const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data])
    const maxValue = useMemo(() => Math.max(...data.map((d) => d.value)), [data])

    const effectiveHighlight = highlightedLabel || wordCloudHover
    const isAnyHighlighted = effectiveHighlight !== null

    const handleMouseEnter = (label: string) => {
        setExpandedCategory(label)
        onHoverOccupation?.(label)
    }

    const handleMouseLeave = () => {
        setExpandedCategory(null)
        onHoverOccupation?.(null)
    }

    const handleWordCloudHover = (label: string | null) => {
        setWordCloudHover(label)
        // Find parent category for this occupation
        if (label) {
            const parentCategory = data.find(cat => 
                cat.subCategories?.some(sub => sub.label === label)
            )
            if (parentCategory) {
                setExpandedCategory(parentCategory.label)
            }
        }
    }

    return (
        <div
            style={{
                width: "100%",
                backgroundColor,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                ...style,
            }}
        >
            {/* Horizontal bar chart */}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {data.map((item, index) => {
                    const isHighlighted = effectiveHighlight === item.label || 
                        item.subCategories?.some(sub => sub.label === effectiveHighlight)
                    const isExpanded = expandedCategory === item.label
                    const isGreyedOut = isAnyHighlighted && !isHighlighted
                    const barWidth = (item.value / maxValue) * 100
                    const percentage = ((item.value / total) * 100).toFixed(1)

                    return (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 4,
                                transition: "all 0.3s ease",
                            }}
                            onMouseEnter={() => handleMouseEnter(item.label)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {/* Main bar row */}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    cursor: "pointer",
                                    opacity: isGreyedOut ? 0.4 : 1,
                                    transition: "all 0.2s ease",
                                    padding: "6px 0",
                                }}
                            >
                                {/* Label */}
                                <div
                                    style={{
                                        width: 160,
                                        fontSize: 12,
                                        fontWeight: isHighlighted ? 600 : 500,
                                        color: isGreyedOut ? "#9CA3AF" : "#333",
                                        textAlign: "right",
                                        flexShrink: 0,
                                        lineHeight: 1.3,
                                    }}
                                    title={item.label}
                                >
                                    {item.label}
                                </div>

                                {/* Bar container */}
                                <div
                                    style={{
                                        flex: 1,
                                        height: isExpanded ? 32 : 28,
                                        backgroundColor: "rgba(0,0,0,0.05)",
                                        borderRadius: 6,
                                        overflow: "hidden",
                                        position: "relative",
                                        transition: "height 0.2s ease",
                                    }}
                                >
                                    {isExpanded && item.subCategories ? (
                                        <div
                                            style={{
                                                display: "flex",
                                                height: "100%",
                                                width: `${barWidth}%`,
                                                borderRadius: 6,
                                                overflow: "hidden",
                                            }}
                                        >
                                            {item.subCategories.map((sub, subIndex) => {
                                                const subWidth = (sub.value / item.value) * 100
                                                const isSubHighlighted = wordCloudHover === sub.label
                                                const shade = subIndex % 2 === 0 
                                                    ? item.color 
                                                    : lightenColor(item.color, 0.3)
                                                
                                                return (
                                                    <div
                                                        key={subIndex}
                                                        style={{
                                                            width: `${subWidth}%`,
                                                            height: "100%",
                                                            backgroundColor: isSubHighlighted 
                                                                ? darkenColor(item.color, 0.2) 
                                                                : shade,
                                                            borderRight: subIndex < item.subCategories!.length - 1 
                                                                ? "1px solid rgba(255,255,255,0.3)" 
                                                                : "none",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            overflow: "hidden",
                                                            transform: isSubHighlighted ? "scaleY(1.1)" : "scaleY(1)",
                                                            transition: "all 0.2s ease",
                                                        }}
                                                        title={`${sub.label}: ${sub.value}`}
                                                    >
                                                        {sub.value >= 3 && (
                                                            <span style={{ 
                                                                fontSize: 9, 
                                                                fontWeight: 600, 
                                                                color: "#fff",
                                                                textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                                                            }}>
                                                                {sub.value}
                                                            </span>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                width: `${barWidth}%`,
                                                height: "100%",
                                                backgroundColor: isGreyedOut ? "#D1D5DB" : item.color,
                                                borderRadius: 6,
                                                transition: "all 0.3s ease",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "flex-end",
                                                paddingRight: 8,
                                                minWidth: item.value >= 5 ? 40 : 0,
                                            }}
                                        >
                                            {item.value >= 5 && (
                                                <span style={{ 
                                                    fontSize: 11, 
                                                    fontWeight: 700, 
                                                    color: "#fff",
                                                    textShadow: "0 1px 2px rgba(0,0,0,0.3)"
                                                }}>
                                                    {item.value}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Percentage */}
                                <div
                                    style={{
                                        width: 50,
                                        fontSize: 12,
                                        fontWeight: isHighlighted ? 600 : 400,
                                        color: isGreyedOut ? "#9CA3AF" : "#666",
                                        textAlign: "left",
                                        flexShrink: 0,
                                    }}
                                >
                                    {percentage}%
                                </div>
                            </div>

                            {/* Expanded sub-category details */}
                            {isExpanded && item.subCategories && (
                                <div
                                    style={{
                                        marginLeft: 172,
                                        marginRight: 62,
                                        padding: "8px 12px",
                                        background: "rgba(0,0,0,0.03)",
                                        borderRadius: 8,
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 8,
                                    }}
                                >
                                    {item.subCategories.map((sub, subIndex) => {
                                        const isSubHighlighted = wordCloudHover === sub.label
                                        return (
                                            <div
                                                key={subIndex}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 6,
                                                    padding: "4px 8px",
                                                    background: isSubHighlighted 
                                                        ? lightenColor(item.color, 0.7)
                                                        : lightenColor(item.color, 0.85),
                                                    borderRadius: 4,
                                                    border: `1px solid ${isSubHighlighted 
                                                        ? item.color 
                                                        : lightenColor(item.color, 0.6)}`,
                                                    transform: isSubHighlighted ? "scale(1.05)" : "scale(1)",
                                                    transition: "all 0.2s ease",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: "50%",
                                                        backgroundColor: subIndex % 2 === 0 
                                                            ? item.color 
                                                            : lightenColor(item.color, 0.3),
                                                    }}
                                                />
                                                <span style={{ fontSize: 11, color: "#444", fontWeight: 500 }}>
                                                    {sub.label}
                                                </span>
                                                <span style={{ 
                                                    fontSize: 11, 
                                                    color: darkenColor(item.color, 0.2), 
                                                    fontWeight: 700 
                                                }}>
                                                    ({sub.value})
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Word Cloud Infographic */}
            <div style={{ marginTop: 16 }}>
                <h4 style={{ 
                    fontSize: 13, 
                    fontWeight: 600, 
                    color: "#666", 
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                }}>
                    Occupation Word Cloud
                </h4>
                <WordCloud 
                    hoveredOccupation={wordCloudHover} 
                    onHover={handleWordCloudHover}
                />
            </div>

            {/* Summary stats */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-around",
                    gap: 16,
                    paddingTop: 16,
                    marginTop: 8,
                    borderTop: "1px solid rgba(0,0,0,0.08)",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: "#333" }}>{total}</div>
                    <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Total People
                    </div>
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: "#E91E63" }}>{data.length}</div>
                    <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Categories
                    </div>
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: "#9C27B0" }}>{allOccupations.length}</div>
                    <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Occupations
                    </div>
                </div>
            </div>
        </div>
    )
}
