import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "./ui/sheet";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import {
  Map as MapIcon,
  Layers,
  History,
  PenTool,
  MousePointer2,
  AlertTriangle,
  CheckCircle2,
  Save,
  Download,
  Upload,
  Maximize2,
  Minimize2,
  AlertOctagon,
  Plus,
  Minus,
  MapPin,
  Footprints,
  Hexagon,
  Search as SearchIcon,
  X,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { MOCK_GROWERS } from "./data/mockData";
import { Grower } from "./data/mockData";

interface AddPlotWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  initialData?: any;
  selectedRegion?: string;
  initialStep?: 1 | 2 | 3; // Add initialStep prop
}

export function AddPlotWizard({
  isOpen,
  onClose,
  onSave,
  initialData,
  selectedRegion = "all",
  initialStep = 1,
}: AddPlotWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(initialStep); // Use initialStep instead of hardcoded 1
  const [isolationError, setIsolationError] = useState(false);
  const [isStep1Expanded, setIsStep1Expanded] = useState(true);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  // Helper function to convert region value to display name
  const getStateDisplayName = (regionValue: string): string => {
    const stateMap: Record<string, string> = {
      punjab: "Punjab",
      haryana: "Haryana",
      "uttar-pradesh": "Uttar Pradesh",
      maharashtra: "Maharashtra",
      gujarat: "Gujarat",
      rajasthan: "Rajasthan",
    };
    return stateMap[regionValue] || "";
  };

  // Pre-fill state if a specific region is selected
  const initialState =
    selectedRegion !== "all"
      ? getStateDisplayName(selectedRegion)
      : initialData?.state || "";

  const [formData, setFormData] = useState({
    grower: initialData?.grower || "",
    fieldAssistant: initialData?.fieldAssistant || "",
    state: initialState,
    district: initialData?.district || "",
    taluka: initialData?.taluka || "",
    village: initialData?.village || "",
    hybrid: initialData?.hybrid || "",
    purpose: initialData?.purpose || "",
    irrigation: initialData?.irrigation || "",
    soilMoisture: initialData?.soilMoisture || "",
    isolationObserved: initialData?.isolationObserved || "",
    crop: initialData?.crop || "",
    sowingDate: initialData?.sowingDate || "",
    estimatedAcreage: initialData?.estimatedAcreage || "",
  });

  // Grower Selection Modal States
  const [showGrowerModal, setShowGrowerModal] = useState(false);
  const [showCreateGrowerDialog, setShowCreateGrowerDialog] = useState(false);
  const [growerMode, setGrowerMode] = useState<
    "select" | "search" | "create" | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"name" | "phone" | "pan">(
    "name",
  );
  const [searchResults, setSearchResults] = useState<Grower[]>([]);
  const [selectedExistingGrower, setSelectedExistingGrower] =
    useState<Grower | null>(null);
  const [showNoResultsMessage, setShowNoResultsMessage] = useState(false);

  // Create New Grower Form State
  const [newGrowerData, setNewGrowerData] = useState({
    name: "",
    age: "",
    fathersName: "",
    phone: "",
    alternatePhone: "",
    panNumber: "",
    village: "",
    cropType: "",
    unit: "",
    territory: "",
    location: "",
    block: "",
    panCardFile: "",
    farmerCategory: "",
  });

  const [selectedCropType, setSelectedCropType] = useState("");

  // Grower to State mapping
  const growerStateMap: Record<string, string> = {
    "ramesh-kumar": "Maharashtra",
    "suresh-patel": "Maharashtra",
    "anita-singh": "Telangana",
    "vikram-reddy": "Telangana",
    "priya-sharma": "Andhra Pradesh",
    "rajesh-gupta": "Maharashtra",
    "amit-verma": "Telangana",
    "sneha-patil": "Maharashtra",
    "rahul-mehta": "Andhra Pradesh",
    "kavita-rao": "Telangana",
    "arjun-singh": "Maharashtra",
    "meera-iyer": "Andhra Pradesh",
    "deepak-kumar": "Telangana",
    "sunita-williams": "Maharashtra",
    "vijay-kumar": "Andhra Pradesh",
  };

  // Step 2 States
  const [mapYear, setMapYear] = useState("2024");
  const [showLayers, setShowLayers] = useState(true);
  const [drawingMode, setDrawingMode] = useState<"none" | "auto" | "manual">(
    "none",
  );
  const [hasErrors, setHasErrors] = useState(true); // Mocking initial errors for Step 2.1
  const [plotType, setPlotType] = useState<"new" | "existing">("new");

  // Update step when initialStep changes and wizard is opened
  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      setIsolationError(false); // Reset error state when wizard opens
    }
  }, [isOpen, initialStep]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1) {
      // Show grower selection modal instead of directly going to step 2
      setShowGrowerModal(true);
      setGrowerMode("select");
      return;
    }
    if (step === 2) {
      if (formData.isolationObserved === "no") {
        setIsolationError(true);
        return;
      }
      setStep(3);
    }
  };

  // Search for existing grower
  const handleSearchGrower = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowNoResultsMessage(false);
      return;
    }

    const results = MOCK_GROWERS.filter((grower) => {
      if (searchType === "name") {
        return grower.name.toLowerCase().includes(searchQuery.toLowerCase());
      } else if (searchType === "phone") {
        return grower.phone.includes(searchQuery);
      } else if (searchType === "pan") {
        return grower.panNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      }
      return false;
    });

    setSearchResults(results);
    setShowNoResultsMessage(results.length === 0);
  };

  // Select an existing grower
  const handleSelectGrowerFromSearch = (grower: Grower) => {
    setSelectedExistingGrower(grower);
    setFormData({
      ...formData,
      grower: grower.name, // Fill grower name for dropdown
      village: grower.village,
      fieldAssistant: "rajiv-sharma", // Logged-in FDO
    });
    setShowGrowerModal(false);
    setGrowerMode("select");
    setStep(2); // Move to Field Details
  };

  // Create new grower
  const handleCreateNewGrower = () => {
    if (!newGrowerData.name || !newGrowerData.phone || !newGrowerData.village) {
      alert("Please fill in required fields");
      return;
    }

    // Create new grower object
    const createdGrower: Grower = {
      id: `grower-${Date.now()}`,
      name: newGrowerData.name,
      age: parseInt(newGrowerData.age) || 0,
      fathersName: newGrowerData.fathersName,
      phone: newGrowerData.phone,
      village: newGrowerData.village,
      region: "Maharashtra", // Default, can be updated
      category: "Medium",
      plots: [],
      yieldForecast: 0,
      image: "",
      panNumber: newGrowerData.panNumber,
    };

    // Fill form with created grower details
    setFormData({
      ...formData,
      grower: createdGrower.name,
      village: createdGrower.village,
      fieldAssistant: "rajiv-sharma",
    });

    setShowCreateGrowerDialog(false);
    setGrowerMode("select");
    setSelectedCropType("");
    setNewGrowerData({
      name: "",
      age: "",
      fathersName: "",
      phone: "",
      alternatePhone: "",
      panNumber: "",
      village: "",
      cropType: "",
      unit: "",
      territory: "",
      location: "",
      block: "",
      panCardFile: "",
      farmerCategory: "",
    });
    setStep(2); // Move to Field Details
  };

  // Skip measurement button handler
  const handleSkipMeasurement = () => {
    setShowGrowerModal(true);
    setGrowerMode("select");
  };

  const handleIsolationChange = (value: string) => {
    setFormData({ ...formData, isolationObserved: value });
    if (value === "yes") setIsolationError(false);
  };

  // Grower Selection Modal Component
  const GrowerSelectionModal = () => (
    <>
      {/* Select Grower Modal - Using Sheet like Filter Panel */}
      <Sheet
        open={showGrowerModal && growerMode === "select"}
        onOpenChange={(open) => {
          if (!open) setShowGrowerModal(false);
        }}
      >
        <SheetContent
          side="bottom"
          className="rounded-t-2xl max-h-[85vh] p-0 overflow-hidden flex flex-col"
        >
          <div className="px-5 py-4 border-b bg-white flex items-center justify-between flex-shrink-0">
            <SheetTitle className="text-base font-semibold text-slate-900">
              Select Grower
            </SheetTitle>
            <SheetDescription className="sr-only">
              Tag to existing grower or create new grower
            </SheetDescription>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
            <p className="text-sm text-slate-600 mb-4">
              Do you want to tag an existing grower or create a new one?
            </p>
            <Button
              className="w-full h-12 bg-[#4CAF50] hover:bg-[#388E3C] text-white"
              onClick={() => {
                setGrowerMode("search");
                setSearchQuery("");
                setSearchResults([]);
                setShowNoResultsMessage(false);
              }}
            >
              Tag to Existing Grower
            </Button>
            <Button
              variant="outline"
              className="w-full h-12"
              onClick={() => {
                setShowGrowerModal(false);
                setShowCreateGrowerDialog(true);
                setNewGrowerData({
                  name: "",
                  age: "",
                  fathersName: "",
                  phone: "",
                  panNumber: "",
                  village: "",
                });
              }}
            >
              Create New Grower
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Search Grower Module - Using Sheet like Filter Panel */}
      <Sheet
        open={showGrowerModal && growerMode === "search"}
        onOpenChange={(open) => {
          if (!open) {
            setShowGrowerModal(false);
            setGrowerMode("select");
          }
        }}
      >
        <SheetContent
          side="bottom"
          className="rounded-t-2xl max-h-[85vh] p-0 overflow-hidden flex flex-col"
        >
          <div className="px-5 py-4 border-b bg-white flex items-center justify-between flex-shrink-0">
            <SheetTitle className="text-base font-semibold text-slate-900">
              Search Grower
            </SheetTitle>
            <SheetDescription className="sr-only">
              Search for existing grower by name, phone, or PAN
            </SheetDescription>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
            {/* Search Type Selection */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Search By
              </p>
              <div className="flex gap-2">
                <Button
                  variant={searchType === "name" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSearchType("name")}
                  className={
                    searchType === "name"
                      ? "bg-[#4CAF50] hover:bg-[#4CAF50]"
                      : ""
                  }
                >
                  Name
                </Button>
                <Button
                  variant={searchType === "phone" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSearchType("phone")}
                  className={
                    searchType === "phone"
                      ? "bg-[#4CAF50] hover:bg-[#4CAF50]"
                      : ""
                  }
                >
                  Phone
                </Button>
                <Button
                  variant={searchType === "pan" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSearchType("pan")}
                  className={
                    searchType === "pan"
                      ? "bg-[#4CAF50] hover:bg-[#4CAF50]"
                      : ""
                  }
                >
                  PAN
                </Button>
              </div>
            </div>

            {/* Search Input */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Enter {searchType}
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder={`Search by ${searchType}...`}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowNoResultsMessage(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchGrower();
                    }
                  }}
                  className="h-10 flex-1"
                  autoFocus
                />
                <Button
                  onClick={handleSearchGrower}
                  className="bg-[#4CAF50] hover:bg-[#388E3C] h-10 w-10 p-0"
                >
                  <SearchIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                  Results ({searchResults.length})
                </p>
                <div className="space-y-2">
                  {searchResults.map((grower) => (
                    <div
                      key={grower.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-green-50 transition-colors"
                      onClick={() => handleSelectGrowerFromSearch(grower)}
                    >
                      <p className="font-medium text-slate-900">
                        {grower.name}
                      </p>
                      <p className="text-sm text-slate-500">{grower.phone}</p>
                      <p className="text-xs text-slate-400">{grower.village}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results Message */}
            {showNoResultsMessage && (
              <Alert>
                <AlertOctagon className="h-4 w-4" />
                <AlertTitle>No Grower Found</AlertTitle>
                <AlertDescription>
                  No existing grower found.{" "}
                  <button
                    onClick={() => {
                      setShowGrowerModal(false);
                      setShowCreateGrowerDialog(true);
                      setGrowerMode("select");
                    }}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Click here to create new grower
                  </button>
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="px-5 py-4 border-t bg-white flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowGrowerModal(false);
                setGrowerMode("select");
              }}
            >
              Back
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowGrowerModal(false);
                setShowCreateGrowerDialog(true);
                setGrowerMode("select");
              }}
            >
              Create New
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Create New Grower Modal - Full Page Dialog Like Growers.tsx */}
      <Dialog
        open={showCreateGrowerDialog}
        onOpenChange={(open) => {
          setShowCreateGrowerDialog(open);
        }}
      >
        <DialogContent className="max-w-full h-full m-0 rounded-none p-0">
          <DialogTitle className="sr-only">Create New Grower</DialogTitle>
          <DialogDescription className="sr-only">
            Fill in the grower details
          </DialogDescription>

          {/* Green Header matching AddPlotWizard */}
          <div className="px-4 py-3 border-b bg-[rgb(76,175,80)] text-white flex justify-between items-center">
            <div className="flex-1">
              <h2 className="text-lg font-bold leading-none">Add New Grower</h2>
              <p className="text-xs text-[rgb(255,255,255)] mt-1">
                Fill in the grower details
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Create Grower Form - Matching Growers.tsx Design */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Grower Preferred Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Enter full name"
                  value={newGrowerData.name}
                  onChange={(e) => {
                    e.preventDefault();
                    setNewGrowerData({
                      ...newGrowerData,
                      name: e.target.value,
                    });
                  }}
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Grower Agreement Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="Enter full name"
                  value={newGrowerData.name}
                  onChange={(e) => {
                    e.preventDefault();
                    setNewGrowerData({
                      ...newGrowerData,
                      name: e.target.value,
                    });
                  }}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Grower Age</Label>
                <Input
                  type="number"
                  placeholder="Enter age"
                  value={newGrowerData.age}
                  onChange={(e) => {
                    e.preventDefault();
                    setNewGrowerData({ ...newGrowerData, age: e.target.value });
                  }}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">Father's Name</Label>
                <Input
                  type="text"
                  placeholder="Enter father's name"
                  value={newGrowerData.fathersName}
                  onChange={(e) => {
                    e.preventDefault();
                    setNewGrowerData({
                      ...newGrowerData,
                      fathersName: e.target.value,
                    });
                  }}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={newGrowerData.phone}
                  onChange={(e) => {
                    e.preventDefault();
                    setNewGrowerData({
                      ...newGrowerData,
                      phone: e.target.value,
                    });
                  }}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Alternate Number (Optional)
                </Label>
                <Input
                  type="tel"
                  placeholder="+91"
                  value={newGrowerData.alternatePhone}
                  onChange={(e) => {
                    e.preventDefault();
                    setNewGrowerData({
                      ...newGrowerData,
                      alternatePhone: e.target.value,
                    });
                  }}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Crop Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedCropType}
                  onValueChange={(value) => {
                    setSelectedCropType(value);
                    setNewGrowerData({
                      ...newGrowerData,
                      cropType: value,
                    });
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
                    <Label className="text-base font-medium">
                      Unit <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newGrowerData.unit}
                      onValueChange={(value) =>
                        setNewGrowerData({
                          ...newGrowerData,
                          unit: value,
                        })
                      }
                    >
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
                    <Label className="text-base font-medium">
                      Territory <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newGrowerData.territory}
                      onValueChange={(value) =>
                        setNewGrowerData({
                          ...newGrowerData,
                          territory: value,
                        })
                      }
                    >
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
                    <Label className="text-base font-medium">
                      Block <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newGrowerData.block}
                      onValueChange={(value) =>
                        setNewGrowerData({
                          ...newGrowerData,
                          block: value,
                        })
                      }
                    >
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
              ) : selectedCropType ? (
                <>
                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Unit <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newGrowerData.unit}
                      onValueChange={(value) =>
                        setNewGrowerData({
                          ...newGrowerData,
                          unit: value,
                        })
                      }
                    >
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
                    <Label className="text-base font-medium">
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newGrowerData.location}
                      onValueChange={(value) =>
                        setNewGrowerData({
                          ...newGrowerData,
                          location: value,
                        })
                      }
                    >
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
                    <Label className="text-base font-medium">
                      Block <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={newGrowerData.block}
                      onValueChange={(value) =>
                        setNewGrowerData({
                          ...newGrowerData,
                          block: value,
                        })
                      }
                    >
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
              ) : null}

              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Village <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={newGrowerData.village}
                  onValueChange={(v) =>
                    setNewGrowerData({ ...newGrowerData, village: v })
                  }
                >
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
                <Label className="text-base font-medium">Upload PAN Card</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 justify-start gap-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Choose File</span>
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Farmer Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={newGrowerData.farmerCategory}
                  onValueChange={(value) =>
                    setNewGrowerData({
                      ...newGrowerData,
                      farmerCategory: value,
                    })
                  }
                >
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
            </form>
          </div>

          {/* Footer with same button styling as AddPlotWizard */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-10 text-sm"
                onClick={() => setShowCreateGrowerDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1 h-10 bg-[#4CAF50] hover:bg-[#388E3C] text-sm"
                onClick={() => {
                  handleCreateNewGrower();
                  setShowCreateGrowerDialog(false);
                }}
              >
                Create Grower
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in fade-in slide-in-from-bottom duration-300">
      {showGrowerModal && <GrowerSelectionModal />}
      <div className="px-4 py-3 border-b bg-[rgb(76,175,80)] text-white flex justify-between items-center">
        <div className="flex-1">
          <h2 className="text-lg font-bold leading-none">Add New Field</h2>
          <p className="text-xs mt-1 text-white/80">Step {step} of 3</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-full">
            <div className="h-1.5 w-1.5 rounded-full bg-[#4CAF50] animate-pulse" />
            <span className="text-[9px] text-[#4CAF50] font-medium">
              Connected
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {step === 2 ? (
          <div className="space-y-4">
            {/* Step 2: Field Details */}
            <div className="space-y-4">
              <div className="pb-2">
                <h3 className="text-lg font-bold">Field Details</h3>
                <p className="text-sm text-slate-500">
                  Fill in the required information
                </p>
              </div>
              {isStep1Expanded && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Grower <span className="text-red-500">*</span>
                    </Label>
                    {formData.grower ? (
                      <div className="h-12 px-4 border rounded-lg bg-slate-50 flex items-center text-base font-medium text-slate-900">
                        {formData.grower}
                        <button
                          onClick={() => {
                            setFormData({
                              ...formData,
                              grower: "",
                              village: "",
                            });
                            setShowGrowerModal(true);
                            setGrowerMode("select");
                          }}
                          className="ml-auto text-xs text-blue-600 hover:text-blue-700 underline"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <Select
                        onValueChange={(v) => {
                          const state = growerStateMap[v] || "";
                          setFormData({ ...formData, grower: v, state: state });
                        }}
                      >
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="Select Grower" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          <SelectItem value="ramesh-kumar">
                            Ramesh Kumar
                          </SelectItem>
                          <SelectItem value="suresh-patel">
                            Suresh Patel
                          </SelectItem>
                          <SelectItem value="anita-singh">
                            Anita Singh
                          </SelectItem>
                          <SelectItem value="vikram-reddy">
                            Vikram Reddy
                          </SelectItem>
                          <SelectItem value="priya-sharma">
                            Priya Sharma
                          </SelectItem>
                          <SelectItem value="rajesh-gupta">
                            Rajesh Gupta
                          </SelectItem>
                          <SelectItem value="amit-verma">Amit Verma</SelectItem>
                          <SelectItem value="sneha-patil">
                            Sneha Patil
                          </SelectItem>
                          <SelectItem value="rahul-mehta">
                            Rahul Mehta
                          </SelectItem>
                          <SelectItem value="kavita-rao">Kavita Rao</SelectItem>
                          <SelectItem value="arjun-singh">
                            Arjun Singh
                          </SelectItem>
                          <SelectItem value="meera-iyer">Meera Iyer</SelectItem>
                          <SelectItem value="deepak-kumar">
                            Deepak Kumar
                          </SelectItem>
                          <SelectItem value="sunita-williams">
                            Sunita Williams
                          </SelectItem>
                          <SelectItem value="vijay-kumar">
                            Vijay Kumar
                          </SelectItem>
                          <SelectItem
                            value="manual_entry"
                            className="font-medium text-blue-600 focus:text-blue-700 border-t mt-1"
                          >
                            + Add Manually
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Assigned Field Assistant{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    {formData.fieldAssistant && formData.grower ? (
                      <div className="h-12 px-4 border rounded-lg bg-slate-50 flex items-center text-base font-medium text-slate-900">
                        Rajiv Sharma
                        <button
                          onClick={() => {
                            setFormData({ ...formData, fieldAssistant: "" });
                          }}
                          className="ml-auto text-xs text-blue-600 hover:text-blue-700 underline"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <Select
                        onValueChange={(v) =>
                          setFormData({ ...formData, fieldAssistant: v })
                        }
                      >
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="Select Field Assistant" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          <SelectItem value="rajiv-sharma">
                            Rajiv Sharma
                          </SelectItem>
                          <SelectItem value="amit-patel">Amit Patel</SelectItem>
                          <SelectItem value="neha-desai">Neha Desai</SelectItem>
                          <SelectItem value="sandeep-reddy">
                            Sandeep Reddy
                          </SelectItem>
                          <SelectItem value="pooja-singh">
                            Pooja Singh
                          </SelectItem>
                          <SelectItem value="vikrant-joshi">
                            Vikrant Joshi
                          </SelectItem>
                          <SelectItem value="anjali-mehta">
                            Anjali Mehta
                          </SelectItem>
                          <SelectItem value="karan-verma">
                            Karan Verma
                          </SelectItem>
                          <SelectItem
                            value="manual_entry"
                            className="font-medium text-blue-600 focus:text-blue-700 border-t mt-1"
                          >
                            + Add Manually
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="border-t border-slate-200 my-2"></div>

                  {/* <div className="space-y-2">
                    <Label className="text-base font-medium">
                      State <span className="text-red-500">*</span>
                    </Label>
                    <div className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-base">
                      {formData.state || "Auto-populated from Grower"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      District <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      onValueChange={(v) =>
                        setFormData({ ...formData, district: v })
                      }
                    >
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="district-a">District A</SelectItem>
                        <SelectItem value="district-b">District B</SelectItem>
                        <SelectItem
                          value="manual_entry"
                          className="font-medium text-blue-600 focus:text-blue-700 border-t mt-1"
                        >
                          + Add Manually
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Taluka <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      onValueChange={(v) =>
                        setFormData({ ...formData, taluka: v })
                      }
                    >
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select Taluka" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="taluka-x">Taluka X</SelectItem>
                        <SelectItem value="taluka-y">Taluka Y</SelectItem>
                        <SelectItem
                          value="manual_entry"
                          className="font-medium text-blue-600 focus:text-blue-700 border-t mt-1"
                        >
                          + Add Manually
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Village <span className="text-red-500">*</span>
                    </Label>
                    {formData.village && formData.grower ? (
                      <div className="h-12 px-4 border rounded-lg bg-slate-50 flex items-center text-base font-medium text-slate-900">
                        {formData.village}
                        <button
                          onClick={() => {
                            setFormData({ ...formData, village: "" });
                          }}
                          className="ml-auto text-xs text-blue-600 hover:text-blue-700 underline"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <Select
                        value={formData.village}
                        onValueChange={(v) =>
                          setFormData({ ...formData, village: v })
                        }
                      >
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder="Select Village" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rampur">Rampur</SelectItem>
                          <SelectItem value="lakhanpur">Lakhanpur</SelectItem>
                          <SelectItem value="sultanpur">Sultanpur</SelectItem>
                          <SelectItem value="rajapur">Rajapur</SelectItem>
                          <SelectItem value="govindpur">Govindpur</SelectItem>
                          <SelectItem
                            value="manual_entry"
                            className="font-medium text-blue-600 focus:text-blue-700 border-t mt-1"
                          >
                            + Add Manually
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="border-t border-slate-200 my-2"></div>

                  {/* <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Field Purpose <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      onValueChange={(v) =>
                        setFormData({ ...formData, purpose: v })
                      }
                    >
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select Purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all_hybrids">All Hybrids</SelectItem>
                        <SelectItem value="rice_hybrids">
                          Rice Hybrids
                        </SelectItem>
                        <SelectItem
                          value="manual_entry"
                          className="font-medium text-blue-600 focus:text-blue-700 border-t mt-1"
                        >
                          + Add Manually
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}
                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Irrigation Method <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      onValueChange={(v) =>
                        setFormData({ ...formData, irrigation: v })
                      }
                    >
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="drip">Drip</SelectItem>
                        <SelectItem value="flood">Flood</SelectItem>
                        <SelectItem value="rainfed">Rainfed</SelectItem>
                        <SelectItem
                          value="manual_entry"
                          className="font-medium text-blue-600 focus:text-blue-700 border-t mt-1"
                        >
                          + Add Manually
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Isolation Observed <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center gap-3 h-12 px-4 border rounded-lg bg-white">
                      <button
                        type="button"
                        onClick={() => handleIsolationChange("yes")}
                        className={`flex-1 h-8 rounded-md transition-all ${
                          formData.isolationObserved === "yes"
                            ? "bg-[#4CAF50] text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleIsolationChange("no")}
                        className={`flex-1 h-8 rounded-md transition-all ${
                          formData.isolationObserved === "no"
                            ? "bg-red-500 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 my-2"></div>

                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Crop <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      onValueChange={(v) =>
                        setFormData({ ...formData, crop: v })
                      }
                    >
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select Crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corn">Corn</SelectItem>
                        <SelectItem value="rice">Rice</SelectItem>
                        <SelectItem value="wheat">Wheat</SelectItem>
                        <SelectItem value="cotton">Cotton</SelectItem>
                        <SelectItem value="soybean">Soybean</SelectItem>
                        <SelectItem
                          value="manual_entry"
                          className="font-medium text-blue-600 focus:text-blue-700 border-t mt-1"
                        >
                          + Add Manually
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Hybrid Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      onValueChange={(v) =>
                        setFormData({ ...formData, hybrid: v })
                      }
                    >
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select Hybrid Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super-99">
                          Super-99 (North)
                        </SelectItem>
                        <SelectItem value="rice-gold">
                          Rice-Gold (North)
                        </SelectItem>
                        <SelectItem value="cotton-x">
                          Cotton-X (South)
                        </SelectItem>
                        <SelectItem
                          value="manual_entry"
                          className="font-medium text-blue-600 focus:text-blue-700 border-t mt-1"
                        >
                          + Add Manually
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* <div className="space-y-2">
                    <Label className="text-base font-medium">
                      Estimated Acreage <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter acreage"
                      className="h-12 text-base"
                      value={formData.estimatedAcreage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          estimatedAcreage: e.target.value,
                        })
                      }
                    />
                  </div> */}
                </div>
              )}
              {isolationError && (
                <Alert variant="destructive">
                  <AlertOctagon className="h-4 w-4" />
                  <AlertTitle>Isolation Conflict Detected</AlertTitle>
                  <AlertDescription>
                    This plot cannot be registered for seed production without
                    proper isolation. Please review the field setup.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        ) : step === 1 ? (
          <div className="h-full flex flex-col">
            <div className="pb-2 mb-4">
              <h3 className="text-lg font-bold">Field Mapping</h3>
              <p className="text-sm text-slate-500">
                Choose your mapping method
              </p>
            </div>
            {/* Zoomed Out Field View with Plot Outline */}
            <div className="flex-1 relative overflow-hidden">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1722082840106-c6508ee966ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjBhZ3JpY3VsdHVyYWwlMjBwbG90c3xlbnwxfHx8fDE3NjUzNjc2NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)",
                }}
              ></div>

              {/* Overlay Buttons */}
              <div className="absolute bottom-6 right-6 flex flex-col gap-3">
                <Button
                  size="icon"
                  className="h-14 w-14 rounded-full bg-white hover:bg-white shadow-xl border-2 border-slate-300"
                  onClick={() => setDrawingMode("manual")}
                >
                  <svg
                    className="h-6 w-6 text-[#4CAF50]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 3 L17 4 L21 7 L23 12 L20 17 L18 21 L13 22 L8 20 L4 16 L2 10 L5 6 L8 4 Z" />
                  </svg>
                </Button>

                <Button
                  size="icon"
                  className="h-14 w-14 rounded-full bg-white hover:bg-white shadow-xl border-2 border-slate-300"
                  onClick={() => setDrawingMode("auto")}
                >
                  <MapPin className="h-6 w-6 text-[#4CAF50]" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Step 3: Summary */}
            <div className="pb-2">
              <h3 className="text-lg font-bold">Field Summary</h3>
              <p className="text-sm text-slate-500">
                Review your plot details before submitting
              </p>
            </div>

            {/* Plot Details Summary */}
            <div className="bg-white border rounded-lg p-4 space-y-3">
              <h4 className="font-bold text-base text-[rgb(26,26,26)]">
                Field Details
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-500">Grower</p>
                  <p className="font-medium">
                    {formData.grower || "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Field Assistant</p>
                  <p className="font-medium">
                    {formData.fieldAssistant || "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">State</p>
                  <p className="font-medium">{formData.state || "Not set"}</p>
                </div>
                <div>
                  <p className="text-slate-500">District</p>
                  <p className="font-medium">
                    {formData.district || "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Taluka</p>
                  <p className="font-medium">
                    {formData.taluka || "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Village</p>
                  <p className="font-medium">
                    {formData.village || "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Field Purpose</p>
                  <p className="font-medium">
                    {formData.purpose || "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Irrigation</p>
                  <p className="font-medium">
                    {formData.irrigation || "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Isolation Observed</p>
                  <p className="font-medium">
                    {formData.isolationObserved || "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Crop</p>
                  <p className="font-medium">
                    {formData.crop || "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Hybrid Type</p>
                  <p className="font-medium">
                    {formData.hybrid || "Not selected"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Estimated Acreage</p>
                  <p className="font-medium">
                    {formData.estimatedAcreage || "Not set"}
                  </p>
                </div>
              </div>
            </div>

            {/* Plot Map Summary */}
            <div className="bg-white border rounded-lg p-4 space-y-3">
              <h4 className="font-bold text-base text-[rgb(26,26,26)]">
                Field Map
              </h4>

              {/* Map Preview */}
              <div className="relative h-48 bg-slate-100 rounded-lg overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url(https://images.unsplash.com/photo-1726433890104-dcee8e781896?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZXJpYWwlMjBmYXJtJTIwZmllbGQlMjBib3VuZGFyeXxlbnwxfHx8fDE3NjQ5MzYyMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)",
                  }}
                ></div>
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <polygon
                    points="25,35 70,30 75,65 30,70"
                    fill="rgba(76, 175, 80, 0.15)"
                    stroke="rgba(76, 175, 80, 0.8)"
                    strokeWidth="0.8"
                    strokeDasharray="2,1"
                  />
                </svg>
              </div>

              {/* Audited Acreage */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-slate-600 mb-1">Audited Acreage</p>
                <p className="text-3xl font-bold text-[#4CAF50]">2.45</p>
                <p className="text-xs text-slate-500 mt-1">acres</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-white shadow-2xl">
        <div className="flex gap-2">
          {step === 1 ? (
            <>
              <Button
                variant="ghost"
                className="h-10 text-sm px-3"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-10 text-sm"
                onClick={handleSkipMeasurement}
              >
                Skip Measurement
              </Button>
              <Button
                className="flex-1 h-10 bg-[#4CAF50] hover:bg-[#388E3C] text-sm"
                onClick={handleNext}
              >
                Proceed
              </Button>
            </>
          ) : step === 2 ? (
            <>
              <Button
                variant="ghost"
                className="h-10 text-sm px-3"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                variant="outline"
                className="h-10 text-sm px-3"
                onClick={onClose}
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                className="flex-1 h-10 text-sm bg-[#4CAF50] hover:bg-[#388E3C]"
                onClick={handleNext}
              >
                Proceed
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="h-10 text-sm px-3"
                onClick={() => setStep(2)}
              >
                Back
              </Button>
              <Button
                variant="outline"
                className="h-10 text-sm px-3"
                onClick={onClose}
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                className="flex-1 h-10 text-sm bg-[#4CAF50] hover:bg-[#388E3C]"
                onClick={() => {
                  onSave?.(formData);
                  onClose();
                }}
              >
                Submit
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
