import { useState } from "react";
import {
  MOCK_GROWERS,
  MOCK_PLOTS,
  MOCK_ADVISORIES,
  Grower,
  Plot,
} from "./data/mockData";
import { AddPlotWizard } from "./AddPlotWizard";
import { GrowerListView } from "./growers/GrowerListView";
import { GrowerDetailView } from "./growers/GrowerDetailView";
import { PlotDetailView } from "./growers/PlotDetailView";
import { AddGrowerDialog } from "./growers/AddGrowerDialog";
import { BulkUploadDialog } from "./growers/BulkUploadDialog";
import {
  DEFAULT_FORM_DATA,
  DEFAULT_FIELD_STAGE_DATA,
  DEFAULT_FILTERS,
  FormData,
  FieldStageData,
  FilterState,
  MediaEntry,
} from "./growers/config/formDefaults";
import {
  CORN_FIELD_STAGES,
  RICE_FIELD_STAGES,
} from "./growers/config/fieldStages";

interface GrowersProps {
  selectedRegion?: string;
  role?: string;
}

export function Growers({
  selectedRegion = "all",
  role = "FDO",
}: GrowersProps = {}) {
  const plotMapImage = "../assets/53659142.jpg";

  // Navigation state
  const [selectedGrower, setSelectedGrower] = useState<Grower | null>(null);
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);

  // Dialog state
  const [isAddGrowerOpen, setIsAddGrowerOpen] = useState(false);
  const [isAddPlotWizardOpen, setIsAddPlotWizardOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [editingGrowerId, setEditingGrowerId] = useState<string | null>(null);

  // Add/Edit grower form state
  const [addStep, setAddStep] = useState(1);
  const [selectedCropType, setSelectedCropType] = useState("Corn");
  const [formData, setFormData] = useState<FormData>({ ...DEFAULT_FORM_DATA });

  // Plot detail state
  const [isMediaSectionOpen, setIsMediaSectionOpen] = useState(true);
  const [isMediaSaved, setIsMediaSaved] = useState(false);
  const [mediaEntries, setMediaEntries] = useState<MediaEntry[]>([]);
  const [activeFieldStage, setActiveFieldStage] = useState("pre-sowing");
  const [isFieldSummaryOpen, setIsFieldSummaryOpen] = useState(false);
  const [fieldStageData, setFieldStageData] = useState<FieldStageData>({
    ...DEFAULT_FIELD_STAGE_DATA,
  });

  // List/filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS });
  const [plotHybridFilter, setPlotHybridFilter] = useState("all");
  const [plotSearchQuery, setPlotSearchQuery] = useState("");

  const activeFilterCount = [
    filters.unit !== "all",
    filters.location !== "all",
    filters.block !== "all",
    filters.village !== "all",
    filters.hybrid !== "all",
  ].filter(Boolean).length;

  const updateStageField = (stage: string, field: string, value: unknown) => {
    setFieldStageData((prev: FieldStageData) => ({
      ...prev,
      [stage]: { ...(prev as any)[stage], [field]: value },
    }));
  };

  const filteredGrowers = MOCK_GROWERS.filter((g) => {
    const matchesSearch =
      g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.panNumber.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (
      filters.village !== "all" &&
      g.village.toLowerCase() !== filters.village
    )
      return false;
    return true;
  });

  const pendingAdvisory = selectedPlot
    ? MOCK_ADVISORIES.find(
        (a) => a.plotId === selectedPlot.id && a.status === "Pending",
      )
    : undefined;

  const handleEditGrower = (grower: Grower) => {
    setSelectedGrower(null);
    setEditingGrowerId(grower.id);
    setFormData({
      preferredName: grower.name,
      age: grower.age.toString(),
      fathersName: grower.fathersName,
      panNumber: grower.panNumber,
      phone: grower.phone,
      referenceNumber: "",
      village: grower.village,
      aadhaarNumber: "",
      cropType: grower.cropType,
      unit: grower.unit,
      location: grower.location,
    });
    setSelectedCropType(grower.cropType);
    setIsAddGrowerOpen(true);
    setAddStep(1);
  };

  const handleCloseDialog = () => {
    setIsAddGrowerOpen(false);
    setEditingGrowerId(null);
    setAddStep(1);
    setSelectedCropType("Corn");
    setFormData({ ...DEFAULT_FORM_DATA });
  };

  return (
    <div className="flex flex-col h-full">
      {selectedPlot ? (
        <PlotDetailView
          selectedPlot={selectedPlot}
          plotMapImage={plotMapImage}
          onBack={() => setSelectedPlot(null)}
          onEditGrower={handleEditGrower}
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
      ) : selectedGrower ? (
        <GrowerDetailView
          selectedGrower={selectedGrower}
          onBack={() => setSelectedGrower(null)}
          onEditGrower={handleEditGrower}
          onSelectPlot={(plot) => {
            setSelectedPlot(plot);
            setActiveFieldStage(
              plot.crop === "Rice" ? "area-measurement" : "pre-sowing",
            );
          }}
          plotSearchQuery={plotSearchQuery}
          setPlotSearchQuery={setPlotSearchQuery}
          plotHybridFilter={plotHybridFilter}
          setPlotHybridFilter={setPlotHybridFilter}
        />
      ) : (
        <GrowerListView
          filteredGrowers={filteredGrowers}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filters={filters}
          setFilters={setFilters}
          activeFilterCount={activeFilterCount}
          onSelectGrower={(grower) => {
            setSelectedGrower(grower);
            setPlotHybridFilter("all");
            setPlotSearchQuery("");
          }}
          selectedGrowerId={selectedGrower?.id}
          role={role}
          onAddGrower={() => setIsAddGrowerOpen(true)}
        />
      )}

      <AddGrowerDialog
        isOpen={isAddGrowerOpen}
        onClose={handleCloseDialog}
        editingGrowerId={editingGrowerId}
        addStep={addStep}
        setAddStep={setAddStep}
        formData={formData}
        setFormData={setFormData}
        selectedCropType={selectedCropType}
        setSelectedCropType={setSelectedCropType}
        onSubmit={handleCloseDialog}
      />

      <AddPlotWizard
        isOpen={isAddPlotWizardOpen}
        onClose={() => setIsAddPlotWizardOpen(false)}
        selectedRegion={selectedRegion}
      />

      <BulkUploadDialog
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
      />
    </div>
  );
}
