// MetroPeople Page: Unites PeopleCircles, CircularDiagram, and ColumnDiagram components

import { useState, type CSSProperties } from "react"
import { PeopleData } from "../../data/metro-people/people"
import LanguageToggle from "../LanguageToggle"
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

const uiCopy = {
    title: {
        en: "Metro People",
        zh: "地铁与人",
    },
    filters: {
        en: "Filters",
        zh: "筛选条件",
    },
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
    tabDemographic: { en: "📊 Demographic", zh: "📊 人口特征" },
    tabOccupation: { en: "💼 Occupation", zh: "💼 职业" },
    tabCloud: { en: "☁️ Cloud", zh: "☁️ 词云" },
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
    const { language, setLanguage } = useAppLanguage("en")
    const [selectedGender, setSelectedGender] = useState<"any" | "male" | "female">("any")
    const [selectedShenzhenBorn, setSelectedShenzhenBorn] = useState<"any" | "yes" | "no">("any")
    const [circleSizeMode, setCircleSizeMode] = useState<"uniform" | "age" | "residence">("age")
    const [density, setDensity] = useState<number>(65)
    const [hoveredBirthDecade, setHoveredBirthDecade] = useState<string | null>(null)
    const [hoveredArrivalDecade, setHoveredArrivalDecade] = useState<string | null>(null)
    const [hoveredGender, setHoveredGender] = useState<string | null>(null)
    const [hoveredOrigin, setHoveredOrigin] = useState<string | null>(null)
    const [hoveredOccupation, setHoveredOccupation] = useState<string | null>(null)
    const [visiblePeopleCount, setVisiblePeopleCount] = useState<number>(0)
    // Tab state: "demographic", "occupation", or "cloud"
    const [activeTab, setActiveTab] = useState<"demographic" | "occupation" | "cloud">("demographic")
    // Dark/light mode state
    const [darkMode, setDarkMode] = useState<boolean>(false)

    // Helper to convert year to decade string
    const getDecade = (year: number | undefined): string | null => {
        if (!year || typeof year !== "number") return null
        const decade = Math.floor(year / 10) * 10
        return `${decade}s`
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

    // Callback when hovering on a person circle
    const handleHoverPerson = (person: Person | null) => {
        if (person) {
            setHoveredBirthDecade(getDecade(person.yearOfBirth))
            setHoveredArrivalDecade(getDecade(getArrivalYear(person)))
            setHoveredGender(person.gender === "male" ? uiCopy.male[language] : person.gender === "female" ? uiCopy.female[language] : null)
            if (typeof person.shenzhenBorn === "boolean") {
                setHoveredOrigin(person.shenzhenBorn ? uiCopy.shenzhenBorn[language] : uiCopy.migrated[language])
            } else {
                setHoveredOrigin(null)
            }
        } else {
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
    const colors = darkMode
        ? {
            bg: "#18181B",
            panel: "#232323",
            card: "#18181B",
            text: "#F3F4F6",
            label: "#E5E7EB",
            accent: "#38BDF8",
            border: "#232323",
            faded: "#A1A1AA",
        }
        : {
            bg: "#F9FAFB",
            panel: "#FFFFFF",
            card: "#F3F4F6",
            text: "#232323",
            label: "#232323",
            accent: "#2563EB",
            border: "#E5E7EB",
            faded: "#A1A1AA",
        }

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
            <LanguageToggle language={language} onChange={setLanguage} />
            {/* Header - simplified */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    padding: "16px 24px",
                    borderBottom: `1px solid ${colors.border}`,
                    flexShrink: 0,
                    background: colors.panel,
                }}
            >
                <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: colors.text, letterSpacing: 1 }}>{uiCopy.title[language]}</h1>
                <button
                    onClick={() => setDarkMode((v) => !v)}
                    style={{
                        marginLeft: 24,
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: `1px solid ${colors.border}`,
                        background: darkMode ? colors.bg : colors.panel,
                        color: colors.text,
                        fontWeight: 600,
                        fontSize: 14,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        transition: "all 0.2s",
                    }}
                    aria-label="Toggle dark/light mode"
                >
                    {darkMode ? uiCopy.themeButton.dark[language] : uiCopy.themeButton.light[language]}
                </button>
            </div>

            {/* Main content area */}
            <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
                {/* People circles - main area */}
                <div
                    style={{
                        flex: 2,
                        position: "relative",
                        minWidth: 0,
                        minHeight: 0,
                        overflow: "hidden",
                        background: colors.panel,
                        borderRadius: 16,
                        margin: 16,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                    }}
                >
                    <PeopleCircles
                        people={people}
                        jsonData={jsonData}
                        selectedGender={selectedGender}
                        selectedShenzhenBorn={selectedShenzhenBorn}
                        sizeMode={circleSizeMode}
                        backgroundColor="#FFFFFF"
                        density={density}
                        onHoverPerson={handleHoverPerson}
                        onVisibleCountChange={setVisiblePeopleCount}
                    />
                </div>

                {/* Sidebar with filters and diagrams */}
                <div
                    style={{
                        flex: 2,
                        padding: 24,
                        borderLeft: `1px solid ${colors.border}`,
                        display: "flex",
                        flexDirection: "column",
                        gap: 20,
                        overflowY: "auto",
                        minHeight: 0,
                        minWidth: 0,
                        background: colors.panel,
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        boxShadow: `inset 0 0 0 1px ${colors.border}, 0 8px 32px rgba(0,0,0,0.15)`,
                        borderRadius: 16,
                        margin: 16,
                    }}
                >
                    {/* Filters Section */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                            padding: 16,
                            borderRadius: 12,
                            background: colors.card,
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: colors.text }}>
                                {uiCopy.filters[language]}
                            </h3>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
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
                            </div>
                        </div>
                        
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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

                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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

                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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

                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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

                        <div style={{ fontSize: 12, color: colors.faded, lineHeight: 1.4 }}>
                            {circleSizeMode === "age"
                                                                ? uiCopy.sizeHintAge[language]
                                : circleSizeMode === "residence"
                                                                    ? uiCopy.sizeHintResidence[language]
                                                                    : uiCopy.sizeHintUniform[language]}
                        </div>
                    </div>

                    {/* Tab Buttons */}
                    <div
                        style={{
                            display: "flex",
                            gap: 6,
                            padding: 4,
                            borderRadius: 12,
                            background: "rgba(0, 0, 0, 0.05)",
                        }}
                    >
                        <button
                            onClick={() => setActiveTab("demographic")}
                            style={{
                                flex: 1,
                                padding: "10px 12px",
                                borderRadius: 8,
                                border: "none",
                                background: activeTab === "demographic" 
                                    ? "#FFFFFF" 
                                    : "transparent",
                                color: activeTab === "demographic" ? "#333" : "#666",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                boxShadow: activeTab === "demographic" 
                                    ? "0 2px 8px rgba(0,0,0,0.1)" 
                                    : "none",
                                transition: "all 0.2s ease",
                            }}
                        >
                            {uiCopy.tabDemographic[language]}
                        </button>
                        <button
                            onClick={() => setActiveTab("occupation")}
                            style={{
                                flex: 1,
                                padding: "10px 12px",
                                borderRadius: 8,
                                border: "none",
                                background: activeTab === "occupation" 
                                    ? "#FFFFFF" 
                                    : "transparent",
                                color: activeTab === "occupation" ? "#333" : "#666",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                boxShadow: activeTab === "occupation" 
                                    ? "0 2px 8px rgba(0,0,0,0.1)" 
                                    : "none",
                                transition: "all 0.2s ease",
                            }}
                        >
                            {uiCopy.tabOccupation[language]}
                        </button>
                        <button
                            onClick={() => setActiveTab("cloud")}
                            style={{
                                flex: 1,
                                padding: "10px 12px",
                                borderRadius: 8,
                                border: "none",
                                background: activeTab === "cloud" 
                                    ? "#FFFFFF" 
                                    : "transparent",
                                color: activeTab === "cloud" ? "#333" : "#666",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                boxShadow: activeTab === "cloud" 
                                    ? "0 2px 8px rgba(0,0,0,0.1)" 
                                    : "none",
                                transition: "all 0.2s ease",
                            }}
                        >
                            {uiCopy.tabCloud[language]}
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === "demographic" ? (
                        <>
                            {/* Circular Diagrams Row */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: 16,
                                    flexWrap: "wrap",
                                }}
                            >
                                <div
                                    style={{
                                        flex: 1,
                                        minWidth: 200,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        padding: 16,
                                        borderRadius: 12,
                                        background: "rgba(255, 255, 255, 0.25)",
                                        backdropFilter: "blur(10px)",
                                        WebkitBackdropFilter: "blur(10px)",
                                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                                    }}
                                >
                                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: colors.text }}>
                                        {uiCopy.genderDistribution[language]}
                                    </h3>
                                    <CircularDiagram
                                        segments={genderData}
                                        size={150}
                                        showLegend={true}
                                        showCenterTotal={true}
                                        backgroundColor="transparent"
                                        highlightedLabel={hoveredGender}
                                    />
                                </div>

                                <div
                                    style={{
                                        flex: 1,
                                        minWidth: 200,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        padding: 16,
                                        borderRadius: 12,
                                        background: "rgba(255, 255, 255, 0.25)",
                                        backdropFilter: "blur(10px)",
                                        WebkitBackdropFilter: "blur(10px)",
                                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                                    }}
                                >
                                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: colors.text }}>
                                        {uiCopy.originDistribution[language]}
                                    </h3>
                                    <CircularDiagram
                                        segments={originData}
                                        size={150}
                                        showLegend={true}
                                        showCenterTotal={true}
                                        centerLabel={uiCopy.people[language]}
                                        backgroundColor="transparent"
                                        highlightedLabel={hoveredOrigin}
                                    />
                                </div>
                            </div>

                            {/* Column Diagrams Row */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: 16,
                                    flexWrap: "wrap",
                                }}
                            >
                                <div
                                    style={{
                                        flex: 1,
                                        minWidth: 200,
                                        padding: 16,
                                        borderRadius: 12,
                                        background: "rgba(255, 255, 255, 0.25)",
                                        backdropFilter: "blur(10px)",
                                        WebkitBackdropFilter: "blur(10px)",
                                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                                    }}
                                >
                                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: colors.text }}>
                                        {uiCopy.birthDecade[language]}
                                    </h3>
                                    <ColumnDiagram
                                        data={birthDecadeData}
                                        height={140}
                                        columnColor="#2196F3"
                                        showGrid={true}
                                        gridSteps={4}
                                        backgroundColor="transparent"
                                        highlightedYear={hoveredBirthDecade}
                                    />
                                </div>

                                <div
                                    style={{
                                        flex: 1,
                                        minWidth: 200,
                                        padding: 16,
                                        borderRadius: 12,
                                        background: "rgba(255, 255, 255, 0.25)",
                                        backdropFilter: "blur(10px)",
                                        WebkitBackdropFilter: "blur(10px)",
                                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                                    }}
                                >
                                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: colors.text }}>
                                        {uiCopy.arrivalYear[language]}
                                    </h3>
                                    <ColumnDiagram
                                        data={residenceYearData}
                                        height={140}
                                        columnColor="#9C27B0"
                                        showGrid={true}
                                        gridSteps={4}
                                        backgroundColor="transparent"
                                        highlightedYear={hoveredArrivalDecade}
                                    />
                                </div>
                            </div>
                        </>
                    ) : activeTab === "occupation" ? (
                        /* Occupation Tab Content */
                        <div
                            style={{
                                padding: 20,
                                borderRadius: 12,
                                background: "rgba(255, 255, 255, 0.25)",
                                backdropFilter: "blur(10px)",
                                WebkitBackdropFilter: "blur(10px)",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                            }}
                        >
                            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: colors.text }}>
                                {uiCopy.occupationDistribution[language]}
                            </h3>
                            <OccupationDiagram
                                data={occupationDiagramData}
                                highlightedLabel={hoveredOccupation}
                                onHoverOccupation={setHoveredOccupation}
                                language={language}
                            />
                        </div>
                    ) : (
                        /* Cloud Tab Content */
                        <div
                            style={{
                                padding: 20,
                                borderRadius: 12,
                                background: "rgba(255, 255, 255, 0.25)",
                                backdropFilter: "blur(10px)",
                                WebkitBackdropFilter: "blur(10px)",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                            }}
                        >
                            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: colors.text }}>
                                {uiCopy.occupationCloud[language]}
                            </h3>
                            <OccupationCloud
                                data={occupationCloudData}
                                highlightedLabel={hoveredOccupation}
                                onHoverOccupation={setHoveredOccupation}
                                language={language}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
