import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search, Plus } from "lucide-react";
import { Plot } from "../data/mockData";

interface MockMapViewProps {
  filteredPlots: Plot[];
  onSelectPlot: (plot: Plot) => void;
  plotMapImage: string;
}

export function MockMapView({
  filteredPlots,
  onSelectPlot,
  plotMapImage,
}: MockMapViewProps) {
  return (
    <div className="relative w-full h-full flex-1 bg-slate-200 overflow-hidden">
      {/* Satellite Map Background */}
      <div
        className="absolute inset-x-0 top-0 bottom-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${plotMapImage})` }}
      />

      {/* Plot Boundaries - Blue Outlines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <rect
          x="50"
          y="100"
          width="120"
          height="90"
          fill="rgba(59,130,246,0.15)"
          stroke="#3B82F6"
          strokeWidth="2.5"
          className="cursor-pointer hover:fill-[rgba(59,130,246,0.25)] transition-all"
          style={{ pointerEvents: "auto" }}
          onClick={() => filteredPlots[0] && onSelectPlot(filteredPlots[0])}
        />
        <rect
          x="240"
          y="90"
          width="100"
          height="100"
          fill="rgba(59,130,246,0.15)"
          stroke="#3B82F6"
          strokeWidth="2.5"
          className="cursor-pointer hover:fill-[rgba(59,130,246,0.25)] transition-all"
          style={{ pointerEvents: "auto" }}
          onClick={() => filteredPlots[1] && onSelectPlot(filteredPlots[1])}
        />
        <rect
          x="100"
          y="250"
          width="150"
          height="100"
          fill="rgba(59,130,246,0.15)"
          stroke="#3B82F6"
          strokeWidth="2.5"
          className="cursor-pointer hover:fill-[rgba(59,130,246,0.25)] transition-all"
          style={{ pointerEvents: "auto" }}
          onClick={() => filteredPlots[2] && onSelectPlot(filteredPlots[2])}
        />
        <rect
          x="40"
          y="400"
          width="90"
          height="90"
          fill="rgba(59,130,246,0.15)"
          stroke="#3B82F6"
          strokeWidth="2.5"
          className="cursor-pointer hover:fill-[rgba(59,130,246,0.25)] transition-all"
          style={{ pointerEvents: "auto" }}
          onClick={() => onSelectPlot(filteredPlots[3] || filteredPlots[0])}
        />
        <rect
          x="310"
          y="260"
          width="110"
          height="120"
          fill="rgba(59,130,246,0.15)"
          stroke="#3B82F6"
          strokeWidth="2.5"
          className="cursor-pointer hover:fill-[rgba(59,130,246,0.25)] transition-all"
          style={{ pointerEvents: "auto" }}
          onClick={() => onSelectPlot(filteredPlots[4] || filteredPlots[0])}
        />
        <rect
          x="180"
          y="50"
          width="50"
          height="50"
          fill="rgba(59,130,246,0.15)"
          stroke="#3B82F6"
          strokeWidth="2.5"
          className="cursor-pointer hover:fill-[rgba(59,130,246,0.25)] transition-all"
          style={{ pointerEvents: "auto" }}
          onClick={() => filteredPlots[0] && onSelectPlot(filteredPlots[0])}
        />
        <rect
          x="360"
          y="150"
          width="60"
          height="80"
          fill="rgba(59,130,246,0.15)"
          stroke="#3B82F6"
          strokeWidth="2.5"
          className="cursor-pointer hover:fill-[rgba(59,130,246,0.25)] transition-all"
          style={{ pointerEvents: "auto" }}
          onClick={() => filteredPlots[1] && onSelectPlot(filteredPlots[1])}
        />
        <rect
          x="30"
          y="280"
          width="60"
          height="60"
          fill="rgba(59,130,246,0.15)"
          stroke="#3B82F6"
          strokeWidth="2.5"
          className="cursor-pointer hover:fill-[rgba(59,130,246,0.25)] transition-all"
          style={{ pointerEvents: "auto" }}
          onClick={() => filteredPlots[2] && onSelectPlot(filteredPlots[2])}
        />
      </svg>

      {/* Search Bar Overlay */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="relative bg-white rounded-lg shadow-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search plots by ID or Grower Name"
            className="pl-10 h-11 border-0 text-sm"
          />
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
        <Button
          variant="secondary"
          size="icon"
          className="bg-white shadow-lg h-10 w-10"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
