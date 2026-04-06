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

  // Plot details state
  const [isMediaSectionOpen, setIsMediaSectionOpen] = useState(true);
  const [isMediaSaved, setIsMediaSaved] = useState(false);
  const [mediaEntries, setMediaEntries] = useState<any[]>([]);

  const [filters, setFilters] = useState({
    state: "all",
    district: "all",
    taluka: "all",
    village: "all",
    farmerCategory: "all",
  });

  const [auditFilter, setAuditFilter] = useState<"all" | "audited" | "pending">(
    "all",
  );

  const [plotHybridFilter, setPlotHybridFilter] = useState("all");
  const [plotStageFilter, setPlotStageFilter] = useState("all");

  const activeFilterCount = [
    filters.state !== "all",
    filters.district !== "all",
    filters.taluka !== "all",
    filters.village !== "all",
    filters.farmerCategory !== "all",
  ].filter(Boolean).length;

  const filteredGrowers = MOCK_GROWERS.filter((g) => {
    const matchesSearch =
      g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.panNumber.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filters.state !== "all" && filters.state !== "punjab") return false;
    if (filters.district !== "all" && filters.district !== "amritsar")
      return false;
    if (filters.taluka !== "all" && filters.taluka !== "beas") return false;
    if (
      filters.village !== "all" &&
      g.village.toLowerCase() !== filters.village
    )
      return false;
    if (filters.farmerCategory !== "all") {
      // Add farmer category logic when available in mock data
    }

    return true;
  });

  // Get pending advisory for selected plot
  const pendingAdvisory = selectedPlot
    ? MOCK_ADVISORIES.find(
        (a) => a.plotId === selectedPlot.id && a.status === "Pending",
      )
    : null;

  const AddGrowerForm = () => (
    <div className="space-y-4 py-2">
      {addStep === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div className="space-y-2">
            <Label className="text-base">Grower Preferred Name *</Label>
            <Input placeholder="Enter full name" className="h-12 text-base" />
          </div>
          <div className="space-y-2">
            <Label className="text-base">Grower Agreement Name *</Label>
            <Input placeholder="Enter full name" className="h-12 text-base" />
          </div>

          <div className="space-y-2">
            <Label className="text-base">Grower Age</Label>
            <Input
              placeholder="Enter age"
              type="number"
              className="h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base">Father's Name</Label>
            <Input
              placeholder="Enter father's name"
              className="h-12 text-base"
            />
          </div>

          {/* Removed Upload Profile Photo section */}

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input placeholder="+91 98765 43210" className="h-12" />
          </div>

          <div className="space-y-2">
            <Label className="text-base">Alternate Number (Optional)</Label>
            <Input placeholder="+91" type="tel" className="h-12 text-base" />
          </div>

          <div className="space-y-2">
            <Label className="text-base">Crop Type *</Label>
            <Select
              value={selectedCropType}
              onValueChange={setSelectedCropType}
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
                <Select>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unit1">Unit 1</SelectItem>
                    <SelectItem value="unit2">Unit 2</SelectItem>
                    <SelectItem value="unit3">Unit 3</SelectItem>
                    <SelectItem value="unit4">Unit 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Territory *</Label>
                <Select>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select Territory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="territory1">Territory 1</SelectItem>
                    <SelectItem value="territory2">Territory 2</SelectItem>
                    <SelectItem value="territory3">Territory 3</SelectItem>
                    <SelectItem value="territory4">Territory 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Block *</Label>
                <Select>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select Block" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="block1">Block 1</SelectItem>
                    <SelectItem value="block2">Block 2</SelectItem>
                    <SelectItem value="block3">Block 3</SelectItem>
                    <SelectItem value="block4">Block 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label className="text-base">Unit *</Label>
                <Select>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unit1">Unit 1</SelectItem>
                    <SelectItem value="unit2">Unit 2</SelectItem>
                    <SelectItem value="unit3">Unit 3</SelectItem>
                    <SelectItem value="unit4">Unit 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Location *</Label>
                <Select>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="location1">Location 1</SelectItem>
                    <SelectItem value="location2">Location 2</SelectItem>
                    <SelectItem value="location3">Location 3</SelectItem>
                    <SelectItem value="location4">Location 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Block *</Label>
                <Select>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder="Select Block" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="block1">Block 1</SelectItem>
                    <SelectItem value="block2">Block 2</SelectItem>
                    <SelectItem value="block3">Block 3</SelectItem>
                    <SelectItem value="block4">Block 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label className="text-base">Village *</Label>
            <Select>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select Village" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rampur">Rampur</SelectItem>
                <SelectItem value="lakhanpur">Lakhanpur</SelectItem>
                <SelectItem value="village3">Village 3</SelectItem>
                <SelectItem value="village4">Village 4</SelectItem>
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
            <Select>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
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
            </TabsContent>

            {/* Advisory Tasks Tab */}
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

          {/* Grower Details Content */}
          <div className="flex-1 overflow-y-auto space-y-4 pb-20">
            {/* Grower Details Card */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-slate-900">Grower Details</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Grower Name</p>
                    <p className="font-medium text-slate-900">
                      {selectedGrower.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Grower Age</p>
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
                      {selectedGrower.village}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="font-medium text-slate-900">
                      {selectedGrower.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Total Plots</p>
                    <p className="font-medium text-slate-900">
                      {selectedGrower.plots.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Crop</p>
                    <p className="font-medium text-slate-900">
                      {MOCK_PLOTS.find((p) => p.growerId === selectedGrower.id)
                        ?.crop || "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Associated Plots Card */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">
                    Associated Plots
                  </h3>
                </div>

                {/* Filter Options */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Hybrid</Label>
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

                  <div className="space-y-1">
                    <Label className="text-xs font-medium">Current Stage</Label>
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
                </div>

                <div className="space-y-2">
                  {selectedGrower.plots
                    .map((plotId) => MOCK_PLOTS.find((p) => p.id === plotId))
                    .filter((plotData) => {
                      if (
                        plotHybridFilter !== "all" &&
                        plotData?.hybrid !== plotHybridFilter
                      ) {
                        return false;
                      }
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
                                {/* Audit Status Badge - Commented Out */}
                                {/* {plotData?.auditStatus === "audited" ? (
                                  <Badge className="bg-[#4CAF50] hover:bg-[#4CAF50] text-white flex items-center gap-1 shrink-0">
                                    <CheckCircle2 className="h-3 w-3" />
                                    Audited
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="secondary"
                                    className="shrink-0 bg-slate-200 text-slate-700 hover:bg-slate-200"
                                  >
                                    Audit Pending
                                  </Badge>
                                )} */}
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="icon" className="h-9 w-9">
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit p-2" align="end">
                  <div className="space-y-1 w-fit">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        setIsAddGrowerOpen(true);
                      }}
                    >
                      <UserPlus className="h-4 w-4" />
                      New Grower
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <Dialog
              open={isAddGrowerOpen}
              onOpenChange={(open) => {
                setIsAddGrowerOpen(open);
                setAddStep(1);
                setSelectedCropType("Corn");
              }}
            >
              <DialogContent className="max-w-full h-full m-0 rounded-none p-0">
                <DialogTitle className="sr-only">Add New Grower</DialogTitle>
                <DialogDescription className="sr-only">
                  Wizard to add a new grower and their plots.
                </DialogDescription>

                {/* Green Header matching AddPlotWizard */}
                <div className="px-4 py-3 border-b bg-[rgb(76,175,80)] text-white flex justify-between items-center">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold leading-none">
                      Add New Grower
                    </h2>
                    <p className="text-xs text-[rgb(255,255,255)] mt-1">
                      Fill in the grower details
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
                      onClick={() => setIsAddGrowerOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 h-10 bg-[#4CAF50] hover:bg-[#388E3C] text-sm"
                      onClick={() => setIsAddGrowerOpen(false)}
                    >
                      Submit
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
                <Button variant="outline" size="sm" className="h-8 gap-2">
                  <Filter className="h-4 w-4" />
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
                          <SelectValue placeholder="All States" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All States</SelectItem>
                          <SelectItem value="punjab">Punjab</SelectItem>
                          <SelectItem value="haryana">Haryana</SelectItem>
                          <SelectItem value="maharashtra">
                            Maharashtra
                          </SelectItem>
                          <SelectItem value="karnataka">Karnataka</SelectItem>
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
                          <SelectValue placeholder="All Districts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Districts</SelectItem>
                          <SelectItem value="amritsar">Amritsar</SelectItem>
                          <SelectItem value="ludhiana">Ludhiana</SelectItem>
                          <SelectItem value="jalandhar">Jalandhar</SelectItem>
                          <SelectItem value="patiala">Patiala</SelectItem>
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
                          <SelectValue placeholder="All Talukas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Talukas</SelectItem>
                          <SelectItem value="beas">Beas</SelectItem>
                          <SelectItem value="taluka1">Taluka 1</SelectItem>
                          <SelectItem value="taluka2">Taluka 2</SelectItem>
                          <SelectItem value="taluka3">Taluka 3</SelectItem>
                          <SelectItem value="taluka4">Taluka 4</SelectItem>
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
                          <SelectItem value="village3">Village 3</SelectItem>
                          <SelectItem value="village4">Village 4</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {/* Farmer Category Filter */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Farmer Category
                      </Label>
                      <Select
                        value={filters.farmerCategory}
                        onValueChange={(v) =>
                          setFilters({ ...filters, farmerCategory: v })
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
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
                        state: "all",
                        district: "all",
                        taluka: "all",
                        village: "all",
                        farmerCategory: "all",
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
                onClick={() => setSelectedGrower(grower)}
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
                        <span>{grower.plots.length} Plots</span>
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
