// MetroPeoplePage: Unites PeopleCircles, CircularDiagram, and ColumnDiagram components

import { useEffect, useState, type CSSProperties } from "react"
import { PeopleData } from "../../data/metro-people/people"
import PeopleCircles, { PEOPLE_GENDER_COLORS, type Person } from "../../components/metro-people/PeopleCircles"
import CircularDiagram, { type Segment } from "../../components/metro-people/CircularDiagram"
import ColumnDiagram, { type DataPoint } from "../../components/metro-people/ColumnDiagram"
import OccupationDiagram, { OCCUPATION_CATEGORY_COLORS } from "../../components/metro-people/OccupationDiagram"
import { useAppLanguage } from "../../hooks/useAppLanguage"
import PageShell from "../../components/ui/PageShell"
import CardTitle from "../../components/ui/CardTitle"

// Left-panel year layout:
// 1 = columns that mirror the bar chart
// 2 = one compact circle region per decade
const LEFT_PANEL_YEAR_LAYOUT_VARIANT: 1 | 2 = 2

type OccupationCategoryName =
    | "Business & Enterprise"
    | "Non-Working / Other Status"
    | "Finance & Commerce"
    | "STEM"
    | "Education & Academia"
    | "Public Sector & State-Owned"
    | "Operations & Logistics"
    | "Professional Services"
    | "Personal & Retail Services"

interface OccupationSummary {
    label: string
    labelCn: string
    category: OccupationCategoryName
}

const occupationLayoutKeys: Record<OccupationCategoryName, string> = {
    "Business & Enterprise": "business",
    "Non-Working / Other Status": "other",
    "Finance & Commerce": "finance",
    "STEM": "stem",
    "Education & Academia": "education",
    "Public Sector & State-Owned": "public",
    "Operations & Logistics": "operations",
    "Professional Services": "professional",
    "Personal & Retail Services": "services",
}

const uiCopy = {
    title: {
        en: "Metro&People",
        zh: "地铁与人",
    },
    filters: {
        en: "Filters",
        zh: "筛选条件",
    },
    openPanel: { en: "Open analysis panel", zh: "打开分析面板" },
    closePanel: { en: "Close analysis panel", zh: "关闭分析面板" },
    shown: {
        en: "shown",
        zh: "已显示",
    },
    total: {
        en: "total",
        zh: "总计",
    },
    density: {
        en: "Density:",
        zh: "密度：",
    },
    gender: {
        en: "Gender:",
        zh: "性别：",
    },
    origin: {
        en: "Origin:",
        zh: "来源：",
    },
    size: {
        en: "Size:",
        zh: "尺寸：",
    },
    allGenders: { en: "All Genders", zh: "全部性别" },
    male: { en: "Male", zh: "男性" },
    female: { en: "Female", zh: "女性" },
    allOrigins: { en: "All Origins", zh: "全部来源" },
    shenzhenBorn: { en: "Shenzhen Born", zh: "深圳出生" },
    migrated: { en: "Migrated", zh: "迁入深圳" },
    uniformSize: { en: "Uniform size", zh: "统一大小" },
    byAge: { en: "By age", zh: "按年龄" },
    byResidence: { en: "By years in Shenzhen", zh: "按在深年限" },
    sizeHintAge: { en: "Older people appear as larger circles.", zh: "年龄越大，圆点越大。" },
    sizeHintResidence: { en: "People who have lived longer in Shenzhen appear as larger circles. Shenzhen-born residents use lifetime residence.", zh: "在深圳居住时间越长，圆点越大。深圳出生居民按终身居住年限计算。" },
    sizeHintUniform: { en: "All people use the same circle size.", zh: "所有人使用相同圆点大小。" },
    genderDistribution: { en: "Gender Distribution", zh: "性别分布" },
    originDistribution: { en: "Origin Distribution", zh: "来源分布" },
    people: { en: "People", zh: "人数" },
    birthDecade: { en: "Birth Decade", zh: "出生年代" },
    arrivalYear: { en: "Year of Arrival", zh: "来深年份" },
    occupationDistribution: { en: "Occupation Distribution", zh: "职业分布" },
    landingDescription: {
        en: "Explore the people behind Shenzhen's metro—where they come from, when they arrived, and how occupation and generation shape urban life.",
        zh: "探索深圳地铁背后的人群——他们来自哪里、何时来到深圳，以及职业和世代如何塑造城市生活。",
    },
    landingAction: { en: "Enter the visualization", zh: "进入可视化" },
    themeButton: {
        dark: {
            en: "Dark",
            zh: "深色",
        },
        light: {
            en: "Light",
            zh: "浅色",
        },
    },
} as const

function getArrivalYear(person: Person): number | undefined {
    if (typeof person.yearOfResidence === "number") {
        return person.yearOfResidence
    }
    if (person.shenzhenBorn && typeof person.yearOfBirth === "number") {
        return person.yearOfBirth
    }
    return undefined
}

function normalizeOccupation(person: Person): OccupationSummary {
    const occupationEn = (person.occupation || "").toLowerCase()
    const occupationCn = person.occupationCn || ""
    const combined = `${occupationEn} ${occupationCn}`

    if (/学生|student/.test(combined)) {
        return { label: "Student", labelCn: "学生", category: "Non-Working / Other Status" }
    }
    if (/退休|retired/.test(combined)) {
        return { label: "Retiree", labelCn: "退休人员", category: "Non-Working / Other Status" }
    }
    if (/家庭主妇|全职主妇|housewife/.test(combined)) {
        return { label: "Full-time Housewife", labelCn: "全职主妇", category: "Non-Working / Other Status" }
    }
    if (/半就职|semi-employed|underemployment/.test(combined)) {
        return { label: "Underemployment", labelCn: "半就职状态", category: "Non-Working / Other Status" }
    }

    if (/大学教师|大学老师|university teacher/.test(combined)) {
        return { label: "University Teacher", labelCn: "大学教师", category: "Education & Academia" }
    }
    if (/辅导员|中学|初中|高中|teacher\/middle school|junior high|senior high/.test(combined)) {
        return { label: "School Educator", labelCn: "学校教育工作者", category: "Education & Academia" }
    }

    if (/银行|bank/.test(combined)) {
        return { label: "Banking", labelCn: "银行业", category: "Finance & Commerce" }
    }
    if (/财务|会计|finance|accounting/.test(combined)) {
        return { label: "Finance & Accounting", labelCn: "财务会计", category: "Finance & Commerce" }
    }
    if (/金融|保险|insurance/.test(combined)) {
        return { label: "Finance & Insurance", labelCn: "金融保险", category: "Finance & Commerce" }
    }
    if (/房地产|real estate/.test(combined)) {
        return { label: "Real Estate", labelCn: "房地产", category: "Finance & Commerce" }
    }
    if (/电商|e-commerce/.test(combined)) {
        return { label: "E-commerce", labelCn: "电商", category: "Finance & Commerce" }
    }

    if (/工程师|engineer/.test(combined)) {
        return { label: "Engineering", labelCn: "工程师", category: "STEM" }
    }
    if (/it/.test(combined)) {
        return { label: "IT Industry", labelCn: "IT行业", category: "STEM" }
    }
    if (/通信|telecommunications|communication/.test(combined)) {
        return { label: "Telecommunications", labelCn: "通信行业", category: "STEM" }
    }
    if (/机械|machinery|manufacturing/.test(combined)) {
        return { label: "Machinery Manufacturing", labelCn: "机械制造", category: "STEM" }
    }
    if (/设计|design/.test(combined)) {
        return { label: "Design", labelCn: "设计", category: "STEM" }
    }
    if (/规划师|urban planner|规划/.test(combined)) {
        return { label: "Urban Planning", labelCn: "规划", category: "STEM" }
    }

    if (/律师|lawyer/.test(combined)) {
        return { label: "Law", labelCn: "法律", category: "Professional Services" }
    }
    if (/药师|pharmacist/.test(combined)) {
        return { label: "Pharmacy", labelCn: "药学", category: "Professional Services" }
    }

    if (/物流|快递|机场|司机|driver|logistics|transport/.test(combined)) {
        return { label: "Logistics & Transport", labelCn: "物流交通", category: "Operations & Logistics" }
    }
    if (/服务行业|service industry/.test(combined)) {
        return { label: "Service Industry", labelCn: "服务行业", category: "Operations & Logistics" }
    }

    if (/国企|政府机关|海关|工会|业委会|government|state-owned|customs/.test(combined)) {
        return { label: "Public Sector & SOE", labelCn: "公共部门与国企", category: "Public Sector & State-Owned" }
    }
    if (/社区工作|community work/.test(combined)) {
        return { label: "Community Work", labelCn: "社区工作", category: "Public Sector & State-Owned" }
    }

    if (/美容|beautician/.test(combined)) {
        return { label: "Beautician", labelCn: "美容", category: "Personal & Retail Services" }
    }
    if (/务工|migrant worker|day labourer/.test(combined)) {
        return { label: "Migrant Work", labelCn: "务工", category: "Personal & Retail Services" }
    }
    if (/旅游|文旅|tourism|culture/.test(combined)) {
        return { label: "Tourism & Culture", labelCn: "旅游文旅", category: "Personal & Retail Services" }
    }

    if (/个体|自营|自雇|店老板|老板|owner|self-employed|business owner|奶茶店|餐厅/.test(combined)) {
        return { label: "Self-employed", labelCn: "个体经营", category: "Business & Enterprise" }
    }
    if (/管理|高管|经营者|经理|负责人|project manager|executive|director/.test(combined)) {
        return { label: "Enterprise Management", labelCn: "企业管理", category: "Business & Enterprise" }
    }
    if (/员工|职工|company employee|enterprise employee|外企|hr/.test(combined)) {
        return { label: "Enterprise Employee", labelCn: "企业员工", category: "Business & Enterprise" }
    }

    return { label: "Other Occupations", labelCn: "其他职业", category: "Business & Enterprise" }
}

export interface MetroPeopleProps {
    people?: Person[]
    jsonData?: string
    style?: CSSProperties
}

export default function MetroPeoplePage({ people, jsonData, style }: MetroPeopleProps) {
    const { language } = useAppLanguage("en")
    const DEFAULT_FILTERS_OPEN = false
    const [selectedGender, setSelectedGender] = useState<"any" | "male" | "female">("any")
    const [selectedShenzhenBorn, setSelectedShenzhenBorn] = useState<"any" | "yes" | "no">("any")
    const [circleSizeMode, setCircleSizeMode] = useState<"uniform" | "age" | "residence">("age")
    const [density, setDensity] = useState<number>(65)
    const [hoveredBirthDecade, setHoveredBirthDecade] = useState<string | null>(null)
    const [hoveredArrivalDecade, setHoveredArrivalDecade] = useState<string | null>(null)
    const [hoveredGender, setHoveredGender] = useState<string | null>(null)
    const [hoveredOrigin, setHoveredOrigin] = useState<string | null>(null)
    const [hoveredOccupation, setHoveredOccupation] = useState<string | null>(null)
    const [hoveredColumnGroup, setHoveredColumnGroup] = useState<{ type: "birth" | "arrival"; decade: string } | null>(null)
    const [hoveredSectorGroup, setHoveredSectorGroup] = useState<{ type: "gender" | "origin"; label: string } | null>(null)
    const [visiblePeopleCount, setVisiblePeopleCount] = useState<number>(0)
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(DEFAULT_FILTERS_OPEN)
    // Start with the compact graph menu, matching the intended first view of
    // the analysis section. The full sidebar remains available via the chevron.
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
    const [showLanding] = useState<boolean>(() => new URLSearchParams(window.location.search).get("enter") !== "1")
    const [landingSlideProgress, setLandingSlideProgress] = useState(() => showLanding ? 0 : 1)
    const [isMainContentReady, setIsMainContentReady] = useState(!showLanding)
    const [typedLandingCaption, setTypedLandingCaption] = useState("")
    const [circleLayoutMode, setCircleLayoutMode] = useState<"free" | "birthDecade" | "arrivalDecade" | "gender" | "origin" | "occupation">("gender")

    useEffect(() => {
        if (!showLanding) {
            setIsMainContentReady(true)
            return
        }
        if (landingSlideProgress < 0.999) {
            setIsMainContentReady(false)
            return
        }

        const settleTimer = window.setTimeout(() => setIsMainContentReady(true), 480)
        return () => window.clearTimeout(settleTimer)
    }, [landingSlideProgress, showLanding])

    // The analysis section should always arrive in its compact default state.
    // Users can still open Filters from the tab row after the transition.
    useEffect(() => {
        if (isMainContentReady) {
            setIsFiltersOpen(DEFAULT_FILTERS_OPEN)
        }
    }, [isMainContentReady])

    useEffect(() => {
        if (!showLanding) return
        const caption = "Shenzhen city through stories of Shenzheners"
        let characterIndex = 0
        setTypedLandingCaption("")
        const timer = window.setInterval(() => {
            characterIndex += 1
            setTypedLandingCaption(caption.slice(0, characterIndex))
            if (characterIndex >= caption.length) window.clearInterval(timer)
        }, 42)
        return () => window.clearInterval(timer)
    }, [showLanding])
    const [selectedGraphId, setSelectedGraphId] = useState<"gender" | "origin" | "birthDecade" | "arrivalDecade" | "occupationDistribution">("gender")
    const [hoveredGraphId, setHoveredGraphId] = useState<"gender" | "origin" | "birthDecade" | "arrivalDecade" | "occupationDistribution" | null>(null)
    const [viewportSize, setViewportSize] = useState(() => ({
        width: typeof window === "undefined" ? 1440 : window.innerWidth,
        height: typeof window === "undefined" ? 900 : window.innerHeight,
    }))
    // Dark/light mode state
    const [darkMode, setDarkMode] = useState<boolean>(false)

    useEffect(() => {
        const updateViewportSize = () => setViewportSize({ width: window.innerWidth, height: window.innerHeight })
        window.addEventListener("resize", updateViewportSize)
        return () => window.removeEventListener("resize", updateViewportSize)
    }, [])

    const demographicChartSize = Math.max(82, Math.min(
        220,
        Math.round(viewportSize.width * 0.25 - 72),
        Math.round((viewportSize.height - 250) / 2 - 48),
    ))
    const demographicCardPadding = viewportSize.height < 760 ? 8 : 10
    const demographicGap = viewportSize.height < 760 ? 6 : 8

    // Helper to convert year to decade string
    const getDecade = (year: number | undefined): string | null => {
        if (!year || typeof year !== "number") return null
        const decade = Math.floor(year / 10) * 10
        return `${decade}s`
    }

    const normalizeDecadeLabel = (decade: string | null): string | null => {
        if (!decade) return null
        return decade.replace("年代", "s")
    }

    const formatDecadeLabel = (decade: string | null): string | null => {
        if (!decade) return null
        return language === "zh" ? decade.replace("s", "年代") : decade
    }

    const parsedFromJson = (() => {
        if (!jsonData) return null
        try {
            const parsed = JSON.parse(jsonData)
            return Array.isArray(parsed) ? (parsed as Person[]) : null
        } catch {
            return null
        }
    })()

    const effectivePeople: Person[] = (() => {
        const basePeople = people && people.length > 0 ? people : (PeopleData as Person[])
        if (parsedFromJson && parsedFromJson.length > 0) {
            return parsedFromJson.map((person, index) => ({
                ...(basePeople[index] || {}),
                ...person,
            }))
        }
        return basePeople
    })()

    const filteredPeople = effectivePeople.filter((person) => {
        if (selectedGender !== "any" && person.gender !== selectedGender) {
            return false
        }
        if (selectedShenzhenBorn === "yes" && !person.shenzhenBorn) {
            return false
        }
        if (selectedShenzhenBorn === "no" && person.shenzhenBorn !== false) {
            return false
        }
        return true
    })


    const highlightPersonFromGraph = hoveredColumnGroup || hoveredSectorGroup || hoveredOccupation
        ? (person: Person) => {
            if (hoveredOccupation) {
                const occupation = normalizeOccupation(person)
                const hoveredKey = hoveredOccupation.trim().toLowerCase()
                return [occupation.category, occupation.label, occupation.labelCn, person.occupation, person.occupationCn]
                    .some((value) => value?.trim().toLowerCase() === hoveredKey)
            }

            if (hoveredColumnGroup) {
                if (hoveredColumnGroup.type === "birth") {
                    return getDecade(person.yearOfBirth) === hoveredColumnGroup.decade
                }
                return getDecade(getArrivalYear(person)) === hoveredColumnGroup.decade
            }

            if (hoveredSectorGroup?.type === "gender") {
                const genderLabel = person.gender === "male"
                    ? uiCopy.male[language]
                    : person.gender === "female"
                        ? uiCopy.female[language]
                        : null
                return genderLabel === hoveredSectorGroup.label
            }

            if (hoveredSectorGroup?.type === "origin") {
                if (typeof person.shenzhenBorn !== "boolean") return false
                const originLabel = person.shenzhenBorn ? uiCopy.shenzhenBorn[language] : uiCopy.migrated[language]
                return originLabel === hoveredSectorGroup.label
            }

            return false
        }
        : undefined

    // Callback when hovering on a person circle
    const handleHoverPerson = (person: Person | null) => {
        if (person) {
            setHoveredColumnGroup(null)
            setHoveredSectorGroup(null)
            setHoveredBirthDecade(getDecade(person.yearOfBirth))
            setHoveredArrivalDecade(getDecade(getArrivalYear(person)))
            setHoveredGender(person.gender === "male" ? uiCopy.male[language] : person.gender === "female" ? uiCopy.female[language] : null)
            if (typeof person.shenzhenBorn === "boolean") {
                setHoveredOrigin(person.shenzhenBorn ? uiCopy.shenzhenBorn[language] : uiCopy.migrated[language])
            } else {
                setHoveredOrigin(null)
            }
            setHoveredOccupation(normalizeOccupation(person).label)
        } else {
            setHoveredBirthDecade(null)
            setHoveredArrivalDecade(null)
            setHoveredGender(null)
            setHoveredOrigin(null)
            setHoveredOccupation(null)
        }
    }

    const handleHoverOccupation = (label: string | null) => {
        setHoveredOccupation(label)
        if (label) {
            setHoveredColumnGroup(null)
            setHoveredSectorGroup(null)
            setHoveredBirthDecade(null)
            setHoveredArrivalDecade(null)
            setHoveredGender(null)
            setHoveredOrigin(null)
        }
    }

    const genderData: Segment[] = [
        { label: uiCopy.male[language], value: filteredPeople.filter((person) => person.gender === "male").length, color: PEOPLE_GENDER_COLORS.male },
        { label: uiCopy.female[language], value: filteredPeople.filter((person) => person.gender === "female").length, color: PEOPLE_GENDER_COLORS.female },
    ].filter((segment) => segment.value > 0)

    const originData: Segment[] = [
        { label: uiCopy.shenzhenBorn[language], value: filteredPeople.filter((person) => person.shenzhenBorn === true).length, color: "var(--color-city)" },
        { label: uiCopy.migrated[language], value: filteredPeople.filter((person) => person.shenzhenBorn === false).length, color: "var(--color-primary)" },
    ].filter((segment) => segment.value > 0)

    const birthDecadeData: DataPoint[] = Object.entries(
        filteredPeople.reduce<Record<string, number>>((acc, person) => {
            const decade = getDecade(person.yearOfBirth)
            if (decade) {
                acc[decade] = (acc[decade] || 0) + 1
            }
            return acc
        }, {})
    )
        .sort(([a], [b]) => Number.parseInt(a, 10) - Number.parseInt(b, 10))
        .map(([year, total]) => ({ year: language === "zh" ? year.replace("s", "年代") : year, total }))

    const residenceYearData: DataPoint[] = Object.entries(
        filteredPeople.reduce<Record<string, number>>((acc, person) => {
            const decade = getDecade(getArrivalYear(person))
            if (decade) {
                acc[decade] = (acc[decade] || 0) + 1
            }
            return acc
        }, {})
    )
        .sort(([a], [b]) => Number.parseInt(a, 10) - Number.parseInt(b, 10))
        .map(([year, total]) => ({ year: language === "zh" ? year.replace("s", "年代") : year, total }))

    const occupationAggregation = filteredPeople.reduce<Record<string, { labelCn: string; category: OccupationCategoryName; value: number }>>((acc, person) => {
        const summary = normalizeOccupation(person)
        const existing = acc[summary.label]
        if (existing) {
            existing.value += 1
        } else {
            acc[summary.label] = {
                labelCn: summary.labelCn,
                category: summary.category,
                value: 1,
            }
        }
        return acc
    }, {})

    const occupationData = Object.entries(occupationAggregation)
        .map(([label, value]) => ({
            label: language === "zh" ? value.labelCn : label,
            value: value.value,
            category: value.category,
            labelCn: value.labelCn,
        }))
        .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))

    const occupationDiagramData = Object.entries(
        occupationData.reduce<Record<string, { color: string; value: number; subCategories: Array<{ label: string; value: number; labelCn?: string }> }>>((acc, item) => {
            const existing = acc[item.category]
            if (existing) {
                existing.value += item.value
                existing.subCategories.push({ label: item.label, value: item.value, labelCn: item.labelCn })
            } else {
                acc[item.category] = {
                    color: OCCUPATION_CATEGORY_COLORS[item.category],
                    value: item.value,
                    subCategories: [{ label: item.label, value: item.value, labelCn: item.labelCn }],
                }
            }
            return acc
        }, {})
    )
        .map(([label, value]) => ({
            label,
            value: value.value,
            color: value.color,
            subCategories: value.subCategories.sort((a, b) => b.value - a.value || a.label.localeCompare(b.label)),
        }))
        .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))

    // Color palette
    const colors = {
        bg: "var(--color-canvas)",
        panel: "var(--color-canvas)",
        card: "var(--color-canvas-soft)",
        text: "var(--color-ink)",
        label: "var(--color-ink)",
        accent: "var(--color-accent)",
        border: "var(--color-hairline)",
        faded: "var(--color-text-muted)",
    }
    const rightChartSize = viewportSize.width < 900 ? 136 : 156
    const rightCardStyle: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        background: "transparent",
        border: "none",
        cursor: "pointer",
    }
    const graphGlassStyle: CSSProperties = {
        border: "1px solid color-mix(in srgb, var(--color-hairline) 80%, transparent)",
        background: "color-mix(in srgb, var(--color-canvas) 88%, transparent)",
        backdropFilter: "blur(18px) saturate(120%)",
        WebkitBackdropFilter: "blur(18px) saturate(120%)",
        boxShadow: "none",
        boxSizing: "border-box",
    }

    const graphOptions = [
        { id: "gender" as const, label: uiCopy.genderDistribution[language], mode: "gender" as const },
        { id: "origin" as const, label: uiCopy.originDistribution[language], mode: "origin" as const },
        { id: "birthDecade" as const, label: uiCopy.birthDecade[language], mode: "birthDecade" as const },
        { id: "arrivalDecade" as const, label: uiCopy.arrivalYear[language], mode: "arrivalDecade" as const },
        { id: "occupationDistribution" as const, label: uiCopy.occupationDistribution[language], mode: "occupation" as const },
    ]
    const selectedGraphTitle = graphOptions.find((option) => option.id === selectedGraphId)?.label
    const LEFT_PANEL_WIDTH = 300
    const RIGHT_PANEL_WIDTH = Math.min(440, Math.max(320, Math.round(viewportSize.width * 0.31)))
    const isCompactLayout = viewportSize.width <= 900

    const landingOverlay = showLanding ? (
            <div
                aria-label={uiCopy.landingAction[language]}
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 50,
                    display: "block",
                    width: "100%",
                    height: "100vh",
                    padding: 0,
                    overflow: "hidden",
                    border: "none",
                    background: "transparent",
                    color: "var(--color-ink)",
                    cursor: "ns-resize",
                    transform: `translateX(-${landingSlideProgress * 100}%)`,
                    willChange: "transform",
                    ...style,
                }}
            >
                {(["left", "right"] as const).map((side) => (
                    <span
                        key={side}
                        aria-hidden="true"
                        style={{
                            position: "absolute",
                            inset: side === "left" ? "0 50% 0 0" : "0 0 0 50%",
                            overflow: "hidden",
                            background: "var(--color-canvas)",
                            transform: "translateX(0)",
                        }}
                    >
                    </span>
                ))}

                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        inset: "0 auto 0 0",
                        width: "32vw",
                        zIndex: 1,
                        backgroundImage: "url('/images/metro-people-cover.jpg')",
                        backgroundPosition: "left top",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        boxShadow: "16px 0 42px rgba(38,56,61,0.16)",
                    }}
                />

                <span
                    style={{
                        position: "absolute",
                        left: "36vw",
                        top: "20vh",
                        zIndex: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        boxSizing: "border-box",
                        opacity: 1,
                    }}
                >
                    <span style={{ fontSize: "clamp(11px, 0.72vw, 15px)", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--color-ink)" }}>
                        Shenzhen Metro
                    </span>
                    <span
                        className="metro-people-shared-title"
                        style={{
                            position: "relative",
                            zIndex: 0,
                            marginTop: "clamp(24px, 2.4vh, 30px)",
                            fontSize: "clamp(58px, 5.15vw, 106px)",
                            fontWeight: 800,
                            lineHeight: 0.9,
                            letterSpacing: "-0.055em",
                        }}
                    >
                        <span
                            aria-hidden="true"
                            style={{
                                position: "absolute",
                                zIndex: -1,
                                left: "0.4%",
                                right: "-5%",
                                bottom: "-1px",
                                height: "clamp(20px, 2.15vw, 44px)",
                                background: "var(--color-primary)",
                            }}
                        />
                        <span style={{ position: "relative", zIndex: 1 }}>{uiCopy.title[language]}</span>
                    </span>
                </span>
                <span
                    aria-live="polite"
                    style={{
                        position: "absolute",
                        left: "36vw",
                        right: 0,
                        bottom: "6vh",
                        zIndex: 2,
                        textAlign: "center",
                        color: "#232323",
                        fontSize: "clamp(18px, 1.55vw, 30px)",
                        fontWeight: "var(--weight-medium)",
                        lineHeight: 1.15,
                        whiteSpace: "nowrap",
                    }}
                >
                    {typedLandingCaption}
                </span>
            </div>
        ) : null

    return (
        <PageShell
            theme={{ chapterColor: "var(--color-people)" }}
            onWheel={(event) => {
                if (!showLanding) return
                event.preventDefault()
                setLandingSlideProgress((progress) => Math.max(0, Math.min(1, progress + event.deltaY / 900)))
            }}
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100dvh",
                maxHeight: "100dvh",
                overflow: "hidden",
                position: "relative",
                backgroundColor: colors.bg,
                ...style,
            }}
        >
            {landingOverlay}
            <div
                className="metro-people-circle-stage"
                style={{
                    position: "absolute",
                    zIndex: 55,
                    left: `${landingSlideProgress * (isCompactLayout ? 0 : LEFT_PANEL_WIDTH)}px`,
                    top: `${landingSlideProgress * (isCompactLayout ? 0 : 72)}px`,
                    bottom: `${landingSlideProgress * (isCompactLayout ? 0 : 36)}px`,
                    width: isCompactLayout
                        ? "100%"
                        : `calc(100% - ${(LEFT_PANEL_WIDTH + RIGHT_PANEL_WIDTH) * landingSlideProgress}px)`,
                    overflow: "visible",
                    pointerEvents: landingSlideProgress >= 0.98 ? "auto" : "none",
                }}
            >
                <PeopleCircles
                    people={people}
                    jsonData={jsonData}
                    selectedGender={selectedGender}
                    selectedShenzhenBorn={selectedShenzhenBorn}
                    sizeMode={circleSizeMode}
                    backgroundColor="transparent"
                    density={density}
                    layoutMode={circleLayoutMode}
                    language={language}
                    occupationOrder={occupationDiagramData.map((item) => occupationLayoutKeys[item.label as OccupationCategoryName])}
                    getOccupationCategory={(person) => occupationLayoutKeys[normalizeOccupation(person).category]}
                    pieCenterXPercent={50}
                    pieScale={1}
                    centerLayouts={true}
                    journeyProgress={showLanding ? landingSlideProgress : 1}
                    showLayoutLabels={isMainContentReady}
                    yearLayoutVariant={LEFT_PANEL_YEAR_LAYOUT_VARIANT}
                    onHoverPerson={handleHoverPerson}
                    highlightPerson={highlightPersonFromGraph}
                    onVisibleCountChange={setVisiblePeopleCount}
                />
            </div>
            {showLanding ? (
                <div
                    aria-label={language === "zh" ? "访谈分析流程" : "Interview analysis process"}
                    style={{
                        position: "absolute",
                        left: "58vw",
                        top: "20vh",
                        width: "40vw",
                        height: "auto",
                        zIndex: 60,
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: 12,
                        pointerEvents: "none",
                        transform: `translateX(-${landingSlideProgress * 50}%)`,
                        opacity: Math.max(0, Math.min(1, (1 - landingSlideProgress) / (1 - 0.46))),
                        willChange: "transform",
                    }}
                >
                    {(
                        language === "zh"
                            ? [
                                { label: "访谈", note: "倾听经历", x: 23, y: 24.5, barWidth: 120 },
                                { label: "编码", note: "标记主题", x: 30, y: 16.8, barWidth: 120 },
                                { label: "归类", note: "聚合模式", x: 37.2, y: 28.2, barWidth: 120 },
                                { label: "比较", note: "跨群体阅读", x: 44.3, y: 19.4, barWidth: 120 },
                                { label: "洞察", note: "形成城市叙事", x: 51.5, y: 24.6, barWidth: 120 },
                              ]
                            : [
                                { label: "INTERVIEW STAGE", note: "Shenzhen’s long term Resident\nstudents interviewed 58 long-term\nResidents of Shenzhen", x: 23.5, y: 15.8, barWidth: 304 },
                                { label: "INTERVIEW TRANSCRIPTION", note: "Shenzhen’s long term Resident students\ninterviewed 58 long-term Residents of Shenzhen", x: 33.5, y: 30.6, barWidth: 428 },
                                { label: "CODING", note: "Shenzhen’s long term Resident\nstudents interviewed 58 long-term\nResidents of Shenzhen", x: 48.2, y: 15.8, barWidth: 210 },
                                { label: "CLUSTERING", note: "Group shared patterns", x: 58.5, y: 30.6, barWidth: 250 },
                                { label: "INSIGHT", note: "Build the urban story", x: 71.5, y: 15.8, barWidth: 170 },
                              ]
                    ).slice(0, 0).map((step) => (
                        <div
                            key={step.label}
                            style={{
                                flex: "1 1 0",
                                minWidth: 0,
                                minHeight: 150,
                                boxSizing: "border-box",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                                gap: 10,
                                padding: "16px 18px",
                                border: "1px solid rgba(38,56,61,0.14)",
                                background: "rgba(255,255,255,0.76)",
                                boxShadow: "0 10px 28px rgba(38,56,61,0.06)",
                                color: "var(--color-ink)",
                            }}
                        >
                            <strong
                                style={{
                                    fontSize: "clamp(16px, 1.12vw, 23px)",
                                    lineHeight: 1,
                                    letterSpacing: ".12em",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {step.label}
                            </strong>
                            <span aria-hidden="true" style={{ width: "100%", height: 6, flex: "0 0 auto", background: "var(--color-primary)" }} />
                            <span style={{ whiteSpace: "pre-line", fontSize: "clamp(13px, 0.94vw, 19px)", lineHeight: 1.25, color: "var(--color-ink)", textAlign: "left" }}>{step.note}</span>
                        </div>
                    ))}
                </div>
            ) : null}
            {/* Main content area */}
            <div
                className="metro-people-main"
                style={{
                display: "flex",
                flex: 1,
                overflow: "hidden",
                minHeight: 0,
                position: "relative",
                width: "100%",
                opacity: isMainContentReady ? 1 : 0,
                pointerEvents: isMainContentReady ? "auto" : "none",
                transform: isMainContentReady ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 220ms ease, transform 220ms ease",
                willChange: "opacity, transform",
                }}
            >
                {/* Left list: chooses the main graph */}
                <nav
                    className="metro-people-graph-nav"
                    aria-label={language === "zh" ? "图表布局选项" : "Graph layout options"}
                    style={{
                        flex: `0 0 ${LEFT_PANEL_WIDTH}px`,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: 18,
                        padding: "96px 0 36px 42px",
                        boxSizing: "border-box",
                        minWidth: 0,
                        zIndex: 56,
                    }}
                >
                    {graphOptions.map((option) => {
                        const isActive = selectedGraphId === option.id
                        return (
                            <button
                                key={option.id}
                                type="button"
                                aria-pressed={isActive}
                                onClick={() => {
                                    setCircleLayoutMode(option.mode)
                                    setSelectedGraphId(option.id)
                                }}
                                style={{
                                    padding: 0,
                                    border: "none",
                                    background: "transparent",
                                    color: isActive ? "var(--color-people)" : "var(--color-text-muted)",
                                    opacity: isActive ? 1 : 0.55,
                                    fontSize: isActive ? 18 : 16,
                                    fontWeight: isActive ? 800 : 700,
                                    letterSpacing: "0.1em",
                                    textTransform: "uppercase",
                                    textAlign: "left",
                                    lineHeight: 1.2,
                                    cursor: "pointer",
                                    transition: "color 180ms ease, opacity 180ms ease",
                                }}
                            >
                                {option.label}
                            </button>
                        )
                    })}
                </nav>

                {/* People circles - main area */}
                <div
                    className="metro-people-center-stage"
                    style={{
                        flex: 1,
                        position: "relative",
                        minWidth: 0,
                        minHeight: 0,
                        overflow: "hidden",
                        background: "transparent",
                    }}
                    aria-live="polite"
                    aria-label={selectedGraphTitle}
                />

                {/* Right panel: graphs that are not in the centre */}
                <div
                    className="metro-people-sidebar"
                    style={{
                        flex: `0 0 ${RIGHT_PANEL_WIDTH}px`,
                        padding: "100px 36px 24px 12px",
                        boxSizing: "border-box",
                        borderLeft: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: demographicGap,
                        overflowY: "auto",
                        minHeight: 0,
                        minWidth: 0,
                        background: "transparent",
                        backdropFilter: "none",
                        WebkitBackdropFilter: "none",
                        boxShadow: "none",
                        borderRadius: 0,
                        margin: 0,
                    }}
                >
                    {/* Filters Section */}
                    {isFiltersOpen && (
                    <div
                        style={{
                            order: 2,
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "stretch",
                            gap: isFiltersOpen ? 10 : 0,
                            padding: isFiltersOpen ? 14 : 0,
                            borderRadius: 16,
                            background: "transparent",
                            border: "none",
                            backdropFilter: "none",
                            WebkitBackdropFilter: "none",
                            boxShadow: "none",
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setIsFiltersOpen((isOpen) => !isOpen)}
                            aria-expanded={isFiltersOpen}
                            style={{
                                display: "none",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 12,
                                width: isFiltersOpen ? "100%" : "auto",
                                minHeight: isFiltersOpen ? 42 : 34,
                                padding: isFiltersOpen ? "0 8px" : "0 10px",
                                border: "none",
                                borderRadius: 12,
                                background: "transparent",
                                cursor: "pointer",
                                textAlign: "left",
                            }}
                        >
                            <span style={{ fontSize: 12, fontWeight: 700, color: colors.text, textTransform: "uppercase", letterSpacing: "0.18em" }}>
                                {uiCopy.filters[language]}
                            </span>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                {isFiltersOpen && (<>
                                <span
                                    style={{
                                        fontSize: 13,
                                        fontWeight: 700,
                                        color: colors.accent,
                                        background: "color-mix(in srgb, var(--color-accent) 12%, transparent)",
                                        padding: "4px 10px",
                                        borderRadius: 16,
                                    }}
                                >
                                    {visiblePeopleCount} {uiCopy.shown[language]}
                                </span>
                                <span
                                    style={{
                                        fontSize: 12,
                                        color: colors.faded,
                                        background: `color-mix(in srgb, var(--color-ink) ${darkMode ? 12 : 4}%, transparent)`,
                                        padding: "2px 8px",
                                        borderRadius: 12,
                                        marginLeft: 2,
                                    }}
                                >
                                    / {PeopleData.length} {uiCopy.total[language]}
                                </span>
                                </>)}
                                <span
                                    aria-hidden="true"
                                    style={{
                                        color: colors.label,
                                        fontSize: 16,
                                        transform: isFiltersOpen ? "rotate(90deg)" : "rotate(0deg)",
                                        transition: "transform 160ms ease",
                                    }}
                                >
                                    ›
                                </span>
                            </div>
                        </button>

                        {isFiltersOpen && (
                        <>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", minWidth: 0 }}>
                            <label style={{ fontSize: 13, color: colors.label, minWidth: 60 }}>{uiCopy.density[language]}</label>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={density}
                                onChange={(e) => setDensity(Number(e.target.value))}
                                style={{ flex: 1, cursor: "pointer", background: colors.panel }}
                            />
                            <span style={{ fontSize: 12, color: colors.text, minWidth: 36 }}>{density}%</span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", minWidth: 0 }}>
                            <label style={{ fontSize: 13, color: colors.label, minWidth: 60 }}>{uiCopy.gender[language]}</label>
                            <select
                                value={selectedGender}
                                onChange={(e) => setSelectedGender(e.target.value as "any" | "male" | "female")}
                                style={{
                                    flex: 1,
                                    padding: "8px 12px",
                                    borderRadius: 8,
                                    border: `1px solid ${colors.border}`,
                                    background: colors.panel,
                                    color: colors.text,
                                    fontSize: 13,
                                }}
                            >
                                <option value="any">{uiCopy.allGenders[language]}</option>
                                <option value="male">{uiCopy.male[language]}</option>
                                <option value="female">{uiCopy.female[language]}</option>
                            </select>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", minWidth: 0 }}>
                            <label style={{ fontSize: 13, color: colors.label, minWidth: 60 }}>{uiCopy.origin[language]}</label>
                            <select
                                value={selectedShenzhenBorn}
                                onChange={(e) => setSelectedShenzhenBorn(e.target.value as "any" | "yes" | "no")}
                                style={{
                                    flex: 1,
                                    padding: "8px 12px",
                                    borderRadius: 8,
                                    border: `1px solid ${colors.border}`,
                                    background: colors.panel,
                                    color: colors.text,
                                    fontSize: 13,
                                }}
                            >
                                <option value="any">{uiCopy.allOrigins[language]}</option>
                                <option value="yes">{uiCopy.shenzhenBorn[language]}</option>
                                <option value="no">{uiCopy.migrated[language]}</option>
                            </select>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", minWidth: 0 }}>
                            <label style={{ fontSize: 13, color: colors.label, minWidth: 60 }}>{uiCopy.size[language]}</label>
                            <select
                                value={circleSizeMode}
                                onChange={(e) => setCircleSizeMode(e.target.value as "uniform" | "age" | "residence")}
                                style={{
                                    flex: 1,
                                    padding: "8px 12px",
                                    borderRadius: 8,
                                    border: `1px solid ${colors.border}`,
                                    background: colors.panel,
                                    color: colors.text,
                                    fontSize: 13,
                                }}
                            >
                                <option value="uniform">{uiCopy.uniformSize[language]}</option>
                                <option value="age">{uiCopy.byAge[language]}</option>
                                <option value="residence">{uiCopy.byResidence[language]}</option>
                            </select>
                        </div>

                        <div style={{ width: "100%", fontSize: 12, color: colors.faded, lineHeight: 1.4 }}>
                            {circleSizeMode === "age"
                                                                ? uiCopy.sizeHintAge[language]
                                : circleSizeMode === "residence"
                                                                    ? uiCopy.sizeHintResidence[language]
                                                                    : uiCopy.sizeHintUniform[language]}
                        </div>
                        </>
                        )}
                    </div>
                    )}

                    {/* Tab Content */}
                    {isFiltersOpen ? null : (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 20,
                                    minWidth: 0,
                                }}
                                className="metro-people-chart-grid"
                            >
                                <div
                                    className={`metro-people-chart-card${selectedGraphId === "gender" ? " is-active" : ""}`}
                                    onMouseEnter={() => setHoveredGraphId("gender")}
                                    onMouseLeave={() => setHoveredGraphId(null)}
                                    onClick={() => {
                                        setCircleLayoutMode("gender")
                                        setSelectedGraphId("gender")
                                    }}
                                    style={rightCardStyle}
                                >
                                    <CardTitle color={colors.text}>
                                        {uiCopy.genderDistribution[language]}
                                    </CardTitle>
                                    <CircularDiagram
                                        segments={genderData}
                                        size={rightChartSize}
                                        showLegend={false}
                                        showCenterTotal={true}
                                        backgroundColor="transparent"
                                        highlightedLabel={hoveredGender}
                                        onSegmentHover={(segment) => {
                                            const label = segment?.label ?? null
                                            setHoveredGender(label)
                                            setHoveredOrigin(null)
                                            setHoveredBirthDecade(null)
                                            setHoveredArrivalDecade(null)
                                            setHoveredColumnGroup(null)
                                            setHoveredSectorGroup(label ? { type: "gender", label } : null)
                                        }}
                                    />
                                </div>

                                <div
                                    className={`metro-people-chart-card${selectedGraphId === "origin" ? " is-active" : ""}`}
                                    onMouseEnter={() => setHoveredGraphId("origin")}
                                    onMouseLeave={() => setHoveredGraphId(null)}
                                    onClick={() => {
                                        setCircleLayoutMode("origin")
                                        setSelectedGraphId("origin")
                                    }}
                                    style={rightCardStyle}
                                >
                                    <CardTitle color={colors.text}>
                                        {uiCopy.originDistribution[language]}
                                    </CardTitle>
                                    <CircularDiagram
                                        segments={originData}
                                        size={rightChartSize}
                                        showLegend={false}
                                        showCenterTotal={true}
                                        centerLabel={uiCopy.people[language]}
                                        backgroundColor="transparent"
                                        highlightedLabel={hoveredOrigin}
                                        onSegmentHover={(segment) => {
                                            const label = segment?.label ?? null
                                            setHoveredOrigin(label)
                                            setHoveredGender(null)
                                            setHoveredBirthDecade(null)
                                            setHoveredArrivalDecade(null)
                                            setHoveredColumnGroup(null)
                                            setHoveredSectorGroup(label ? { type: "origin", label } : null)
                                        }}
                                    />
                                </div>

                                <div
                                    className={`metro-people-chart-card${selectedGraphId === "birthDecade" ? " is-active" : ""}`}
                                    onMouseEnter={() => setHoveredGraphId("birthDecade")}
                                    onMouseLeave={() => setHoveredGraphId(null)}
                                    onClick={() => {
                                        setCircleLayoutMode("birthDecade")
                                        setSelectedGraphId("birthDecade")
                                    }}
                                    style={rightCardStyle}
                                >
                                    <CardTitle className="metro-people-column-chart-title" color={colors.text}>
                                        {uiCopy.birthDecade[language]}
                                    </CardTitle>
                                    <ColumnDiagram
                                        data={birthDecadeData}
                                        compact
                                        height={170}
                                        columnColor="var(--color-people)"
                                        showGrid={true}
                                        gridSteps={4}
                                        backgroundColor="transparent"
                                        highlightedYear={formatDecadeLabel(hoveredBirthDecade)}
                                        onColumnHover={(dataPoint) => {
                                            const decade = normalizeDecadeLabel(dataPoint?.year ?? null)
                                            setHoveredBirthDecade(decade)
                                            setHoveredArrivalDecade(null)
                                            setHoveredColumnGroup(decade ? { type: "birth", decade } : null)
                                            setHoveredSectorGroup(null)
                                            setHoveredGender(null)
                                            setHoveredOrigin(null)
                                        }}
                                    />
                                </div>

                                <div
                                    className={`metro-people-chart-card${selectedGraphId === "arrivalDecade" ? " is-active" : ""}`}
                                    onMouseEnter={() => setHoveredGraphId("arrivalDecade")}
                                    onMouseLeave={() => setHoveredGraphId(null)}
                                    onClick={() => {
                                        setCircleLayoutMode("arrivalDecade")
                                        setSelectedGraphId("arrivalDecade")
                                    }}
                                    style={rightCardStyle}
                                >
                                    <CardTitle className="metro-people-column-chart-title" color={colors.text}>
                                        {uiCopy.arrivalYear[language]}
                                    </CardTitle>
                                    <ColumnDiagram
                                        data={residenceYearData}
                                        compact
                                        height={170}
                                        columnColor="var(--color-accent)"
                                        showGrid={true}
                                        gridSteps={4}
                                        backgroundColor="transparent"
                                        highlightedYear={formatDecadeLabel(hoveredArrivalDecade)}
                                        onColumnHover={(dataPoint) => {
                                            const decade = normalizeDecadeLabel(dataPoint?.year ?? null)
                                            setHoveredArrivalDecade(decade)
                                            setHoveredBirthDecade(null)
                                            setHoveredColumnGroup(decade ? { type: "arrival", decade } : null)
                                            setHoveredSectorGroup(null)
                                            setHoveredGender(null)
                                            setHoveredOrigin(null)
                                        }}
                                    />
                                </div>

                        <div
                            className={`metro-people-chart-card metro-people-occupation-chart${selectedGraphId === "occupationDistribution" ? " is-active" : ""}`}
                            onMouseEnter={() => setHoveredGraphId("occupationDistribution")}
                            onMouseLeave={() => setHoveredGraphId(null)}
                            onClick={() => {
                                setCircleLayoutMode("occupation")
                                setSelectedGraphId("occupationDistribution")
                            }}
                            style={rightCardStyle}
                        >
                            <CardTitle color={colors.text}>
                                {uiCopy.occupationDistribution[language]}
                            </CardTitle>
                            <OccupationDiagram
                                data={occupationDiagramData}
                                highlightedLabel={hoveredOccupation}
                                onHoverOccupation={handleHoverOccupation}
                                language={language}
                            />
                        </div>
                            </div>
                    )}
                </div>
            </div>
        </PageShell>
    )
}
