import { Card, CardContent } from "../ui/card";
import { Plot } from "../data/mockData";
import { CropHealthSheet } from "./CropHealthSheet";

interface PlotListViewProps {
  filteredPlots: Plot[];
  cropHealthMap: Record<string, string>;
  cropHealthModalPlotId: string | null;
  role: string;
  getStageDisplayLabel: (stage: string) => string;
  onSelectPlot: (plot: Plot) => void;
  onCropHealthSelect: (plotId: string, health: string) => void;
  onCropHealthClear: (plotId: string) => void;
  onCropHealthModalOpen: (plotId: string) => void;
  onCropHealthModalClose: () => void;
}

export function PlotListView({
  filteredPlots,
  cropHealthMap,
  cropHealthModalPlotId,
  role,
  getStageDisplayLabel,
  onSelectPlot,
  onCropHealthSelect,
  onCropHealthClear,
  onCropHealthModalOpen,
  onCropHealthModalClose,
}: PlotListViewProps) {
  return (
    <>
      <div className="flex-1 h-0 overflow-y-auto space-y-3 pb-20">
        {filteredPlots.map((plot) => {
          const health = cropHealthMap[plot.id];
          const healthColor =
            health === "Good"
              ? "text-green-600"
              : health === "Average"
                ? "text-yellow-600"
                : health === "Below Average"
                  ? "text-orange-500"
                  : health === "Poor"
                    ? "text-red-600"
                    : "text-slate-400";

          return (
            <Card
              key={plot.id}
              className="cursor-pointer transition-all hover:shadow-md active:scale-[0.98] overflow-hidden"
            >
              <CardContent className="p-0 flex">
                {/* Main content */}
                <div
                  className="flex-1 min-w-0 p-3"
                  onClick={() => onSelectPlot(plot)}
                >
                  <div className="flex items-start gap-2 mb-0.5">
                    <h3 className="font-semibold text-sm truncate font-mono text-slate-800">
                      {plot.id}
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    {plot.growerName}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{plot.village}</span>
                    <span className="text-slate-300">|</span>
                    <span>{plot.hybrid}</span>
                  </div>
                  {plot.stage && (
                    <div className="mt-1.5">
                      <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                        {getStageDisplayLabel(plot.stage)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Crop Health partition */}
                <div
                  className={`w-[72px] flex flex-col items-center justify-center bg-slate-50 border-l border-slate-200 px-2 shrink-0 self-stretch ${role !== "FDO" ? "cursor-pointer hover:bg-slate-100 active:bg-slate-200 transition-colors" : "cursor-default"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (role !== "FDO") {
                      onCropHealthModalOpen(plot.id);
                    }
                  }}
                >
                  <p className="text-[9px] font-semibold text-slate-500 text-center leading-tight mb-1">
                    Crop Health
                  </p>
                  <p
                    className={`text-xs font-bold text-center leading-tight ${healthColor}`}
                  >
                    {health || "—"}
                  </p>
                  {role !== "FDO" && (
                    <p className="text-[8px] text-slate-400 mt-0.5 text-center">
                      tap to set
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Crop Health Sheet */}
      <CropHealthSheet
        plotId={cropHealthModalPlotId}
        cropHealthMap={cropHealthMap}
        onSelect={onCropHealthSelect}
        onClear={onCropHealthClear}
        onClose={onCropHealthModalClose}
      />
    </>
  );
}
