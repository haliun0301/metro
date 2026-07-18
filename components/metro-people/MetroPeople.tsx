// MetroPeople Page: Unites PeopleCircles, CircularDiagram, and ColumnDiagram components

import { useEffect, useState, type CSSProperties } from "react"
import { PeopleData } from "../../data/metro-people/people"
import PeopleCircles, { type Person } from "./PeopleCircles"
import CircularDiagram, { type Segment } from "./CircularDiagram"
import ColumnDiagram, { type DataPoint } from "./ColumnDiagram"
import OccupationDiagram from "./OccupationDiagram"
import OccupationCloud from "./OccupationCloud"
import { useAppLanguage } from "../../hooks/useAppLanguage"

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

const occupationCategoryColors: Record<OccupationCategoryName, string> = {
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
        en: "Metro People",
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
    tabDemographic: { en: "Demographic", zh: "人口特征" },
    tabOccupation: { en: "Occupation", zh: "职业" },
    genderDistribution: { en: "Gender Distribution", zh: "性别分布" },
    originDistribution: { en: "Origin Distribution", zh: "来源分布" },
    people: { en: "People", zh: "人数" },
    birthDecade: { en: "Birth Decade", zh: "出生年代" },
    arrivalYear: { en: "Year of Arrival", zh: "来深年份" },
    occupationDistribution: { en: "Occupation Distribution", zh: "职业分布" },
    occupationCloud: { en: "Occupation Word Cloud", zh: "职业词云" },
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

export default function MetroPeople({ people, jsonData, style }: MetroPeopleProps) {
    const { language } = useAppLanguage("en")
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
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)
    const [circleLayoutMode, setCircleLayoutMode] = useState<"free" | "birthDecade" | "arrivalDecade" | "gender" | "origin" | "occupation">("birthDecade")
    const [selectedGraphId, setSelectedGraphId] = useState<"gender" | "origin" | "birthDecade" | "arrivalDecade" | "occupationDistribution" | "occupationCloud">("birthDecade")
    const [viewportSize, setViewportSize] = useState(() => ({
        width: typeof window === "undefined" ? 1440 : window.innerWidth,
        height: typeof window === "undefined" ? 900 : window.innerHeight,
    }))
    // Tab state: "demographic" or "occupation"
    const [activeTab, setActiveTab] = useState<"demographic" | "occupation">("demographic")
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
        { label: uiCopy.male[language], value: filteredPeople.filter((person) => person.gender === "male").length, color: "#A1CDFF" },
        { label: uiCopy.female[language], value: filteredPeople.filter((person) => person.gender === "female").length, color: "#FFB8D8" },
    ].filter((segment) => segment.value > 0)

    const originData: Segment[] = [
        { label: uiCopy.shenzhenBorn[language], value: filteredPeople.filter((person) => person.shenzhenBorn === true).length, color: "#4CAF50" },
        { label: uiCopy.migrated[language], value: filteredPeople.filter((person) => person.shenzhenBorn === false).length, color: "#FF9800" },
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

    const occupationCloudData = Object.entries(occupationAggregation)
        .map(([label, value]) => ({
            label: language === "zh" ? value.labelCn : label,
            value: value.value,
            category: value.category,
            labelCn: value.labelCn,
        }))
        .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label))

    const occupationDiagramData = Object.entries(
        occupationCloudData.reduce<Record<string, { color: string; value: number; subCategories: Array<{ label: string; value: number; labelCn?: string }> }>>((acc, item) => {
            const existing = acc[item.category]
            if (existing) {
                existing.value += item.value
                existing.subCategories.push({ label: item.label, value: item.value, labelCn: item.labelCn })
            } else {
                acc[item.category] = {
                    color: occupationCategoryColors[item.category as OccupationCategoryName],
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
        bg: "#FFFFFF",
        panel: "#FFFFFF",
        card: "#FFFFFF",
        text: "#232323",
        label: "#232323",
        accent: "#2563EB",
        border: "#E5E7EB",
        faded: "#6B7280",
    }

    const graphOptions = [
        { id: "gender" as const, label: uiCopy.genderDistribution[language], mode: "gender" as const, tab: "demographic" as const },
        { id: "origin" as const, label: uiCopy.originDistribution[language], mode: "origin" as const, tab: "demographic" as const },
        { id: "birthDecade" as const, label: uiCopy.birthDecade[language], mode: "birthDecade" as const, tab: "demographic" as const },
        { id: "arrivalDecade" as const, label: uiCopy.arrivalYear[language], mode: "arrivalDecade" as const, tab: "demographic" as const },
        { id: "occupationDistribution" as const, label: uiCopy.occupationDistribution[language], mode: "occupation" as const, tab: "occupation" as const },
        { id: "occupationCloud" as const, label: uiCopy.occupationCloud[language], mode: "occupation" as const, tab: "occupation" as const },
    ]
    const selectedGraphTitle = graphOptions.find((option) => option.id === selectedGraphId)?.label

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100vh",
                maxHeight: "100vh",
                overflow: "hidden",
                backgroundColor: colors.bg,
                ...style,
            }}
        >
            <header
                style={{
                    position: "relative",
                    zIndex: 30,
                    display: "flex",
                    minHeight: 114,
                    flexShrink: 0,
                    alignItems: "flex-start",
                    justifyContent: "center",
                    paddingTop: 50,
                    boxSizing: "border-box",
                    borderBottom: "none",
                    background: "rgba(255,255,255,0.72)",
                    backdropFilter: "blur(18px)",
                    WebkitBackdropFilter: "blur(18px)",
                }}
            >
                <div
                    aria-live="polite"
                    style={{
                        padding: "0 24px",
                        display: "flex",
                        height: 48,
                        alignItems: "center",
                        color: colors.text,
                        fontSize: 20,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textAlign: "center",
                        textTransform: "uppercase",
                    }}
                >
                    {selectedGraphTitle}
                </div>
            </header>

            {/* Main content area */}
            <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0, position: "relative" }}>
                {/* People circles - main area */}
                <div
                    style={{
                        flex: 1,
                        position: "relative",
                        minWidth: 0,
                        minHeight: 0,
                        overflow: "hidden",
                        background: "transparent",
                        borderRadius: 0,
                        margin: "24px 28px 68px",
                        boxShadow: "none",
                        transition: "flex 240ms ease",
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
                        onHoverPerson={handleHoverPerson}
                        highlightPerson={highlightPersonFromGraph}
                        onVisibleCountChange={setVisiblePeopleCount}
                    />
                </div>

                <button
                    type="button"
                    onClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
                    aria-label={isSidebarOpen ? uiCopy.closePanel[language] : uiCopy.openPanel[language]}
                    aria-expanded={isSidebarOpen}
                    style={{
                        position: "absolute",
                        top: "50%",
                        right: isSidebarOpen ? "calc(50% - 22px)" : "162px",
                        zIndex: 20,
                        width: 44,
                        height: 64,
                        transform: "translateY(-50%)",
                        border: "1px solid transparent",
                        borderRadius: 16,
                        background: "transparent",
                        color: "#37443E",
                        fontSize: 24,
                        lineHeight: 1,
                        cursor: "pointer",
                        backdropFilter: "none",
                        WebkitBackdropFilter: "none",
                        boxShadow: "none",
                        transition: "right 240ms ease, background 160ms ease",
                    }}
                >
                    {isSidebarOpen ? "›" : "‹"}
                </button>

                {/* Sidebar with filters and diagrams */}
                {isSidebarOpen ? (
                <div
                    style={{
                        flex: 1,
                        padding: 24,
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
                        margin: "24px 16px 68px",
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
                                        background: darkMode ? "rgba(56, 189, 248, 0.12)" : "rgba(37, 99, 235, 0.12)",
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
                                        background: darkMode ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.04)",
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

                    {/* Tab Buttons */}
                    <div
                        style={{
                            display: "flex",
                            gap: 6,
                            padding: 4,
                            borderRadius: 12,
                            background: "transparent",
                            border: "none",
                        }}
                    >
                        <button
                            onClick={() => {
                                setActiveTab("demographic")
                                setIsFiltersOpen(false)
                            }}
                            style={{
                                flex: 1,
                                padding: "10px 12px",
                                borderRadius: 8,
                                border: "none",
                                background: "transparent",
                                color: activeTab === "demographic" ? "#333" : "#666",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                boxShadow: "none",
                                transition: "all 0.2s ease",
                            }}
                        >
                            {uiCopy.tabDemographic[language]}
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab("occupation")
                                setIsFiltersOpen(false)
                            }}
                            style={{
                                flex: 1,
                                padding: "10px 12px",
                                borderRadius: 8,
                                border: "none",
                                background: "transparent",
                                color: activeTab === "occupation" ? "#333" : "#666",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                boxShadow: "none",
                                transition: "all 0.2s ease",
                            }}
                        >
                            {uiCopy.tabOccupation[language]}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsFiltersOpen((isOpen) => !isOpen)}
                            aria-expanded={isFiltersOpen}
                            style={{
                                flex: 1,
                                padding: "10px 12px",
                                borderRadius: 8,
                                border: "none",
                                background: "transparent",
                                color: isFiltersOpen ? "#333" : "#666",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                boxShadow: "none",
                                transition: "all 0.2s ease",
                            }}
                        >
                            {uiCopy.filters[language]}
                        </button>
                    </div>

                    {/* Tab Content */}
                    {isFiltersOpen ? null : activeTab === "demographic" ? (
                        <>
                            {/* Circular Diagrams Row */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: demographicGap,
                                    flex: "1 1 0",
                                    minHeight: 0,
                                }}
                            >
                                <div
                                    onClick={() => {
                                        setCircleLayoutMode("gender")
                                        setSelectedGraphId("gender")
                                    }}
                                    style={{
                                        flex: 1,
                                        minWidth: 200,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: demographicCardPadding,
                                        borderRadius: 12,
                                        border: "none",
                                        background: "transparent",
                                        backdropFilter: "none",
                                        WebkitBackdropFilter: "none",
                                        boxShadow: "none",
                                        cursor: "pointer",
                                        transition: "border-color 180ms ease",
                                    }}
                                >
                                    <h3 style={{ width: "100%", fontSize: 13, fontWeight: 600, marginBottom: 4, color: colors.text, textAlign: "center" }}>
                                        {uiCopy.genderDistribution[language]}
                                    </h3>
                                    <CircularDiagram
                                        segments={genderData}
                                        size={demographicChartSize}
                                        showLegend={true}
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
                                    onClick={() => {
                                        setCircleLayoutMode("origin")
                                        setSelectedGraphId("origin")
                                    }}
                                    style={{
                                        flex: 1,
                                        minWidth: 200,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: demographicCardPadding,
                                        borderRadius: 12,
                                        border: "none",
                                        background: "transparent",
                                        backdropFilter: "none",
                                        WebkitBackdropFilter: "none",
                                        boxShadow: "none",
                                        cursor: "pointer",
                                        transition: "border-color 180ms ease",
                                    }}
                                >
                                    <h3 style={{ width: "100%", fontSize: 13, fontWeight: 600, marginBottom: 4, color: colors.text, textAlign: "center" }}>
                                        {uiCopy.originDistribution[language]}
                                    </h3>
                                    <CircularDiagram
                                        segments={originData}
                                        size={demographicChartSize}
                                        showLegend={true}
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
                            </div>

                            {/* Column Diagrams Row */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: demographicGap,
                                    flex: "1 1 0",
                                    minHeight: 0,
                                }}
                            >
                                <div
                                    onClick={() => {
                                        setCircleLayoutMode("birthDecade")
                                        setSelectedGraphId("birthDecade")
                                    }}
                                    style={{
                                        flex: 1,
                                        minWidth: 200,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: demographicCardPadding,
                                        borderRadius: 12,
                                        border: "none",
                                        background: "transparent",
                                        backdropFilter: "none",
                                        WebkitBackdropFilter: "none",
                                        boxShadow: "none",
                                        cursor: "pointer",
                                        transition: "border-color 180ms ease",
                                    }}
                                >
                                    <h3 style={{ width: "100%", fontSize: 13, fontWeight: 600, marginBottom: 4, color: colors.text, textAlign: "center" }}>
                                        {uiCopy.birthDecade[language]}
                                    </h3>
                                    <ColumnDiagram
                                        data={birthDecadeData}
                                        height={demographicChartSize}
                                        columnColor="#2196F3"
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
                                    onClick={() => {
                                        setCircleLayoutMode("arrivalDecade")
                                        setSelectedGraphId("arrivalDecade")
                                    }}
                                    style={{
                                        flex: 1,
                                        minWidth: 200,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: demographicCardPadding,
                                        borderRadius: 12,
                                        border: "none",
                                        background: "transparent",
                                        backdropFilter: "none",
                                        WebkitBackdropFilter: "none",
                                        boxShadow: "none",
                                        cursor: "pointer",
                                        transition: "border-color 180ms ease",
                                    }}
                                >
                                    <h3 style={{ width: "100%", fontSize: 13, fontWeight: 600, marginBottom: 4, color: colors.text, textAlign: "center" }}>
                                        {uiCopy.arrivalYear[language]}
                                    </h3>
                                    <ColumnDiagram
                                        data={residenceYearData}
                                        height={demographicChartSize}
                                        columnColor="#9C27B0"
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
                            </div>
                        </>
                    ) : (
                        /* Occupation Tab Content */
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div
                                onClick={() => {
                                    setCircleLayoutMode("occupation")
                                    setSelectedGraphId("occupationDistribution")
                                }}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 20,
                                    borderRadius: 12,
                                    border: "none",
                                    background: "transparent",
                                    backdropFilter: "none",
                                    WebkitBackdropFilter: "none",
                                    boxShadow: "none",
                                    cursor: "pointer",
                                    transition: "border-color 180ms ease",
                                }}
                            >
                                <h3 style={{ width: "100%", fontSize: 16, fontWeight: 600, marginBottom: 20, color: colors.text, textAlign: "center" }}>
                                    {uiCopy.occupationDistribution[language]}
                                </h3>
                                <OccupationDiagram
                                    data={occupationDiagramData}
                                    highlightedLabel={hoveredOccupation}
                                    onHoverOccupation={handleHoverOccupation}
                                    language={language}
                                />
                            </div>

                            <div
                                onClick={() => {
                                    setCircleLayoutMode("occupation")
                                    setSelectedGraphId("occupationCloud")
                                }}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 20,
                                    borderRadius: 12,
                                    border: "none",
                                    background: "transparent",
                                    backdropFilter: "none",
                                    WebkitBackdropFilter: "none",
                                    boxShadow: "none",
                                    cursor: "pointer",
                                    transition: "border-color 180ms ease",
                                }}
                            >
                                <h3 style={{ width: "100%", fontSize: 16, fontWeight: 600, marginBottom: 16, color: colors.text, textAlign: "center" }}>
                                    {uiCopy.occupationCloud[language]}
                                </h3>
                                <OccupationCloud
                                    data={occupationCloudData}
                                    highlightedLabel={hoveredOccupation}
                                    onHoverOccupation={handleHoverOccupation}
                                    language={language}
                                />
                            </div>
                        </div>
                    )}
                </div>
                ) : (
                    <aside
                        aria-label={language === "zh" ? "图表布局选项" : "Graph layout options"}
                        style={{
                            flex: "0 0 168px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            gap: 8,
                            padding: 8,
                            margin: 8,
                            minWidth: 0,
                        }}
                    >
                        {graphOptions.map((option, index) => {
                            const isActive = selectedGraphId === option.id
                            return (
                                <button
                                    key={`${option.mode}-${index}`}
                                    type="button"
                                    aria-pressed={isActive}
                                    onClick={() => {
                                        setActiveTab(option.tab)
                                        setCircleLayoutMode(option.mode)
                                        setSelectedGraphId(option.id)
                                    }}
                                    style={{
                                        width: "100%",
                                        padding: "10px 8px",
                                        borderRadius: 10,
                                        border: "none",
                                        background: "transparent",
                                        color: colors.text,
                                        fontSize: 11,
                                        fontWeight: 600,
                                        lineHeight: 1.3,
                                        textAlign: "center",
                                        cursor: "pointer",
                                        backdropFilter: "none",
                                        WebkitBackdropFilter: "none",
                                        boxShadow: "none",
                                    }}
                                >
                                    {option.label}
                                </button>
                            )
                        })}
                    </aside>
                )}
            </div>
        </div>
    )
}
