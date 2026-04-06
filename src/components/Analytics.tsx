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
  Plus,
  TriangleAlert,
  Clock,
  Filter,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
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
  ) => void;
  onNavigateToAdvisory?: (status: string) => void;
  onNavigateToGrowers?: () => void;
}

interface KPICard {
  id: string;
  value: number | string;
  unit?: string;
  label: string;
  icon: React.ReactNode;
  backgroundColor: string;
  borderColor: string;
  shadowColor: string;
  iconBgColor: string;
  iconColor: string;
  textColor: string;
  unitColor?: string;
  subtitle?: string;
  subtitleColor?: string;
  onCard?: boolean;
  borderAccent?: string;
  onClick?: () => void;
  acreage?: number; // Acreage value
  expectedYield?: number; // Expected yield in KG
  hideExpectedYield?: boolean; // For Vegetative stage
}

export function Analytics({
  onNavigateToPlots,
  onNavigateToAdvisory,
  onNavigateToGrowers,
}: AnalyticsProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hybridType, setHybridType] = useState("all");
  const [filterVillage, setFilterVillage] = useState("all");

  const activeFilterCount = [hybridType, filterVillage].filter(
    (v) => v !== "all",
  ).length;

  // Mock Data for KPIs
  const highlightCards: KPICard[] = [
    {
      id: "growers",
      value: 33,
      label: "No. of Growers",
      icon: <Users className="w-5 h-5" />,
      backgroundColor: "#FFF8DC",
      borderColor: "#EAC117",
      shadowColor: "#DA A520",
      iconBgColor: "#FCEABB",
      iconColor: "#B8860B",
      textColor: "#5C4300",
      onClick: () => onNavigateToGrowers?.(),
    },
    {
      id: "no-of-fields",
      value: 124,
      label: "No. of Fields",
      icon: <Grid className="w-5 h-5" />,
      backgroundColor: "#FFF8DC",
      borderColor: "#EAC117",
      shadowColor: "#DAA520",
      iconBgColor: "#FCEABB",
      iconColor: "#B8860B",
      textColor: "#5C4300",
      onClick: () => onNavigateToPlots?.("all"),
    },
    {
      id: "measured-acre",
      value: "847.5",
      label: "Measured Acre",
      icon: <Ruler className="w-5 h-5" />,
      backgroundColor: "#FFF8DC",
      borderColor: "#EAC117",
      shadowColor: "#DAA520",
      iconBgColor: "#FCEABB",
      iconColor: "#B8860B",
      textColor: "#5C4300",
      onClick: () => onNavigateToPlots?.("audited"),
    },
  ];

  const cropStageCards: KPICard[] = [
    {
      id: "sown-acreage",
      acreage: 145,
      label: "Sown Acreage",
      icon: <Sprout className="w-5 h-5" />,
      backgroundColor: "#fff",
      borderColor: "#e5e7eb",
      shadowColor: "rgba(0,0,0,0.08)",
      iconBgColor: "#e8f5e9",
      iconColor: "#2e7d32",
      textColor: "#1a1a1a",
      unitColor: "#888",
      onClick: () => {},
      value: 0, // Placeholder
    },
    {
      id: "vegetative",
      acreage: 67.5,
      expectedYield: 89000, // 89 T converted to KG
      label: "Vegetative / Transplanting",
      icon: <Leaf className="w-5 h-5" />,
      backgroundColor: "#fff",
      borderColor: "#e5e7eb",
      shadowColor: "rgba(0,0,0,0.08)",
      iconBgColor: "#e8f5e9",
      iconColor: "#2e7d32",
      textColor: "#1a1a1a",
      unitColor: "#888",
      hideExpectedYield: true, // Hide expected yield for vegetative
      onClick: () => onNavigateToPlots?.("all", "Vegetative"),
      value: 0, // Placeholder
    },
    {
      id: "flowering",
      acreage: 98.2,
      expectedYield: 120000, // 120 T converted to KG
      label: "Flowering Stage",
      icon: <Flower className="w-5 h-5" />,
      backgroundColor: "#fff",
      borderColor: "#e5e7eb",
      shadowColor: "rgba(0,0,0,0.08)",
      iconBgColor: "#f1f8e9",
      iconColor: "#558b2f",
      textColor: "#1a1a1a",
      unitColor: "#888",
      onClick: () => onNavigateToPlots?.("all", "Flowering"),
      value: 0, // Placeholder
    },
    {
      id: "harvest",
      acreage: 112.3,
      expectedYield: 156000, // 156 T converted to KG
      label: "Harvest Stage",
      icon: <Combine className="w-5 h-5" />,
      backgroundColor: "#fff",
      borderColor: "#e5e7eb",
      shadowColor: "rgba(0,0,0,0.08)",
      iconBgColor: "#e8f5e9",
      iconColor: "#33691e",
      textColor: "#1a1a1a",
      unitColor: "#888",
      onClick: () => onNavigateToPlots?.("all", "Harvest"),
      value: 0, // Placeholder
    },
    {
      id: "dispatch",
      acreage: 45.8,
      expectedYield: 34200, // Already in KG
      label: "Dispatch Stage",
      icon: <Truck className="w-5 h-5" />,
      backgroundColor: "#fff",
      borderColor: "#e5e7eb",
      shadowColor: "rgba(0,0,0,0.08)",
      iconBgColor: "#e0f2f1",
      iconColor: "#00695c",
      textColor: "#1a1a1a",
      unitColor: "#888",
      onClick: () => {},
      value: 0, // Placeholder
    },
  ];

  const alertCards: KPICard[] = [
    {
      id: "pre-sowing-fields",
      value: 12,
      unit: "Fields",
      label: "Fields pending measurement",
      icon: <Plus className="w-5 h-5" />,
      backgroundColor: "#fff",
      borderColor: "#e5e7eb",
      shadowColor: "rgba(0,0,0,0.08)",
      iconBgColor: "#fff3e0",
      iconColor: "#e65100",
      textColor: "#1a1a1a",
      unitColor: "#888",
      onClick: () => onNavigateToPlots?.("pending"),
    },
    {
      id: "pending-tasks",
      value: 28,
      unit: "Tasks",
      label: "Pending Tasks",
      icon: <TriangleAlert className="w-5 h-5" />,
      backgroundColor: "#fff",
      borderColor: "#e5e7eb",
      shadowColor: "rgba(0,0,0,0.08)",
      iconBgColor: "#fff3e0",
      iconColor: "#e65100",
      textColor: "#1a1a1a",
      unitColor: "#888",
      borderAccent: "#ff9800",
      onClick: () => onNavigateToAdvisory?.("Pending"),
    },
    {
      id: "overdue-tasks",
      value: 3,
      unit: "Tasks",
      label: "Overdue Tasks",
      icon: <Clock className="w-5 h-5" />,
      backgroundColor: "#fff",
      borderColor: "#e5e7eb",
      shadowColor: "rgba(0,0,0,0.08)",
      iconBgColor: "#fce4ec",
      iconColor: "#c62828",
      textColor: "#1a1a1a",
      unitColor: "#888",
      borderAccent: "#ef5350",
      onClick: () => onNavigateToAdvisory?.("Overdue"),
    },
  ];

  // Render KPI Card Component
  const renderKPICard = (card: KPICard) => (
    <div
      key={card.id}
      onClick={card.onClick}
      style={{
        backgroundColor: card.backgroundColor,
        borderColor: card.borderColor,
        border: `1.5px solid ${card.borderColor}`,
        borderRadius: "10px",
        boxShadow: `0 1px 4px ${card.shadowColor.includes("rgba") ? card.shadowColor : `rgba(218, 165, 32, 0.2)`}`,
        padding: "10px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "6px",
        transition: "transform 0.2s ease-in-out",
        flex: 1,
      }}
      onMouseDown={(e) => {
        if (e.currentTarget.style.transform !== undefined) {
          e.currentTarget.style.transform = "scale(0.95)";
        }
      }}
      onMouseUp={(e) => {
        if (e.currentTarget.style.transform !== undefined) {
          e.currentTarget.style.transform = "scale(1)";
        }
      }}
    >
      {/* Icon + Label Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "100%",
        }}
      >
        {/* Icon Container */}
        <div
          style={{
            backgroundColor: card.iconBgColor,
            borderRadius: "6px",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: card.iconColor,
            flexShrink: 0,
          }}
        >
          {card.icon}
        </div>

        {/* Label - Next to Icon */}
        <p
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: card.textColor,
            margin: 0,
            lineHeight: "1.2",
            flex: 1,
          }}
        >
          {card.label}
        </p>
      </div>

      {/* Value and Unit */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "4px",
        }}
      >
        <span
          style={{
            fontSize: "20px",
            fontWeight: 900,
            color: card.textColor,
          }}
        >
          {typeof card.value === "string"
            ? card.value
            : card.value.toLocaleString()}
        </span>
        {card.unit && (
          <span style={{ fontSize: "10px", color: card.unitColor || "#888" }}>
            {card.unit}
          </span>
        )}
      </div>

      {/* Subtitle */}
      {card.subtitle && (
        <p
          style={{
            fontSize: "9px",
            fontWeight: 600,
            color: card.subtitleColor,
            margin: 0,
            marginTop: "2px",
          }}
        >
          {card.subtitle}
        </p>
      )}
    </div>
  );

  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        padding: "6px 10px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        overflowY: "auto",
        height: "100%",
      }}
    >
      {/* Section 1: Page Title with Filter */}
      <div
        style={{
          marginBottom: "8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h2
            style={{
              color: "#1a1a1a",
              fontSize: "14px",
              fontWeight: 800,
              margin: 0,
            }}
          >
            Analytics
          </h2>
          <p style={{ color: "#888", fontSize: "9px", margin: "2px 0 0 0" }}>
            Field operation kpi scorecards.
          </p>
        </div>
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-2">
              <Filter className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="rounded-t-2xl max-h-[85vh] p-0 overflow-hidden flex flex-col"
          >
            <div className="px-5 py-4 border-b bg-white flex items-center justify-between flex-shrink-0">
              <SheetTitle className="text-base font-semibold text-slate-900">
                Filters
              </SheetTitle>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    setHybridType("all");
                    setFilterVillage("all");
                  }}
                  className="text-xs text-[#4CAF50] font-semibold"
                >
                  Reset All
                </button>
              )}
              <SheetDescription className="sr-only">
                Filter Analytics data
              </SheetDescription>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-4">
                {/* Hybrid Type Filter */}
                <div>
                  <label className="text-sm font-semibold text-slate-900 mb-2 block">
                    Hybrid Type
                  </label>
                  <Select value={hybridType} onValueChange={setHybridType}>
                    <SelectTrigger className="h-10 bg-white border-slate-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Hybrids</SelectItem>
                      <SelectItem value="hybrid1">Hybrid 1</SelectItem>
                      <SelectItem value="hybrid2">Hybrid 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Village Filter */}
                <div>
                  <label className="text-sm font-semibold text-slate-900 mb-2 block">
                    Village
                  </label>
                  <Select
                    value={filterVillage}
                    onValueChange={setFilterVillage}
                  >
                    <SelectTrigger className="h-10 bg-white border-slate-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Villages</SelectItem>
                      <SelectItem value="village1">Village 1</SelectItem>
                      <SelectItem value="village2">Village 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Section 2: Top Row - 3 Yellow Highlight Cards */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
        {highlightCards.map((card) => renderKPICard(card))}
      </div>

      {/* Section 3: CROP STAGES Header */}
      <div
        style={{
          color: "#2e7d32",
          fontSize: "8px",
          fontWeight: 700,
          letterSpacing: "1px",
          marginBottom: "8px",
          marginTop: "4px",
        }}
      >
        CROP STAGES
      </div>

      {/* Section 4: Crop Stage Cards - 2 Column Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "5px",
          marginBottom: "12px",
        }}
      >
        {cropStageCards.map((card) => (
          <div
            key={card.id}
            onClick={card.onClick}
            style={{
              backgroundColor: card.backgroundColor,
              borderRadius: "10px",
              padding: "8px 10px",
              boxShadow: `0 1px 3px rgba(0,0,0,0.08)`,
              cursor: "pointer",
              border: `1px solid ${card.borderColor}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "4px",
              transition: "transform 0.2s ease-in-out",
            }}
            onMouseDown={(e) => {
              if (e.currentTarget.style.transform !== undefined) {
                e.currentTarget.style.transform = "scale(0.98)";
              }
            }}
            onMouseUp={(e) => {
              if (e.currentTarget.style.transform !== undefined) {
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            {/* Icon + Label Row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
              }}
            >
              {/* Icon Container */}
              <div
                style={{
                  backgroundColor: card.iconBgColor,
                  borderRadius: "6px",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: card.iconColor,
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>

              {/* Label - Next to Icon */}
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: card.textColor,
                  margin: 0,
                  lineHeight: "1.2",
                  flex: 1,
                }}
              >
                {card.label}
              </p>
            </div>

            {/* Acreage - Larger font, on top */}
            {card.acreage !== undefined && (
              <div
                style={{ display: "flex", alignItems: "baseline", gap: "2px" }}
              >
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: 900,
                    color: card.textColor,
                  }}
                >
                  {card.acreage.toLocaleString()}
                </span>
                <span style={{ fontSize: "10px", color: card.unitColor }}>
                  Acre
                </span>
              </div>
            )}

            {/* Expected Yield - Smaller font, below (only if not hidden) */}
            {card.expectedYield !== undefined && !card.hideExpectedYield && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "1px" }}
              >
                <span
                  style={{
                    fontSize: "7px",
                    color: card.unitColor,
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Expected Yield
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "2px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: card.textColor,
                    }}
                  >
                    {(card.expectedYield / 1000).toLocaleString()}
                  </span>
                  <span
                    style={{
                      fontSize: "9px",
                      color: card.unitColor,
                      fontWeight: 500,
                    }}
                  >
                    KG
                  </span>
                </div>
              </div>
            )}

            {/* Subtitle */}
            {card.subtitle && (
              <p
                style={{
                  fontSize: "8px",
                  fontWeight: 500,
                  color: card.subtitleColor,
                  margin: 0,
                }}
              >
                {card.subtitle}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Section 5: ALERTS Header */}
      <div
        style={{
          color: "#2e7d32",
          fontSize: "8px",
          fontWeight: 700,
          letterSpacing: "1px",
          marginBottom: "8px",
          marginTop: "4px",
        }}
      >
        ALERTS
      </div>

      {/* Section 6: Alert Cards - 2 Column Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "5px",
          marginBottom: "16px",
        }}
      >
        {alertCards.map((card) => (
          <div
            key={card.id}
            onClick={card.onClick}
            style={{
              backgroundColor: card.backgroundColor,
              borderRadius: "10px",
              padding: "8px 10px",
              boxShadow: `0 1px 3px rgba(0,0,0,0.08)`,
              cursor: "pointer",
              border: `1px solid ${card.borderColor}`,
              borderLeft: card.borderAccent
                ? `3px solid ${card.borderAccent}`
                : `1px solid ${card.borderColor}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "4px",
              transition: "transform 0.2s ease-in-out",
            }}
            onMouseDown={(e) => {
              if (e.currentTarget.style.transform !== undefined) {
                e.currentTarget.style.transform = "scale(0.98)";
              }
            }}
            onMouseUp={(e) => {
              if (e.currentTarget.style.transform !== undefined) {
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            {/* Icon + Label Row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
              }}
            >
              {/* Icon Container */}
              <div
                style={{
                  backgroundColor: card.iconBgColor,
                  borderRadius: "6px",
                  width: "24px",
                  height: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: card.iconColor,
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>

              {/* Label - Next to Icon */}
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: card.textColor,
                  margin: 0,
                  lineHeight: "1.2",
                  flex: 1,
                }}
              >
                {card.label}
              </p>
            </div>

            {/* Value and Unit */}
            <div
              style={{ display: "flex", alignItems: "baseline", gap: "2px" }}
            >
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 900,
                  color: card.textColor,
                }}
              >
                {typeof card.value === "string"
                  ? card.value
                  : card.value.toLocaleString()}
              </span>
              {card.unit && (
                <span style={{ fontSize: "10px", color: card.unitColor }}>
                  {card.unit}
                </span>
              )}
            </div>

            {/* Subtitle */}
            {card.subtitle && (
              <p
                style={{
                  fontSize: "9px",
                  fontWeight: 600,
                  color: card.subtitleColor,
                  margin: 0,
                }}
              >
                {card.subtitle}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
