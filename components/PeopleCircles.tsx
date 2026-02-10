import { useMemo, useState, startTransition, useEffect, useRef, useCallback, type CSSProperties } from "react"
import { motion } from "framer-motion"
import { PeopleData } from "../data/people"

interface ResponsiveImage {
    src: string
    srcSet?: string
    alt?: string
}

export interface Person {
    name: string
    profileUrl: string
    image?: ResponsiveImage
    gender?: "male" | "female"
    circleSize?: number
    circleColor?: string
    yearOfBirth?: number
    shenzhenBorn?: boolean
    yearOfResidence?: number
    imageFile?: string
}

export const defaultPeople: Person[] = PeopleData as Person[]

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
    onVisibleCountChange?: (count: number) => void
    selectedGender?: "any" | "male" | "female"
    selectedShenzhenBorn?: "any" | "yes" | "no"
    density?: number
}

const MAX_CIRCLES = 96

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
    onVisibleCountChange,
    selectedGender = "any",
    selectedShenzhenBorn = "any",
    density = 100,
}: PeopleCirclesProps) {
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

    const circleCount = Math.min(effectivePeople.length, MAX_CIRCLES)
    const spreadRadius = 0.10 + (density / 100) * 0.35
    const adjustedCircleSize = Math.round(circleSize * (0.4 + (density / 100) * 0.6))

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
        const customPos = customPositions.get(circle.index)
        if (customPos) {
            return customPos
        }
        return { xPercent: circle.xPercent, yPercent: circle.yPercent }
    }, [customPositions])

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
    }, [circlesData, getCirclePosition])

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
        const size = adjustedCircleSize
        element.style.left = `${xPercent}%`
        element.style.top = `${yPercent}%`
        element.style.marginLeft = `${-size / 2}px`
        element.style.marginTop = `${-(size * 1.2) / 2}px`
        
        // Store the position in a ref for final state update
        dragOffsetRef.current.finalX = xPercent
        dragOffsetRef.current.finalY = yPercent
    }, [draggingIndex, adjustedCircleSize])

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

    const hoveredPerson =
        hoveredIndex !== null && hoveredIndex < effectivePeople.length
            ? effectivePeople[hoveredIndex]
            : undefined

    const hoveredCircle = hoveredIndex !== null
        ? circlesData.find((c) => c.index === hoveredIndex)
        : undefined
    
    const hoveredCirclePos = hoveredCircle ? getCirclePosition(hoveredCircle) : undefined

    return (
        <div
            ref={containerRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: "hidden",
                backgroundColor,
                touchAction: "none",
                ...(style || {}),
            }}
            onMouseLeave={() => {
                handleMouseLeave()
            }}
        >
            {visibleCircles.map((circle) => {
                const hasPerson = circle.index < effectivePeople.length
                const person = hasPerson ? effectivePeople[circle.index] : undefined
                const isHovered = hoveredIndex === circle.index && draggingIndex === null
                const isDragging = draggingIndex === circle.index
                const isVisited = visitedIndices.has(circle.index)
                const size = adjustedCircleSize
                const halfSize = size / 2

                const pos = getCirclePosition(circle)

                const baseColor = person?.circleColor
                    ? person.circleColor
                    : person?.gender === "female"
                      ? "#A1CDFF"
                      : person?.gender === "male"
                        ? "#FFB8D8"
                        : circleColor

                // Check if any icon is hovered (but not this one)
                const isAnyHovered = hoveredIndex !== null && draggingIndex === null
                const isGreyedOut = isAnyHovered && !isHovered

                // Apply greyed out color if another icon is hovered
                let genderColor = isVisited ? lightenColor(baseColor, 0.4) : baseColor
                if (isGreyedOut) {
                    genderColor = "#D1D5DB" // Grey color for non-hovered icons
                }

                // Determine scale based on state
                const targetScale = isDragging ? 1.2 : isHovered ? hoverScale : 1
                
                // Determine opacity based on hover state
                const targetOpacity = isGreyedOut ? 0.4 : 1

                return (
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
                            height: size * 1.2,
                            marginLeft: -halfSize,
                            marginTop: -(size * 1.2) / 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: isDragging ? "grabbing" : "grab",
                            filter: isHovered 
                                ? "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" 
                                : isGreyedOut 
                                    ? "none"
                                    : "drop-shadow(0 1px 2px rgba(0,0,0,0.1))",
                            zIndex: isDragging ? 100 : isHovered ? 50 : 1,
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
                                ? { type: "spring", stiffness: 400, damping: 30, duration: 0.15 }
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
                        <PersonIcon color={genderColor} size={size} />
                    </motion.div>
                )
            })}

            {hoveredPerson && hoveredCirclePos && draggingIndex === null && (
                <div
                    style={{
                        position: "absolute",
                        left: `${hoveredCirclePos.xPercent}%`,
                        top: `${hoveredCirclePos.yPercent}%`,
                        transform: "translate(-50%, -130%)",
                        pointerEvents: "none",
                        backgroundColor: "#FFFFFF",
                        borderRadius: 12,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                        padding: 8,
                        minWidth: 120,
                        maxWidth: 200,
                        zIndex: 200,
                    }}
                    aria-hidden="true"
                >
                    {(hoveredPerson.imageFile || hoveredPerson.image?.src) && (
                        <div
                            style={{
                                width: "100%",
                                borderRadius: 8,
                                overflow: "hidden",
                                marginBottom: showNameOnHover ? 6 : 0,
                            }}
                        >
                            <img
                                src={hoveredPerson.imageFile || hoveredPerson.image?.src || ""}
                                alt={hoveredPerson.name}
                                style={{ display: "block", width: "100%", height: "auto", objectFit: "cover" }}
                            />
                        </div>
                    )}
                    {showNameOnHover && hoveredPerson.name && (
                        <div
                            style={{
                                fontSize: nameFontSize,
                                fontWeight: nameFontWeight,
                                lineHeight: "1.2em",
                                letterSpacing: "-0.01em",
                                textAlign: "center",
                                color: "#000000",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {hoveredPerson.name}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
