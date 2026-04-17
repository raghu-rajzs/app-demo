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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import {
  Search,
  UserPlus,
  Filter,
  Phone,
  Sprout,
} from "lucide-react";
import { Grower } from "../data/mockData";
import { FilterState } from "./config/formDefaults";

interface GrowerListViewProps {
  filteredGrowers: Grower[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  activeFilterCount: number;
  onSelectGrower: (grower: Grower) => void;
  selectedGrowerId?: string;
  role?: string;
  onAddGrower: () => void;
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

export function GrowerListView({
  filteredGrowers,
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  activeFilterCount,
  onSelectGrower,
  selectedGrowerId,
  role,
  onAddGrower,
}: GrowerListViewProps) {
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Growers</h2>
          <p className="text-sm text-slate-500">
            {filteredGrowers.length} growers
          </p>
        </div>

        <div className="flex items-center gap-2">
          {role === "FDO" && (
            <button
              className="flex items-center gap-1.5 bg-[#4CAF50] hover:bg-[#388E3C] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
              onClick={onAddGrower}
            >
              <UserPlus className="h-3.5 w-3.5" />
              Add New Grower
            </button>
          )}
          {role !== "FDO" && (
            <div className="text-xs text-slate-500 px-3 py-2">
              Only FDO can add growers on mobile
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 items-center justify-between bg-white p-3 rounded-lg border shadow-sm">
        {/* Filter Icon with Popover */}
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
                Filter growers by criteria
              </p>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="p-4 space-y-4">
                {/* Hybrid Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Hybrid</Label>
                  <Select
                    value={filters.hybrid}
                    onValueChange={(v) =>
                      setFilters({ ...filters, hybrid: v })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="All Hybrids" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Hybrids</SelectItem>
                      <SelectItem value="dkc-9144">DKC 9144</SelectItem>
                      <SelectItem value="p3396">P 3396</SelectItem>
                      <SelectItem value="nk-6240">NK 6240</SelectItem>
                      <SelectItem value="9001-gold">9001 GOLD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Unit Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Unit</Label>
                  <Select
                    value={filters.unit}
                    onValueChange={(v) => setFilters({ ...filters, unit: v })}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="All Units" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Units</SelectItem>
                      <SelectItem value="unit-north">Unit North</SelectItem>
                      <SelectItem value="unit-south">Unit South</SelectItem>
                      <SelectItem value="unit-east">Unit East</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Location Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Location</Label>
                  <Select
                    value={filters.location}
                    onValueChange={(v) =>
                      setFilters({ ...filters, location: v })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
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

                <Separator />

                {/* Village Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Village</Label>
                  <Select
                    value={filters.village}
                    onValueChange={(v) =>
                      setFilters({ ...filters, village: v })
                    }
                  >
                    <SelectTrigger className="h-8 text-xs">
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
                onClick={() =>
                  setFilters({
                    unit: "all",
                    location: "all",
                    block: "all",
                    village: "all",
                    hybrid: "all",
                  })
                }
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
            placeholder="Search by ID, Name, Village, Phone or PAN"
            className="pl-8 h-8 text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto space-y-3 pb-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {filteredGrowers.map((grower) => (
          <Card
            key={grower.id}
            onClick={() => onSelectGrower(grower)}
            className={`cursor-pointer transition-all active:scale-[0.98] ${
              selectedGrowerId === grower.id
                ? "border-[#10B981] ring-2 ring-[#10B981]/20 bg-green-50/50"
                : ""
            }`}
          >
            <CardContent className="p-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 font-mono mb-1">
                      {getGrowerCode(grower)}
                    </p>
                    <h3 className="font-semibold text-base truncate">
                      {grower.name}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-slate-500 truncate mt-0.5">
                  {grower.village}, Beas, Amritsar, Punjab
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Sprout className="h-3.5 w-3.5" />
                    <span>{grower.plots.length} Fields</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{grower.phone}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
