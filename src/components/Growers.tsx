import React, { useState } from "react";
import { MOCK_GROWERS, Grower } from "./data/mockData";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "./ui/dialog";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Search,
  UserPlus,
  Phone,
  MapPin,
  Sprout,
  Upload,
  CheckCircle,
  Users,
  Filter,
  Edit,
  Trash2,
  MoreVertical,
  Share2,
  Download,
  Map as MapIcon,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AddPlotWizard } from "./AddPlotWizard";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { ArrowLeft } from "lucide-react";
import { MOCK_PLOTS, Plot, MOCK_ADVISORIES } from "./data/mockData";
import { Save } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Plus, Camera, Video, AlertOctagon, CheckCircle2 } from "lucide-react";
import { Textarea } from "./ui/textarea";
// import plotMapImage from "figma:asset/7ecc90bf8cdb62d2ec7cf882c21e5e68d7ea4a0a.png";

interface GrowersProps {
  selectedRegion?: string;
}

export function Growers({ selectedRegion = "all" }: GrowersProps = {}) {
  const plotMapImage = "../assets/53659142.jpg";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrower, setSelectedGrower] = useState<Grower | null>(null);
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [isAddGrowerOpen, setIsAddGrowerOpen] = useState(false);
  const [isAddPlotWizardOpen, setIsAddPlotWizardOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [selectedCropType, setSelectedCropType] = useState("Corn");
  const [editingGrowerId, setEditingGrowerId] = useState<string | null>(null);

  // Form data state
  const [formData, setFormData] = useState({
    preferredName: "",
    agreementName: "",
    age: "",
    fathersName: "",
    panNumber: "",
    phone: "",
    alternatePhone: "",
    cropType: "Corn",
    unit: "",
    location: "",
    territory: "",
    block: "",
    village: "",
    category: "",
  });

  // Plot details state
  const [isMediaSectionOpen, setIsMediaSectionOpen] = useState(true);
  const [isMediaSaved, setIsMediaSaved] = useState(false);
  const [mediaEntries, setMediaEntries] = useState<any[]>([]);

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

  const [filters, setFilters] = useState({
    unit: "all",
    location: "all",
    block: "all",
    village: "all",
    hybrid: "all",
  });

  const [auditFilter, setAuditFilter] = useState<"all" | "audited" | "pending">(
    "all",
  );

  const [plotHybridFilter, setPlotHybridFilter] = useState("all");
  const [plotStageFilter, setPlotStageFilter] = useState("all");
  const [plotSearchQuery, setPlotSearchQuery] = useState("");

  const activeFilterCount = [
    filters.unit !== "all",
    filters.location !== "all",
    filters.block !== "all",
    filters.village !== "all",
    filters.hybrid !== "all",
  ].filter(Boolean).length;

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

  // Get pending advisory for selected plot
  const pendingAdvisory = selectedPlot
    ? MOCK_ADVISORIES.find(
        (a) => a.plotId === selectedPlot.id && a.status === "Pending",
      )
    : null;

  // Handle edit grower
  const handleEditGrower = (grower: Grower) => {
    setEditingGrowerId(grower.id);
    setFormData({
      preferredName: grower.name,
      agreementName: grower.agreementName,
      age: grower.age.toString(),
      fathersName: grower.fathersName,
      panNumber: grower.panNumber,
      phone: grower.phone,
      alternatePhone: grower.alternatePhone || "",
      cropType: grower.cropType,
      unit: grower.unit,
      location: grower.location,
      territory: grower.cropType === "Rice" ? grower.location : "",
      block: grower.block,
      village: grower.village,
      category: grower.category,
    });
    setSelectedCropType(grower.cropType);
    setIsAddGrowerOpen(true);
    setAddStep(1);
  };

  // Reset form when dialog closes
  const handleCloseDialog = () => {
    setIsAddGrowerOpen(false);
    setEditingGrowerId(null);
    setAddStep(1);
    setSelectedCropType("Corn");
    setFormData({
      preferredName: "",
      agreementName: "",
      age: "",
      fathersName: "",
      panNumber: "",
      phone: "",
      alternatePhone: "",
      cropType: "Corn",
      unit: "",
      location: "",
      territory: "",
      block: "",
      village: "",
      category: "",
    });
  };

  const AddGrowerForm = () => (
    <div className="space-y-4 py-2">
      {addStep === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div className="space-y-2">
            <Label className="text-base">Grower Preferred Name *</Label>
            <Input
              placeholder="Enter full name"
              className="h-12 text-base"
              value={formData.preferredName}
              onChange={(e) =>
                setFormData({ ...formData, preferredName: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label className="text-base">Grower Agreement Name *</Label>
            <Input
              placeholder="Enter full name"
              className="h-12 text-base"
              value={formData.agreementName}
              onChange={(e) =>
                setFormData({ ...formData, agreementName: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base">Grower Age</Label>
            <Input
              placeholder="Enter age"
              type="number"
              className="h-12 text-base"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base">Father's Name</Label>
            <Input
              placeholder="Enter father's name"
              className="h-12 text-base"
              value={formData.fathersName}
              onChange={(e) =>
                setFormData({ ...formData, fathersName: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base">PAN Number</Label>
            <Input
              placeholder="Enter PAN number (e.g., ABCDE1234F)"
              className="h-12 text-base"
              maxLength={10}
              value={formData.panNumber}
              onChange={(e) =>
                setFormData({ ...formData, panNumber: e.target.value })
              }
            />
          </div>

          {/* Removed Upload Profile Photo section */}

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              placeholder="+91 98765 43210"
              className="h-12"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base">Alternate Number (Optional)</Label>
            <Input
              placeholder="+91"
              type="tel"
              className="h-12 text-base"
              value={formData.alternatePhone}
              onChange={(e) =>
                setFormData({ ...formData, alternatePhone: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base">Crop Type *</Label>
            <Select
              value={formData.cropType}
              onValueChange={(v) => {
                setFormData({ ...formData, cropType: v });
                setSelectedCropType(v);
              }}
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select Crop Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Corn">Corn</SelectItem>
                <SelectItem value="Rice">Rice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedCropType === "Rice" ? (
            <>
              <div className="space-y-2">
                <Label className="text-base">Unit *</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(v) => setFormData({ ...formData, unit: v })}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unit North">Unit North</SelectItem>
                    <SelectItem value="Unit South">Unit South</SelectItem>
                    <SelectItem value="Unit East">Unit East</SelectItem>
                    <SelectItem value="Unit West">Unit West</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Territory *</Label>
                <Select
                  value={formData.territory}
                  onValueChange={(v) =>
                    setFormData({ ...formData, territory: v, location: v })
                  }
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select Territory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Territory 1">Territory 1</SelectItem>
                    <SelectItem value="Territory 2">Territory 2</SelectItem>
                    <SelectItem value="Territory 3">Territory 3</SelectItem>
                    <SelectItem value="Territory 4">Territory 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Block *</Label>
                <Select
                  value={formData.block}
                  onValueChange={(v) => setFormData({ ...formData, block: v })}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select Block" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Block A">Block A</SelectItem>
                    <SelectItem value="Block B">Block B</SelectItem>
                    <SelectItem value="Block C">Block C</SelectItem>
                    <SelectItem value="Block D">Block D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label className="text-base">Unit *</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(v) => setFormData({ ...formData, unit: v })}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unit North">Unit North</SelectItem>
                    <SelectItem value="Unit South">Unit South</SelectItem>
                    <SelectItem value="Unit East">Unit East</SelectItem>
                    <SelectItem value="Unit West">Unit West</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Location *</Label>
                <Select
                  value={formData.location}
                  onValueChange={(v) =>
                    setFormData({ ...formData, location: v })
                  }
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Location A">Location A</SelectItem>
                    <SelectItem value="Location B">Location B</SelectItem>
                    <SelectItem value="Location C">Location C</SelectItem>
                    <SelectItem value="Location D">Location D</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Block *</Label>
                <Select
                  value={formData.block}
                  onValueChange={(v) => setFormData({ ...formData, block: v })}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select Block" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Block A">Block A</SelectItem>
                    <SelectItem value="Block B">Block B</SelectItem>
                    <SelectItem value="Block C">Block C</SelectItem>
                    <SelectItem value="Block D">Block D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label className="text-base">Village *</Label>
            <Select
              value={formData.village}
              onValueChange={(v) => setFormData({ ...formData, village: v })}
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select Village" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rampur">Rampur</SelectItem>
                <SelectItem value="Lakhanpur">Lakhanpur</SelectItem>
                <SelectItem value="Sultanpur">Sultanpur</SelectItem>
                <SelectItem value="Rajapur">Rajapur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-base">Upload PAN Card</Label>
            <Button
              variant="outline"
              className="w-full h-12 justify-start gap-2"
            >
              <Upload className="h-4 w-4" />
              <span>Choose File</span>
            </Button>
          </div>

          <div className="space-y-2">
            <Label className="text-base">Farmer Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(v) => setFormData({ ...formData, category: v })}
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Small">Small</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {addStep === 2 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div className="p-4 bg-blue-50 text-blue-700 rounded-lg text-base">
            📍 Adding initial plot for grower
          </div>

          <div className="space-y-2">
            <Label className="text-base">Hybrid *</Label>
            <Select>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select Hybrid" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="h1">Super-99 (Corn)</SelectItem>
                <SelectItem value="h2">Rice-Gold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-base">Plot Purpose *</Label>
            <Select>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select Purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seed">Seed Production</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-base">Irrigation Method *</Label>
            <Select>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="drip">Drip</SelectItem>
                <SelectItem value="flood">Flood</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-base">Soil Moisture at Sowing *</Label>
            <Select>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select Moisture Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dry">Dry</SelectItem>
                <SelectItem value="optimal">Optimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {addStep === 3 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div className="h-[400px] bg-slate-200 rounded-lg border relative overflow-hidden">
            {/* Map Placeholder */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1591714345924-9957eb4014e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080')] bg-cover bg-center opacity-60"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/95 p-6 rounded-xl shadow-lg text-center">
                <MapPin className="h-12 w-12 mx-auto text-[#4CAF50] mb-3" />
                <p className="font-medium text-base mb-1">
                  Tap to start drawing boundary
                </p>
                <p className="text-sm text-slate-500">GPS Accuracy: High</p>
              </div>
            </div>
            {/* Controls */}
            <div className="absolute bottom-3 left-3 right-3 flex gap-2">
              <Button
                size="lg"
                variant="secondary"
                className="shadow-lg flex-1"
              >
                Undo
              </Button>
              <Button
                size="lg"
                variant="default"
                className="shadow-lg flex-1 bg-[#4CAF50] hover:bg-[#388E3C]"
              >
                Finish
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-4 rounded-lg border-2 border-slate-200">
              <span className="text-slate-500 block text-sm mb-1">
                Calculated Area
              </span>
              <span className="font-bold text-lg">0.00 Acres</span>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
              <span className="text-slate-500 block text-sm mb-1">
                Overlap Check
              </span>
              <span className="font-bold text-[#4CAF50] flex items-center gap-1 text-lg">
                <CheckCircle className="h-4 w-4" /> Pass
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* If a plot is selected, show plot details */}
      {selectedPlot ? (
        <div className="space-y-4 h-full flex flex-col">
          {/* Header with Back Button, Plot ID, and Grower */}
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
              <h2 className="font-bold font-mono truncate">
                {selectedPlot.id}
              </h2>
              <p className="text-sm text-slate-500 truncate">
                {selectedPlot.growerName}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
            >
              {/* <Share2 className="h-4 w-4" /> */}
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
          <Tabs
            defaultValue="details"
            className="flex-1 flex flex-col overflow-hidden"
          >
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
                      <p className="text-xs text-slate-500">
                        Irrigation Method
                      </p>
                      <p className="font-medium text-slate-900">Drip</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Planting Method</p>
                      <p className="font-medium text-slate-900">Machine</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">
                        Isolation Verified
                      </p>
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
                      <p className="text-xs text-slate-500">
                        Estimated Acreage
                      </p>
                      <p className="font-medium text-slate-900">
                        {selectedPlot.area}
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

              {/* Property Photos & Videos */}
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">
                      Property Photos & Videos
                    </h3>
                    {isMediaSaved && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => {
                          setIsMediaSectionOpen(true);
                          setIsMediaSaved(false);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {!isMediaSaved && !isMediaSectionOpen && (
                    <Button
                      className="w-full gap-2 bg-[#4CAF50] hover:bg-[#388E3C]"
                      onClick={() => setIsMediaSectionOpen(true)}
                    >
                      <Plus className="h-4 w-4" /> Add Media
                    </Button>
                  )}

                  {isMediaSaved && !isMediaSectionOpen && (
                    <div className="space-y-3 pt-2">
                      {mediaEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {entry.type === "photo" ? (
                              <Camera className="h-4 w-4 text-slate-600" />
                            ) : (
                              <Video className="h-4 w-4 text-slate-600" />
                            )}
                            <span className="font-medium text-slate-900 capitalize">
                              {entry.type}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-xs text-slate-500">
                                Date Captured
                              </p>
                              <p className="font-medium text-slate-900">
                                {new Date(
                                  entry.dateCaptured,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">
                                Time Captured
                              </p>
                              <p className="font-medium text-slate-900">
                                {entry.timeCaptured}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {isMediaSectionOpen && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="space-y-2">
                        <Label>Media Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select media type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="photo">Photo</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button variant="outline" className="w-full gap-2">
                        <Camera className="h-4 w-4" />
                        Capture/Upload Media
                      </Button>

                      <div className="flex justify-end gap-2 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsMediaSectionOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-[#4CAF50] hover:bg-[#388E3C]"
                          onClick={() => {
                            setIsMediaSectionOpen(false);
                            setIsMediaSaved(true);
                            setMediaEntries([
                              {
                                id: "1",
                                type: "photo",
                                dateCaptured: new Date().toISOString(),
                                timeCaptured: new Date().toLocaleTimeString(),
                              },
                            ]);
                          }}
                        >
                          Save Media
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Field Stages Section */}
              <Card>
                <CardContent className="p-4 space-y-4">
                  {/* Header with Summary Button */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">
                      Field Stages
                    </h3>
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
                              <SelectItem value="sugarcane">
                                Sugarcane
                              </SelectItem>
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
                          <Label className="text-xs">
                            Male 1 Planting Date
                          </Label>
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
                          <Label className="text-xs">
                            Male 2 Planting Date
                          </Label>
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
                          <Label className="text-xs">
                            Area Cancelled (Acre)
                          </Label>
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
                            <div
                              key={reason}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                id={`reason-${reason}`}
                                checked={fieldStageData.vegetative.areaCancelledReason.includes(
                                  reason,
                                )}
                                onCheckedChange={(checked) => {
                                  const cur =
                                    fieldStageData.vegetative
                                      .areaCancelledReason;
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
                        <Label className="text-xs">
                          Pollination Information
                        </Label>
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
                              updateStageField(
                                "flowering",
                                "mSkeletonization",
                                v,
                              )
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
                            value={
                              fieldStageData.flowering.male1TasselsThrowing
                            }
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
                            value={
                              fieldStageData.flowering.male2TasselsThrowing
                            }
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
                          <Label className="text-xs">
                            Neighbor Distance (m)
                          </Label>
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
                              updateStageField(
                                "flowering",
                                "fieldScoreRating",
                                v,
                              )
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
                          <Label className="text-xs">
                            Estimated Yield (Kg)
                          </Label>
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

                  {/* ── Quality, Pre-Harvest, Harvest, Dispatch, CCP ── */}
                  {[
                    "quality",
                    "pre-harvest",
                    "harvest",
                    "dispatch",
                    "ccp",
                  ].includes(activeFieldStage) && (
                    <div className="space-y-4 pt-2 border-t">
                      <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                          <Sprout className="h-6 w-6 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            {activeFieldStage === "quality"
                              ? "Quality Stage"
                              : activeFieldStage === "pre-harvest"
                                ? "Pre-Harvest Stage"
                                : activeFieldStage === "harvest"
                                  ? "Harvest Stage"
                                  : activeFieldStage === "dispatch"
                                    ? "Dispatch Stage"
                                    : "CCP Stage"}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Detailed fields available in full PlotTracker view
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent
              value="advisory-tasks"
              className="flex-1 overflow-y-auto space-y-4 mt-4 pb-20"
            >
              {/* Pending Advisory */}
              {pendingAdvisory && (
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-amber-900 flex items-center gap-2">
                        <AlertOctagon className="h-5 w-5" /> Pending Advisory
                      </h3>
                      <Badge
                        variant="outline"
                        className="bg-amber-100 text-amber-800 border-amber-300"
                      >
                        High Priority
                      </Badge>
                    </div>
                    <div>
                      <p className="font-medium text-amber-900">
                        {pendingAdvisory.title}
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        {pendingAdvisory.action}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white border-none"
                    >
                      Execute Advisory
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Tasks */}
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">Tasks</h3>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Task List */}
                  <div className="space-y-2">
                    <Card className="border border-slate-200">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <Checkbox className="mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">
                              Apply Fertilizer
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                Irrigation
                              </Badge>
                              <span className="text-xs text-slate-500">
                                Due: Dec 10, 2024
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-slate-200">
                      <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                          <Checkbox className="mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">
                              Pest Inspection
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                Monitoring
                              </Badge>
                              <span className="text-xs text-slate-500">
                                Due: Dec 12, 2024
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : selectedGrower ? (
        <div className="space-y-4 h-full flex flex-col">
          {/* Header with Back Button matching Plot Details style */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSelectedGrower(null)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold font-mono truncate text-sm">
                {(() => {
                  const getInitials = (name: string) => {
                    return name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase();
                  };
                  const state = "PB";
                  const city = selectedGrower.region.toUpperCase();
                  const village = selectedGrower.village.toUpperCase();
                  const initials = getInitials(selectedGrower.name);
                  return `${state}/${city}/${village}/${initials}`;
                })()}
              </h2>
              <p className="text-sm text-slate-500 truncate">
                {selectedGrower.name}
              </p>
            </div>
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
                  onClick={() => handleEditGrower(selectedGrower!)}
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

          {/* Grower Details Content */}
          <div className="flex-1 overflow-y-auto space-y-4 pb-20">
            {/* Grower Details Card */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-slate-900">Grower Details</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Preferred Name</p>
                    <p className="font-medium text-slate-900">
                      {selectedGrower.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Agreement Name</p>
                    <p className="font-medium text-slate-900">
                      {selectedGrower.agreementName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Age</p>
                    <p className="font-medium text-slate-900">
                      {selectedGrower.age} years
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Father's Name</p>
                    <p className="font-medium text-slate-900">
                      {selectedGrower.fathersName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">PAN Number</p>
                    <p className="font-medium text-slate-900">
                      {selectedGrower.panNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="font-medium text-slate-900">
                      {selectedGrower.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Alternate Phone</p>
                    <p className="font-medium text-slate-900">
                      {selectedGrower.alternatePhone || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Crop Type</p>
                    <p className="font-medium text-slate-900">
                      {selectedGrower.cropType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Unit</p>
                    <p className="font-medium text-slate-900">
                      {selectedGrower.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">
                      {selectedGrower.cropType === "Rice"
                        ? "Territory"
                        : "Location"}
                    </p>
                    <p className="font-medium text-slate-900">
                      {selectedGrower.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Block</p>
                    <p className="font-medium text-slate-900">
                      {selectedGrower.block}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Village</p>
                    <p className="font-medium text-slate-900">
                      {selectedGrower.village}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Category</p>
                    <p className="font-medium text-slate-900">
                      {selectedGrower.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Total Fields</p>
                    <p className="font-medium text-slate-900">
                      {selectedGrower.plots.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Associated Plots Card */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-900">
                    Associated Plots
                  </h3>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex gap-2 items-center">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Search plots by ID, hybrid, stage"
                      value={plotSearchQuery}
                      onChange={(e) => setPlotSearchQuery(e.target.value)}
                      className="pl-10 h-9 text-sm"
                    />
                  </div>

                  {/* Filter Button with Popover */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 gap-1.5"
                      >
                        <Filter className="h-4 w-4" />
                        <span className="text-xs hidden sm:inline">Filter</span>
                        {(plotHybridFilter !== "all" ||
                          plotStageFilter !== "all") && (
                          <Badge
                            variant="secondary"
                            className="h-5 px-1 text-[10px]"
                          >
                            {
                              [
                                plotHybridFilter !== "all",
                                plotStageFilter !== "all",
                              ].filter(Boolean).length
                            }
                          </Badge>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3" align="end">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Hybrid</Label>
                          <Select
                            value={plotHybridFilter}
                            onValueChange={setPlotHybridFilter}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="All Hybrids" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Hybrids</SelectItem>
                              {Array.from(
                                new Set(
                                  selectedGrower.plots
                                    .map(
                                      (plotId) =>
                                        MOCK_PLOTS.find((p) => p.id === plotId)
                                          ?.hybrid,
                                    )
                                    .filter(Boolean),
                                ),
                              ).map((hybrid) => (
                                <SelectItem key={hybrid} value={hybrid || ""}>
                                  {hybrid}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Current Stage
                          </Label>
                          <Select
                            value={plotStageFilter}
                            onValueChange={setPlotStageFilter}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="All Stages" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Stages</SelectItem>
                              {Array.from(
                                new Set(
                                  selectedGrower.plots
                                    .map(
                                      (plotId) =>
                                        MOCK_PLOTS.find((p) => p.id === plotId)
                                          ?.stage,
                                    )
                                    .filter(Boolean),
                                ),
                              ).map((stage) => (
                                <SelectItem key={stage} value={stage || ""}>
                                  {stage}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator />

                        {(plotHybridFilter !== "all" ||
                          plotStageFilter !== "all") && (
                          <>
                            <Separator />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => {
                                setPlotHybridFilter("all");
                                setPlotStageFilter("all");
                              }}
                            >
                              Clear All
                            </Button>
                          </>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  {selectedGrower.plots
                    .map((plotId) => MOCK_PLOTS.find((p) => p.id === plotId))
                    .filter((plotData) => {
                      // Search filter
                      if (plotSearchQuery.trim()) {
                        const query = plotSearchQuery.toLowerCase();
                        const matchesSearch =
                          plotData?.id.toLowerCase().includes(query) ||
                          plotData?.hybrid.toLowerCase().includes(query) ||
                          plotData?.stage.toLowerCase().includes(query);
                        if (!matchesSearch) return false;
                      }

                      // Hybrid filter
                      if (
                        plotHybridFilter !== "all" &&
                        plotData?.hybrid !== plotHybridFilter
                      ) {
                        return false;
                      }

                      // Stage filter
                      if (
                        plotStageFilter !== "all" &&
                        plotData?.stage !== plotStageFilter
                      ) {
                        return false;
                      }

                      return true;
                    })
                    .map((plotData) => {
                      if (!plotData) return null;
                      return (
                        <Card
                          key={plotData.id}
                          onClick={() => {
                            setSelectedPlot(plotData);
                          }}
                          className="cursor-pointer transition-all hover:shadow-md active:scale-[0.98]"
                        >
                          <CardContent className="p-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <div className="min-w-0">
                                  <h3 className="font-semibold text-base truncate font-mono">
                                    {plotData.id}
                                  </h3>
                                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                    <Sprout className="h-3 w-3" />
                                    {plotData.hybrid}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                                <div className="bg-slate-50 rounded px-2 py-1">
                                  <p className="text-slate-400 text-[10px] mb-0.5">
                                    Current Stage
                                  </p>
                                  <p className="font-medium text-slate-700">
                                    {plotData?.stage || "N/A"}
                                  </p>
                                </div>
                                <div className="bg-amber-50 rounded px-2 py-1">
                                  <p className="text-amber-500 text-[10px] mb-0.5">
                                    Expected Stage
                                  </p>
                                  <p className="font-medium text-amber-700">
                                    {plotData?.expectedStage || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        // List view when no grower is selected
        <div className="flex flex-col gap-3 h-full">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Growers</h2>
              <p className="text-sm text-slate-500">
                {filteredGrowers.length} growers
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1.5 bg-[#4CAF50] hover:bg-[#388E3C] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                onClick={() => {
                  setIsAddGrowerOpen(true);
                }}
              >
                <UserPlus className="h-3.5 w-3.5" />
                Add New Grower
              </button>
            </div>
            <Dialog
              open={isAddGrowerOpen}
              onOpenChange={(open) => {
                if (!open) {
                  handleCloseDialog();
                } else {
                  setIsAddGrowerOpen(open);
                }
              }}
            >
              <DialogContent className="max-w-full h-full m-0 rounded-none p-0">
                <DialogTitle className="sr-only">
                  {editingGrowerId ? "Edit Grower" : "Add New Grower"}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  {editingGrowerId
                    ? "Edit the grower details"
                    : "Wizard to add a new grower and their plots."}
                </DialogDescription>

                {/* Green Header matching AddPlotWizard */}
                <div className="px-4 py-3 border-b bg-[rgb(76,175,80)] text-white flex justify-between items-center">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold leading-none">
                      {editingGrowerId ? "Edit Grower" : "Add New Grower"}
                    </h2>
                    <p className="text-xs text-[rgb(255,255,255)] mt-1">
                      {editingGrowerId
                        ? "Update grower details"
                        : "Fill in the grower details"}
                    </p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <AddGrowerForm />
                </div>

                {/* Footer with same button styling as AddPlotWizard */}
                <div className="p-4 border-t bg-white">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 h-10 text-sm"
                      onClick={handleCloseDialog}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 h-10 bg-[#4CAF50] hover:bg-[#388E3C] text-sm"
                      onClick={() => {
                        /* TODO: Submit grower data */
                        handleCloseDialog();
                      }}
                    >
                      {editingGrowerId ? "Update" : "Submit"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex gap-3 items-center justify-between bg-white p-3 rounded-lg border shadow-sm">
            {/* Filter Icon with Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5">
                  <Filter className="h-4 w-4" />
                  <span className="text-xs">Filter</span>
                  {activeFilterCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="h-4 px-1.5 text-[10px]"
                    >
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
                        onValueChange={(v) =>
                          setFilters({ ...filters, unit: v })
                        }
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

                    {/* Block Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Block</Label>
                      <Select
                        value={filters.block}
                        onValueChange={(v) =>
                          setFilters({ ...filters, block: v })
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="All Blocks" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Blocks</SelectItem>
                          <SelectItem value="block-1">Block 1</SelectItem>
                          <SelectItem value="block-2">Block 2</SelectItem>
                          <SelectItem value="block-3">Block 3</SelectItem>
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
                    onClick={() => {
                      setFilters({
                        unit: "all",
                        location: "all",
                        block: "all",
                        village: "all",
                        hybrid: "all",
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
                onClick={() => {
                  setSelectedGrower(grower);
                  setPlotHybridFilter("all");
                  setPlotStageFilter("all");
                  setPlotSearchQuery("");
                }}
                className={`cursor-pointer transition-all active:scale-[0.98] ${selectedGrower?.id === grower.id ? "border-[#10B981] ring-2 ring-[#10B981]/20 bg-green-50/50" : ""}`}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-400 font-mono mb-1">
                          {(() => {
                            const getInitials = (name: string) => {
                              return name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase();
                            };
                            const state = "PB";
                            const city = grower.region.toUpperCase();
                            const village = grower.village.toUpperCase();
                            const initials = getInitials(grower.name);
                            return `${state}/${city}/${village}/${initials}`;
                          })()}
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
      )}
      <AddPlotWizard
        isOpen={isAddPlotWizardOpen}
        onClose={() => setIsAddPlotWizardOpen(false)}
        selectedRegion={selectedRegion}
      />

      {/* Bulk Upload Dialog */}
      <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
        <DialogContent className="max-w-full h-full m-0 rounded-none sm:max-w-lg sm:h-auto sm:m-6 sm:rounded-lg">
          <DialogHeader className="px-4 pt-4">
            <DialogTitle className="text-xl">Bulk Upload Growers</DialogTitle>
            <DialogDescription>
              Download the template, fill in the grower details, and upload the
              completed file.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="space-y-6 py-4">
              {/* Download Template Section */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Step 1: Download Template
                </Label>
                <div className="border-2 border-dashed border-[#10B981] rounded-lg p-4 bg-green-50">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-[#10B981] rounded-lg flex items-center justify-center shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-6 w-6 text-white"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">Growers_Template.xlsx</p>
                        <p className="text-xs text-slate-600">
                          Excel template with required fields
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="default"
                      className="w-full h-12 bg-[#10B981] hover:bg-[#0e9870]"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 mr-2"
                      >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" x2="12" y1="15" y2="3" />
                      </svg>
                      Download Template
                    </Button>
                  </div>
                </div>
              </div>

              {/* Upload File Section */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Step 2: Upload Completed File
                </Label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 bg-slate-50 active:bg-slate-100 transition-colors">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <Upload className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="font-medium mb-1">Tap to upload file</p>
                    <p className="text-sm text-slate-500 mb-4">
                      Excel files (.xlsx, .xls) up to 10MB
                    </p>
                    <Input
                      type="file"
                      className="hidden"
                      id="bulk-upload-file"
                      accept=".xlsx,.xls"
                    />
                    <label htmlFor="bulk-upload-file" className="w-full">
                      <Button variant="outline" size="lg" className="w-full">
                        Browse Files
                      </Button>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 px-4 pb-4 sm:flex-row">
            <Button
              className="w-full h-12 bg-[#10B981] hover:bg-[#0e9870] sm:w-auto"
              onClick={() => setIsBulkUploadOpen(false)}
            >
              Upload & Process
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 sm:w-auto"
              onClick={() => setIsBulkUploadOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
