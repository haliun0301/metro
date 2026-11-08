import { startTransition, useEffect, useMemo, useRef, useState, type CSSProperties } from "react"
import { motion, useInView } from "framer-motion"

type Language = "en" | "zh"

export interface SubCategory {
    label: string
    value: number
    labelCn?: string
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
    language?: Language
    style?: CSSProperties
}

const uiCopy = {
    person: { en: "person", zh: "人" },
    people: { en: "people", zh: "人" },
} as const

const categoryTranslations: Record<string, string> = {
    "Business & Enterprise": "企业与经营",
    "Non-Working / Other Status": "非在职 / 其他状态",
    "Finance & Commerce": "金融与商业",
    "STEM": "理工领域",
    "Education & Academia": "教育与学术",
    "Public Sector & State-Owned": "公共部门与国企",
    "Operations & Logistics": "运营与物流",
    "Professional Services": "专业服务",
    "Personal & Retail Services": "个人与零售服务",
}

export const OCCUPATION_CATEGORY_COLORS: Record<string, string> = {
    "Business & Enterprise": "var(--color-people)",
    "Non-Working / Other Status": "var(--color-text-muted)",
    "Finance & Commerce": "var(--color-city)",
    "STEM": "var(--color-primary)",
    "Education & Academia": "var(--color-accent)",
    "Public Sector & State-Owned": "color-mix(in srgb, var(--color-accent) 70%, var(--color-ink))",
    "Operations & Logistics": "color-mix(in srgb, var(--color-city) 55%, var(--color-ink))",
    "Professional Services": "color-mix(in srgb, var(--color-people) 55%, var(--color-text-muted))",
    "Personal & Retail Services": "color-mix(in srgb, var(--color-primary) 60%, var(--color-ink))",
}

const defaultOccupationData: OccupationData[] = [
    { 
        label: "Business & Enterprise", 
        value: 30, 
        color: OCCUPATION_CATEGORY_COLORS["Business & Enterprise"],
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
        color: OCCUPATION_CATEGORY_COLORS["Non-Working / Other Status"],
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
        color: OCCUPATION_CATEGORY_COLORS["Finance & Commerce"],
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
        color: OCCUPATION_CATEGORY_COLORS["STEM"],
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
        color: OCCUPATION_CATEGORY_COLORS["Education & Academia"],
        subCategories: [
            { label: "University teacher", value: 7 },
            { label: "Middle school teacher", value: 3 },
            { label: "Education and training", value: 1 },
        ]
    },
    { 
        label: "Public Sector & State-Owned", 
        value: 5, 
        color: OCCUPATION_CATEGORY_COLORS["Public Sector & State-Owned"],
        subCategories: [
            { label: "State-owned enterprises", value: 3 },
            { label: "Government agency", value: 2 },
        ]
    },
    { 
        label: "Operations & Logistics", 
        value: 4, 
        color: OCCUPATION_CATEGORY_COLORS["Operations & Logistics"],
        subCategories: [
            { label: "Logistics industry", value: 3 },
            { label: "Service industry", value: 1 },
        ]
    },
    { 
        label: "Professional Services", 
        value: 2, 
        color: OCCUPATION_CATEGORY_COLORS["Professional Services"],
        subCategories: [
            { label: "Lawyer", value: 1 },
            { label: "Pharmacist", value: 1 },
        ]
    },
    { 
        label: "Personal & Retail Services", 
        value: 2, 
        color: OCCUPATION_CATEGORY_COLORS["Personal & Retail Services"],
        subCategories: [
            { label: "Beautician", value: 1 },
            { label: "Migrant worker", value: 1 },
        ]
    },
]

function lightenColor(color: string, percent: number): string {
    return `color-mix(in srgb, ${color} ${(1 - percent) * 100}%, var(--color-canvas))`
}

function darkenColor(color: string, percent: number): string {
    return `color-mix(in srgb, ${color} ${(1 - percent) * 100}%, var(--color-ink))`
}

export default function OccupationDiagram({
    data = defaultOccupationData,
    backgroundColor = "transparent",
    highlightedLabel,
    onHoverOccupation,
    language = "en",
    style,
}: OccupationDiagramProps) {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
    const [animateIn, setAnimateIn] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const isInView = useInView(containerRef, { margin: "0px 0px -10% 0px", once: true })

    useEffect(() => {
        if (!isInView || animateIn) return
        const timer = window.setTimeout(() => {
            startTransition(() => setAnimateIn(true))
        }, 100)
        return () => window.clearTimeout(timer)
    }, [isInView, animateIn])
    
    const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data])
    const maxValue = useMemo(() => Math.max(...data.map((d) => d.value), 1), [data])

    const effectiveHighlight = highlightedLabel
    const isAnyHighlighted = effectiveHighlight !== null

    const handleMouseEnter = (label: string) => {
        setExpandedCategory(label)
        onHoverOccupation?.(label)
    }

    const handleMouseLeave = () => {
        setExpandedCategory(null)
        onHoverOccupation?.(null)
    }

    return (
        <div
            ref={containerRef}
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
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
                                gap: 2,
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
                                    gap: 10,
                                    cursor: "pointer",
                                    opacity: isGreyedOut ? 0.4 : 1,
                                    transition: "all 0.2s ease",
                                    padding: "2px 0",
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
                                    title={language === "zh" ? (categoryTranslations[item.label] || item.label) : item.label}
                                >
                                    {language === "zh" ? (categoryTranslations[item.label] || item.label) : item.label}
                                </div>

                                {/* Bar container */}
                                <div
                                    style={{
                                        flex: 1,
                                        height: 8,
                                        backgroundColor: "rgba(0,0,0,0.05)",
                                        borderRadius: 6,
                                        overflow: "hidden",
                                        position: "relative",
                                        transition: "background-color 0.2s ease",
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
                                                const shade = subIndex % 2 === 0 
                                                    ? item.color 
                                                    : lightenColor(item.color, 0.3)
                                                
                                                return (
                                                    <div
                                                        key={subIndex}
                                                        style={{
                                                            width: `${subWidth}%`,
                                                            height: "100%",
                                                            backgroundColor: shade,
                                                            borderRight: subIndex < item.subCategories!.length - 1 
                                                                ? "1px solid rgba(255,255,255,0.3)" 
                                                                : "none",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            overflow: "hidden",                                                            transition: "all 0.2s ease",
                                                        }}
                                                        title={`${language === "zh" ? (sub.labelCn || sub.label) : sub.label}: ${sub.value}`}
                                                    >
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <motion.div
                                            initial={{ scaleX: 0, opacity: 0 }}
                                            animate={animateIn ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
                                            transition={{ duration: 0.65, delay: index * 0.08, ease: "easeOut" }}
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
                                                transformOrigin: "left center",
                                            }}
                                        >
                                        </motion.div>
                                    )}
                                </div>

                                {/* Percentage */}
                                <div
                                    style={{
                                        width: 62,
                                        flexShrink: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        fontSize: 11,
                                        whiteSpace: "nowrap",
                                        color: isGreyedOut ? "#9CA3AF" : "#666",
                                    }}
                                >
                                    <span style={{ fontWeight: 600, color: isGreyedOut ? "#9CA3AF" : "#333" }}>{item.value}</span>
                                    <span>{percentage}%</span>
                                </div>
                            </div>

                            {/* Expanded sub-category details */}
                            {isExpanded && item.subCategories && (
                                <div
                                    style={{
                                        boxSizing: "border-box",
                                        width: "100%",
                                        padding: "4px 6px",
                                        background: "rgba(0,0,0,0.03)",
                                        borderRadius: 8,
                                        display: "grid",
                                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                                        gap: "2px 8px",
                                    }}
                                >
                                    {item.subCategories.map((sub, subIndex) => {
                                        return (
                                            <div
                                                key={subIndex}
                                                style={{
                                                    minWidth: 0,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 4,
                                                    overflow: "hidden",
                                                    transition: "all 0.2s ease",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        width: 6,
                                                        height: 6,
                                                        flex: "0 0 auto",
                                                        borderRadius: "50%",
                                                        backgroundColor: subIndex % 2 === 0 
                                                            ? item.color 
                                                            : lightenColor(item.color, 0.3),
                                                    }}
                                                />
                                                <span style={{ minWidth: 0, fontSize: 10, color: "#444", fontWeight: 500, lineHeight: 1.15 }}>
                                                    {language === "zh" ? (sub.labelCn || sub.label) : sub.label}
                                                </span>
                                                <span style={{
                                                    fontSize: 10,
                                                    color: darkenColor(item.color, 0.2), 
                                                    fontWeight: 700,
                                                    flex: "0 0 auto",
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

        </div>
    )
}
