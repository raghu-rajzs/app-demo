import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import {
  ArrowLeft,
  Edit,
  MoreVertical,
  Search,
  Filter,
  Sprout,
} from "lucide-react";
import { Grower, Plot, MOCK_PLOTS } from "../data/mockData";

interface GrowerDetailViewProps {
  selectedGrower: Grower;
  onBack: () => void;
  onEditGrower: (grower: Grower) => void;
  onSelectPlot: (plot: Plot) => void;
  plotSearchQuery: string;
  setPlotSearchQuery: (q: string) => void;
  plotHybridFilter: string;
  setPlotHybridFilter: (f: string) => void;
}

function getGrowerCode(grower: Grower): string {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  const state = "PB";
  const city = grower.region.toUpperCase();
  const village = grower.village.toUpperCase();
  const initials = getInitials(grower.name);
  return `${state}/${city}/${village}/${initials}`;
}

export function GrowerDetailView({
  selectedGrower,
  onBack,
  onEditGrower,
  onSelectPlot,
  plotSearchQuery,
  setPlotSearchQuery,
  plotHybridFilter,
  setPlotHybridFilter,
}: GrowerDetailViewProps) {
  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold font-mono truncate text-sm">
            {getGrowerCode(selectedGrower)}
          </h2>
          <p className="text-sm text-slate-500 truncate">{selectedGrower.name}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditGrower(selectedGrower)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-20">
        {/* Grower Details Card */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-slate-900">Grower Details</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <p className="text-xs text-slate-500">Grower ID</p>
                <p className="font-medium text-slate-900">{selectedGrower.id}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Grower Preferred Name</p>
                <p className="font-medium text-slate-900">
                  {selectedGrower.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">SAP Grower ID</p>
                <p className="font-medium text-slate-900">
                  SAP-{selectedGrower.id.substring(0, 6).toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Age</p>
                <p className="font-medium text-slate-900">
                  {selectedGrower.age} years
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Father's Name</p>
                <p className="font-medium text-slate-900">
                  {selectedGrower.fathersName}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">PAN Number</p>
                <p className="font-medium text-slate-900">
                  {selectedGrower.panNumber}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="font-medium text-slate-900">
                  {selectedGrower.phone}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Crop Type</p>
                <p className="font-medium text-slate-900">
                  {selectedGrower.cropType}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Unit</p>
                <p className="font-medium text-slate-900">
                  {selectedGrower.unit}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">
                  {selectedGrower.cropType === "Rice" ? "Territory" : "Location"}
                </p>
                <p className="font-medium text-slate-900">
                  {selectedGrower.location}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Village</p>
                <p className="font-medium text-slate-900">
                  {selectedGrower.village}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Fields</p>
                <p className="font-medium text-slate-900">
                  {selectedGrower.plots.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Associated Plots Card */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-900">Associated Plots</h3>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex gap-2 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search plots by ID, hybrid, stage"
                  value={plotSearchQuery}
                  onChange={(e) => setPlotSearchQuery(e.target.value)}
                  className="pl-10 h-9 text-sm"
                />
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-1.5">
                    <Filter className="h-4 w-4" />
                    <span className="text-xs hidden sm:inline">Filter</span>
                    {plotHybridFilter !== "all" && (
                      <Badge
                        variant="secondary"
                        className="h-5 px-1 text-[10px]"
                      >
                        1
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3" align="end">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Hybrid</Label>
                      <Select
                        value={plotHybridFilter}
                        onValueChange={setPlotHybridFilter}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="All Hybrids" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Hybrids</SelectItem>
                          {Array.from(
                            new Set(
                              selectedGrower.plots
                                .map(
                                  (plotId) =>
                                    MOCK_PLOTS.find((p) => p.id === plotId)
                                      ?.hybrid,
                                )
                                .filter(Boolean),
                            ),
                          ).map((hybrid) => (
                            <SelectItem key={hybrid} value={hybrid || ""}>
                              {hybrid}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {plotHybridFilter !== "all" && (
                      <>
                        <Separator />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => setPlotHybridFilter("all")}
                        >
                          Clear All
                        </Button>
                      </>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              {selectedGrower.plots
                .map((plotId) => MOCK_PLOTS.find((p) => p.id === plotId))
                .filter((plotData) => {
                  if (plotSearchQuery.trim()) {
                    const query = plotSearchQuery.toLowerCase();
                    const matchesSearch =
                      plotData?.id.toLowerCase().includes(query) ||
                      plotData?.hybrid.toLowerCase().includes(query) ||
                      plotData?.stage?.toLowerCase().includes(query);
                    if (!matchesSearch) return false;
                  }
                  if (
                    plotHybridFilter !== "all" &&
                    plotData?.hybrid !== plotHybridFilter
                  ) {
                    return false;
                  }
                  return true;
                })
                .map((plotData) => {
                  if (!plotData) return null;
                  return (
                    <Card
                      key={plotData.id}
                      onClick={() => onSelectPlot(plotData)}
                      className="cursor-pointer transition-all hover:shadow-md active:scale-[0.98]"
                    >
                      <CardContent className="p-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-base truncate font-mono">
                                {plotData.id}
                              </h3>
                              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <Sprout className="h-3 w-3" />
                                {plotData.hybrid}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                            <div className="bg-slate-50 rounded px-2 py-1">
                              <p className="text-slate-400 text-[10px] mb-0.5">
                                Measured Acre
                              </p>
                              <p className="font-medium text-slate-700">
                                {plotData?.acreage || "N/A"}
                              </p>
                            </div>
                            <div className="bg-blue-50 rounded px-2 py-1">
                              <p className="text-blue-500 text-[10px] mb-0.5">
                                DAS
                              </p>
                              <p className="font-medium text-blue-700">
                                {(() => {
                                  if (!plotData?.sowingDate) return "N/A";
                                  const sowingDate = new Date(
                                    plotData.sowingDate,
                                  );
                                  const today = new Date();
                                  const das = Math.floor(
                                    (today.getTime() - sowingDate.getTime()) /
                                      (1000 * 60 * 60 * 24),
                                  );
                                  return das >= 0 ? das : "N/A";
                                })()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
