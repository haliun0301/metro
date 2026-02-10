// MetroPeople Page: Unites PeopleCircles, CircularDiagram, and ColumnDiagram components

import { useState, type CSSProperties } from "react"
import PeopleCircles, { type Person } from "./PeopleCircles"
import CircularDiagram, { type Segment } from "./CircularDiagram"
import ColumnDiagram, { type DataPoint } from "./ColumnDiagram"
import OccupationDiagram from "./OccupationDiagram"
import OccupationCloud from "./OccupationCloud"

export interface MetroPeopleProps {
    people?: Person[]
    jsonData?: string
    style?: CSSProperties
}

export default function MetroPeople({ people, jsonData, style }: MetroPeopleProps) {
    const [selectedGender, setSelectedGender] = useState<"any" | "male" | "female">("any")
    const [selectedShenzhenBorn, setSelectedShenzhenBorn] = useState<"any" | "yes" | "no">("any")
    const [density, setDensity] = useState<number>(65)
    const [hoveredBirthDecade, setHoveredBirthDecade] = useState<string | null>(null)
    const [hoveredArrivalDecade, setHoveredArrivalDecade] = useState<string | null>(null)
    const [hoveredGender, setHoveredGender] = useState<string | null>(null)
    const [hoveredOrigin, setHoveredOrigin] = useState<string | null>(null)
    const [hoveredOccupation, setHoveredOccupation] = useState<string | null>(null)
    const [visiblePeopleCount, setVisiblePeopleCount] = useState<number>(0)
    
    // Tab state: "demographic", "occupation", or "cloud"
    const [activeTab, setActiveTab] = useState<"demographic" | "occupation" | "cloud">("demographic")

    // Helper to convert year to decade string
    const getDecade = (year: number | undefined): string | null => {
        if (!year || typeof year !== "number") return null
        const decade = Math.floor(year / 10) * 10
        return `${decade}s`
    }

    // Callback when hovering on a person circle
    const handleHoverPerson = (person: Person | null) => {
        if (person) {
            setHoveredBirthDecade(getDecade(person.yearOfBirth))
            const residenceYear = typeof person.yearOfResidence === "number" 
                ? person.yearOfResidence 
                : parseInt(String(person.yearOfResidence), 10)
            setHoveredArrivalDecade(getDecade(isNaN(residenceYear) ? undefined : residenceYear))
            setHoveredGender(person.gender === "male" ? "Male" : person.gender === "female" ? "Female" : null)
            if (typeof person.shenzhenBorn === "boolean") {
                setHoveredOrigin(person.shenzhenBorn ? "Shenzhen Born" : "Migrated")
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

    // Gender distribution data
    const genderData: Segment[] = [
        { label: "Male", value: 45, color: "#A1CDFF" },
        { label: "Female", value: 66, color: "#FFB8D8" },
    ]

    // Origin distribution data (Shenzhen born vs migrated)
    const originData: Segment[] = [
        { label: "Shenzhen Born", value: 33, color: "#4CAF50" },
        { label: "Migrated", value: 78, color: "#FF9800" },
    ]

    // Birth decade distribution data
    const birthDecadeData: DataPoint[] = [
        { year: "1940s", total: 4 },
        { year: "1950s", total: 4 },
        { year: "1960s", total: 10 },
        { year: "1970s", total: 39 },
        { year: "1980s", total: 15 },
        { year: "1990s", total: 20 },
        { year: "2000s", total: 19 },
    ]

    // Year of arrival distribution data
    const residenceYearData: DataPoint[] = [
        { year: "1970s", total: 2 },
        { year: "1980s", total: 9 },
        { year: "1990s", total: 40 },
        { year: "2000s", total: 23 },
        { year: "2010s", total: 4 },
    ]

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100vh",
                maxHeight: "100vh",
                overflow: "hidden",
                backgroundColor: "#FAFAFA",
                ...style,
            }}
        >
            {/* Header - simplified */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    padding: "16px 24px",
                    borderBottom: "1px solid #eee",
                    flexShrink: 0,
                }}
            >
                <h1 style={{ fontSize: 24, fontWeight: 600, margin: 0 }}>Metro People</h1>
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
                    }}
                >
                    <PeopleCircles
                        people={people}
                        jsonData={jsonData}
                        selectedGender={selectedGender}
                        selectedShenzhenBorn={selectedShenzhenBorn}
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
                        borderLeft: "1px solid rgba(255,255,255,0.3)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 20,
                        overflowY: "auto",
                        minHeight: 0,
                        minWidth: 0,
                        background: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2), 0 8px 32px rgba(0,0,0,0.1)",
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
                            background: "rgba(255, 255, 255, 0.3)",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "#333" }}>
                                Filters
                            </h3>
                            <div
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: "#2196F3",
                                    background: "rgba(33, 150, 243, 0.1)",
                                    padding: "4px 10px",
                                    borderRadius: 16,
                                }}
                            >
                                {visiblePeopleCount} people
                            </div>
                        </div>
                        
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <label style={{ fontSize: 13, color: "#555", minWidth: 60 }}>Density:</label>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={density}
                                onChange={(e) => setDensity(Number(e.target.value))}
                                style={{ flex: 1, cursor: "pointer" }}
                            />
                            <span style={{ fontSize: 12, color: "#666", minWidth: 36 }}>{density}%</span>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <label style={{ fontSize: 13, color: "#555", minWidth: 60 }}>Gender:</label>
                            <select
                                value={selectedGender}
                                onChange={(e) => setSelectedGender(e.target.value as "any" | "male" | "female")}
                                style={{
                                    flex: 1,
                                    padding: "8px 12px",
                                    borderRadius: 8,
                                    border: "1px solid rgba(0,0,0,0.1)",
                                    background: "rgba(255,255,255,0.6)",
                                    backdropFilter: "blur(4px)",
                                    fontSize: 13,
                                }}
                            >
                                <option value="any">All Genders</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <label style={{ fontSize: 13, color: "#555", minWidth: 60 }}>Origin:</label>
                            <select
                                value={selectedShenzhenBorn}
                                onChange={(e) => setSelectedShenzhenBorn(e.target.value as "any" | "yes" | "no")}
                                style={{
                                    flex: 1,
                                    padding: "8px 12px",
                                    borderRadius: 8,
                                    border: "1px solid rgba(0,0,0,0.1)",
                                    background: "rgba(255,255,255,0.6)",
                                    backdropFilter: "blur(4px)",
                                    fontSize: 13,
                                }}
                            >
                                <option value="any">All Origins</option>
                                <option value="yes">Shenzhen Born</option>
                                <option value="no">Migrated</option>
                            </select>
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
                            📊 Demographic
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
                            💼 Occupation
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
                            ☁️ Cloud
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
                                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "#333" }}>
                                        Gender Distribution
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
                                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "#333" }}>
                                        Origin Distribution
                                    </h3>
                                    <CircularDiagram
                                        segments={originData}
                                        size={150}
                                        showLegend={true}
                                        showCenterTotal={true}
                                        centerLabel="People"
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
                                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#333" }}>
                                        Birth Decade
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
                                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#333" }}>
                                        Year of Arrival
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
                            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, color: "#333" }}>
                                Occupation Distribution
                            </h3>
                            <OccupationDiagram
                                highlightedLabel={hoveredOccupation}
                                onHoverOccupation={setHoveredOccupation}
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
                            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: "#333" }}>
                                Occupation Word Cloud
                            </h3>
                            <OccupationCloud
                                highlightedLabel={hoveredOccupation}
                                onHoverOccupation={setHoveredOccupation}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
