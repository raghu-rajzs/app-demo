import React, { useState } from "react";
import {
  Users,
  Grid,
  Ruler,
  Sprout,
  Leaf,
  Flower,
  Combine,
  Truck,
  TriangleAlert,
  Clock,
  Calendar,
  Filter,
  AlertCircle,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface AnalyticsProps {
  onNavigateToPlots?: (
    auditFilter?: "all" | "audited" | "pending",
    stageFilter?: string,
    statusFilter?: string,
  ) => void;
  onNavigateToAdvisory?: (status: string) => void;
  onNavigateToGrowers?: () => void;
  role?: string;
}

export function Analytics({
  onNavigateToPlots,
  onNavigateToAdvisory,
  onNavigateToGrowers,
  role = "FDO",
}: AnalyticsProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hybridType, setHybridType] = useState("all");
  const [filterUnit, setFilterUnit] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [filterVillage, setFilterVillage] = useState("all");

  const visibleFilters =
    role === "FDO"
      ? ["hybrid", "village"]
      : role === "Territory Manager"
        ? ["hybrid", "location", "village"]
        : ["hybrid", "unit", "location", "village"]; // Unit Lead

  const activeFilterCount = [
    hybridType !== "all" ? 1 : 0,
    visibleFilters.includes("unit") && filterUnit !== "all" ? 1 : 0,
    visibleFilters.includes("location") && filterLocation !== "all" ? 1 : 0,
    visibleFilters.includes("village") && filterVillage !== "all" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  // Crop stage data with field counts and status breakdown
  const stageData = [
    {
      id: "sowing",
      label: "Sowing",
      icon: <Sprout style={{ width: "15px", height: "15px" }} />,
      acreageLabel: "Sown Acre",
      acreage: 140,
      fieldCount: 32,
      inProgress: 12,
      notYetStarted: 10,
      completed: 10,
      expectedYield: null as number | null,
      iconBg: "#e8f5e9",
      iconColor: "#2e7d32",
    },
    {
      id: "vegetative",
      label: "Vegetative / Transplanting",
      icon: <Leaf style={{ width: "15px", height: "15px" }} />,
      acreageLabel: "Standing Acre",
      acreage: 67.5,
      fieldCount: 18,
      inProgress: 8,
      notYetStarted: 5,
      completed: 5,
      expectedYield: null as number | null,
      iconBg: "#e8f5e9",
      iconColor: "#2e7d32",
    },
    {
      id: "flowering",
      label: "Flowering",
      icon: <Flower style={{ width: "15px", height: "15px" }} />,
      acreageLabel: "Standing Acre",
      acreage: 98.2,
      fieldCount: 28,
      inProgress: 10,
      notYetStarted: 8,
      completed: 10,
      expectedYield: 120,
      iconBg: "#f1f8e9",
      iconColor: "#558b2f",
    },
    {
      id: "harvest",
      label: "Harvest",
      icon: <Combine style={{ width: "15px", height: "15px" }} />,
      acreageLabel: "Harvested Acre",
      acreage: 112.3,
      fieldCount: 30,
      inProgress: 12,
      notYetStarted: 8,
      completed: 10,
      expectedYield: 156,
      iconBg: "#e8f5e9",
      iconColor: "#33691e",
    },
    {
      id: "dispatch",
      label: "Dispatch",
      icon: <Truck style={{ width: "15px", height: "15px" }} />,
      acreageLabel: "Dispatched Acre",
      acreage: 45.8,
      fieldCount: 16,
      inProgress: 6,
      notYetStarted: 4,
      completed: 6,
      expectedYield: 34.2,
      iconBg: "#e0f2f1",
      iconColor: "#00695c",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        padding: "8px 10px",
        display: "flex",
        flexDirection: "column",
        gap: "0px",
        overflowY: "auto",
        height: "100%",
      }}
    >
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <div>
          <h2
            style={{
              color: "#1a1a1a",
              fontSize: "15px",
              fontWeight: 800,
              margin: 0,
            }}
          >
            Home
          </h2>
          <p style={{ color: "#888", fontSize: "9px", margin: "2px 0 0 0" }}>
            Field operation KPI scorecards
          </p>
        </div>
        <button
          onClick={() => setIsFilterOpen(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "6px 12px",
            borderRadius: "8px",
            border: "1.5px solid #e2e8f0",
            background: "white",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: 600,
            color: "#374151",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
        >
          <Filter style={{ width: "12px", height: "12px" }} />
          Filter
          {activeFilterCount > 0 && (
            <span
              style={{
                background: "#4CAF50",
                color: "white",
                borderRadius: "10px",
                padding: "0 5px",
                fontSize: "9px",
                fontWeight: 700,
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ── ALERTS SECTION ── */}
      <div
        style={{
          color: "#c0392b",
          fontSize: "8px",
          fontWeight: 700,
          letterSpacing: "1.2px",
          marginBottom: "6px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <AlertCircle style={{ width: "10px", height: "10px" }} />
        ALERTS
      </div>
      <div style={{ display: "flex", gap: "5px", marginBottom: "14px" }}>
        {/* Overdue */}
        <div
          onClick={() => onNavigateToAdvisory?.("Overdue")}
          style={{
            flex: 1,
            backgroundColor: "#fff",
            border: "1.5px solid #ef5350",
            borderLeft: "3px solid #ef5350",
            borderRadius: "10px",
            padding: "8px 8px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "3px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                background: "#fce4ec",
                borderRadius: "5px",
                padding: "3px",
                display: "flex",
              }}
            >
              <TriangleAlert
                style={{ width: "11px", height: "11px", color: "#c62828" }}
              />
            </div>
            <span
              style={{ fontSize: "9px", fontWeight: 700, color: "#1a1a1a" }}
            >
              Overdue
            </span>
          </div>
          <span
            style={{
              fontSize: "24px",
              fontWeight: 900,
              color: "#c62828",
              lineHeight: 1,
            }}
          >
            3
          </span>
          <span style={{ fontSize: "8px", color: "#888" }}>Tasks</span>
        </div>

        {/* Today */}
        <div
          onClick={() => onNavigateToAdvisory?.("Today")}
          style={{
            flex: 1,
            backgroundColor: "#fff",
            border: "1.5px solid #ff9800",
            borderLeft: "3px solid #ff9800",
            borderRadius: "10px",
            padding: "8px 8px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "3px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                background: "#fff3e0",
                borderRadius: "5px",
                padding: "3px",
                display: "flex",
              }}
            >
              <Calendar
                style={{ width: "11px", height: "11px", color: "#e65100" }}
              />
            </div>
            <span
              style={{ fontSize: "9px", fontWeight: 700, color: "#1a1a1a" }}
            >
              Today
            </span>
          </div>
          <span
            style={{
              fontSize: "24px",
              fontWeight: 900,
              color: "#e65100",
              lineHeight: 1,
            }}
          >
            7
          </span>
          <span style={{ fontSize: "8px", color: "#888" }}>Tasks</span>
        </div>

        {/* Upcoming */}
        <div
          onClick={() => onNavigateToAdvisory?.("Upcoming")}
          style={{
            flex: 1,
            backgroundColor: "#fff",
            border: "1.5px solid #4CAF50",
            borderLeft: "3px solid #4CAF50",
            borderRadius: "10px",
            padding: "8px 8px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "3px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                background: "#e8f5e9",
                borderRadius: "5px",
                padding: "3px",
                display: "flex",
              }}
            >
              <Clock
                style={{ width: "11px", height: "11px", color: "#2e7d32" }}
              />
            </div>
            <span
              style={{ fontSize: "9px", fontWeight: 700, color: "#1a1a1a" }}
            >
              Upcoming
            </span>
          </div>
          <span
            style={{
              fontSize: "24px",
              fontWeight: 900,
              color: "#2e7d32",
              lineHeight: 1,
            }}
          >
            18
          </span>
          <span style={{ fontSize: "8px", color: "#888" }}>Tasks</span>
        </div>
      </div>

      {/* ── MY PORTFOLIO SECTION ── */}
      <div
        style={{
          color: "#2e7d32",
          fontSize: "8px",
          fontWeight: 700,
          letterSpacing: "1.2px",
          marginBottom: "6px",
        }}
      >
        MY PORTFOLIO
      </div>
      <div style={{ display: "flex", gap: "4px", marginBottom: "14px" }}>
        {/* Total Growers Assigned */}
        <div
          onClick={() => onNavigateToGrowers?.()}
          style={{
            flex: 1,
            backgroundColor: "#FFF8DC",
            border: "1.5px solid #EAC117",
            borderRadius: "10px",
            padding: "8px 5px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "3px",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              background: "#FCEABB",
              borderRadius: "5px",
              padding: "3px",
              display: "flex",
            }}
          >
            <Users
              style={{ width: "11px", height: "11px", color: "#B8860B" }}
            />
          </div>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 900,
              color: "#5C4300",
              lineHeight: 1,
            }}
          >
            33
          </span>
          <span
            style={{
              fontSize: "8px",
              fontWeight: 700,
              color: "#5C4300",
              lineHeight: 1.2,
            }}
          >
            Total Growers
          </span>
        </div>

        {/* Total Fields Assigned */}
        <div
          onClick={() => onNavigateToPlots?.("all")}
          style={{
            flex: 1,
            backgroundColor: "#FFF8DC",
            border: "1.5px solid #EAC117",
            borderRadius: "10px",
            padding: "8px 5px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "3px",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              background: "#FCEABB",
              borderRadius: "5px",
              padding: "3px",
              display: "flex",
            }}
          >
            <Grid style={{ width: "11px", height: "11px", color: "#B8860B" }} />
          </div>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 900,
              color: "#5C4300",
              lineHeight: 1,
            }}
          >
            124
          </span>
          <span
            style={{
              fontSize: "8px",
              fontWeight: 700,
              color: "#5C4300",
              lineHeight: 1.2,
            }}
          >
            Total Fields
          </span>
        </div>

        {/* Total Fields Measured */}
        <div
          onClick={() => onNavigateToPlots?.("audited")}
          style={{
            flex: 1,
            backgroundColor: "#FFF8DC",
            border: "1.5px solid #EAC117",
            borderRadius: "10px",
            padding: "8px 5px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "3px",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              background: "#FCEABB",
              borderRadius: "5px",
              padding: "3px",
              display: "flex",
            }}
          >
            <Ruler
              style={{ width: "11px", height: "11px", color: "#B8860B" }}
            />
          </div>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 900,
              color: "#5C4300",
              lineHeight: 1,
            }}
          >
            87
          </span>
          <span
            style={{
              fontSize: "8px",
              fontWeight: 700,
              color: "#5C4300",
              lineHeight: 1.2,
            }}
          >
            Fields Measured
          </span>
        </div>

        {/* Measured Acre */}
        <div
          onClick={() => onNavigateToPlots?.("audited")}
          style={{
            flex: 1,
            backgroundColor: "#FFF8DC",
            border: "1.5px solid #EAC117",
            borderRadius: "10px",
            padding: "8px 5px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "3px",
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              background: "#FCEABB",
              borderRadius: "5px",
              padding: "3px",
              display: "flex",
            }}
          >
            <Ruler
              style={{ width: "11px", height: "11px", color: "#B8860B" }}
            />
          </div>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 900,
              color: "#5C4300",
              lineHeight: 1,
            }}
          >
            847
          </span>
          <span
            style={{
              fontSize: "8px",
              fontWeight: 700,
              color: "#5C4300",
              lineHeight: 1.2,
            }}
          >
            Measured Acre
          </span>
        </div>
      </div>

      {/* ── CROP STAGES SECTION ── */}
      <div
        style={{
          color: "#2e7d32",
          fontSize: "8px",
          fontWeight: 700,
          letterSpacing: "1.2px",
          marginBottom: "8px",
        }}
      >
        CROP STAGES
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        {stageData.map((stage) => {
          const stageKey = stage.label.split(" /")[0].split(" ")[0];
          return (
            <div
              key={stage.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "12px 12px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                width: "100%",
              }}
            >
              {/* Stage Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    backgroundColor: stage.iconBg,
                    borderRadius: "6px",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: stage.iconColor,
                    flexShrink: 0,
                  }}
                >
                  {stage.icon}
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    color: "#1a1a1a",
                  }}
                >
                  {stage.label}
                </span>
              </div>

              {/* Acreage + Field Count */}
              <div
                style={{
                  marginBottom: "10px",
                  display: "flex",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                  gap: "2px",
                }}
              >
                <span
                  style={{ fontSize: "10px", color: "#555", fontWeight: 600 }}
                >
                  {stage.acreageLabel}:{" "}
                </span>
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: 900,
                    color: "#1a1a1a",
                    lineHeight: 1,
                  }}
                >
                  {stage.acreage}
                </span>
                <span style={{ fontSize: "10px", color: "#666" }}>
                  {" "}
                  acres across{" "}
                </span>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: 800,
                    color: "#2e7d32",
                    lineHeight: 1,
                  }}
                >
                  {stage.fieldCount}
                </span>
                <span style={{ fontSize: "10px", color: "#666" }}> Fields</span>
              </div>

              {/* Status Pills */}
              <div style={{ display: "flex", gap: "5px" }}>
                {/* In Progress */}
                <div
                  onClick={() =>
                    onNavigateToPlots?.("all", stageKey, "In Progress")
                  }
                  style={{
                    flex: 1,
                    backgroundColor: "#fff8e1",
                    border: "1px solid #fbbf24",
                    borderRadius: "8px",
                    padding: "7px 4px",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: 900,
                      color: "#d97706",
                      lineHeight: 1,
                    }}
                  >
                    {stage.inProgress}
                  </div>
                  <div
                    style={{
                      fontSize: "8px",
                      fontWeight: 600,
                      color: "#92400e",
                      lineHeight: 1.3,
                      marginTop: "2px",
                    }}
                  >
                    In Progress
                  </div>
                </div>

                {/* Not Yet Started */}
                <div
                  onClick={() =>
                    onNavigateToPlots?.("all", stageKey, "Not Yet Started")
                  }
                  style={{
                    flex: 1,
                    backgroundColor: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    padding: "7px 4px",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: 900,
                      color: "#475569",
                      lineHeight: 1,
                    }}
                  >
                    {stage.notYetStarted}
                  </div>
                  <div
                    style={{
                      fontSize: "8px",
                      fontWeight: 600,
                      color: "#475569",
                      lineHeight: 1.3,
                      marginTop: "2px",
                    }}
                  >
                    Not Started
                  </div>
                </div>

                {/* Completed */}
                <div
                  onClick={() =>
                    onNavigateToPlots?.("all", stageKey, "Completed")
                  }
                  style={{
                    flex: 1,
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #4CAF50",
                    borderRadius: "8px",
                    padding: "7px 4px",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "20px",
                      fontWeight: 900,
                      color: "#16a34a",
                      lineHeight: 1,
                    }}
                  >
                    {stage.completed}
                  </div>
                  <div
                    style={{
                      fontSize: "8px",
                      fontWeight: 600,
                      color: "#166534",
                      lineHeight: 1.3,
                      marginTop: "2px",
                    }}
                  >
                    Completed
                  </div>
                </div>
              </div>

              {/* Expected Yield */}
              {stage.expectedYield !== null && (
                <div
                  style={{
                    marginTop: "10px",
                    paddingTop: "8px",
                    borderTop: "1px solid #f0f0f0",
                    display: "flex",
                    alignItems: "baseline",
                    gap: "4px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "9px",
                      color: "#888",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Expected Yield:
                  </span>
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "#1a1a1a",
                      lineHeight: 1,
                    }}
                  >
                    {stage.expectedYield}
                  </span>
                  <span
                    style={{ fontSize: "10px", color: "#666", fontWeight: 500 }}
                  >
                    KG
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── FILTER SHEET ── */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl max-h-[75vh] p-0 overflow-hidden flex flex-col"
        >
          <div className="px-5 py-4 border-b bg-white flex items-center justify-between flex-shrink-0">
            <SheetTitle className="text-base font-semibold text-slate-900">
              Filters
            </SheetTitle>
            {activeFilterCount > 0 && (
              <button
                onClick={() => {
                  setHybridType("all");
                  setFilterUnit("all");
                  setFilterLocation("all");
                  setFilterVillage("all");
                }}
                className="text-xs text-[#4CAF50] font-semibold"
              >
                Reset All
              </button>
            )}
            <SheetDescription className="sr-only">
              Filter Home data
            </SheetDescription>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {/* Hybrid */}
            <div>
              <label className="text-sm font-semibold text-slate-900 mb-2 block">
                Hybrid
              </label>
              <Select value={hybridType} onValueChange={setHybridType}>
                <SelectTrigger className="h-10 bg-white border-slate-300">
                  <SelectValue placeholder="All Hybrids" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hybrids</SelectItem>
                  <SelectItem value="dkc-9144">DKC 9144</SelectItem>
                  <SelectItem value="p3396">P 3396</SelectItem>
                  <SelectItem value="nk-6240">NK 6240</SelectItem>
                  <SelectItem value="9001-gold">9001 GOLD</SelectItem>
                  <SelectItem value="pioneer-3396">Pioneer 3396</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Unit — Unit Lead only */}
            {visibleFilters.includes("unit") && (
              <div>
                <label className="text-sm font-semibold text-slate-900 mb-2 block">
                  Unit
                </label>
                <Select value={filterUnit} onValueChange={setFilterUnit}>
                  <SelectTrigger className="h-10 bg-white border-slate-300">
                    <SelectValue placeholder="All Units" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Units</SelectItem>
                    <SelectItem value="unit-north">Unit North</SelectItem>
                    <SelectItem value="unit-south">Unit South</SelectItem>
                    <SelectItem value="unit-east">Unit East</SelectItem>
                    <SelectItem value="unit-west">Unit West</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Location — TM + UL */}
            {visibleFilters.includes("location") && (
              <div>
                <label className="text-sm font-semibold text-slate-900 mb-2 block">
                  Location
                </label>
                <Select
                  value={filterLocation}
                  onValueChange={setFilterLocation}
                >
                  <SelectTrigger className="h-10 bg-white border-slate-300">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="location-a">Location A</SelectItem>
                    <SelectItem value="location-b">Location B</SelectItem>
                    <SelectItem value="location-c">Location C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Village — all roles */}
            {visibleFilters.includes("village") && (
              <div>
                <label className="text-sm font-semibold text-slate-900 mb-2 block">
                  Village
                </label>
                <Select value={filterVillage} onValueChange={setFilterVillage}>
                  <SelectTrigger className="h-10 bg-white border-slate-300">
                    <SelectValue placeholder="All Villages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Villages</SelectItem>
                    <SelectItem value="rampur">Rampur</SelectItem>
                    <SelectItem value="lakhanpur">Lakhanpur</SelectItem>
                    <SelectItem value="sultanpur">Sultanpur</SelectItem>
                    <SelectItem value="govindpur">Govindpur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="px-5 py-4 border-t bg-white flex-shrink-0">
            <Button
              className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white h-11 text-sm font-semibold"
              onClick={() => setIsFilterOpen(false)}
            >
              Apply Filters
              {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
