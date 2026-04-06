import React, { useState } from "react";
import {
  MOCK_PLOTS,
  Plot,
  MOCK_ADVISORIES,
  MOCK_GROWERS,
} from "./data/mockData";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import {
  Map as MapIcon,
  List,
  Filter,
  Search,
  Plus,
  Droplets,
  AlertTriangle,
  Bug,
  CloudRain,
  ThermometerSun,
  Sprout,
  SlidersHorizontal,
  X,
  ChevronRight,
  AlertOctagon,
  ArrowLeft,
  Download,
  Copy,
  Edit,
  Trash2,
  MoreVertical,
  Share2,
  Camera,
  Video,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { AddPlotWizard } from "./AddPlotWizard";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import plotMapImage from "figma:asset/332f5dc0a96a9859a215db7d62948338a5a56cf1.png";

interface PlotTrackerProps {
  initialAuditFilter?: "all" | "audited" | "pending";
  initialStageFilter?: string;
  selectedRegion?: string;
}

export function PlotTracker({
  initialAuditFilter = "all",
  initialStageFilter = "all",
  selectedRegion = "all",
}: PlotTrackerProps = {}) {
  const [viewMode, setViewMode] = useState<"map" | "list">("list");
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [isAddPlotOpen, setIsAddPlotOpen] = useState(false);
  const [wizardInitialStep, setWizardInitialStep] = useState<1 | 2 | 3>(1);
  const [isPreSeasonOpen, setIsPreSeasonOpen] = useState(false);
  const [isSeasonDetailsOpen, setIsSeasonDetailsOpen] = useState(false);
  const [isHarvestDetailsOpen, setIsHarvestDetailsOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isAddTaskPageOpen, setIsAddTaskPageOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState("");
  const [isCopyPlotOpen, setIsCopyPlotOpen] = useState(false);
  const [isSeasonDetailsSaved, setIsSeasonDetailsSaved] = useState(false);
  const [isHarvestDetailsSaved, setIsHarvestDetailsSaved] = useState(false);
  const [isEditingSowingDate, setIsEditingSowingDate] = useState(false);
  const [isEditingHarvestDate, setIsEditingHarvestDate] = useState(false);

  // Field Stages state
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

  const FIELD_STAGES = [
    { id: "pre-sowing", label: "Pre-Sowing" },
    { id: "sowing", label: "Sowing" },
    { id: "vegetative", label: "Vegetative" },
    { id: "flowering", label: "Flowering" },
    { id: "quality", label: "Quality" },
    { id: "pre-harvest", label: "Pre-Harvest" },
    { id: "harvest", label: "Harvest" },
    { id: "dispatch", label: "Dispatch" },
    { id: "ccp", label: "CCP" },
  ];

  const [copiedPlotInitialData, setCopiedPlotInitialData] = useState<any>(null);
  const [copyPlotData, setCopyPlotData] = useState({
    season: "",
    state: "",
    district: "",
    grower: "",
    plotId: "",
  });

  // Plot details form data
  const [preSeasonData, setPreSeasonData] = useState({
    soilType: "",
    previousCrop: "",
    tillageMethod: "",
    irrigationSystem: "",
  });

  // In-season Observations state - array for multiple observations
  const [observations, setObservations] = useState<
    Array<{
      id: string;
      observationType: "general" | "flag";
      flagType?: "disease" | "nutrition" | "soil-moisture";
      comment: string;
      observedDate: string;
      observedTime: string;
      criticality: "low" | "medium" | "high";
    }>
  >([]);

  const [currentObservation, setCurrentObservation] = useState({
    observationType: "general" as "general" | "flag",
    flagType: "" as "disease" | "nutrition" | "soil-moisture" | "",
    comment: "",
    observedDate: "",
    observedTime: "",
    criticality: "low" as "low" | "medium" | "high",
  });

  const [editingObservationId, setEditingObservationId] = useState<
    string | null
  >(null);

  const [harvestData, setHarvestData] = useState({
    sowingDate: "",
    harvestDate: "",
  });

  const [taskData, setTaskData] = useState({
    title: "",
    taskType: "",
    dueDate: "",
  });

  // Remarks for completed tasks
  const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);
  const [remarks, setRemarks] = useState("");
  const [taskRemarks, setTaskRemarks] = useState<Record<number, string>>({});
  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>(
    {
      3: true, // Task 3 is initially completed
    },
  );

  const handleCheckboxChange = (taskId: number, isChecked: boolean) => {
    if (!isChecked) {
      // Unchecking - just update state
      setCompletedTasks((prev) => ({ ...prev, [taskId]: false }));
    } else {
      // Checking - open remarks dialog
      setCurrentTaskId(taskId);
      setRemarks("");
      setIsRemarksDialogOpen(true);
    }
  };

  const handleRemarksSubmit = () => {
    if (currentTaskId !== null) {
      setTaskRemarks((prev) => ({ ...prev, [currentTaskId]: remarks }));
      setCompletedTasks((prev) => ({ ...prev, [currentTaskId]: true }));
      setIsRemarksDialogOpen(false);
      setCurrentTaskId(null);
      setRemarks("");
    }
  };

  // Property Photos & Videos state
  const [isMediaSectionOpen, setIsMediaSectionOpen] = useState(true);
  const [isMediaSaved, setIsMediaSaved] = useState(false);
  const [mediaEntries, setMediaEntries] = useState<
    Array<{
      id: string;
      type: "photo" | "video";
      dateCaptured: string;
      timeCaptured: string;
    }>
  >([]);
  const [currentMediaEntry, setCurrentMediaEntry] = useState({
    type: "photo" as "photo" | "video",
    dateCaptured: "",
    timeCaptured: "",
  });

  // Filter states
  const [filters, setFilters] = useState({
    grower: "all",
    assignedFieldAssistant: "all",
    state: "all",
    district: "all",
    taluka: "all",
    village: "all",
    crop: "all",
    hybrid: "all",
    currentStage: initialStageFilter,
    expectedStage: "all",
  });

  const [auditFilter, setAuditFilter] = useState<"all" | "audited" | "pending">(
    initialAuditFilter,
  );

  const activeFilterCount = [
    filters.grower !== "all",
    filters.assignedFieldAssistant !== "all",
    filters.state !== "all",
    filters.district !== "all",
    filters.taluka !== "all",
    filters.village !== "all",
    filters.crop !== "all",
    filters.hybrid !== "all",
    filters.currentStage !== "all",
    filters.expectedStage !== "all",
  ].filter(Boolean).length;

  const filteredPlots = MOCK_PLOTS.filter((plot) => {
    if (filters.grower !== "all" && plot.growerId !== filters.grower)
      return false;
    if (filters.assignedFieldAssistant !== "all") return false; // Add field assistant matching when data is available
    if (filters.state !== "all" && plot.state?.toLowerCase() !== filters.state)
      return false;
    if (
      filters.district !== "all" &&
      plot.district?.toLowerCase() !== filters.district
    )
      return false;
    if (
      filters.taluka !== "all" &&
      plot.taluka?.toLowerCase() !== filters.taluka
    )
      return false;
    if (
      filters.village !== "all" &&
      plot.village?.toLowerCase() !== filters.village
    )
      return false;
    if (filters.crop !== "all" && plot.crop?.toLowerCase() !== filters.crop)
      return false;
    if (
      filters.hybrid !== "all" &&
      plot.hybrid?.toLowerCase() !== filters.hybrid
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

    return true;
  });

  // Simulate Map View Component
  const MockMapView = () => (
    <div className="relative w-full h-full flex-1 bg-slate-200 overflow-hidden">
      {/* Satellite Map Background */}
      <div
        className="absolute inset-x-0 top-0 bottom-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${plotMapImage})` }}
      />

      {/* Plot Boundaries - Blue Outlines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Plot 1 - Top Left - Small Rectangle */}
        <rect
          x="50"
          y="100"
          width="120"
          height="90"
          fill="rgba(59, 130, 246, 0.15)"
          stroke="#3B82F6"
          strokeWidth="2.5"
          className="cursor-pointer hover:fill-[rgba(59,130,246,0.25)] transition-all"
          style={{ pointerEvents: "auto" }}
          onClick={() => setSelectedPlot(filteredPlots[0])}
        />

        {/* Plot 2 - Top Right - Square */}
        <rect
          x="240"
          y="90"
          width="100"
          height="100"
          fill="rgba(59, 130, 246, 0.15)"
          stroke="#3B82F6"
          strokeWidth="2.5"
          className="cursor-pointer hover:fill-[rgba(59,130,246,0.25)] transition-all"
          style={{ pointerEvents: "auto" }}
          onClick={() => setSelectedPlot(filteredPlots[1])}
        />

        {/* Plot 3 - Middle - Rectangle */}
        <rect
          x="100"
          y="250"
          width="150"
          height="100"
          fill="rgba(59, 130, 246, 0.15)"
          stroke="#3B82F6"
          strokeWidth="2.5"
          className="cursor-pointer hover:fill-[rgba(59,130,246,0.25)] transition-all"
          style={{ pointerEvents: "auto" }}
          onClick={() => setSelectedPlot(filteredPlots[2])}
        />

        {/* Plot 4 - Bottom Left - Small Square */}
        <rect
          x="40"
          y="400"
          width="90"
          height="90"
          fill="rgba(59, 130, 246, 0.15)"
          stroke="#3B82F6"
          strokeWidth="2.5"
          className="cursor-pointer hover:fill-[rgba(59,130,246,0.25)] transition-all"
          style={{ pointerEvents: "auto" }}
          onClick={() => setSelectedPlot(filteredPlots[3] || filteredPlots[0])}
        />

        {/* Plot 5 - Bottom Right - Rectangle */}
        <rect
          x="310"
          y="260"
          width="110"
          height="120"
          fill="rgba(59, 130, 246, 0.15)"
          stroke="#3B82F6"
          strokeWidth="2.5"
          className="cursor-pointer hover:fill-[rgba(59,130,246,0.25)] transition-all"
          style={{ pointerEvents: "auto" }}
          onClick={() => setSelectedPlot(filteredPlots[4] || filteredPlots[0])}
        />

        {/* Additional Small Plots */}
        {/* Plot 6 - Top Center - Small Square */}
        <rect
          x="180"
          y="50"
          width="50"
          height="50"
          fill="rgba(59, 130, 246, 0.15)"
          stroke="#3B82F6"
          strokeWidth="2.5"
          className="cursor-pointer hover:fill-[rgba(59,130,246,0.25)] transition-all"
          style={{ pointerEvents: "auto" }}
          onClick={() => setSelectedPlot(filteredPlots[0])}
        />

        {/* Plot 7 - Right Side - Small Rectangle */}
        <rect
          x="360"
          y="150"
          width="60"
          height="80"
          fill="rgba(59, 130, 246, 0.15)"
          stroke="#3B82F6"
          strokeWidth="2.5"
          className="cursor-pointer hover:fill-[rgba(59,130,246,0.25)] transition-all"
          style={{ pointerEvents: "auto" }}
          onClick={() => setSelectedPlot(filteredPlots[1])}
        />

        {/* Plot 8 - Middle Left - Small Square */}
        <rect
          x="30"
          y="280"
          width="60"
          height="60"
          fill="rgba(59, 130, 246, 0.15)"
          stroke="#3B82F6"
          strokeWidth="2.5"
          className="cursor-pointer hover:fill-[rgba(59,130,246,0.25)] transition-all"
          style={{ pointerEvents: "auto" }}
          onClick={() => setSelectedPlot(filteredPlots[2])}
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

  // If add task page is open, show the full page form
  if (isAddTaskPageOpen) {
    return (
      <div className="space-y-4 h-full flex flex-col">
        {/* Header with Back Button */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsAddTaskPageOpen(false);
              setTaskData({ title: "", taskType: "", dueDate: "" });
            }}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h2 className="font-bold">Add Task</h2>
            <p className="text-sm text-slate-500">
              Create a new task for this plot
            </p>
          </div>
        </div>

        {/* Add Task Form */}
        <Card className="flex-1">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                placeholder="Enter task title"
                value={taskData.title}
                onChange={(e) =>
                  setTaskData({ ...taskData, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Task Type</Label>
              <Select
                value={taskData.taskType}
                onValueChange={(v) => setTaskData({ ...taskData, taskType: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select task type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="irrigation">Irrigation</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="analysis">Analysis</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="fertilization">Fertilization</SelectItem>
                  <SelectItem value="pest-control">Pest Control</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={taskData.dueDate}
                onChange={(e) =>
                  setTaskData({ ...taskData, dueDate: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setIsAddTaskPageOpen(false);
              setTaskData({ title: "", taskType: "", dueDate: "" });
            }}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              // Save task logic here
              setIsAddTaskPageOpen(false);
              setTaskData({ title: "", taskType: "", dueDate: "" });
            }}
            disabled={
              !taskData.title || !taskData.taskType || !taskData.dueDate
            }
          >
            Save Task
          </Button>
        </div>
      </div>
    );
  }

  // If a plot is selected, show the full page details view
  if (selectedPlot) {
    return (
      <div className="space-y-4 h-full flex flex-col">
        {/* Simplified Header with Back Button, Plot ID, and Grower */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSelectedPlot(null)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold font-mono truncate">{selectedPlot.id}</h2>
            <p className="text-sm text-slate-500 truncate">
              {selectedPlot.growerName}
            </p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
            <Share2 className="h-4 w-4" />
          </Button>
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
              <DropdownMenuItem>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem>
                <AlertOctagon className="h-4 w-4 mr-2" />
                Report An Issue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Tabs for Details and Advisory Tasks */}
        <Tabs defaultValue="details" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-[#4CAF50] data-[state=active]:text-white"
            >
              Details
            </TabsTrigger>
            <TabsTrigger
              value="advisory-tasks"
              className="data-[state=active]:bg-[#4CAF50] data-[state=active]:text-white"
            >
              Advisory Tasks
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent
            value="details"
            className="flex-1 overflow-y-auto space-y-4 mt-4 pb-20"
          >
            {/* Plot Details */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-slate-900">Field Details</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Grower</p>
                    <p className="font-medium text-slate-900">
                      {selectedPlot.growerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">
                      Assigned Field Assistant
                    </p>
                    <p className="font-medium text-slate-900">Rajiv Sharma</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">State</p>
                    <p className="font-medium text-slate-900">Punjab</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">District</p>
                    <p className="font-medium text-slate-900">Amritsar</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Taluka</p>
                    <p className="font-medium text-slate-900">Beas</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Village</p>
                    <p className="font-medium text-slate-900">
                      {selectedPlot.village}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Field Purpose</p>
                    <p className="font-medium text-slate-900">All Hybrids</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Irrigation Method</p>
                    <p className="font-medium text-slate-900">Drip</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Isolation Observed</p>
                    <p className="font-medium text-slate-900">Yes</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Crop</p>
                    <p className="font-medium text-slate-900">
                      {selectedPlot.crop}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Hybrid Type</p>
                    <p className="font-medium text-slate-900">
                      {selectedPlot.hybrid}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Estimated Acreage</p>
                    <p className="font-medium text-slate-900">
                      {selectedPlot.acreage}
                    </p>
                  </div>
                </div>

                {/* Divider */}
                {/* <Separator className="my-4" /> */}

                {/* Sowing Date Field */}
                {/* <div className="space-y-2">
                  <Label>Sowing Date</Label>
                  {!harvestData.sowingDate && !isEditingSowingDate && (
                    <Button
                      variant="outline"
                      className="w-full gap-2 justify-start h-10"
                      onClick={() => setIsEditingSowingDate(true)}
                    >
                      <Plus className="h-4 w-4" /> Add
                    </Button>
                  )}

                  {harvestData.sowingDate && !isEditingSowingDate && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md border">
                      <p className="font-medium text-slate-900">
                        {new Date(harvestData.sowingDate).toLocaleDateString()}
                      </p>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => setIsEditingSowingDate(true)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}

                  {isEditingSowingDate && (
                    <div className="space-y-2">
                      <Input
                        type="date"
                        value={harvestData.sowingDate}
                        onChange={(e) =>
                          setHarvestData({
                            ...harvestData,
                            sowingDate: e.target.value,
                          })
                        }
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsEditingSowingDate(false);
                            if (!harvestData.sowingDate) {
                              setHarvestData({
                                ...harvestData,
                                sowingDate: "",
                              });
                            }
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          className="bg-[#4CAF50] hover:bg-[#388E3C]"
                          onClick={() => setIsEditingSowingDate(false)}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  )}
                </div> */}

                {/* Complete Weeks Field - Only shows after sowing date is saved */}
                {/* {harvestData.sowingDate && (
                  <div className="space-y-2">
                    <Label>Complete Weeks</Label>
                    <Input
                      type="text"
                      value={`${Math.floor((new Date().getTime() - new Date(harvestData.sowingDate).getTime()) / (1000 * 60 * 60 * 24 * 7))} weeks`}
                      readOnly
                      disabled
                      className="bg-slate-50"
                    />
                  </div>
                )} */}

                {/* Harvest Date Field - Only shows after sowing date is saved */}
                {/* {harvestData.sowingDate && (
                  <div className="space-y-2">
                    <Label>Harvest Date</Label>
                    {!harvestData.harvestDate && !isEditingHarvestDate && (
                      <Button
                        variant="outline"
                        className="w-full gap-2 justify-start h-10"
                        onClick={() => setIsEditingHarvestDate(true)}
                      >
                        <Plus className="h-4 w-4" /> Add
                      </Button>
                    )}

                    {harvestData.harvestDate && !isEditingHarvestDate && (
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md border">
                        <p className="font-medium text-slate-900">
                          {new Date(
                            harvestData.harvestDate,
                          ).toLocaleDateString()}
                        </p>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => setIsEditingHarvestDate(true)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}

                    {isEditingHarvestDate && (
                      <div className="space-y-2">
                        <Input
                          type="date"
                          value={harvestData.harvestDate}
                          onChange={(e) =>
                            setHarvestData({
                              ...harvestData,
                              harvestDate: e.target.value,
                            })
                          }
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setIsEditingHarvestDate(false);
                              if (!harvestData.harvestDate) {
                                setHarvestData({
                                  ...harvestData,
                                  harvestDate: "",
                                });
                              }
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="bg-[#4CAF50] hover:bg-[#388E3C]"
                            onClick={() => setIsEditingHarvestDate(false)}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )} */}
              </CardContent>
            </Card>

            {/* Plot Mapping */}
            {/* <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-slate-900">Field Mapping</h3>

                {selectedPlot?.auditStatus === "pending" ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-slate-100 text-slate-600 border-slate-300"
                        >
                          Audit Pending
                        </Badge>
                      </div>
                      <Button
                        className="w-full gap-2 bg-[#4CAF50] hover:bg-[#45a049]"
                        onClick={() => {
                          setSelectedPlot(null);
                          setWizardInitialStep(1);
                          setIsAddPlotOpen(true);
                        }}
                      >
                        <CheckCircle2 className="h-4 w-4" /> Start Audit
                      </Button>
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="text-xs text-slate-500 mb-2">
                      Audited Acreage
                    </p>
                    <p className="text-2xl font-bold text-[#4CAF50]">
                      2.3 acres
                    </p>
                  </div>
                )}

                {selectedPlot?.auditStatus !== "pending" && (
                  <div>
                    <p className="text-xs text-slate-500 mb-2">
                      Plot Preview On Map
                    </p>
                    <div className="w-full h-48 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                      <ImageWithFallback
                        src={plotMapImage}
                        alt="Satellite view of plot"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card> */}

            {/* Field Stages Section */}
            <Card>
              <CardContent className="p-4 space-y-4">
                {/* Header with Summary Button */}
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Field Stages</h3>
                  <Button
                    size="sm"
                    className="bg-[#4CAF50] hover:bg-[#388E3C] h-8 text-xs px-3"
                    onClick={() => setIsFieldSummaryOpen(true)}
                  >
                    Summary
                  </Button>
                </div>

                {/* Stage Pills — wrapping */}
                <div className="flex flex-wrap gap-2">
                  {FIELD_STAGES.map((stage) => (
                    <button
                      key={stage.id}
                      type="button"
                      onClick={() => setActiveFieldStage(stage.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                        activeFieldStage === stage.id
                          ? "bg-[#4CAF50] text-white border-[#4CAF50]"
                          : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {stage.label}
                    </button>
                  ))}
                </div>

                {/* ── Pre-Sowing ── */}
                {activeFieldStage === "pre-sowing" && (
                  <div className="space-y-4 pt-2 border-t">
                    <p className="text-xs text-slate-500">
                      GPS field measurement is optional. You can proceed to
                      other stages without measuring.
                    </p>
                    {!fieldStageData.preSowing.measured ? (
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => {
                          updateStageField("preSowing", "measured", true);
                          updateStageField("preSowing", "acreage", "2.30");
                        }}
                      >
                        <MapIcon className="h-4 w-4" />
                        Measure Field (GPS)
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-md border border-green-200">
                          <div>
                            <p className="text-xs text-slate-500">
                              Measured Acreage
                            </p>
                            <p className="text-2xl font-bold text-[#4CAF50]">
                              {fieldStageData.preSowing.acreage} acres
                            </p>
                          </div>
                          <CheckCircle2 className="h-6 w-6 text-[#4CAF50]" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-2">
                            Field Preview on Map
                          </p>
                          <div className="w-full h-40 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                            <ImageWithFallback
                              src={plotMapImage}
                              alt="Field map preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            updateStageField("preSowing", "measured", false);
                            updateStageField("preSowing", "acreage", "");
                          }}
                        >
                          Re-measure
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Sowing ── */}
                {activeFieldStage === "sowing" && (
                  <div className="space-y-3 pt-2 border-t">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Previous Crop</Label>
                        <Select
                          value={fieldStageData.sowing.previousCrop}
                          onValueChange={(v) =>
                            updateStageField("sowing", "previousCrop", v)
                          }
                        >
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="wheat">Wheat</SelectItem>
                            <SelectItem value="rice">Rice</SelectItem>
                            <SelectItem value="sugarcane">Sugarcane</SelectItem>
                            <SelectItem value="cotton">Cotton</SelectItem>
                            <SelectItem value="soybean">Soybean</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Planting Ratio</Label>
                        <Select
                          value={fieldStageData.sowing.plantingRatio}
                          onValueChange={(v) =>
                            updateStageField("sowing", "plantingRatio", v)
                          }
                        >
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4:1">4:1</SelectItem>
                            <SelectItem value="4:2">4:2</SelectItem>
                            <SelectItem value="6:2">6:2</SelectItem>
                            <SelectItem value="8:2">8:2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Male Lot Number</Label>
                        <Input
                          className="h-9 text-sm"
                          placeholder="Enter lot #"
                          value={fieldStageData.sowing.maleLotNumber}
                          onChange={(e) =>
                            updateStageField(
                              "sowing",
                              "maleLotNumber",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Female Lot Number</Label>
                        <Input
                          className="h-9 text-sm"
                          placeholder="Enter lot #"
                          value={fieldStageData.sowing.femaleLotNumber}
                          onChange={(e) =>
                            updateStageField(
                              "sowing",
                              "femaleLotNumber",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Male Issued Acre</Label>
                        <Input
                          className="h-9 text-sm"
                          type="number"
                          placeholder="0.0"
                          value={fieldStageData.sowing.maleIssuedAcre}
                          onChange={(e) =>
                            updateStageField(
                              "sowing",
                              "maleIssuedAcre",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Female Issued Acre</Label>
                        <Input
                          className="h-9 text-sm"
                          type="number"
                          placeholder="0.0"
                          value={fieldStageData.sowing.femaleIssuedAcre}
                          onChange={(e) =>
                            updateStageField(
                              "sowing",
                              "femaleIssuedAcre",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Irrigation Type</Label>
                      <Select
                        value={fieldStageData.sowing.irrigationType}
                        onValueChange={(v) =>
                          updateStageField("sowing", "irrigationType", v)
                        }
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="drip">Drip</SelectItem>
                          <SelectItem value="flood">Flood</SelectItem>
                          <SelectItem value="sprinkler">Sprinkler</SelectItem>
                          <SelectItem value="furrow">Furrow</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Female Sowing Date</Label>
                      <Input
                        className="h-9 text-sm"
                        type="date"
                        value={fieldStageData.sowing.femaleSowingDate}
                        onChange={(e) =>
                          updateStageField(
                            "sowing",
                            "femaleSowingDate",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Acres</Label>
                      <Input
                        className="h-9 text-sm"
                        type="number"
                        placeholder="0.0"
                        value={fieldStageData.sowing.acres}
                        onChange={(e) =>
                          updateStageField("sowing", "acres", e.target.value)
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Male 1 Planting Date</Label>
                        <Input
                          className="h-9 text-sm"
                          type="date"
                          value={fieldStageData.sowing.male1PlantingDate}
                          onChange={(e) =>
                            updateStageField(
                              "sowing",
                              "male1PlantingDate",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Male 2 Planting Date</Label>
                        <Input
                          className="h-9 text-sm"
                          type="date"
                          value={fieldStageData.sowing.male2PlantingDate}
                          onChange={(e) =>
                            updateStageField(
                              "sowing",
                              "male2PlantingDate",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Vegetative ── */}
                {activeFieldStage === "vegetative" && (
                  <div className="space-y-3 pt-2 border-t">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Area Cancelled (Acre)</Label>
                        <Input
                          className="h-9 text-sm"
                          type="number"
                          placeholder="0.0"
                          value={fieldStageData.vegetative.areaCancelled}
                          onChange={(e) =>
                            updateStageField(
                              "vegetative",
                              "areaCancelled",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Standing Acre</Label>
                        <Input
                          className="h-9 text-sm"
                          type="number"
                          placeholder="0.0"
                          value={fieldStageData.vegetative.standingAcre}
                          onChange={(e) =>
                            updateStageField(
                              "vegetative",
                              "standingAcre",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Area Cancelled Reason</Label>
                      <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-md border border-slate-200">
                        {[
                          "Frost",
                          "Flooding",
                          "Pest",
                          "Disease",
                          "Poor Germination",
                          "Other",
                        ].map((reason) => (
                          <div key={reason} className="flex items-center gap-2">
                            <Checkbox
                              id={`reason-${reason}`}
                              checked={fieldStageData.vegetative.areaCancelledReason.includes(
                                reason,
                              )}
                              onCheckedChange={(checked) => {
                                const cur =
                                  fieldStageData.vegetative.areaCancelledReason;
                                updateStageField(
                                  "vegetative",
                                  "areaCancelledReason",
                                  checked
                                    ? [...cur, reason]
                                    : cur.filter((r: string) => r !== reason),
                                );
                              }}
                            />
                            <label
                              htmlFor={`reason-${reason}`}
                              className="text-xs text-slate-700 cursor-pointer"
                            >
                              {reason}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Plant Uniformity</Label>
                      <Select
                        value={fieldStageData.vegetative.plantUniformity}
                        onValueChange={(v) =>
                          updateStageField("vegetative", "plantUniformity", v)
                        }
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="average">Average</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">FF Plant Count</Label>
                        <Input
                          className="h-9 text-sm"
                          type="number"
                          placeholder="0"
                          value={fieldStageData.vegetative.ffPlantCount}
                          onChange={(e) =>
                            updateStageField(
                              "vegetative",
                              "ffPlantCount",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Male 1 Plant Count</Label>
                        <Input
                          className="h-9 text-sm"
                          type="number"
                          placeholder="0"
                          value={fieldStageData.vegetative.male1PlantCount}
                          onChange={(e) =>
                            updateStageField(
                              "vegetative",
                              "male1PlantCount",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Row Spacing FF (cm)</Label>
                        <Input
                          className="h-9 text-sm"
                          type="number"
                          placeholder="0"
                          value={fieldStageData.vegetative.rowSpacingFF}
                          onChange={(e) =>
                            updateStageField(
                              "vegetative",
                              "rowSpacingFF",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Row Spacing FM (cm)</Label>
                        <Input
                          className="h-9 text-sm"
                          type="number"
                          placeholder="0"
                          value={fieldStageData.vegetative.rowSpacingFM}
                          onChange={(e) =>
                            updateStageField(
                              "vegetative",
                              "rowSpacingFM",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Row Spacing MM (cm)</Label>
                        <Input
                          className="h-9 text-sm"
                          type="number"
                          placeholder="0"
                          value={fieldStageData.vegetative.rowSpacingMM}
                          onChange={(e) =>
                            updateStageField(
                              "vegetative",
                              "rowSpacingMM",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Male 2 Plant Count</Label>
                      <Input
                        className="h-9 text-sm"
                        type="number"
                        placeholder="0"
                        value={fieldStageData.vegetative.male2PlantCount}
                        onChange={(e) =>
                          updateStageField(
                            "vegetative",
                            "male2PlantCount",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Plant Rouging</Label>
                      <div className="flex gap-2">
                        {["yes", "no"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() =>
                              updateStageField(
                                "vegetative",
                                "plantRouging",
                                opt,
                              )
                            }
                            className={`flex-1 py-2 rounded-md border text-sm font-medium capitalize transition-colors ${fieldStageData.vegetative.plantRouging === opt ? "bg-[#4CAF50] text-white border-[#4CAF50]" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Estimated Yield (Kg)</Label>
                      <Input
                        className="h-9 text-sm"
                        type="number"
                        placeholder="0"
                        value={fieldStageData.vegetative.estimatedYield}
                        onChange={(e) =>
                          updateStageField(
                            "vegetative",
                            "estimatedYield",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                )}

                {/* ── Flowering ── */}
                {activeFieldStage === "flowering" && (
                  <div className="space-y-3 pt-2 border-t">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Detasseling Start</Label>
                        <Input
                          className="h-9 text-sm"
                          type="date"
                          value={fieldStageData.flowering.detasselingStart}
                          onChange={(e) =>
                            updateStageField(
                              "flowering",
                              "detasselingStart",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Detasseling End</Label>
                        <Input
                          className="h-9 text-sm"
                          type="date"
                          value={fieldStageData.flowering.detasselingEnd}
                          onChange={(e) =>
                            updateStageField(
                              "flowering",
                              "detasselingEnd",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Pollination Information</Label>
                      <Select
                        value={fieldStageData.flowering.pollinationInfo}
                        onValueChange={(v) =>
                          updateStageField("flowering", "pollinationInfo", v)
                        }
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="average">Average</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">
                          FF Tassels Throwing Pollen (%)
                        </Label>
                        <Input
                          className="h-9 text-sm"
                          type="number"
                          placeholder="0"
                          value={fieldStageData.flowering.ffTasselsThrowing}
                          onChange={(e) =>
                            updateStageField(
                              "flowering",
                              "ffTasselsThrowing",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">
                          Off-Types Shedding Pollen (%)
                        </Label>
                        <Input
                          className="h-9 text-sm"
                          type="number"
                          placeholder="0"
                          value={fieldStageData.flowering.offTypesShedding}
                          onChange={(e) =>
                            updateStageField(
                              "flowering",
                              "offTypesShedding",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Nicking</Label>
                        <Select
                          value={fieldStageData.flowering.nicking}
                          onValueChange={(v) =>
                            updateStageField("flowering", "nicking", v)
                          }
                        >
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="perfect">Perfect</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">M Skeletonization</Label>
                        <Select
                          value={fieldStageData.flowering.mSkeletonization}
                          onValueChange={(v) =>
                            updateStageField("flowering", "mSkeletonization", v)
                          }
                        >
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="partial">Partial</SelectItem>
                            <SelectItem value="complete">Complete</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">FF Silks (%)</Label>
                      <Input
                        className="h-9 text-sm"
                        type="number"
                        placeholder="0"
                        value={fieldStageData.flowering.ffSilks}
                        onChange={(e) =>
                          updateStageField(
                            "flowering",
                            "ffSilks",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">
                          Male 1 Tassels Throwing Pollen (%)
                        </Label>
                        <Input
                          className="h-9 text-sm"
                          type="number"
                          placeholder="0"
                          value={fieldStageData.flowering.male1TasselsThrowing}
                          onChange={(e) =>
                            updateStageField(
                              "flowering",
                              "male1TasselsThrowing",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">
                          Male 2 Tassels Throwing Pollen (%)
                        </Label>
                        <Input
                          className="h-9 text-sm"
                          type="number"
                          placeholder="0"
                          value={fieldStageData.flowering.male2TasselsThrowing}
                          onChange={(e) =>
                            updateStageField(
                              "flowering",
                              "male2TasselsThrowing",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">M Pollen Amount</Label>
                      <Select
                        value={fieldStageData.flowering.mPollenAmount}
                        onValueChange={(v) =>
                          updateStageField("flowering", "mPollenAmount", v)
                        }
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="abundant">Abundant</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="scarce">Scarce</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Field Problem</Label>
                      <Select
                        value={fieldStageData.flowering.fieldProblem}
                        onValueChange={(v) =>
                          updateStageField("flowering", "fieldProblem", v)
                        }
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="disease">Disease</SelectItem>
                          <SelectItem value="pest">Pest</SelectItem>
                          <SelectItem value="waterlogging">
                            Waterlogging
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Neighbor Shedding</Label>
                      <div className="flex gap-2">
                        {["yes", "no"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() =>
                              updateStageField(
                                "flowering",
                                "neighborShedding",
                                opt,
                              )
                            }
                            className={`flex-1 py-2 rounded-md border text-sm font-medium capitalize transition-colors ${fieldStageData.flowering.neighborShedding === opt ? "bg-[#4CAF50] text-white border-[#4CAF50]" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    {fieldStageData.flowering.neighborShedding === "yes" && (
                      <div className="space-y-1.5">
                        <Label className="text-xs">Neighbor Distance (m)</Label>
                        <Input
                          className="h-9 text-sm"
                          type="number"
                          placeholder="0"
                          value={fieldStageData.flowering.neighborDistance}
                          onChange={(e) =>
                            updateStageField(
                              "flowering",
                              "neighborDistance",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    )}
                    <div className="space-y-1.5">
                      <Label className="text-xs">Isolation Sufficient</Label>
                      <div className="flex gap-2">
                        {["yes", "no"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() =>
                              updateStageField(
                                "flowering",
                                "isolationSufficient",
                                opt,
                              )
                            }
                            className={`flex-1 py-2 rounded-md border text-sm font-medium capitalize transition-colors ${fieldStageData.flowering.isolationSufficient === opt ? "bg-[#4CAF50] text-white border-[#4CAF50]" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Isolation Code</Label>
                        <Select
                          value={fieldStageData.flowering.isolationCode}
                          onValueChange={(v) =>
                            updateStageField("flowering", "isolationCode", v)
                          }
                        >
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Field Score Rating</Label>
                        <Select
                          value={fieldStageData.flowering.fieldScoreRating}
                          onValueChange={(v) =>
                            updateStageField("flowering", "fieldScoreRating", v)
                          }
                        >
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 — Low Risk</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3 — Medium</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5 — High Risk</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">
                        Nick with Contaminant Block
                      </Label>
                      <div className="flex gap-2">
                        {["yes", "no"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() =>
                              updateStageField(
                                "flowering",
                                "nickWithContaminantBlock",
                                opt,
                              )
                            }
                            className={`flex-1 py-2 rounded-md border text-sm font-medium capitalize transition-colors ${fieldStageData.flowering.nickWithContaminantBlock === opt ? "bg-[#4CAF50] text-white border-[#4CAF50]" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Standing Acre</Label>
                        <Input
                          className="h-9 text-sm"
                          type="number"
                          placeholder="0.0"
                          value={fieldStageData.flowering.standingAcre}
                          onChange={(e) =>
                            updateStageField(
                              "flowering",
                              "standingAcre",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Estimated Yield (Kg)</Label>
                        <Input
                          className="h-9 text-sm"
                          type="number"
                          placeholder="0"
                          value={fieldStageData.flowering.estimatedYield}
                          onChange={(e) =>
                            updateStageField(
                              "flowering",
                              "estimatedYield",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Quality ── */}
                {activeFieldStage === "quality" && (
                  <div className="space-y-4 pt-2 border-t">
                    <div className="flex flex-col items-center justify-center py-4 text-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <Sprout className="h-6 w-6 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          Quality Stage
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Detailed quality capture fields coming soon.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Notes</Label>
                      <Textarea
                        placeholder="Add any quality notes..."
                        rows={3}
                        value={fieldStageData.quality.notes}
                        onChange={(e) =>
                          updateStageField("quality", "notes", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}

                {/* ── Pre-Harvest ── */}
                {activeFieldStage === "pre-harvest" && (
                  <div className="space-y-3 pt-2 border-t">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Male Destruction</Label>
                      <div className="flex gap-2">
                        {["yes", "no"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() =>
                              updateStageField(
                                "preHarvest",
                                "maleDestruction",
                                opt,
                              )
                            }
                            className={`flex-1 py-2 rounded-md border text-sm font-medium capitalize transition-colors ${fieldStageData.preHarvest.maleDestruction === opt ? "bg-[#4CAF50] text-white border-[#4CAF50]" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Disease Intensity</Label>
                        <Select
                          value={fieldStageData.preHarvest.diseaseIntensity}
                          onValueChange={(v) =>
                            updateStageField(
                              "preHarvest",
                              "diseaseIntensity",
                              v,
                            )
                          }
                        >
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Disease Name</Label>
                        <Select
                          value={fieldStageData.preHarvest.diseaseName}
                          onValueChange={(v) =>
                            updateStageField("preHarvest", "diseaseName", v)
                          }
                        >
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="blight">Blight</SelectItem>
                            <SelectItem value="rust">Rust</SelectItem>
                            <SelectItem value="smut">Smut</SelectItem>
                            <SelectItem value="rot">Root Rot</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Crop Health</Label>
                        <Select
                          value={fieldStageData.preHarvest.cropHealth}
                          onValueChange={(v) =>
                            updateStageField("preHarvest", "cropHealth", v)
                          }
                        >
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="average">Average</SelectItem>
                            <SelectItem value="poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Field Problem</Label>
                        <Select
                          value={fieldStageData.preHarvest.fieldProblem}
                          onValueChange={(v) =>
                            updateStageField("preHarvest", "fieldProblem", v)
                          }
                        >
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="waterlog">
                              Waterlogging
                            </SelectItem>
                            <SelectItem value="pest">Pest Attack</SelectItem>
                            <SelectItem value="weed">Weed Pressure</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">
                        Pre-Harvest Cut Moisture (%)
                      </Label>
                      <Input
                        className="h-9 text-sm"
                        type="number"
                        placeholder="0.0"
                        value={fieldStageData.preHarvest.preHarvestCutMoisture}
                        onChange={(e) =>
                          updateStageField(
                            "preHarvest",
                            "preHarvestCutMoisture",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Standing Acre</Label>
                        <Input
                          className="h-9 text-sm"
                          type="number"
                          placeholder="0.0"
                          value={fieldStageData.preHarvest.standingAcre}
                          onChange={(e) =>
                            updateStageField(
                              "preHarvest",
                              "standingAcre",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Estimated Yield (Kg)</Label>
                        <Input
                          className="h-9 text-sm"
                          type="number"
                          placeholder="0"
                          value={fieldStageData.preHarvest.estimatedYield}
                          onChange={(e) =>
                            updateStageField(
                              "preHarvest",
                              "estimatedYield",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">
                        Estimated Yield — Final (Kg)
                      </Label>
                      <Input
                        className="h-9 text-sm"
                        type="number"
                        placeholder="0"
                        value={fieldStageData.preHarvest.estimatedYieldFinal}
                        onChange={(e) =>
                          updateStageField(
                            "preHarvest",
                            "estimatedYieldFinal",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                )}

                {/* ── Harvest ── */}
                {activeFieldStage === "harvest" && (
                  <div className="space-y-3 pt-2 border-t">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Male Date</Label>
                        <Input
                          className="h-9 text-sm"
                          type="date"
                          value={fieldStageData.harvest.maleDate}
                          onChange={(e) =>
                            updateStageField(
                              "harvest",
                              "maleDate",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Female Date</Label>
                        <Input
                          className="h-9 text-sm"
                          type="date"
                          value={fieldStageData.harvest.femaleDate}
                          onChange={(e) =>
                            updateStageField(
                              "harvest",
                              "femaleDate",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Harvest Weight (Kg)</Label>
                      <Input
                        className="h-9 text-sm"
                        type="number"
                        placeholder="0"
                        value={fieldStageData.harvest.harvestWeight}
                        onChange={(e) =>
                          updateStageField(
                            "harvest",
                            "harvestWeight",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Field Final</Label>
                      <div className="flex gap-2">
                        {["yes", "no"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() =>
                              updateStageField("harvest", "fieldFinal", opt)
                            }
                            className={`flex-1 py-2 rounded-md border text-sm font-medium capitalize transition-colors ${fieldStageData.harvest.fieldFinal === opt ? "bg-[#4CAF50] text-white border-[#4CAF50]" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Dispatch ── */}
                {activeFieldStage === "dispatch" && (
                  <div className="space-y-3 pt-2 border-t">
                    <div className="space-y-1.5">
                      <Label className="text-xs">LR Number</Label>
                      <Input
                        className="h-9 text-sm"
                        placeholder="Enter LR number"
                        value={fieldStageData.dispatch.lrNumber}
                        onChange={(e) =>
                          updateStageField(
                            "dispatch",
                            "lrNumber",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Truck Number</Label>
                      <Input
                        className="h-9 text-sm"
                        placeholder="Enter truck number"
                        value={fieldStageData.dispatch.truckNumber}
                        onChange={(e) =>
                          updateStageField(
                            "dispatch",
                            "truckNumber",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Dispatch Weight (Kg)</Label>
                      <Input
                        className="h-9 text-sm"
                        type="number"
                        placeholder="0"
                        value={fieldStageData.dispatch.dispatchWeight}
                        onChange={(e) =>
                          updateStageField(
                            "dispatch",
                            "dispatchWeight",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                )}

                {/* ── CCP ── */}
                {activeFieldStage === "ccp" && (
                  <div className="space-y-4 pt-2 border-t">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Child Care Protection (CCP)
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Confirm whether any child below the age of 18 was found
                        working on this field.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">
                        Was any child found working on the field?
                      </Label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateStageField("ccp", "childWorking", "yes")
                          }
                          className={`flex-1 py-2 rounded-md border text-sm font-medium transition-colors ${fieldStageData.ccp.childWorking === "yes" ? "bg-red-500 text-white border-red-500" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}
                        >
                          Yes (Violation)
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateStageField("ccp", "childWorking", "no")
                          }
                          className={`flex-1 py-2 rounded-md border text-sm font-medium transition-colors ${fieldStageData.ccp.childWorking === "no" ? "bg-[#4CAF50] text-white border-[#4CAF50]" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}
                        >
                          No (Clear)
                        </button>
                      </div>
                      {fieldStageData.ccp.childWorking === "yes" && (
                        <div className="p-3 bg-red-50 rounded-md border border-red-200 mt-2">
                          <p className="text-xs text-red-700 font-semibold">
                            ⚠ Child labour violation detected. Report to your
                            supervisor immediately.
                          </p>
                        </div>
                      )}
                      {fieldStageData.ccp.childWorking === "no" && (
                        <div className="p-3 bg-green-50 rounded-md border border-green-200 mt-2">
                          <p className="text-xs text-green-700 font-semibold">
                            ✓ No child labour detected. Field is compliant.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Field Summary Dialog */}
                <Dialog
                  open={isFieldSummaryOpen}
                  onOpenChange={setIsFieldSummaryOpen}
                >
                  <DialogContent className="max-w-[90vw] sm:max-w-sm max-h-[80vh] mx-auto">
                    <DialogHeader>
                      <DialogTitle className="text-base font-bold">
                        Field Stage Summary
                      </DialogTitle>
                      <DialogDescription className="text-xs text-slate-500">
                        {selectedPlot.id} — {selectedPlot.growerName}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 mt-2 overflow-y-auto">
                      {[
                        {
                          title: "Pre-Sowing",
                          items: [
                            {
                              label: "Field Measured",
                              value: fieldStageData.preSowing.measured
                                ? `Yes — ${fieldStageData.preSowing.acreage} acres`
                                : "Not measured",
                            },
                          ],
                        },
                        {
                          title: "Sowing",
                          items: [
                            {
                              label: "Previous Crop",
                              value: fieldStageData.sowing.previousCrop,
                            },
                            {
                              label: "Planting Ratio",
                              value: fieldStageData.sowing.plantingRatio,
                            },
                            {
                              label: "Male Lot #",
                              value: fieldStageData.sowing.maleLotNumber,
                            },
                            {
                              label: "Female Lot #",
                              value: fieldStageData.sowing.femaleLotNumber,
                            },
                            {
                              label: "Irrigation",
                              value: fieldStageData.sowing.irrigationType,
                            },
                            {
                              label: "Female Sowing Date",
                              value: fieldStageData.sowing.femaleSowingDate,
                            },
                            {
                              label: "Acres",
                              value: fieldStageData.sowing.acres,
                            },
                          ],
                        },
                        {
                          title: "Vegetative",
                          items: [
                            {
                              label: "Area Cancelled",
                              value: fieldStageData.vegetative.areaCancelled
                                ? `${fieldStageData.vegetative.areaCancelled} acre`
                                : "",
                            },
                            {
                              label: "Cancel Reasons",
                              value:
                                fieldStageData.vegetative.areaCancelledReason.join(
                                  ", ",
                                ),
                            },
                            {
                              label: "Plant Uniformity",
                              value: fieldStageData.vegetative.plantUniformity,
                            },
                            {
                              label: "Plant Rouging",
                              value: fieldStageData.vegetative.plantRouging,
                            },
                            {
                              label: "Standing Acre",
                              value: fieldStageData.vegetative.standingAcre,
                            },
                            {
                              label: "Estimated Yield",
                              value: fieldStageData.vegetative.estimatedYield
                                ? `${fieldStageData.vegetative.estimatedYield} Kg`
                                : "",
                            },
                          ],
                        },
                        {
                          title: "Flowering",
                          items: [
                            {
                              label: "Detasseling Start",
                              value: fieldStageData.flowering.detasselingStart,
                            },
                            {
                              label: "Detasseling End",
                              value: fieldStageData.flowering.detasselingEnd,
                            },
                            {
                              label: "Nicking",
                              value: fieldStageData.flowering.nicking,
                            },
                            {
                              label: "Field Score Rating",
                              value: fieldStageData.flowering.fieldScoreRating,
                            },
                            {
                              label: "Neighbor Shedding",
                              value: fieldStageData.flowering.neighborShedding,
                            },
                            {
                              label: "Isolation Sufficient",
                              value:
                                fieldStageData.flowering.isolationSufficient,
                            },
                            {
                              label: "Standing Acre",
                              value: fieldStageData.flowering.standingAcre,
                            },
                            {
                              label: "Estimated Yield",
                              value: fieldStageData.flowering.estimatedYield
                                ? `${fieldStageData.flowering.estimatedYield} Kg`
                                : "",
                            },
                          ],
                        },
                        {
                          title: "Quality",
                          items: [
                            {
                              label: "Notes",
                              value: fieldStageData.quality.notes || "",
                            },
                          ],
                        },
                        {
                          title: "Pre-Harvest",
                          items: [
                            {
                              label: "Male Destruction",
                              value: fieldStageData.preHarvest.maleDestruction,
                            },
                            {
                              label: "Crop Health",
                              value: fieldStageData.preHarvest.cropHealth,
                            },
                            {
                              label: "Disease",
                              value: [
                                fieldStageData.preHarvest.diseaseIntensity,
                                fieldStageData.preHarvest.diseaseName,
                              ]
                                .filter(Boolean)
                                .join(" — "),
                            },
                            {
                              label: "Cut Moisture",
                              value: fieldStageData.preHarvest
                                .preHarvestCutMoisture
                                ? `${fieldStageData.preHarvest.preHarvestCutMoisture}%`
                                : "",
                            },
                            {
                              label: "Standing Acre",
                              value: fieldStageData.preHarvest.standingAcre,
                            },
                            {
                              label: "Final Est. Yield",
                              value: fieldStageData.preHarvest
                                .estimatedYieldFinal
                                ? `${fieldStageData.preHarvest.estimatedYieldFinal} Kg`
                                : "",
                            },
                          ],
                        },
                        {
                          title: "Harvest",
                          items: [
                            {
                              label: "Male Date",
                              value: fieldStageData.harvest.maleDate,
                            },
                            {
                              label: "Female Date",
                              value: fieldStageData.harvest.femaleDate,
                            },
                            {
                              label: "Harvest Weight",
                              value: fieldStageData.harvest.harvestWeight
                                ? `${fieldStageData.harvest.harvestWeight} Kg`
                                : "",
                            },
                            {
                              label: "Field Final",
                              value: fieldStageData.harvest.fieldFinal,
                            },
                          ],
                        },
                        {
                          title: "Dispatch",
                          items: [
                            {
                              label: "LR Number",
                              value: fieldStageData.dispatch.lrNumber,
                            },
                            {
                              label: "Truck Number",
                              value: fieldStageData.dispatch.truckNumber,
                            },
                            {
                              label: "Dispatch Weight",
                              value: fieldStageData.dispatch.dispatchWeight
                                ? `${fieldStageData.dispatch.dispatchWeight} Kg`
                                : "",
                            },
                          ],
                        },
                        {
                          title: "CCP",
                          items: [
                            {
                              label: "Child Labour",
                              value:
                                fieldStageData.ccp.childWorking === "yes"
                                  ? "⚠ Violation Detected"
                                  : fieldStageData.ccp.childWorking === "no"
                                    ? "✓ Clear"
                                    : "",
                            },
                          ],
                        },
                      ].map((section) => {
                        const hasData = section.items.some(
                          (item) => item.value,
                        );
                        return (
                          <div
                            key={section.title}
                            className={`rounded-lg border p-3 ${hasData ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50"}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                                {section.title}
                              </p>
                              {hasData ? (
                                <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px] px-1.5 h-5">
                                  Entered
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 h-5 text-slate-400"
                                >
                                  Empty
                                </Badge>
                              )}
                            </div>
                            {hasData && (
                              <div className="space-y-1">
                                {section.items
                                  .filter((item) => item.value)
                                  .map((item) => (
                                    <div
                                      key={item.label}
                                      className="flex justify-between items-baseline gap-2"
                                    >
                                      <span className="text-[11px] text-slate-500 shrink-0">
                                        {item.label}
                                      </span>
                                      <span className="text-[11px] font-semibold text-slate-800 text-right capitalize">
                                        {item.value}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <DialogFooter className="mt-4">
                      <Button
                        className="w-full bg-[#4CAF50] hover:bg-[#388E3C]"
                        onClick={() => setIsFieldSummaryOpen(false)}
                      >
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* In-season Observations */}
            {/* <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">
                    In-season Observations
                  </h3>
                </div>

                {observations.length > 0 && !isSeasonDetailsOpen && (
                  <div className="space-y-3">
                    {observations.map((obs) => (
                      <Card key={obs.id} className="border border-slate-200">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    obs.observationType === "flag"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {obs.observationType === "flag"
                                    ? "Flag"
                                    : "General"}
                                </Badge>
                                {obs.observationType === "flag" &&
                                  obs.flagType && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs capitalize"
                                    >
                                      {obs.flagType.replace("-", " ")}
                                    </Badge>
                                  )}
                                <Badge
                                  variant="outline"
                                  className={`text-xs capitalize ${
                                    obs.criticality === "high"
                                      ? "border-red-300 text-red-700 bg-red-50"
                                      : obs.criticality === "medium"
                                        ? "border-yellow-300 text-yellow-700 bg-yellow-50"
                                        : "border-green-300 text-green-700 bg-green-50"
                                  }`}
                                >
                                  {obs.criticality}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-700">
                                {obs.comment}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span>
                                  {new Date(
                                    obs.observedDate,
                                  ).toLocaleDateString()}
                                </span>
                                <span>{obs.observedTime}</span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() => {
                                  setEditingObservationId(obs.id);
                                  setCurrentObservation({
                                    observationType: obs.observationType,
                                    flagType: obs.flagType || "",
                                    comment: obs.comment,
                                    observedDate: obs.observedDate,
                                    observedTime: obs.observedTime,
                                    criticality: obs.criticality,
                                  });
                                  setIsSeasonDetailsOpen(true);
                                }}
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => {
                                  setObservations(
                                    observations.filter((o) => o.id !== obs.id),
                                  );
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Button
                      className="w-full gap-2"
                      onClick={() => {
                        setIsSeasonDetailsOpen(true);
                        setEditingObservationId(null);
                        setCurrentObservation({
                          observationType: "general",
                          flagType: "",
                          comment: "",
                          observedDate: "",
                          observedTime: "",
                          criticality: "low",
                        });
                      }}
                    >
                      <Plus className="h-4 w-4" /> Add Observation
                    </Button>
                  </div>
                )}

                {observations.length === 0 && !isSeasonDetailsOpen && (
                  <Button
                    className="w-full gap-2"
                    onClick={() => setIsSeasonDetailsOpen(true)}
                  >
                    <Plus className="h-4 w-4" /> Add Observation
                  </Button>
                )}

                {isSeasonDetailsOpen && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label>Observation Type</Label>
                      <Select
                        value={currentObservation.observationType}
                        onValueChange={(v: "general" | "flag") =>
                          setCurrentObservation({
                            ...currentObservation,
                            observationType: v,
                            flagType:
                              v === "general"
                                ? ""
                                : currentObservation.flagType,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="flag">Flag</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {currentObservation.observationType === "flag" && (
                      <div className="space-y-2">
                        <Label>Flag Type</Label>
                        <Select
                          value={currentObservation.flagType}
                          onValueChange={(v) =>
                            setCurrentObservation({
                              ...currentObservation,
                              flagType: v as
                                | "disease"
                                | "nutrition"
                                | "soil-moisture",
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select flag type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="disease">Disease</SelectItem>
                            <SelectItem value="nutrition">Nutrition</SelectItem>
                            <SelectItem value="soil-moisture">
                              Soil Moisture
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Comment</Label>
                      <Textarea
                        placeholder="Add your observation comment..."
                        rows={3}
                        value={currentObservation.comment}
                        onChange={(e) =>
                          setCurrentObservation({
                            ...currentObservation,
                            comment: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Add Media</Label>
                      <Button variant="outline" className="w-full gap-2">
                        <Camera className="h-4 w-4" />
                        Upload Photo/Video
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Observed On (Date)</Label>
                        <Input
                          type="date"
                          value={currentObservation.observedDate}
                          onChange={(e) =>
                            setCurrentObservation({
                              ...currentObservation,
                              observedDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Input
                          type="time"
                          value={currentObservation.observedTime}
                          onChange={(e) =>
                            setCurrentObservation({
                              ...currentObservation,
                              observedTime: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Criticality</Label>
                      <Select
                        value={currentObservation.criticality}
                        onValueChange={(v: "low" | "medium" | "high") =>
                          setCurrentObservation({
                            ...currentObservation,
                            criticality: v,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsSeasonDetailsOpen(false);
                          setEditingObservationId(null);
                          setCurrentObservation({
                            observationType: "general",
                            flagType: "",
                            comment: "",
                            observedDate: "",
                            observedTime: "",
                            criticality: "low",
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          if (editingObservationId) {
                            // Update existing observation
                            setObservations(
                              observations.map((obs) =>
                                obs.id === editingObservationId
                                  ? {
                                      ...obs,
                                      observationType:
                                        currentObservation.observationType,
                                      flagType: currentObservation.flagType as
                                        | "disease"
                                        | "nutrition"
                                        | "soil-moisture"
                                        | undefined,
                                      comment: currentObservation.comment,
                                      observedDate:
                                        currentObservation.observedDate,
                                      observedTime:
                                        currentObservation.observedTime,
                                      criticality:
                                        currentObservation.criticality,
                                    }
                                  : obs,
                              ),
                            );
                          } else {
                            // Add new observation
                            const newObservation = {
                              id: Date.now().toString(),
                              observationType:
                                currentObservation.observationType,
                              flagType:
                                currentObservation.observationType === "flag"
                                  ? (currentObservation.flagType as
                                      | "disease"
                                      | "nutrition"
                                      | "soil-moisture")
                                  : undefined,
                              comment: currentObservation.comment,
                              observedDate: currentObservation.observedDate,
                              observedTime: currentObservation.observedTime,
                              criticality: currentObservation.criticality,
                            };
                            setObservations([...observations, newObservation]);
                          }
                          setIsSeasonDetailsOpen(false);
                          setEditingObservationId(null);
                          setCurrentObservation({
                            observationType: "general",
                            flagType: "",
                            comment: "",
                            observedDate: "",
                            observedTime: "",
                            criticality: "low",
                          });
                        }}
                        disabled={
                          !currentObservation.comment ||
                          !currentObservation.observedDate ||
                          !currentObservation.observedTime ||
                          (currentObservation.observationType === "flag" &&
                            !currentObservation.flagType)
                        }
                      >
                        {editingObservationId
                          ? "Update Observation"
                          : "Save Observation"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card> */}
          </TabsContent>

          {/* Advisory Tasks Tab */}
          <TabsContent
            value="advisory-tasks"
            className="flex-1 overflow-y-auto space-y-4 mt-4 pb-20"
          >
            {/* Tasks */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">Tasks</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => setIsAddTaskPageOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Filters and Search */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      All
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      Overdue
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      Pending
                    </Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">
                      Completed
                    </Button>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 ml-auto"
                  >
                    <Search className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Task List */}
                <div className="space-y-2">
                  {/* Task 1 */}
                  <Card className="border border-slate-200">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          className="mt-0.5"
                          checked={completedTasks[1]}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(1, checked === true)
                          }
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium text-sm ${completedTasks[1] ? "line-through text-slate-400" : ""}`}
                          >
                            Apply Fertilizer
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              Irrigation
                            </Badge>
                            <span
                              className={`text-xs ${completedTasks[1] ? "text-slate-400" : "text-slate-500"}`}
                            >
                              Due: Dec 10, 2024
                            </span>
                          </div>
                          {taskRemarks[1] && (
                            <div className="mt-2 p-2 bg-slate-50 rounded-md border border-slate-200">
                              <p className="text-xs font-medium text-slate-700">
                                Remarks:
                              </p>
                              <p className="text-xs text-slate-600 mt-1">
                                {taskRemarks[1]}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Task 2 */}
                  <Card className="border border-slate-200">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          className="mt-0.5"
                          checked={completedTasks[2]}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(2, checked === true)
                          }
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium text-sm ${completedTasks[2] ? "line-through text-slate-400" : ""}`}
                          >
                            Pest Inspection
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              Monitoring
                            </Badge>
                            <span
                              className={`text-xs ${completedTasks[2] ? "text-slate-400" : "text-slate-500"}`}
                            >
                              Due: Dec 12, 2024
                            </span>
                          </div>
                          {taskRemarks[2] && (
                            <div className="mt-2 p-2 bg-slate-50 rounded-md border border-slate-200">
                              <p className="text-xs font-medium text-slate-700">
                                Remarks:
                              </p>
                              <p className="text-xs text-slate-600 mt-1">
                                {taskRemarks[2]}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Task 3 */}
                  <Card className="border border-slate-200">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          className="mt-0.5"
                          checked={completedTasks[3]}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(3, checked === true)
                          }
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium text-sm ${completedTasks[3] ? "line-through text-slate-400" : ""}`}
                          >
                            Soil Testing
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              Analysis
                            </Badge>
                            <span
                              className={`text-xs ${completedTasks[3] ? "text-slate-400" : "text-slate-500"}`}
                            >
                              Due: Dec 5, 2024
                            </span>
                          </div>
                          {taskRemarks[3] && (
                            <div className="mt-2 p-2 bg-slate-50 rounded-md border border-slate-200">
                              <p className="text-xs font-medium text-slate-700">
                                Remarks:
                              </p>
                              <p className="text-xs text-slate-600 mt-1">
                                {taskRemarks[3]}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Task 4 */}
                  <Card className="border border-slate-200">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          className="mt-0.5"
                          checked={completedTasks[4]}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange(4, checked === true)
                          }
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium text-sm ${completedTasks[4] ? "line-through text-slate-400" : ""}`}
                          >
                            Weed Control
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              Maintenance
                            </Badge>
                            <span
                              className={`text-xs ${completedTasks[4] ? "text-slate-400" : "text-slate-500"}`}
                            >
                              Due: Dec 15, 2024
                            </span>
                          </div>
                          {taskRemarks[4] && (
                            <div className="mt-2 p-2 bg-slate-50 rounded-md border border-slate-200">
                              <p className="text-xs font-medium text-slate-700">
                                Remarks:
                              </p>
                              <p className="text-xs text-slate-600 mt-1">
                                {taskRemarks[4]}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Add Task Form */}
                {isTasksOpen && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label>Task Title</Label>
                      <Input placeholder="Enter task title" />
                    </div>
                    <div className="space-y-2">
                      <Label>Task Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select task type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="irrigation">Irrigation</SelectItem>
                          <SelectItem value="monitoring">Monitoring</SelectItem>
                          <SelectItem value="analysis">Analysis</SelectItem>
                          <SelectItem value="maintenance">
                            Maintenance
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Due Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsTasksOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={() => setIsTasksOpen(false)}>
                        Save Task
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Remarks Full Page */}
        {isRemarksDialogOpen && (
          <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in fade-in slide-in-from-bottom duration-300">
            {/* Green Header */}
            <div className="px-4 py-3 border-b bg-[rgb(76,175,80)] text-white flex justify-between items-center">
              <div className="flex-1">
                <h2 className="text-lg font-bold leading-none">Add Remarks</h2>
                <p className="text-xs mt-1 text-white/80">
                  Add completion remarks for this task
                </p>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="remarks-plot"
                    className="text-base font-medium"
                  >
                    Remarks <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="remarks-plot"
                    placeholder="Enter your remarks here..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={6}
                    className="resize-none text-base"
                  />
                </div>
              </div>
            </div>

            {/* Footer with Buttons */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-10 text-sm"
                  onClick={() => {
                    setIsRemarksDialogOpen(false);
                    setCurrentTaskId(null);
                    setRemarks("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-10 bg-[#4CAF50] hover:bg-[#388E3C] text-sm"
                  onClick={handleRemarksSubmit}
                  disabled={!remarks.trim()}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="gap-3 h-full flex flex-col pb-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Field Tracker</h2>
          <p className="text-sm text-slate-500">{filteredPlots.length} plots</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2" align="end">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    setWizardInitialStep(1);
                    setIsAddPlotOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  New Field
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <AddPlotWizard
            isOpen={isAddPlotOpen}
            onClose={() => {
              setIsAddPlotOpen(false);
              setCopiedPlotInitialData(null);
              setWizardInitialStep(1);
            }}
            initialData={copiedPlotInitialData}
            selectedRegion={selectedRegion}
            initialStep={wizardInitialStep}
          />

          {/* Copy Plot Dialog */}
          <Dialog open={isCopyPlotOpen} onOpenChange={setIsCopyPlotOpen}>
            <DialogContent
              className="max-w-full h-full m-0 rounded-none p-0 flex flex-col"
              hideCloseButton
            >
              <DialogTitle className="sr-only">
                Copy From Existing Plot
              </DialogTitle>
              <DialogDescription className="sr-only">
                Select an existing plot to copy data from
              </DialogDescription>

              {/* Green Header matching AddPlotWizard */}
              <div className="px-4 py-3 border-b bg-[rgb(76,175,80)] text-white flex justify-between items-center flex-shrink-0">
                <div className="flex-1">
                  <h2 className="text-lg font-bold leading-none">
                    Copy From Existing Plot
                  </h2>
                  <p className="text-xs text-[rgb(255,255,255)] mt-1">
                    Select an existing plot to copy data from
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Season</Label>
                    <Select
                      value={copyPlotData.season}
                      onValueChange={(v) =>
                        setCopyPlotData({ ...copyPlotData, season: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024-kharif">
                          2024 - Kharif
                        </SelectItem>
                        <SelectItem value="2024-rabi">2024 - Rabi</SelectItem>
                        <SelectItem value="2023-kharif">
                          2023 - Kharif
                        </SelectItem>
                        <SelectItem value="2023-rabi">2023 - Rabi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>State</Label>
                    <Select
                      value={copyPlotData.state}
                      onValueChange={(v) =>
                        setCopyPlotData({
                          ...copyPlotData,
                          state: v,
                          district: "",
                          grower: "",
                          plotId: "",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="punjab">Punjab</SelectItem>
                        <SelectItem value="haryana">Haryana</SelectItem>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="uttar-pradesh">
                          Uttar Pradesh
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>District</Label>
                    <Select
                      value={copyPlotData.district}
                      onValueChange={(v) =>
                        setCopyPlotData({
                          ...copyPlotData,
                          district: v,
                          grower: "",
                          plotId: "",
                        })
                      }
                      disabled={!copyPlotData.state}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amritsar">Amritsar</SelectItem>
                        <SelectItem value="ludhiana">Ludhiana</SelectItem>
                        <SelectItem value="jalandhar">Jalandhar</SelectItem>
                        <SelectItem value="patiala">Patiala</SelectItem>
                        <SelectItem value="bathinda">Bathinda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Grower</Label>
                    <Select
                      value={copyPlotData.grower}
                      onValueChange={(v) =>
                        setCopyPlotData({
                          ...copyPlotData,
                          grower: v,
                          plotId: "",
                        })
                      }
                      disabled={!copyPlotData.district}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grower" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_GROWERS.map((grower) => (
                          <SelectItem key={grower.id} value={grower.id}>
                            {grower.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Plot ID</Label>
                    <Select
                      value={copyPlotData.plotId}
                      onValueChange={(v) =>
                        setCopyPlotData({ ...copyPlotData, plotId: v })
                      }
                      disabled={!copyPlotData.grower}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_PLOTS.filter(
                          (plot) => plot.growerId === copyPlotData.grower,
                        ).map((plot) => (
                          <SelectItem key={plot.id} value={plot.id}>
                            {plot.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Footer with same button styling as AddPlotWizard */}
              <div className="p-4 border-t bg-white flex-shrink-0">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    className="text-sm px-3"
                    onClick={() => {
                      setIsCopyPlotOpen(false);
                      setCopyPlotData({
                        season: "",
                        state: "",
                        district: "",
                        grower: "",
                        plotId: "",
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-[#4CAF50] hover:bg-[#388E3C] text-sm"
                    onClick={() => {
                      // Find the selected plot and prepare its data for pre-filling
                      const selectedPlot = MOCK_PLOTS.find(
                        (plot) => plot.id === copyPlotData.plotId,
                      );
                      if (selectedPlot) {
                        setCopiedPlotInitialData({
                          grower: selectedPlot.growerId,
                          fieldAssistant: "rajiv-sharma",
                          state: selectedPlot.state,
                          district: selectedPlot.district,
                          taluka: "taluka-x",
                          village: "village-alpha",
                          hybrid: "super-99",
                          purpose: "all_hybrids",
                          irrigation:
                            selectedPlot.irrigationMethod?.toLowerCase() ||
                            "drip",
                          planting: "manual",
                          isolationVerified: "yes",
                          crop: selectedPlot.crop?.toLowerCase() || "corn",
                          sowingDate: "",
                          estimatedAcreage:
                            selectedPlot.acreage?.toString() || "",
                        });
                      }
                      setIsCopyPlotOpen(false);
                      setIsAddPlotOpen(true);
                      setCopyPlotData({
                        season: "",
                        state: "",
                        district: "",
                        grower: "",
                        plotId: "",
                      });
                    }}
                  >
                    Proceed
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Expanded Filters Bar */}
      {viewMode === "list" && (
        <div className="flex gap-3 items-center justify-between bg-white p-3 rounded-lg border shadow-sm">
          {/* Filter Icon with Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-2">
                <Filter className="h-4 w-4" />
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
                  {/* Grower Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Grower</Label>
                    <Select
                      value={filters.grower}
                      onValueChange={(v) =>
                        setFilters({ ...filters, grower: v })
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select grower" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Growers</SelectItem>
                        {MOCK_GROWERS.map((grower) => (
                          <SelectItem key={grower.id} value={grower.id}>
                            {grower.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Assigned Field Assistant Filter */}
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
                        <SelectItem value="all">
                          All Field Assistants
                        </SelectItem>
                        <SelectItem value="rajiv-sharma">
                          Rajiv Sharma
                        </SelectItem>
                        <SelectItem value="priya-patel">Priya Patel</SelectItem>
                        <SelectItem value="amit-singh">Amit Singh</SelectItem>
                        <SelectItem value="neha-gupta">Neha Gupta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* State Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">State</Label>
                    <Select
                      value={filters.state}
                      onValueChange={(v) =>
                        setFilters({ ...filters, state: v })
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        <SelectItem value="punjab">Punjab</SelectItem>
                        <SelectItem value="haryana">Haryana</SelectItem>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="uttar pradesh">
                          Uttar Pradesh
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* District Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">District</Label>
                    <Select
                      value={filters.district}
                      onValueChange={(v) =>
                        setFilters({ ...filters, district: v })
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Districts</SelectItem>
                        <SelectItem value="amritsar">Amritsar</SelectItem>
                        <SelectItem value="ludhiana">Ludhiana</SelectItem>
                        <SelectItem value="jalandhar">Jalandhar</SelectItem>
                        <SelectItem value="patiala">Patiala</SelectItem>
                        <SelectItem value="bathinda">Bathinda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Taluka Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Taluka</Label>
                    <Select
                      value={filters.taluka}
                      onValueChange={(v) =>
                        setFilters({ ...filters, taluka: v })
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Select taluka" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Talukas</SelectItem>
                        <SelectItem value="beas">Beas</SelectItem>
                        <SelectItem value="ajnala">Ajnala</SelectItem>
                        <SelectItem value="majitha">Majitha</SelectItem>
                        <SelectItem value="tarn-taran">Tarn Taran</SelectItem>
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
                        <SelectValue placeholder="Select village" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Villages</SelectItem>
                        <SelectItem value="rampur">Rampur</SelectItem>
                        <SelectItem value="sultanpur">Sultanpur</SelectItem>
                        <SelectItem value="khanna">Khanna</SelectItem>
                        <SelectItem value="moga">Moga</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Current Stage Filter */}
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
                        <SelectItem value="Sowing">Sowing</SelectItem>
                        <SelectItem value="Vegetative">Vegetative</SelectItem>
                        <SelectItem value="Detassling">Detassling</SelectItem>
                        <SelectItem value="Transplanting">
                          Transplanting
                        </SelectItem>
                        <SelectItem value="PPI">PPI</SelectItem>
                        <SelectItem value="Flowering">Flowering</SelectItem>
                        <SelectItem value="Harvest">Harvest</SelectItem>
                        <SelectItem value="Dispatch">Dispatch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Expected Stage Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Expected Stage
                    </Label>
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
                        <SelectItem value="Sowing">Sowing</SelectItem>
                        <SelectItem value="Vegetative">Vegetative</SelectItem>
                        <SelectItem value="Detassling">Detassling</SelectItem>
                        <SelectItem value="Transplanting">
                          Transplanting
                        </SelectItem>
                        <SelectItem value="PPI">PPI</SelectItem>
                        <SelectItem value="Flowering">Flowering</SelectItem>
                        <SelectItem value="Harvest">Harvest</SelectItem>
                        <SelectItem value="Dispatch">Dispatch</SelectItem>
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
                  onClick={() => {
                    setFilters({
                      grower: "all",
                      assignedFieldAssistant: "all",
                      state: "all",
                      district: "all",
                      taluka: "all",
                      village: "all",
                      crop: "all",
                      hybrid: "all",
                      currentStage: "all",
                      expectedStage: "all",
                    });
                  }}
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
      )}

      {/* View Mode Toggle - Floating Bottom Overlay - Hidden when forms are open */}
      {!isAddPlotOpen &&
        !isPreSeasonOpen &&
        !isSeasonDetailsOpen &&
        !isHarvestDetailsOpen &&
        !isTasksOpen &&
        !isAddTaskPageOpen &&
        !isCopyPlotOpen && (
          <div className="fixed bottom-[196px] left-1/2 -translate-x-1/2 z-50">
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

      {/* Quick Audit Filters */}
      {viewMode === "list" && (
        <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Button
            variant={auditFilter === "all" ? "default" : "outline"}
            size="sm"
            className={`h-8 text-xs whitespace-nowrap ${
              auditFilter === "all" ? "bg-[#4CAF50] hover:bg-[#388E3C]" : ""
            }`}
            onClick={() => setAuditFilter("all")}
          >
            All
          </Button>
          <Button
            variant={auditFilter === "audited" ? "default" : "outline"}
            size="sm"
            className={`h-8 text-xs whitespace-nowrap ${
              auditFilter === "audited" ? "bg-[#4CAF50] hover:bg-[#388E3C]" : ""
            }`}
            onClick={() => setAuditFilter("audited")}
          >
            Field Measured
          </Button>
          <Button
            variant={auditFilter === "pending" ? "default" : "outline"}
            size="sm"
            className={`h-8 text-xs whitespace-nowrap ${
              auditFilter === "pending" ? "bg-[#4CAF50] hover:bg-[#388E3C]" : ""
            }`}
            onClick={() => setAuditFilter("pending")}
          >
            Field Measurement Pending
          </Button>
        </div>
      )}

      {/* Main Content Area */}
      {viewMode === "map" ? (
        <MockMapView />
      ) : (
        <div className="flex-1 h-0 overflow-y-auto space-y-3 pb-20">
          {filteredPlots.map((plot) => (
            <Card
              key={plot.id}
              onClick={() => setSelectedPlot(plot)}
              className="cursor-pointer transition-all hover:shadow-md active:scale-[0.98]"
            >
              <CardContent className="p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-base truncate font-mono">
                      {plot.id}
                    </h3>
                    {plot.auditStatus === "audited" ? (
                      <Badge className="bg-green-100 hover:bg-green-100 text-green-700 border-green-200 flex items-center gap-1 shrink-0">
                        <CheckCircle2 className="h-3 w-3" />
                        Field Measured
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-slate-50 text-slate-600 border-slate-200 shrink-0"
                      >
                        Field Measurement Pending
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mb-2">
                    {plot.growerName}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Sprout className="h-3.5 w-3.5" />
                      <span>{plot.crop}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">({plot.hybrid})</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Sowing Date:{" "}
                    {new Date(plot.sowingDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
