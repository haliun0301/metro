import { useMemo, useState, startTransition, useEffect, useRef, useCallback, type CSSProperties } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { PeopleData } from "../../data/metro-people/people"

const CURRENT_YEAR = 2026

interface ResponsiveImage {
    src: string
    srcSet?: string
    alt?: string
}

export interface Person {
    id?: string
    name: string
    nickname: string
    nicknameCn: string
    profileUrl: string
    image?: ResponsiveImage
    profileImage?: ResponsiveImage
    gender?: "male" | "female"
    circleSize?: number
    circleColor?: string
    yearOfBirth?: number
    shenzhenBorn?: boolean
    yearOfResidence?: number
    imageFile?: string
    occupationCn?: string
    occupation?: string
}

export const defaultPeople: Person[] = PeopleData as Person[]

const profileImageModules = import.meta.glob('../../assets/person-stories/**/*.{png,jpg,jpeg,webp,avif,gif}', {
    eager: true,
    import: 'default',
    query: '?url',
}) as Record<string, string>

function resolveProfileImage(src?: string) {
    if (!src) return undefined
    if (/^(https?:)?\/\//.test(src) || src.startsWith('data:')) return src

    const normalizedSrc = src.startsWith('/') ? src : '/' + src
    const moduleKey = '../..' + normalizedSrc
    return profileImageModules[moduleKey] || src
}

// Minimal person icon - filled style
function PersonIcon({ color, size }: { color: string; size: number }) {
    return (
        <svg
            width={size}
            height={size * 1.1}
            viewBox="0 0 24 26"
            fill="none"
            style={{ display: "block" }}
        >
            {/* Head - filled circle */}
            <circle cx="12" cy="6" r="5" fill={color} />
            {/* Body - filled curved shape */}
            <path d="M3 26 C3 18 7 13 12 13 C17 13 21 18 21 26 Z" fill={color} />
        </svg>
    )
}

// Helper function to lighten a hex color
function lightenColor(hex: string, percent: number): string {
    // Remove # if present
    const cleanHex = hex.replace('#', '')
    
    // Parse RGB values
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    
    // Lighten each channel
    const newR = Math.min(255, Math.round(r + (255 - r) * percent))
    const newG = Math.min(255, Math.round(g + (255 - g) * percent))
    const newB = Math.min(255, Math.round(b + (255 - b) * percent))
    
    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`
}

export interface PeopleCirclesProps {
    people?: Person[]
    backgroundColor?: string
    circleColor?: string
    circleSize?: number
    hoverScale?: number
    showNameOnHover?: boolean
    nameFontSize?: number
    nameFontWeight?: number | string
    style?: CSSProperties
    jsonData?: string
    onHoverPersonGender?: (gender: "male" | "female" | null) => void
    onHoverPersonShenzhenBorn?: (shenzhenBorn: boolean | null) => void
    onHoverPerson?: (person: Person | null) => void
    highlightPerson?: (person: Person) => boolean
    onVisibleCountChange?: (count: number) => void
    selectedGender?: "any" | "male" | "female"
    selectedShenzhenBorn?: "any" | "yes" | "no"
    density?: number
    sizeMode?: "uniform" | "age" | "residence"
    layoutMode?: "free" | "birthDecade" | "arrivalDecade" | "gender" | "origin" | "occupation"
    language?: "en" | "zh"
    occupationOrder?: string[]
    getOccupationCategory?: (person: Person) => string
    pieCenterXPercent?: number
    pieScale?: number
    centerLayouts?: boolean
    journeyProgress?: number
    /** 1 keeps decade groups as columns; 2 gathers each decade into its own region. */
    yearLayoutVariant?: 1 | 2
}

const MAX_CIRCLES = 111

function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value))
}

function seededUnit(seed: number) {
    const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
    return value - Math.floor(value)
}

function getEntryNetworkPosition(index: number) {
    // Stable, irregular coordinates keep the entry nodes scattered between renders.
    const x = 5 + seededUnit(index + 11) * 90
    const y = 58 + seededUnit(index * 2.17 + 47) * 34
    return { x, y }
}

function getResidenceYears(person: Person): number | null {
    if (typeof person.yearOfBirth !== "number") return null
    if (typeof person.yearOfResidence === "number") {
        return Math.max(0, CURRENT_YEAR - person.yearOfResidence)
    }
    if (person.yearOfResidence === null || typeof person.yearOfResidence === "undefined") {
        if (person.shenzhenBorn === true) {
            return Math.max(0, CURRENT_YEAR - person.yearOfBirth)
        }
    }
    return null
}

export default function PeopleCircles({
    people = defaultPeople,
    backgroundColor = "#FFFFFF",
    circleColor = "#EEEEEE",
    circleSize = 32,
    hoverScale = 1.8,
    showNameOnHover = true,
    nameFontSize = 14,
    nameFontWeight = 500,
    style,
    jsonData,
    onHoverPersonGender,
    onHoverPersonShenzhenBorn,
    onHoverPerson,
    highlightPerson,
    onVisibleCountChange,
    selectedGender = "any",
    selectedShenzhenBorn = "any",
    density = 100,
    sizeMode = "uniform",
    layoutMode = "free",
    language = "en",
    occupationOrder = [],
    getOccupationCategory,
    pieCenterXPercent = 50,
    pieScale = 1,
    centerLayouts = false,
    journeyProgress = 1,
    yearLayoutVariant = 1,
}: PeopleCirclesProps) {
    const navigate = useNavigate()
    const parsedFromJson: Person[] | null = useMemo(() => {
        if (!jsonData) return null
        try {
            const parsed = JSON.parse(jsonData)
            if (Array.isArray(parsed)) return parsed as Person[]
            return null
        } catch {
            return null
        }
    }, [jsonData])

    const effectivePeople = useMemo(() => {
        const basePeople = people && people.length > 0 ? people : defaultPeople
        if (parsedFromJson && parsedFromJson.length > 0) {
            return parsedFromJson.map((person, index) => ({
                ...(basePeople[index] || {}),
                ...person,
            }))
        }
        return basePeople
    }, [people, parsedFromJson])

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [visitedIndices, setVisitedIndices] = useState<Set<number>>(new Set())
    
    // Drag state - use refs for position during drag to avoid re-renders
    const containerRef = useRef<HTMLDivElement>(null)
    const [containerSize, setContainerSize] = useState({ width: 800, height: 700 })
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
    const dragOffsetRef = useRef<{ x: number; y: number; finalX?: number; finalY?: number }>({ x: 0, y: 0 })
    const [customPositions, setCustomPositions] = useState<Map<number, { xPercent: number; yPercent: number }>>(new Map())
    const dragStartPos = useRef<{ x: number; y: number } | null>(null)
    const hasDragged = useRef(false)
    
    // Ref to directly manipulate dragging element without state updates
    const draggingElementRef = useRef<HTMLDivElement | null>(null)
    
    // Track which icons have completed their initial animation
    const initializedIndicesRef = useRef<Set<number>>(new Set())
    const [initialAnimationComplete, setInitialAnimationComplete] = useState(false)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const updateSize = () => {
            const rect = container.getBoundingClientRect()
            if (rect.width > 0 && rect.height > 0) {
                setContainerSize({ width: rect.width, height: rect.height })
            }
        }
        updateSize()
        const observer = new ResizeObserver(updateSize)
        observer.observe(container)
        return () => observer.disconnect()
    }, [])

    const circleCount = Math.min(effectivePeople.length, MAX_CIRCLES)
    const spreadRadius = 0.10 + (density / 100) * 0.35
    const adjustedCircleSize = Math.round(circleSize * (0.4 + (density / 100) * 0.6))

    const sizeStats = useMemo(() => {
        const ages = effectivePeople
            .map((person) => (typeof person.yearOfBirth === "number" ? CURRENT_YEAR - person.yearOfBirth : null))
            .filter((value): value is number => typeof value === "number" && Number.isFinite(value))

        const residenceYears = effectivePeople
            .map((person) => getResidenceYears(person))
            .filter((value): value is number => typeof value === "number" && Number.isFinite(value))

        return {
            ageMin: ages.length > 0 ? Math.min(...ages) : 18,
            ageMax: ages.length > 0 ? Math.max(...ages) : 80,
            residenceMin: residenceYears.length > 0 ? Math.min(...residenceYears) : 0,
            residenceMax: residenceYears.length > 0 ? Math.max(...residenceYears) : 50,
        }
    }, [effectivePeople])

    const getCircleSize = useCallback((person?: Person) => {
        const minSize = Math.max(16, adjustedCircleSize * 0.7)
        const maxSize = Math.max(minSize + 8, adjustedCircleSize * 1.9)

        if (!person || sizeMode === "uniform") {
            return adjustedCircleSize
        }

        let metric: number | null = null
        let minMetric = 0
        let maxMetric = 1

        if (sizeMode === "age") {
            metric = typeof person.yearOfBirth === "number" ? CURRENT_YEAR - person.yearOfBirth : null
            minMetric = sizeStats.ageMin
            maxMetric = sizeStats.ageMax
        } else if (sizeMode === "residence") {
            metric = getResidenceYears(person)
            minMetric = sizeStats.residenceMin
            maxMetric = sizeStats.residenceMax
        }

        if (metric === null || !Number.isFinite(metric)) {
            return adjustedCircleSize
        }

        const range = Math.max(1, maxMetric - minMetric)
        const normalized = clamp((metric - minMetric) / range, 0, 1)
        return Math.round(minSize + normalized * (maxSize - minSize))
    }, [adjustedCircleSize, sizeMode, sizeStats])

    const circlesData = useMemo(() => {
        const items: { index: number; xPercent: number; yPercent: number }[] = []
        const phi = (Math.sqrt(5) + 1) / 2
        const goldenAngle = (2 - phi) * 2 * Math.PI

        for (let i = 0; i < circleCount; i++) {
            const t = (i + 0.5) / circleCount
            const angle = i * goldenAngle
            const r = Math.sqrt(t) * spreadRadius
            const baseX = 0.5 + r * Math.cos(angle)
            const baseY = 0.5 + r * Math.sin(angle)
            const jitterX = (Math.sin(i * 12.9898) * 43758.5453) % 0.015
            const jitterY = (Math.cos(i * 78.233) * 12345.6789) % 0.015
            const x = Math.max(0.05, Math.min(0.95, baseX + jitterX))
            const y = Math.max(0.05, Math.min(0.95, baseY + jitterY))
            items.push({ index: i, xPercent: x * 100, yPercent: y * 100 })
        }
        return items
    }, [circleCount, spreadRadius])

    // Get position for a circle (custom if moved, otherwise default)
    const getCirclePosition = useCallback((circle: { index: number; xPercent: number; yPercent: number }) => {
        if (layoutMode !== "free") {
            return { xPercent: circle.xPercent, yPercent: circle.yPercent }
        }
        const customPos = customPositions.get(circle.index)
        if (customPos) {
            return customPos
        }
        return { xPercent: circle.xPercent, yPercent: circle.yPercent }
    }, [customPositions, layoutMode])

    const visibleCircles = useMemo(() => {
        return circlesData.filter((circle) => {
            const person = circle.index < effectivePeople.length ? effectivePeople[circle.index] : undefined
            if (!person) return false

            if (selectedGender !== "any" && person.gender !== selectedGender) {
                return false
            }

            if (selectedShenzhenBorn !== "any") {
                if (selectedShenzhenBorn === "yes" && !person.shenzhenBorn) {
                    return false
                }
                if (selectedShenzhenBorn === "no" && person.shenzhenBorn !== false) {
                    return false
                }
            }

            return true
        })
    }, [circlesData, effectivePeople, selectedGender, selectedShenzhenBorn])

    const organizedLayout = useMemo(() => {
        if (layoutMode === "free") {
            return {
                circles: visibleCircles,
                guides: [] as Array<{ key: string; label: string; xPercent: number; yPercent?: number; rightPercent?: number; orientation?: "vertical" | "horizontal" | "region" }>,
                pie: null as null | {
                    centerXPercent: number
                    centerYPercent: number
                    diameter: number
                    separators: number[]
                    labels: Array<{ key: string; label: string; xPercent: number; yPercent: number }>
                },
            }
        }

        const decadeKeys = ["1940s", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s"]
        const categoryKeys = layoutMode === "birthDecade" || layoutMode === "arrivalDecade"
            ? decadeKeys
            : layoutMode === "gender"
                ? ["male", "female", "unknown"]
                : layoutMode === "origin"
                    ? ["born", "migrated", "unknown"]
                    : ["business", "finance", "stem", "education", "public", "operations", "professional", "services", "other"]

        const getCategory = (person: Person) => {
            if (layoutMode === "birthDecade") {
                return typeof person.yearOfBirth === "number" ? `${Math.floor(person.yearOfBirth / 10) * 10}s` : "unknown"
            }
            if (layoutMode === "arrivalDecade") {
                const arrivalYear = typeof person.yearOfResidence === "number"
                    ? person.yearOfResidence
                    : person.shenzhenBorn && typeof person.yearOfBirth === "number"
                        ? person.yearOfBirth
                        : undefined
                return typeof arrivalYear === "number" ? `${Math.floor(arrivalYear / 10) * 10}s` : "unknown"
            }
            if (layoutMode === "gender") return person.gender ?? "unknown"
            if (layoutMode === "origin") return person.shenzhenBorn === true ? "born" : person.shenzhenBorn === false ? "migrated" : "unknown"

            if (getOccupationCategory) return getOccupationCategory(person)

            const occupation = `${person.occupation ?? ""} ${person.occupationCn ?? ""}`.toLowerCase()
            if (/企业|创业|business|entrepreneur|manager|管理/.test(occupation)) return "business"
            if (/金融|银行|finance|bank|account|会计|commerce/.test(occupation)) return "finance"
            if (/工程|技术|程序|科研|engineer|developer|technology|scientist|stem/.test(occupation)) return "stem"
            if (/教育|教师|老师|学生|education|teacher|professor|student|academic/.test(occupation)) return "education"
            if (/政府|公务|国企|public sector|government|state-owned/.test(occupation)) return "public"
            if (/司机|运输|物流|运营|driver|transport|logistics|operations/.test(occupation)) return "operations"
            if (/医生|律师|设计|咨询|doctor|lawyer|designer|consultant|professional/.test(occupation)) return "professional"
            if (/零售|服务|销售|餐饮|retail|service|sales|restaurant/.test(occupation)) return "services"
            return "other"
        }

        const groups = new Map<string, typeof visibleCircles>()
        categoryKeys.forEach((key) => groups.set(key, []))
        visibleCircles.forEach((circle) => {
            const person = effectivePeople[circle.index]
            const category = person ? getCategory(person) : "unknown"
            if (!groups.has(category)) groups.set(category, [])
            groups.get(category)?.push(circle)
        })
        const isVerticalBarLayout = layoutMode === "birthDecade" || layoutMode === "arrivalDecade"
        const genderRank = isVerticalBarLayout
            ? ({ male: 0, female: 1 } as const)
            : ({ female: 0, male: 1 } as const)
        groups.forEach((group) => {
            group.sort((a, b) => {
                const personA = effectivePeople[a.index]
                const personB = effectivePeople[b.index]
                const rankA = personA?.gender ? genderRank[personA.gender] : 2
                const rankB = personB?.gender ? genderRank[personB.gender] : 2
                if (rankA !== rankB) return rankA - rankB
                const birthA = personA?.yearOfBirth ?? Number.MAX_SAFE_INTEGER
                const birthB = personB?.yearOfBirth ?? Number.MAX_SAFE_INTEGER
                if (birthA !== birthB) return birthA - birthB
                return (personA?.name ?? "").localeCompare(personB?.name ?? "")
            })
        })

        const populatedKeys = categoryKeys.filter((key) => (groups.get(key)?.length ?? 0) > 0)
        const requestedOccupationKeys = occupationOrder.filter((key) => populatedKeys.includes(key))
        const activeKeys = layoutMode === "occupation" && requestedOccupationKeys.length > 0
            ? [...requestedOccupationKeys, ...populatedKeys.filter((key) => !requestedOccupationKeys.includes(key))]
            : layoutMode === "birthDecade" || layoutMode === "arrivalDecade"
            ? categoryKeys
            : populatedKeys.length > 0 ? populatedKeys : categoryKeys
        const left = activeKeys.length > 5 ? 7 : 16
        const right = activeKeys.length > 5 ? 93 : 84
        const xStep = activeKeys.length > 1 ? (right - left) / (activeKeys.length - 1) : 0
        const labels: Record<string, { en: string; zh: string }> = {
            male: { en: "Male", zh: "男性" },
            female: { en: "Female", zh: "女性" },
            born: { en: "Shenzhen born", zh: "深圳出生" },
            migrated: { en: "Migrated", zh: "迁入深圳" },
            unknown: { en: "Unknown", zh: "未知" },
            business: { en: "Business", zh: "企业" },
            finance: { en: "Finance", zh: "金融" },
            stem: { en: "STEM", zh: "科技" },
            education: { en: "Education", zh: "教育" },
            public: { en: "Public", zh: "公共部门" },
            operations: { en: "Operations", zh: "运营" },
            professional: { en: "Professional", zh: "专业服务" },
            services: { en: "Services", zh: "零售服务" },
            other: { en: "Other", zh: "其他" },
        }

        if (layoutMode === "gender" || layoutMode === "origin") {
            const pieKeys = populatedKeys.length > 0 ? populatedKeys : categoryKeys
            const total = Math.max(1, pieKeys.reduce((sum, key) => sum + (groups.get(key)?.length ?? 0), 0))
            const centerX = containerSize.width * (pieCenterXPercent / 100)
            const centerY = containerSize.height * 0.47
            const radius = Math.min(containerSize.width, containerSize.height) * 0.34 * pieScale
            let startAngle = -Math.PI / 2
            const separators: number[] = []
            const pieLabels: Array<{ key: string; label: string; xPercent: number; yPercent: number }> = []
            const positionedCircles = pieKeys.flatMap((key) => {
                const group = groups.get(key) ?? []
                const sectorAngle = (group.length / total) * Math.PI * 2
                const sectorStart = startAngle
                const sectorMiddle = sectorStart + sectorAngle / 2
                separators.push((sectorStart * 180) / Math.PI)
                pieLabels.push({
                    key,
                    label: labels[key]?.[language] ?? key,
                    xPercent: ((centerX + Math.cos(sectorMiddle) * radius * 1.14) / containerSize.width) * 100,
                    yPercent: ((centerY + Math.sin(sectorMiddle) * radius * 1.14) / containerSize.height) * 100,
                })

                const points = group.map((circle, index) => {
                    const radialFraction = Math.sqrt((index + 0.7) / Math.max(1, group.length))
                    const angleFraction = (index * 0.61803398875) % 1
                    const angle = sectorStart + sectorAngle * (0.08 + angleFraction * 0.84)
                    const pointRadius = radius * (0.15 + radialFraction * 0.77)
                    return {
                        ...circle,
                        xPercent: ((centerX + Math.cos(angle) * pointRadius) / containerSize.width) * 100,
                        yPercent: ((centerY + Math.sin(angle) * pointRadius) / containerSize.height) * 100,
                    }
                })
                startAngle += sectorAngle
                return points
            })

            return {
                circles: positionedCircles,
                guides: [] as Array<{ key: string; label: string; xPercent: number; yPercent?: number; orientation?: "vertical" | "horizontal" }>,
                pie: {
                    centerXPercent: (centerX / containerSize.width) * 100,
                    centerYPercent: (centerY / containerSize.height) * 100,
                    diameter: radius * 2,
                    separators,
                    labels: pieLabels,
                },
            }
        }

        if (layoutMode === "occupation") {
            const top = 10
            const bottom = 90
            const yStep = activeKeys.length > 1 ? (bottom - top) / (activeKeys.length - 1) : 0
            const defaultRowLeft = 18
            const rowRight = 93
            const maxRowCount = Math.max(1, ...activeKeys.map((key) => groups.get(key)?.length ?? 0))
            const sharedXStep = Math.min(5.2, (rowRight - defaultRowLeft) / Math.max(1, maxRowCount - 1))
            const rowWidth = (maxRowCount - 1) * sharedXStep
            const rowLeft = centerLayouts ? 50 - rowWidth / 2 : defaultRowLeft
            const guides = activeKeys.map((key, index) => ({
                key,
                label: labels[key]?.[language] ?? key,
                xPercent: rowLeft,
                rightPercent: 100 - (rowLeft + rowWidth),
                yPercent: top + index * yStep,
                orientation: "horizontal" as const,
            }))
            const positionedCircles = guides.flatMap((guide) => (
                (groups.get(guide.key) ?? []).map((circle, index) => ({
                    ...circle,
                    xPercent: rowLeft + index * sharedXStep,
                    yPercent: guide.yPercent,
                }))
            ))
            return { circles: positionedCircles, guides, pie: null }
        }

        if (isVerticalBarLayout && yearLayoutVariant === 2) {
            // Variant 2: collision-aware circle packing. The same edge-to-edge
            // gap is used in every decade, regardless of group or circle size.
            const regionKeys = populatedKeys.length > 0 ? populatedKeys : activeKeys
            const circleGap = 9
            const packedByKey = new Map(regionKeys.map((key) => {
                const group = groups.get(key) ?? []
                const placed: Array<{ circle: typeof group[number]; x: number; y: number; radius: number }> = []

                group.forEach((circle, index) => {
                    const radius = getCircleSize(effectivePeople[circle.index]) / 2
                    if (index === 0) {
                        placed.push({ circle, x: 0, y: 0, radius })
                        return
                    }

                    let selected = { x: 0, y: 0 }
                    for (let attempt = 1; attempt <= 5000; attempt += 1) {
                        const searchRadius = 4 * Math.sqrt(attempt)
                        const angle = attempt * 2.399963229728653
                        const candidate = {
                            x: Math.cos(angle) * searchRadius,
                            y: Math.sin(angle) * searchRadius,
                        }
                        const hasClearance = placed.every((existing) => (
                            Math.hypot(candidate.x - existing.x, candidate.y - existing.y)
                            >= radius + existing.radius + circleGap
                        ))
                        if (hasClearance) {
                            selected = candidate
                            break
                        }
                    }
                    placed.push({ circle, ...selected, radius })
                })

                const minX = Math.min(0, ...placed.map((item) => item.x - item.radius))
                const maxX = Math.max(0, ...placed.map((item) => item.x + item.radius))
                const minY = Math.min(0, ...placed.map((item) => item.y - item.radius))
                const maxY = Math.max(0, ...placed.map((item) => item.y + item.radius))
                const centerX = (minX + maxX) / 2
                const centerY = (minY + maxY) / 2

                return [key, {
                    points: placed.map((item) => ({ ...item, x: item.x - centerX, y: item.y - centerY })),
                    width: Math.max(48, maxX - minX),
                    height: Math.max(48, maxY - minY),
                }] as const
            }))

            const splitIndex = Math.ceil(regionKeys.length / 2)
            const rowKeys = [regionKeys.slice(0, splitIndex), regionKeys.slice(splitIndex)].filter((row) => row.length > 0)
            const regionTitleBand = 38
            const regionRowGap = 18
            const rowRequirements = rowKeys.map((row) => (
                Math.max(...row.map((key) => packedByKey.get(key)?.height ?? 48)) + regionTitleBand
            ))
            const requiredRegionHeight = rowRequirements.reduce((sum, height) => sum + height, 0)
                + regionRowGap * Math.max(0, rowKeys.length - 1)
            const desiredTopInset = clamp(containerSize.height * 0.14, 64, 120)
            const regionTopInset = Math.min(
                desiredTopInset,
                Math.max(12, containerSize.height - requiredRegionHeight - 12),
            )
            let rowTop = regionTopInset
            const regions = rowKeys.flatMap((row, rowIndex) => {
                if (rowIndex === 1) {
                    rowTop = Math.max(rowTop, containerSize.height * 0.56)
                }
                const rowHeight = rowRequirements[rowIndex]
                const weights = row.map((key) => (packedByKey.get(key)?.width ?? 48) + 28)
                const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
                let columnLeft = 0
                const rowRegions = row.map((key, columnIndex) => {
                    const width = containerSize.width * (weights[columnIndex] / totalWeight)
                    const packedHeight = packedByKey.get(key)?.height ?? 48
                    const region = {
                        key,
                        label: labels[key]?.[language] ?? (language === "zh" ? key.replace("s", "年代") : key),
                        xPercent: ((columnLeft + width / 2) / containerSize.width) * 100,
                        yPercent: ((rowTop + regionTitleBand + packedHeight / 2) / containerSize.height) * 100,
                        titleYPercent: ((rowTop + 13) / containerSize.height) * 100,
                        width,
                        height: rowHeight,
                        orientation: "region" as const,
                    }
                    columnLeft += width
                    return region
                })
                rowTop += rowHeight + regionRowGap
                return rowRegions
            })
            const guides = regions.map((region) => {
                return {
                    key: region.key,
                    label: region.label,
                    xPercent: region.xPercent,
                    yPercent: region.titleYPercent,
                    orientation: "region" as const,
                }
            })
            const positionedCircles = regions.flatMap((region) => {
                const packed = packedByKey.get(region.key)
                return (packed?.points ?? []).map((point) => ({
                    ...point.circle,
                    xPercent: region.xPercent + (point.x / containerSize.width) * 100,
                    yPercent: region.yPercent + (point.y / containerSize.height) * 100,
                }))
            })

            return { circles: positionedCircles, guides, pie: null }
        }

        const guides = activeKeys.map((key, index) => ({
            key,
            label: labels[key]?.[language] ?? (language === "zh" ? key.replace("s", "年代") : key),
            xPercent: left + index * xStep,
        }))
        const maxCategoryCount = Math.max(1, ...guides.map((guide) => groups.get(guide.key)?.length ?? 0))
        const sharedYStep = Math.min(6.2, 72 / Math.max(1, maxCategoryCount - 1))
        const positionedCircles = guides.flatMap((guide) => {
            const group = groups.get(guide.key) ?? []
            return group.map((circle, index) => ({
                ...circle,
                xPercent: guide.xPercent,
                yPercent: 84 - index * sharedYStep,
            }))
        })

        return { circles: positionedCircles, guides, pie: null }
    }, [centerLayouts, containerSize, effectivePeople, getCircleSize, getOccupationCategory, language, layoutMode, occupationOrder, pieCenterXPercent, pieScale, visibleCircles, yearLayoutVariant])

    useEffect(() => {
        onVisibleCountChange?.(visibleCircles.length)
    }, [visibleCircles.length, onVisibleCountChange])

    // Mark initial animation as complete after a delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setInitialAnimationComplete(true)
        }, circleCount * 15 + 500) // Wait for all staggered animations plus buffer
        return () => clearTimeout(timer)
    }, [circleCount])

    // Drag handlers - use direct DOM manipulation during drag
    const handleDragStart = useCallback((index: number, clientX: number, clientY: number, element: HTMLDivElement) => {
        if (layoutMode !== "free") return
        if (!containerRef.current) return
        
        const rect = containerRef.current.getBoundingClientRect()
        const circle = circlesData.find(c => c.index === index)
        if (!circle) return
        
        const pos = getCirclePosition(circle)
        const circleX = (pos.xPercent / 100) * rect.width
        const circleY = (pos.yPercent / 100) * rect.height
        
        draggingElementRef.current = element
        setDraggingIndex(index)
        dragOffsetRef.current = {
            x: clientX - rect.left - circleX,
            y: clientY - rect.top - circleY
        }
        dragStartPos.current = { x: clientX, y: clientY }
        hasDragged.current = false
        
        // Set initial transform for smooth dragging
        element.style.zIndex = '100'
        element.style.cursor = 'grabbing'
    }, [circlesData, getCirclePosition, layoutMode])

    const handleDragMove = useCallback((clientX: number, clientY: number) => {
        if (draggingIndex === null || !containerRef.current || !draggingElementRef.current) return
        
        if (dragStartPos.current) {
            const dx = clientX - dragStartPos.current.x
            const dy = clientY - dragStartPos.current.y
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                hasDragged.current = true
            }
        }
        
        const rect = containerRef.current.getBoundingClientRect()
        const newX = clientX - rect.left - dragOffsetRef.current.x
        const newY = clientY - rect.top - dragOffsetRef.current.y
        
        const xPercent = Math.max(2, Math.min(98, (newX / rect.width) * 100))
        const yPercent = Math.max(2, Math.min(98, (newY / rect.height) * 100))
        
        // Directly update DOM position for smooth dragging (no state update)
        const element = draggingElementRef.current
        const person = effectivePeople[draggingIndex]
        const size = getCircleSize(person)
        element.style.left = `${xPercent}%`
        element.style.top = `${yPercent}%`
        element.style.marginLeft = `${-size / 2}px`
        element.style.marginTop = `${-size / 2}px`
        
        // Store the position in a ref for final state update
        dragOffsetRef.current.finalX = xPercent
        dragOffsetRef.current.finalY = yPercent
    }, [draggingIndex, effectivePeople, getCircleSize])

    const handleDragEnd = useCallback(() => {
        if (draggingIndex !== null && draggingElementRef.current) {
            const element = draggingElementRef.current
            element.style.zIndex = ''
            element.style.cursor = 'grab'
            
            // Only update state with final position
            if (dragOffsetRef.current.finalX !== undefined && dragOffsetRef.current.finalY !== undefined) {
                setCustomPositions(prev => {
                    const newMap = new Map(prev)
                    newMap.set(draggingIndex, { 
                        xPercent: dragOffsetRef.current.finalX!, 
                        yPercent: dragOffsetRef.current.finalY! 
                    })
                    return newMap
                })
            }
        }
        
        setDraggingIndex(null)
        draggingElementRef.current = null
        dragStartPos.current = null
        dragOffsetRef.current = { x: 0, y: 0 }
    }, [draggingIndex])

    // Mouse event handlers
    const handleMouseDown = useCallback((index: number, e: React.MouseEvent, element: HTMLDivElement) => {
        e.preventDefault()
        e.stopPropagation()
        handleDragStart(index, e.clientX, e.clientY, element)
    }, [handleDragStart])

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (draggingIndex !== null) {
            e.preventDefault()
            handleDragMove(e.clientX, e.clientY)
        }
    }, [draggingIndex, handleDragMove])

    const handleMouseUp = useCallback(() => {
        handleDragEnd()
    }, [handleDragEnd])

    // Touch event handlers
    const handleTouchStart = useCallback((index: number, e: React.TouchEvent, element: HTMLDivElement) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0]
            handleDragStart(index, touch.clientX, touch.clientY, element)
        }
    }, [handleDragStart])

    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (draggingIndex !== null && e.touches.length === 1) {
            e.preventDefault()
            const touch = e.touches[0]
            handleDragMove(touch.clientX, touch.clientY)
        }
    }, [draggingIndex, handleDragMove])

    const handleTouchEnd = useCallback(() => {
        handleDragEnd()
    }, [handleDragEnd])

    // Global event listeners for drag
    useEffect(() => {
        if (draggingIndex !== null) {
            window.addEventListener('mousemove', handleMouseMove)
            window.addEventListener('mouseup', handleMouseUp)
            window.addEventListener('touchmove', handleTouchMove, { passive: false })
            window.addEventListener('touchend', handleTouchEnd)
            
            return () => {
                window.removeEventListener('mousemove', handleMouseMove)
                window.removeEventListener('mouseup', handleMouseUp)
                window.removeEventListener('touchmove', handleTouchMove)
                window.removeEventListener('touchend', handleTouchEnd)
            }
        }
    }, [draggingIndex, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd])

    const handleMouseEnter = useCallback((index: number) => {
        if (draggingIndex !== null) return
        startTransition(() => setHoveredIndex(index))
        const person = effectivePeople[index]
        if (person) {
            onHoverPersonGender?.(person.gender ?? null)
            onHoverPersonShenzhenBorn?.(
                typeof person.shenzhenBorn === "boolean" ? person.shenzhenBorn : null
            )
            onHoverPerson?.(person)
        }
    }, [draggingIndex, effectivePeople, onHoverPersonGender, onHoverPersonShenzhenBorn, onHoverPerson])

    const handleMouseLeave = useCallback(() => {
        if (draggingIndex !== null) return
        startTransition(() => setHoveredIndex(null))
        onHoverPersonGender?.(null)
        onHoverPersonShenzhenBorn?.(null)
        onHoverPerson?.(null)
    }, [draggingIndex, onHoverPersonGender, onHoverPersonShenzhenBorn, onHoverPerson])

    const handleClick = useCallback((index: number, e: React.MouseEvent) => {
        if (hasDragged.current) {
            e.preventDefault()
            e.stopPropagation()
            return
        }
        setVisitedIndices(prev => {
            const newSet = new Set(prev)
            newSet.add(index)
            return newSet
        })
    }, [])

    const handlePersonNavigate = useCallback((
        index: number,
        personUrl: string | null,
        e: React.MouseEvent
    ) => {
        handleClick(index, e)
        if (hasDragged.current || !personUrl) {
            return
        }
        e.preventDefault()
        navigate(personUrl)
    }, [handleClick, navigate])

    return (
        <div
            ref={containerRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: "visible",
                backgroundColor,
                touchAction: "none",
                ...(style || {}),
            }}
            onMouseLeave={() => {
                handleMouseLeave()
            }}
        >
            {organizedLayout.pie && (
                <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    <div
                        style={{
                            position: "absolute",
                            left: `${organizedLayout.pie.centerXPercent}%`,
                            top: `${organizedLayout.pie.centerYPercent}%`,
                            width: organizedLayout.pie.diameter,
                            height: organizedLayout.pie.diameter,
                            borderRadius: "50%",
                            border: "none",
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                    {organizedLayout.pie.separators.map((angle, index) => (
                        <div
                            key={`pie-separator-${index}`}
                            style={{
                                position: "absolute",
                                left: `${organizedLayout.pie!.centerXPercent}%`,
                                top: `${organizedLayout.pie!.centerYPercent}%`,
                                width: organizedLayout.pie!.diameter / 2,
                                borderTop: "none",
                                transform: `rotate(${angle}deg)`,
                                transformOrigin: "left center",
                            }}
                        />
                    ))}
                    {organizedLayout.pie.labels.map((label) => (
                        <span
                            key={`pie-label-${label.key}`}
                            style={{
                                position: "absolute",
                                left: `${label.xPercent}%`,
                                top: `${label.yPercent}%`,
                                transform: "translate(-50%, -50%)",
                                padding: "3px 7px",
                                borderRadius: 999,
                                background: "rgba(255,255,255,0.72)",
                                color: "rgba(35,35,35,0.72)",
                                fontSize: 11,
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                backdropFilter: "blur(8px)",
                            }}
                        >
                            {label.label}
                        </span>
                    ))}
                </div>
            )}

            {organizedLayout.guides.map((guide) => (
                <div
                    key={`guide-${guide.key}`}
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        left: `${guide.xPercent}%`,
                        right: guide.orientation === "horizontal" ? `${guide.rightPercent ?? 5}%` : undefined,
                        top: guide.orientation === "horizontal" || guide.orientation === "region" ? `${guide.yPercent}%` : "7%",
                        bottom: guide.orientation === "horizontal" || guide.orientation === "region" ? undefined : "9%",
                        width: guide.orientation === "horizontal" ? undefined : 1,
                        height: guide.orientation === "horizontal" ? 1 : undefined,
                        borderLeft: "none",
                        borderTop: "none",
                        transform: guide.orientation === "horizontal"
                            ? "translateY(-0.5px)"
                            : guide.orientation === "region"
                                ? "translate(-50%, -50%)"
                                : "translateX(-0.5px)",
                        pointerEvents: "none",
                        opacity: journeyProgress,
                        zIndex: guide.orientation === "region" ? 20 : undefined,
                    }}
                >
                    <span
                        style={{
                            position: "absolute",
                            left: guide.orientation === "horizontal" ? -10 : "50%",
                            top: guide.orientation === "horizontal" ? "50%" : guide.orientation === "region" ? 0 : undefined,
                            bottom: guide.orientation === "horizontal" || guide.orientation === "region" ? undefined : -24,
                            width: guide.orientation === "horizontal" ? 105 : undefined,
                            transform: guide.orientation === "horizontal"
                                ? "translate(-100%, -50%)"
                                : guide.orientation === "region"
                                    ? "translate(-50%, -50%)"
                                    : "translateX(-50%)",
                            padding: guide.orientation === "region" ? "5px 10px" : undefined,
                            borderRadius: guide.orientation === "region" ? 999 : undefined,
                            background: guide.orientation === "region" ? "rgba(255,255,255,0.96)" : undefined,
                            color: guide.orientation === "region" ? "rgba(35, 35, 35, 0.88)" : "rgba(35, 35, 35, 0.68)",
                            fontSize: guide.orientation === "region" ? 12 : 11,
                            fontWeight: guide.orientation === "region" ? 700 : 600,
                            letterSpacing: guide.orientation === "region" ? "0.04em" : undefined,
                            whiteSpace: "nowrap",
                            textAlign: guide.orientation === "horizontal" ? "right" : "center",
                        }}
                    >
                        {guide.label}
                    </span>
                </div>
            ))}

            {organizedLayout.circles.map((circle) => {
                const hasPerson = circle.index < effectivePeople.length
                const person = hasPerson ? effectivePeople[circle.index] : undefined
                const isHovered = hoveredIndex === circle.index && draggingIndex === null
                const isDragging = draggingIndex === circle.index
                const isVisited = visitedIndices.has(circle.index)
                const size = getCircleSize(person)
                const halfSize = size / 2

                const graphPos = getCirclePosition(circle)
                const progress = clamp(journeyProgress, 0, 1)
                const entryPosition = getEntryNetworkPosition(circle.index)
                const pos = {
                    xPercent: entryPosition.x + (graphPos.xPercent - entryPosition.x) * progress,
                    yPercent: entryPosition.y + (graphPos.yPercent - entryPosition.y) * progress,
                }

                const genderOutlineColor = person?.gender === "male"
                    ? "#A1CDFF"
                    : person?.gender === "female"
                        ? "#FFB8D8"
                        : circleColor
                const baseColor = person?.circleColor || genderOutlineColor

                const hasPersonHighlight = Boolean(highlightPerson)
                const matchesPersonHighlight = person ? highlightPerson?.(person) !== false : false

                // Check if any icon or chart group is hovered.
                const isAnyHovered = hoveredIndex !== null && draggingIndex === null
                const isGreyedOut = (isAnyHovered && !isHovered) || (hasPersonHighlight && !matchesPersonHighlight)

                // Apply greyed out color if another icon or chart group is hovered.
                let genderColor = isVisited ? lightenColor(baseColor, 0.4) : baseColor
                if (isGreyedOut) {
                    genderColor = "#D1D5DB"
                }
                const outlineColor = isGreyedOut
                    ? "#D1D5DB"
                    : isVisited ? lightenColor(genderOutlineColor, 0.3) : genderOutlineColor

                // Determine scale based on state
                const targetScale = isDragging ? 1.2 : isHovered ? hoverScale : 1
                
                // Determine opacity based on hover state
                const targetOpacity = isGreyedOut ? 0.4 : 1

                const personUrl = person?.id
                    ? `/people/${person.id}`
                    : null
                const profileImageSrc = resolveProfileImage(
                    person?.profileImage?.src || person?.imageFile
                )
                const displayName = person
                    ? language === "zh"
                        ? person.nicknameCn || person.nickname || person.name
                        : person.nickname || person.name
                    : ""
                const occupationLabel = person
                    ? language === "zh"
                        ? person.occupationCn || person.occupation
                        : person.occupation || person.occupationCn
                    : ""
                const originLabel = person
                    ? person.shenzhenBorn
                        ? language === "zh" ? "深圳出生" : "Shenzhen born"
                        : typeof person.yearOfResidence === "number"
                            ? language === "zh" ? `${person.yearOfResidence} 年来深` : `Arrived in Shenzhen in ${person.yearOfResidence}`
                            : ""
                    : ""
                const birthLabel = person && typeof person.yearOfBirth === "number"
                    ? language === "zh" ? `${person.yearOfBirth} 年出生` : `Born ${person.yearOfBirth}`
                    : ""
                const briefIntro = [occupationLabel, originLabel, birthLabel].filter(Boolean).join(" · ")
                const hoverCard = person ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                            position: "absolute",
                            left: "50%",
                            bottom: "calc(100% + 10px)",
                            width: 176,
                            marginLeft: -88,
                            padding: "9px 10px",
                            borderRadius: 10,
                            border: "1px solid rgba(35,35,35,0.12)",
                            background: "#FFFFFF",
                            color: "#232323",
                            textAlign: "left",
                            boxShadow: "none",
                            boxSizing: "border-box",
                            fontFamily: "var(--font-sans)",
                            fontSize: "var(--text-small)",
                            fontWeight: "var(--weight-regular)",
                            pointerEvents: "none",
                        }}
                        aria-hidden="true"
                    >
                        <div style={{ fontSize: "var(--text-small)", fontWeight: "var(--weight-semibold)", lineHeight: 1.35 }}>{displayName}</div>
                        {briefIntro && (
                            <div style={{ marginTop: 4, color: "#626C67", fontSize: "var(--text-caption)", lineHeight: 1.45 }}>
                                {briefIntro}
                            </div>
                        )}
                    </motion.div>
                ) : null

                return (
                    personUrl ? (
                        <button
                            key={`person-${circle.index}`}
                            type="button"
                            onClick={(e) => handlePersonNavigate(circle.index, personUrl, e)}
                            style={{
                                position: "absolute",
                                left: `${pos.xPercent}%`,
                                top: `${pos.yPercent}%`,
                                width: size,
                                height: size,
                                marginLeft: -halfSize,
                                marginTop: -halfSize,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: isDragging ? 100 : isHovered ? 50 : 1,
                                padding: 0,
                                border: "none",
                                background: "transparent",
                                transition: "left 420ms cubic-bezier(0.22, 1, 0.36, 1), top 420ms cubic-bezier(0.22, 1, 0.36, 1)",
                            }}
                        >
                            <motion.div
                                ref={(el) => {
                                    if (isDragging && el) {
                                        draggingElementRef.current = el
                                    }
                                }}
                                layout={false}
                                style={{
                                    width: size,
                                    height: size,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: layoutMode === "free" ? (isDragging ? "grabbing" : "grab") : "pointer",
                                    filter: "none",
                                    userSelect: "none",
                                    touchAction: "none",
                                }}
                                initial={initialAnimationComplete ? false : { scale: 0, opacity: 0 }}
                                animate={{ 
                                    scale: targetScale, 
                                    opacity: targetOpacity
                                }}
                                transition={
                                    initialAnimationComplete
                                        ? { type: "spring", stiffness: 230, damping: 24, mass: 0.75 }
                                        : {
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20,
                                            delay: circle.index * 0.015,
                                        }
                                }
                                onMouseEnter={() => handleMouseEnter(circle.index)}
                                onMouseLeave={handleMouseLeave}
                                onMouseDown={(e) => handleMouseDown(circle.index, e, e.currentTarget)}
                                onTouchStart={(e) => handleTouchStart(circle.index, e, e.currentTarget)}
                                onClick={(e) => handleClick(circle.index, e)}
                                aria-label={person ? `Person: ${person.name}` : "Empty person"}
                                role={hasPerson ? "button" : "img"}
                            >
                                <div
                                    style={{
                                        width: size,
                                        height: size,
                                        borderRadius: "50%",
                                        backgroundColor: profileImageSrc ? genderColor : "#FFFFFF",
                                        backgroundImage: profileImageSrc ? `url(${profileImageSrc})` : "none",
                                        backgroundPosition: "center",
                                        backgroundSize: "cover",
                                        backgroundRepeat: "no-repeat",
                                        border: "none",
                                        outline: `3px solid ${outlineColor}`,
                                        outlineOffset: 0,
                                        boxSizing: "border-box",
                                        boxShadow: "none",
                                        transition: "outline-color 280ms ease, background-color 280ms ease",
                                    }}
                                />
                                {isHovered && hoverCard}
                            </motion.div>
                        </button>
                    ) : (
                        <motion.div
                            key={`person-${circle.index}`}
                            ref={(el) => {
                                if (isDragging && el) {
                                    draggingElementRef.current = el
                                }
                            }}
                            layout={false}
                            style={{
                                position: "absolute",
                                left: `${pos.xPercent}%`,
                                top: `${pos.yPercent}%`,
                                width: size,
                                height: size,
                                marginLeft: -halfSize,
                                marginTop: -halfSize,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: layoutMode === "free" ? (isDragging ? "grabbing" : "grab") : "pointer",
                                filter: "none",
                                zIndex: isDragging ? 100 : isHovered ? 50 : 1,
                                userSelect: "none",
                                touchAction: "none",
                                transition: "left 420ms cubic-bezier(0.22, 1, 0.36, 1), top 420ms cubic-bezier(0.22, 1, 0.36, 1)",
                            }}
                            initial={initialAnimationComplete ? false : { scale: 0, opacity: 0 }}
                            animate={{ 
                                scale: targetScale, 
                                opacity: targetOpacity
                            }}
                            transition={
                                initialAnimationComplete
                                    ? { type: "spring", stiffness: 230, damping: 24, mass: 0.75 }
                                    : {
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                        delay: circle.index * 0.015,
                                    }
                            }
                            onMouseEnter={() => handleMouseEnter(circle.index)}
                            onMouseLeave={handleMouseLeave}
                            onMouseDown={(e) => handleMouseDown(circle.index, e, e.currentTarget)}
                            onTouchStart={(e) => handleTouchStart(circle.index, e, e.currentTarget)}
                            onClick={(e) => handleClick(circle.index, e)}
                            aria-label={person ? `Person: ${person.name}` : "Empty person"}
                            role={hasPerson ? "button" : "img"}
                        >
                            <div
                                style={{
                                    width: size,
                                    height: size,
                                    borderRadius: "50%",
                                    backgroundColor: profileImageSrc ? genderColor : "#FFFFFF",
                                    backgroundImage: profileImageSrc ? `url(${profileImageSrc})` : "none",
                                    backgroundPosition: "center",
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat",
                                    border: "none",
                                    outline: `3px solid ${outlineColor}`,
                                    outlineOffset: 0,
                                    boxSizing: "border-box",
                                    boxShadow: "none",
                                    transition: "outline-color 280ms ease, background-color 280ms ease",
                                }}
                            />
                            {isHovered && hoverCard}
                        </motion.div>
                    )
                )
            })}

        </div>
    )
}
