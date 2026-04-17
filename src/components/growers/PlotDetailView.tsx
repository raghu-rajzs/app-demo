import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  ArrowLeft,
  Edit,
  Trash2,
  MoreVertical,
  AlertOctagon,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Plot, Grower, Advisory, MOCK_GROWERS } from "../data/mockData";
import { getStageDisplayLabel } from "./config/fieldStages";
import { FieldStageData, MediaEntry } from "./config/formDefaults";
import { PropertyMediaSection } from "./PropertyMediaSection";
import { FieldStagesSection } from "./FieldStagesSection";
import { AdvisoryTasksTab } from "./AdvisoryTasksTab";

interface PlotDetailViewProps {
  selectedPlot: Plot;
  plotMapImage: string;
  onBack: () => void;
  onEditGrower: (grower: Grower) => void;
  activeFieldStage: string;
  setActiveFieldStage: (stage: string) => void;
  fieldStageData: FieldStageData;
  updateStageField: (stage: string, field: string, value: unknown) => void;
  isFieldSummaryOpen: boolean;
  setIsFieldSummaryOpen: (v: boolean) => void;
  isMediaSectionOpen: boolean;
  setIsMediaSectionOpen: (v: boolean) => void;
  isMediaSaved: boolean;
  setIsMediaSaved: (v: boolean) => void;
  mediaEntries: MediaEntry[];
  setMediaEntries: (entries: MediaEntry[]) => void;
  pendingAdvisory: Advisory | undefined;
}

export function PlotDetailView({
  selectedPlot,
  plotMapImage,
  onBack,
  onEditGrower,
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
      {/* Header with Back Button, Plot ID, and Grower */}
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
        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
          {/* Share icon placeholder */}
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
            <DropdownMenuItem
              onClick={() => {
                const grower = MOCK_GROWERS.find(
                  (g) => g.id === selectedPlot.growerId,
                );
                if (grower) onEditGrower(grower);
              }}
            >
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
      <Tabs defaultValue="details" className="flex-1 flex flex-col overflow-hidden">
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
              <h3 className="font-semibold text-slate-900">Plot Details</h3>
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
                  <p className="text-xs text-slate-500">Planting Method</p>
                  <p className="font-medium text-slate-900">Machine</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Isolation Verified</p>
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
                    {getStageDisplayLabel(selectedPlot.stage)}
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
                    {(selectedPlot as any).area}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Audited Acreage</p>
                  <p className="font-medium text-slate-900">2.3 acres</p>
                </div>
              </div>
              <div className="pt-2">
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
            </CardContent>
          </Card>

          <PropertyMediaSection
            isMediaSectionOpen={isMediaSectionOpen}
            setIsMediaSectionOpen={setIsMediaSectionOpen}
            isMediaSaved={isMediaSaved}
            setIsMediaSaved={setIsMediaSaved}
            mediaEntries={mediaEntries}
            setMediaEntries={setMediaEntries}
          />

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

        <TabsContent
          value="advisory-tasks"
          className="flex-1 overflow-y-auto space-y-4 mt-4 pb-20"
        >
          <AdvisoryTasksTab pendingAdvisory={pendingAdvisory} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
