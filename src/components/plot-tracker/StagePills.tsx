import { MOCK_PLOTS } from "../data/mockData";

interface StagePillsProps {
  cropFilter: string;
  activeStagePill: string;
  setActiveStagePill: (stage: string) => void;
  activeStatusPill: string;
  setActiveStatusPill: (status: string) => void;
}

const RICE_STAGES = [
  { id: "Sowing", label: "Sowing" },
  { id: "Transplanting", label: "Transplanting" },
  { id: "PPI", label: "PPI" },
  { id: "Flowering", label: "Flowering" },
  { id: "Harvest", label: "Harvest" },
  { id: "Dispatch", label: "Dispatch" },
];

const CORN_STAGES = [
  { id: "Sowing", label: "Sowing" },
  { id: "Vegetative", label: "Vegetative" },
  { id: "Detassling", label: "Detassling" },
  { id: "Harvest", label: "Harvest" },
  { id: "Dispatch", label: "Dispatch" },
];

const DEFAULT_STAGES = [
  { id: "Sowing", label: "Sowing" },
  { id: "Vegetative", label: "Transplanting" },
  { id: "Flowering", label: "Flowering" },
  { id: "Harvest", label: "Harvest" },
  { id: "Dispatch", label: "Dispatch" },
];

const STATUS_OPTIONS = [
  { id: "all", label: "All Status" },
  { id: "In Progress", label: "In Progress" },
  { id: "Not Yet Started", label: "Not Yet Started" },
  { id: "Completed", label: "Completed" },
];

export function StagePills({
  cropFilter,
  activeStagePill,
  setActiveStagePill,
  activeStatusPill,
  setActiveStatusPill,
}: StagePillsProps) {
  const stages =
    cropFilter === "rice"
      ? RICE_STAGES
      : cropFilter === "corn"
        ? CORN_STAGES
        : DEFAULT_STAGES;

  const basePool = MOCK_PLOTS.filter((p) => p.stage === activeStagePill);
  const statusCounts: Record<string, number> = {
    all: basePool.length,
    "In Progress": Math.floor(basePool.length * 0.4),
    "Not Yet Started": Math.floor(basePool.length * 0.35),
    Completed:
      basePool.length -
      Math.floor(basePool.length * 0.4) -
      Math.floor(basePool.length * 0.35),
  };

  return (
    <>
      {/* Crop Stage Pills */}
      <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div
          className="flex items-center gap-2 pb-1"
          style={{ minWidth: "max-content" }}
        >
          {stages.map((stage) => {
            const isActive = activeStagePill === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => {
                  setActiveStagePill(stage.id);
                  setActiveStatusPill("all");
                }}
                className={`h-8 px-3 text-xs rounded-full border font-medium whitespace-nowrap transition-colors ${isActive ? "bg-[#4CAF50] text-white border-[#4CAF50]" : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"}`}
              >
                {stage.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Pills */}
      <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {STATUS_OPTIONS.map((status) => {
          const count = statusCounts[status.id] || 0;
          const isActive = activeStatusPill === status.id;
          return (
            <button
              key={status.id}
              onClick={() => setActiveStatusPill(status.id)}
              className={`h-7 px-2.5 text-xs rounded-full border font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${isActive ? "bg-slate-700 text-white border-slate-700" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`}
            >
              {status.label}
              <span
                className={`text-[9px] font-bold rounded-full px-1 ${isActive ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
