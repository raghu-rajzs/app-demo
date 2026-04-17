import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ArrowLeft,
  MoreVertical,
  Edit,
  Trash2,
  AlertOctagon,
} from "lucide-react";
import { Plot, Advisory } from "../data/mockData";
import { FieldStagesSection } from "../growers/FieldStagesSection";
import { PropertyMediaSection } from "../growers/PropertyMediaSection";
import { PlotAdvisoryTasksTab } from "./PlotAdvisoryTasksTab";
import { MediaEntry } from "../growers/config/formDefaults";

interface PlotDetailViewProps {
  selectedPlot: Plot;
  plotMapImage: string;
  onBack: () => void;
  onAddTask: () => void;
  // Field stages
  activeFieldStage: string;
  setActiveFieldStage: (stage: string) => void;
  fieldStageData: any;
  updateStageField: (stage: string, field: string, value: unknown) => void;
  isFieldSummaryOpen: boolean;
  setIsFieldSummaryOpen: (open: boolean) => void;
  // Media
  isMediaSectionOpen: boolean;
  setIsMediaSectionOpen: (open: boolean) => void;
  isMediaSaved: boolean;
  setIsMediaSaved: (saved: boolean) => void;
  mediaEntries: MediaEntry[];
  setMediaEntries: (entries: MediaEntry[]) => void;
  // Advisory
  pendingAdvisory: Advisory | undefined;
}

export function PlotDetailView({
  selectedPlot,
  plotMapImage,
  onBack,
  onAddTask,
  activeFieldStage,
  setActiveFieldStage,
  fieldStageData,
  updateStageField,
  isFieldSummaryOpen,
  setIsFieldSummaryOpen,
  isMediaSectionOpen,
  setIsMediaSectionOpen,
  isMediaSaved,
  setIsMediaSaved,
  mediaEntries,
  setMediaEntries,
  pendingAdvisory,
}: PlotDetailViewProps) {
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
          <h2 className="font-bold font-mono truncate">{selectedPlot.id}</h2>
          <p className="text-sm text-slate-500 truncate">
            {selectedPlot.growerName}
          </p>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" />
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

      {/* Tabs */}
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
          {/* Field Details Card */}
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
                  <p className="text-xs text-slate-500">Crop Stage</p>
                  <p className="font-medium text-slate-900">
                    {selectedPlot.stage}
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
            </CardContent>
          </Card>

          {/* Property Media Section — reused from growers */}
          <PropertyMediaSection
            isMediaSectionOpen={isMediaSectionOpen}
            setIsMediaSectionOpen={setIsMediaSectionOpen}
            isMediaSaved={isMediaSaved}
            setIsMediaSaved={setIsMediaSaved}
            mediaEntries={mediaEntries}
            setMediaEntries={setMediaEntries}
          />

          {/* Field Stages — reused from growers (now with full stage implementations) */}
          <FieldStagesSection
            selectedPlot={selectedPlot}
            plotMapImage={plotMapImage}
            activeFieldStage={activeFieldStage}
            setActiveFieldStage={setActiveFieldStage}
            fieldStageData={fieldStageData}
            updateStageField={updateStageField}
            isFieldSummaryOpen={isFieldSummaryOpen}
            setIsFieldSummaryOpen={setIsFieldSummaryOpen}
          />
        </TabsContent>

        {/* Advisory Tasks Tab */}
        <TabsContent
          value="advisory-tasks"
          className="flex-1 overflow-y-auto space-y-4 mt-4 pb-20"
        >
          <PlotAdvisoryTasksTab
            pendingAdvisory={pendingAdvisory}
            onAddTask={onAddTask}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
