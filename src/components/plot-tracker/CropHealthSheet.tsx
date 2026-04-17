import { Sheet, SheetContent, SheetTitle, SheetDescription } from "../ui/sheet";

interface CropHealthSheetProps {
  plotId: string | null;
  cropHealthMap: Record<string, string>;
  onSelect: (plotId: string, health: string) => void;
  onClear: (plotId: string) => void;
  onClose: () => void;
}

const HEALTH_OPTIONS = [
  {
    label: "Good",
    color: "text-green-600",
    active: "border-green-500 bg-green-50",
  },
  {
    label: "Average",
    color: "text-yellow-600",
    active: "border-yellow-500 bg-yellow-50",
  },
  {
    label: "Below Average",
    color: "text-orange-500",
    active: "border-orange-400 bg-orange-50",
  },
  { label: "Poor", color: "text-red-600", active: "border-red-500 bg-red-50" },
];

export function CropHealthSheet({
  plotId,
  cropHealthMap,
  onSelect,
  onClear,
  onClose,
}: CropHealthSheetProps) {
  const currentHealth = plotId ? cropHealthMap[plotId] : undefined;

  return (
    <Sheet
      open={plotId !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="bottom"
        className="rounded-t-2xl max-h-[60vh] p-0 overflow-hidden flex flex-col"
      >
        <div className="px-5 py-4 border-b bg-white flex items-center justify-between flex-shrink-0">
          <SheetTitle className="text-base font-semibold text-slate-900">
            Crop Health
          </SheetTitle>
          {currentHealth && (
            <button
              onClick={() => plotId && onClear(plotId)}
              className="text-xs text-[#4CAF50] font-semibold"
            >
              Clear
            </button>
          )}
          <SheetDescription className="sr-only">
            Select crop health status
          </SheetDescription>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className="text-xs text-slate-500 mb-3">
            {plotId} — Select the current crop health status
          </p>
          <div className="space-y-2">
            {HEALTH_OPTIONS.map((option) => {
              const selected = currentHealth === option.label;
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => {
                    if (plotId) {
                      onSelect(plotId, option.label);
                      onClose();
                    }
                  }}
                  className={`w-full py-3 px-4 rounded-md border text-sm font-semibold transition-colors text-left ${selected ? `${option.active} ${option.color} border-2` : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"}`}
                >
                  <span className={selected ? option.color : ""}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
