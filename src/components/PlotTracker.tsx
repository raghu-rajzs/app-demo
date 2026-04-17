import { useState } from "react";
import { MOCK_PLOTS, MOCK_ADVISORIES, Plot } from "./data/mockData";
import { Button } from "./ui/button";
import { Map as MapIcon, List, Plus } from "lucide-react";
import { AddPlotWizard } from "./AddPlotWizard";
import { FieldAdditionPage } from "./FieldAdditionPage";
import plotMapImage from "figma:asset/332f5dc0a96a9859a215db7d62948338a5a56cf1.png";
import { AddTaskPage } from "./plot-tracker/AddTaskPage";
import { PlotDetailView } from "./plot-tracker/PlotDetailView";
import { MockMapView } from "./plot-tracker/MockMapView";
import { CopyPlotDialog } from "./plot-tracker/CopyPlotDialog";
import { PlotFilterBar, FilterState } from "./plot-tracker/PlotFilterBar";
import { StagePills } from "./plot-tracker/StagePills";
import { PlotListView } from "./plot-tracker/PlotListView";
import { MediaEntry } from "./growers/config/formDefaults";

interface PlotTrackerProps {
  initialAuditFilter?: "all" | "audited" | "pending";
  initialStageFilter?: string;
  initialStatusFilter?: string;
  selectedRegion?: string;
  role?: string;
}

export function PlotTracker({
  initialAuditFilter = "all",
  initialStageFilter = "all",
  initialStatusFilter = "all",
  selectedRegion = "all",
  role = "FDO",
}: PlotTrackerProps = {}) {
  const [viewMode, setViewMode] = useState<"map" | "list">("list");
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [isAddPlotOpen, setIsAddPlotOpen] = useState(false);
  const [isFieldAdditionPageOpen, setIsFieldAdditionPageOpen] = useState(false);
  const [fieldAdditionInitialData, setFieldAdditionInitialData] =
    useState<any>(null);
  const [isAddTaskPageOpen, setIsAddTaskPageOpen] = useState(false);
  const [isCopyPlotOpen, setIsCopyPlotOpen] = useState(false);
  const [copiedPlotInitialData, setCopiedPlotInitialData] = useState<any>(null);
  const [copyPlotData, setCopyPlotData] = useState({
    season: "",
    state: "",
    district: "",
    grower: "",
    plotId: "",
  });
  const [taskData, setTaskData] = useState({
    title: "",
    taskType: "",
    dueDate: "",
  });

  // Field Stages
  const [activeFieldStage, setActiveFieldStage] = useState("pre-sowing");
  const [isFieldSummaryOpen, setIsFieldSummaryOpen] = useState(false);
  const [fieldStageData, setFieldStageData] = useState({
    preSowing: { measured: false, acreage: "" },
    sowing: {
      previousCrop: "",
      plantingRatio: "",
      maleLotNumber: "",
      femaleLotNumber: "",
      maleIssuedAcre: "",
      femaleIssuedAcre: "",
      irrigationType: "",
      femaleSowingDate: "",
      acres: "",
      male1PlantingDate: "",
      male2PlantingDate: "",
    },
    vegetative: {
      areaCancelled: "",
      areaCancelledReason: [] as string[],
      plantUniformity: "",
      ffPlantCount: "",
      male1PlantCount: "",
      rowSpacingFF: "",
      rowSpacingFM: "",
      rowSpacingMM: "",
      male2PlantCount: "",
      plantRouging: "",
      standingAcre: "",
      estimatedYield: "",
    },
    flowering: {
      detasselingStart: "",
      detasselingEnd: "",
      pollinationInfo: "",
      ffTasselsThrowing: "",
      offTypesShedding: "",
      nicking: "",
      mSkeletonization: "",
      ffSilks: "",
      male1TasselsThrowing: "",
      male2TasselsThrowing: "",
      mPollenAmount: "",
      fieldProblem: "",
      neighborShedding: "",
      neighborDistance: "",
      isolationSufficient: "",
      isolationCode: "",
      nickWithContaminantBlock: "",
      fieldScoreRating: "",
      standingAcre: "",
      estimatedYield: "",
    },
    quality: { notes: "" },
    preHarvest: {
      maleDestruction: "",
      diseaseIntensity: "",
      diseaseName: "",
      cropHealth: "",
      fieldProblem: "",
      estimatedYield: "",
      preHarvestCutMoisture: "",
      standingAcre: "",
      estimatedYieldFinal: "",
    },
    harvest: {
      maleDate: "",
      femaleDate: "",
      harvestWeight: "",
      fieldFinal: "",
    },
    dispatch: { dispatchWeight: "", truckNumber: "", lrNumber: "" },
    ccp: { childWorking: "" },
  });

  const updateStageField = (stage: string, field: string, value: unknown) => {
    setFieldStageData((prev: any) => ({
      ...prev,
      [stage]: { ...prev[stage], [field]: value },
    }));
  };

  // Media
  const [isMediaSectionOpen, setIsMediaSectionOpen] = useState(true);
  const [isMediaSaved, setIsMediaSaved] = useState(false);
  const [mediaEntries, setMediaEntries] = useState<MediaEntry[]>([]);

  // Crop Health
  const [cropHealthMap, setCropHealthMap] = useState<Record<string, string>>(
    {},
  );
  const [cropHealthModalPlotId, setCropHealthModalPlotId] = useState<
    string | null
  >(null);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    grower: "all",
    assignedFieldAssistant: "all",
    unit: "all",
    location: "all",
    village: "all",
    crop: "all",
    hybrid: "all",
    currentStage: initialStageFilter,
    expectedStage: "all",
    cropHealth: "all",
  });
  const [auditFilter] = useState<"all" | "audited" | "pending">(
    initialAuditFilter,
  );
  const [activeStagePill, setActiveStagePill] = useState<string>(
    initialStageFilter !== "all" ? initialStageFilter : "Sowing",
  );
  const [activeStatusPill, setActiveStatusPill] =
    useState<string>(initialStatusFilter);

  const activeFilterCount = [
    filters.grower !== "all",
    filters.assignedFieldAssistant !== "all",
    filters.unit !== "all",
    filters.location !== "all",
    filters.village !== "all",
    filters.crop !== "all",
    filters.hybrid !== "all",
    filters.currentStage !== "all",
    filters.expectedStage !== "all",
    filters.cropHealth !== "all",
  ].filter(Boolean).length;

  const DISPLAY_TRANSPLANTING_LABEL = true;

  const getStageDisplayLabel = (stageValue: string): string =>
    stageValue === "Vegetative" && DISPLAY_TRANSPLANTING_LABEL
      ? "Transplanting"
      : stageValue;

  const filteredPlots = MOCK_PLOTS.filter((plot) => {
    if (filters.grower !== "all" && plot.growerId !== filters.grower)
      return false;
    if (filters.assignedFieldAssistant !== "all") return false;
    if (
      filters.unit !== "all" &&
      plot.unit?.toLowerCase() !== filters.unit.toLowerCase()
    )
      return false;
    if (
      filters.location !== "all" &&
      plot.location?.toLowerCase() !== filters.location.toLowerCase()
    )
      return false;
    if (
      filters.village !== "all" &&
      plot.village?.toLowerCase() !== filters.village.toLowerCase()
    )
      return false;
    if (filters.crop !== "all" && plot.crop?.toLowerCase() !== filters.crop)
      return false;
    if (
      filters.hybrid !== "all" &&
      plot.hybrid?.toLowerCase() !== filters.hybrid.toLowerCase()
    )
      return false;
    if (filters.currentStage !== "all" && plot.stage !== filters.currentStage)
      return false;
    if (
      filters.expectedStage !== "all" &&
      plot.expectedStage !== filters.expectedStage
    )
      return false;
    if (auditFilter !== "all" && plot.auditStatus !== auditFilter) return false;
    if (activeStagePill !== "all" && plot.stage !== activeStagePill)
      return false;
    return true;
  });

  const pendingAdvisory = MOCK_ADVISORIES?.find(
    (a) => a.plotId === selectedPlot?.id && a.status === "Pending",
  );

  // ── Add Task Page ──
  if (isAddTaskPageOpen) {
    return (
      <AddTaskPage
        taskData={taskData}
        setTaskData={setTaskData}
        onClose={() => setIsAddTaskPageOpen(false)}
      />
    );
  }

  // ── Plot Detail View ──
  if (selectedPlot) {
    return (
      <PlotDetailView
        selectedPlot={selectedPlot}
        plotMapImage={plotMapImage}
        onBack={() => setSelectedPlot(null)}
        onAddTask={() => setIsAddTaskPageOpen(true)}
        activeFieldStage={activeFieldStage}
        setActiveFieldStage={setActiveFieldStage}
        fieldStageData={fieldStageData}
        updateStageField={updateStageField}
        isFieldSummaryOpen={isFieldSummaryOpen}
        setIsFieldSummaryOpen={setIsFieldSummaryOpen}
        isMediaSectionOpen={isMediaSectionOpen}
        setIsMediaSectionOpen={setIsMediaSectionOpen}
        isMediaSaved={isMediaSaved}
        setIsMediaSaved={setIsMediaSaved}
        mediaEntries={mediaEntries}
        setMediaEntries={setMediaEntries}
        pendingAdvisory={pendingAdvisory}
      />
    );
  }

  // ── List / Map View ──
  return (
    <div className="gap-3 h-full flex flex-col pb-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Fields</h2>
          <p className="text-sm text-slate-500">
            {filteredPlots.length} fields
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-1.5 bg-[#4CAF50] hover:bg-[#388E3C] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            onClick={() => setIsAddPlotOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Add New Field
          </button>
          <AddPlotWizard
            isOpen={isAddPlotOpen}
            onClose={() => {
              setIsAddPlotOpen(false);
              setCopiedPlotInitialData(null);
            }}
            onMappingComplete={(mappingData) => {
              setFieldAdditionInitialData(mappingData);
              setIsFieldAdditionPageOpen(true);
              setIsAddPlotOpen(false);
            }}
            initialData={copiedPlotInitialData}
            selectedRegion={selectedRegion}
          />
          {isFieldAdditionPageOpen && (
            <FieldAdditionPage
              initialData={fieldAdditionInitialData}
              onClose={() => {
                setIsFieldAdditionPageOpen(false);
                setFieldAdditionInitialData(null);
              }}
              onSave={() => {
                setIsFieldAdditionPageOpen(false);
                setFieldAdditionInitialData(null);
              }}
            />
          )}
        </div>
      </div>

      {/* Filter Bar */}
      {viewMode === "list" && (
        <PlotFilterBar
          filters={filters}
          setFilters={setFilters}
          activeFilterCount={activeFilterCount}
        />
      )}

      {/* View Mode Toggle */}
      {!isAddPlotOpen && !isFieldAdditionPageOpen && !isCopyPlotOpen && (
        <div className="fixed bottom-[104px] sm:bottom-[196px] left-1/2 -translate-x-1/2 z-50">
          <div className="inline-flex items-center bg-white border border-slate-200 rounded-lg p-1 gap-1 shadow-lg mx-[0px] my-[16px]">
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 ${viewMode === "list" ? "bg-[#4CAF50] text-white" : "text-[#4CAF50] hover:bg-green-50"}`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 ${viewMode === "map" ? "bg-[#4CAF50] text-white" : "text-[#4CAF50] hover:bg-green-50"}`}
              onClick={() => setViewMode("map")}
            >
              <MapIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Stage & Status Pills */}
      {viewMode === "list" && (
        <StagePills
          cropFilter={filters.crop}
          activeStagePill={activeStagePill}
          setActiveStagePill={(s) => {
            setActiveStagePill(s);
            setActiveStatusPill("all");
          }}
          activeStatusPill={activeStatusPill}
          setActiveStatusPill={setActiveStatusPill}
        />
      )}

      {/* Main Content */}
      {viewMode === "map" ? (
        <MockMapView
          filteredPlots={filteredPlots}
          onSelectPlot={(plot) => {
            setSelectedPlot(plot);
            setActiveFieldStage(
              plot.crop === "Rice" ? "area-measurement" : "pre-sowing",
            );
          }}
          plotMapImage={plotMapImage}
        />
      ) : (
        <PlotListView
          filteredPlots={filteredPlots}
          cropHealthMap={cropHealthMap}
          cropHealthModalPlotId={cropHealthModalPlotId}
          role={role}
          getStageDisplayLabel={getStageDisplayLabel}
          onSelectPlot={(plot) => {
            setSelectedPlot(plot);
            setActiveFieldStage(
              plot.crop === "Rice" ? "area-measurement" : "pre-sowing",
            );
          }}
          onCropHealthSelect={(plotId, health) =>
            setCropHealthMap((prev: Record<string, string>) => ({
              ...prev,
              [plotId]: health,
            }))
          }
          onCropHealthClear={(plotId) =>
            setCropHealthMap((prev: Record<string, string>) => {
              const next = { ...prev };
              delete next[plotId];
              return next;
            })
          }
          onCropHealthModalOpen={setCropHealthModalPlotId}
          onCropHealthModalClose={() => setCropHealthModalPlotId(null)}
        />
      )}

      {/* Copy Plot Dialog */}
      <CopyPlotDialog
        isOpen={isCopyPlotOpen}
        copyPlotData={copyPlotData}
        setCopyPlotData={setCopyPlotData}
        onProceed={(initialData) => {
          setCopiedPlotInitialData(initialData);
          setIsCopyPlotOpen(false);
          setIsAddPlotOpen(true);
        }}
        onClose={() => {
          setIsCopyPlotOpen(false);
          setCopyPlotData({
            season: "",
            state: "",
            district: "",
            grower: "",
            plotId: "",
          });
        }}
      />
    </div>
  );
}
