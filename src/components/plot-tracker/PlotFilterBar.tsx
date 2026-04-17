import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Filter, Search } from "lucide-react";
import { MOCK_GROWERS, MOCK_PLOTS } from "../data/mockData";

export interface FilterState {
  grower: string;
  assignedFieldAssistant: string;
  unit: string;
  location: string;
  village: string;
  crop: string;
  hybrid: string;
  currentStage: string;
  expectedStage: string;
  cropHealth: string;
}

interface PlotFilterBarProps {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  activeFilterCount: number;
}

const STAGE_OPTIONS = [
  "Sowing",
  "Vegetative",
  "Detassling",
  "Transplanting",
  "PPI",
  "Flowering",
  "Harvest",
  "Dispatch",
];

export function PlotFilterBar({
  filters,
  setFilters,
  activeFilterCount,
}: PlotFilterBarProps) {
  const getUniqueUnits = () =>
    [...new Set(MOCK_PLOTS.map((p) => p.unit))].sort();
  const getUniqueLocations = () =>
    [
      ...new Set(
        MOCK_PLOTS.filter(
          (p) =>
            filters.unit === "all" ||
            p.unit?.toLowerCase() === filters.unit.toLowerCase(),
        ).map((p) => p.location),
      ),
    ].sort();
  const getUniqueVillages = () =>
    [
      ...new Set(
        MOCK_PLOTS.filter(
          (p) =>
            (filters.unit === "all" ||
              p.unit?.toLowerCase() === filters.unit.toLowerCase()) &&
            (filters.location === "all" ||
              p.location?.toLowerCase() === filters.location.toLowerCase()),
        ).map((p) => p.village),
      ),
    ].sort();
  const getUniqueHybrids = () =>
    [
      ...new Set(
        MOCK_PLOTS.filter(
          (p) =>
            (filters.unit === "all" ||
              p.unit?.toLowerCase() === filters.unit.toLowerCase()) &&
            (filters.location === "all" ||
              p.location?.toLowerCase() === filters.location.toLowerCase()) &&
            (filters.village === "all" ||
              p.village?.toLowerCase() === filters.village.toLowerCase()),
        ).map((p) => p.hybrid),
      ),
    ].sort();

  const clearAll = () =>
    setFilters({
      grower: "all",
      assignedFieldAssistant: "all",
      unit: "all",
      location: "all",
      village: "all",
      crop: "all",
      hybrid: "all",
      currentStage: "all",
      expectedStage: "all",
      cropHealth: "all",
    });

  return (
    <div className="flex gap-3 items-center justify-between bg-white p-3 rounded-lg border shadow-sm">
      {/* Filter Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1.5">
            <Filter className="h-4 w-4" />
            <span className="text-xs">Filter</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-3 bg-slate-50 border-b">
            <h4 className="font-medium text-sm">Filters</h4>
            <p className="text-xs text-slate-500">
              Filter plots by location and assignment
            </p>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Grower</Label>
                <Select
                  value={filters.grower}
                  onValueChange={(v) => setFilters({ ...filters, grower: v })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select grower" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Growers</SelectItem>
                    {MOCK_GROWERS.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Assigned Field Assistant
                </Label>
                <Select
                  value={filters.assignedFieldAssistant}
                  onValueChange={(v) =>
                    setFilters({ ...filters, assignedFieldAssistant: v })
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select field assistant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Field Assistants</SelectItem>
                    <SelectItem value="rajiv-sharma">Rajiv Sharma</SelectItem>
                    <SelectItem value="priya-patel">Priya Patel</SelectItem>
                    <SelectItem value="amit-singh">Amit Singh</SelectItem>
                    <SelectItem value="neha-gupta">Neha Gupta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-medium">Unit</Label>
                <Select
                  value={filters.unit}
                  onValueChange={(v) =>
                    setFilters({
                      ...filters,
                      unit: v,
                      location: "all",
                      village: "all",
                    })
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Units</SelectItem>
                    {getUniqueUnits().map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-medium">Location</Label>
                <Select
                  value={filters.location}
                  onValueChange={(v) =>
                    setFilters({ ...filters, location: v, village: "all" })
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {getUniqueLocations().map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-medium">Village</Label>
                <Select
                  value={filters.village}
                  onValueChange={(v) => setFilters({ ...filters, village: v })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select village" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Villages</SelectItem>
                    {getUniqueVillages().map((v) => (
                      <SelectItem key={v} value={v}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-medium">Hybrid</Label>
                <Select
                  value={filters.hybrid}
                  onValueChange={(v) => setFilters({ ...filters, hybrid: v })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select hybrid" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Hybrids</SelectItem>
                    {getUniqueHybrids().map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-medium">Current Stage</Label>
                <Select
                  value={filters.currentStage}
                  onValueChange={(v) =>
                    setFilters({ ...filters, currentStage: v })
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select current stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    {STAGE_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-medium">Expected Stage</Label>
                <Select
                  value={filters.expectedStage}
                  onValueChange={(v) =>
                    setFilters({ ...filters, expectedStage: v })
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select expected stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    {STAGE_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-medium">Crop Health</Label>
                <Select
                  value={filters.cropHealth}
                  onValueChange={(v) =>
                    setFilters({ ...filters, cropHealth: v })
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select crop health" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Average">Average</SelectItem>
                    <SelectItem value="Below Average">Below Average</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </ScrollArea>
          <div className="p-3 border-t bg-slate-50 flex justify-between items-center">
            <span className="text-xs text-slate-500">
              {activeFilterCount} active filter
              {activeFilterCount !== 1 ? "s" : ""}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={clearAll}
            >
              Clear All
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Search Bar */}
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by Plot ID or Grower Name"
          className="pl-8 h-8 text-xs"
        />
      </div>
    </div>
  );
}
