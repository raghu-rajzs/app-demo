import React, { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { ScrollArea } from "./ui/scroll-area";
import {
  ArrowLeft,
  Search as SearchIcon,
  AlertOctagon,
  Plus,
  Upload,
} from "lucide-react";
import { MOCK_GROWERS, Grower } from "./data/mockData";

interface FieldAdditionPageProps {
  initialData?: any;
  onClose: () => void;
  onSave?: (data: any) => void;
  isEditMode?: boolean;
}

export function FieldAdditionPage({
  initialData,
  onClose,
  onSave,
  isEditMode = false,
}: FieldAdditionPageProps) {
  // Field form data
  const [formData, setFormData] = useState({
    grower: initialData?.grower || "",
    growerId: initialData?.growerId || "",
    fieldAssistant: initialData?.fieldAssistant || "rajiv-sharma", // Current logged-in user
    village: initialData?.village || "",
    unit: initialData?.unit || "",
    location: initialData?.location || "",
    irrigationMethod: initialData?.irrigationMethod || "",
    isolationObserved: initialData?.isolationObserved || "",
    crop: initialData?.crop || "",
    hybrid: initialData?.hybrid || "",
    estimatedAcreage: initialData?.estimatedAcreage || "",
    currentStage: initialData?.currentStage || "Sowing",
  });

  // Grower search states
  const [showGrowerSearch, setShowGrowerSearch] = useState(
    !initialData?.grower,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"name" | "phone" | "pan">(
    "name",
  );
  const [searchResults, setSearchResults] = useState<Grower[]>([]);
  const [showNoResultsMessage, setShowNoResultsMessage] = useState(false);
  const [showCreateGrowerDialog, setShowCreateGrowerDialog] = useState(false);

  // Create grower form
  const [newGrowerData, setNewGrowerData] = useState({
    preferredName: "",
    agreementName: "",
    age: "",
    fathersName: "",
    phone: "",
    referenceNumber: "",
    panNumber: "",
    panImageFile: null as File | null,
    aadhaarNumber: "",
    aadhaarImageFile: null as File | null,
    village: "",
    alternatePhone: "",
    cropType: "",
    unit: "",
    location: "",
    block: "",
    farmerCategory: "",
  });

  const [selectedCropType, setSelectedCropType] = useState("");

  // Control variable: set to false to show "Vegetative" instead of "Transplanting"
  const DISPLAY_TRANSPLANTING_LABEL = true;

  // Field stages — dynamic based on crop
  const CORN_FIELD_STAGES = [
    { id: "pre-sowing", label: "Pre-Sowing" },
    { id: "sowing", label: "Sowing" },
    {
      id: "vegetative",
      label: DISPLAY_TRANSPLANTING_LABEL ? "Transplanting" : "Vegetative",
    },
    { id: "flowering", label: "Flowering" },
    { id: "quality", label: "Quality" },
    { id: "pre-harvest", label: "Pre-Harvest" },
    { id: "harvest", label: "Harvest" },
    { id: "dispatch", label: "Dispatch" },
    { id: "ccp", label: "CCP" },
  ];

  const RICE_FIELD_STAGES = [
    { id: "area-measurement", label: "Area Measurement" },
    { id: "field-preparation", label: "Field Preparation" },
    { id: "sowing", label: "Sowing" },
    { id: "transplanting", label: "Transplanting" },
    { id: "isolation", label: "Isolation" },
    { id: "fertilizer-management", label: "Fertilizer Management" },
    { id: "chemical-application", label: "Chemical Application" },
    { id: "agronomy", label: "Agronomy" },
    { id: "ppi-observation", label: "PPI Observation" },
    { id: "flowering", label: "Flowering" },
    { id: "rouging", label: "Rouging" },
    { id: "chopping-harvesting", label: "Chopping & Harvesting" },
    { id: "dispatch", label: "Dispatch" },
    { id: "post-dispatch", label: "Post Dispatch" },
  ];

  const FIELD_STAGES =
    formData.crop === "rice" ? RICE_FIELD_STAGES : CORN_FIELD_STAGES;

  // Search for existing grower
  const handleSearchGrower = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowNoResultsMessage(false);
      return;
    }

    const results = MOCK_GROWERS.filter((grower) => {
      const query = searchQuery.toLowerCase();
      return (
        grower.name.toLowerCase().includes(query) ||
        grower.phone.includes(searchQuery) ||
        grower.panNumber.toLowerCase().includes(query)
      );
    });

    setSearchResults(results);
    setShowNoResultsMessage(results.length === 0);
  };

  // Select an existing grower
  const handleSelectGrowerFromSearch = (grower: Grower) => {
    setFormData({
      ...formData,
      grower: grower.name,
      growerId: grower.id,
      village: grower.village,
      unit: grower.unit,
      location: grower.location,
    });
    setShowGrowerSearch(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Create new grower
  const handleCreateNewGrower = () => {
    if (
      !newGrowerData.preferredName ||
      !newGrowerData.referenceNumber ||
      !newGrowerData.village
    ) {
      alert(
        "Please fill in required fields: Preferred Name, Reference Number, and Village",
      );
      return;
    }

    const createdGrower: Grower = {
      id: `grower-${Date.now()}`,
      name: newGrowerData.preferredName,
      agreementName: newGrowerData.agreementName || newGrowerData.preferredName,
      age: parseInt(newGrowerData.age) || 0,
      fathersName: newGrowerData.fathersName,
      phone: newGrowerData.phone,
      alternatePhone: newGrowerData.alternatePhone,
      village: newGrowerData.village,
      region: "Maharashtra",
      block: newGrowerData.block,
      unit: newGrowerData.unit || "Unit North",
      location: newGrowerData.location || "Location A",
      cropType: (newGrowerData.cropType || "Corn") as "Corn" | "Rice",
      category:
        (newGrowerData.farmerCategory as "Small" | "Medium" | "Large") ||
        "Medium",
      plots: [],
      yieldForecast: 0,
      image: "",
      panNumber: newGrowerData.panNumber,
      referenceNumber: newGrowerData.referenceNumber,
      aadhaarNumber: newGrowerData.aadhaarNumber,
    };

    setFormData({
      ...formData,
      grower: createdGrower.name,
      growerId: createdGrower.id,
      village: createdGrower.village,
      unit: createdGrower.unit,
      location: createdGrower.location,
    });

    setShowCreateGrowerDialog(false);
    setShowGrowerSearch(false);
    setNewGrowerData({
      preferredName: "",
      agreementName: "",
      age: "",
      fathersName: "",
      phone: "",
      referenceNumber: "",
      panNumber: "",
      panImageFile: null,
      aadhaarNumber: "",
      aadhaarImageFile: null,
      village: "",
      alternatePhone: "",
      cropType: "",
      unit: "",
      location: "",
      block: "",
      farmerCategory: "",
    });
    setSelectedCropType("");
  };

  const handleSave = () => {
    if (!formData.grower || !formData.village || !formData.crop) {
      alert("Please fill in required fields");
      return;
    }
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in fade-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-[rgb(76,175,80)] text-white flex justify-between items-center">
        <div className="flex-1">
          <h2 className="text-lg font-bold leading-none">
            {isEditMode ? "Edit Field" : "Add New Field"}
          </h2>
          <p className="text-xs mt-1 text-white/80">
            {isEditMode
              ? "Update field details"
              : "Fill in the field information"}
          </p>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-4 pb-6 space-y-6">
          {/* Grower Selection Section */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Grower Selection
                </h3>
                <p className="text-xs text-slate-500">
                  Search or create a new grower
                </p>
              </div>

              {formData.grower && !showGrowerSearch ? (
                <div className="h-12 px-4 border rounded-lg bg-slate-50 flex items-center text-base font-medium text-slate-900 justify-between">
                  <span>{formData.grower}</span>
                  <button
                    onClick={() => {
                      setFormData({
                        ...formData,
                        grower: "",
                        growerId: "",
                        village: "",
                      });
                      setShowGrowerSearch(true);
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 underline"
                  >
                    Change
                  </button>
                </div>
              ) : null}

              {showGrowerSearch && (
                <div className="space-y-4 pt-2">
                  {/* Search Input */}
                  <div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search by Name, Phone or PAN"
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
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
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
                            <p className="text-sm text-slate-500">
                              {grower.phone}
                            </p>
                            <p className="text-xs text-slate-400">
                              {grower.village}
                            </p>
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
                            setShowCreateGrowerDialog(true);
                          }}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Click here to create new grower
                        </button>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Create New Grower CTA */}
                  {searchResults.length === 0 && !showNoResultsMessage && (
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => setShowCreateGrowerDialog(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Create New Grower
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assigned Field Assistant */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Label className="text-sm font-medium">
                Assigned Field Assistant
              </Label>
              <div className="h-10 px-4 border rounded-lg bg-slate-50 flex items-center text-sm font-medium text-slate-900">
                Rajiv Sharma (Current User)
              </div>
            </CardContent>
          </Card>

          {/* Village */}
          {formData.village && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label className="text-sm font-medium">Village</Label>
                <Input
                  value={formData.village}
                  onChange={(e) =>
                    setFormData({ ...formData, village: e.target.value })
                  }
                  className="h-10"
                />
              </CardContent>
            </Card>
          )}

          {/* Field Details */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Field Details
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in the required information
                </p>
              </div>

              <Separator />

              {/* Irrigation Method */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Irrigation Method <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.irrigationMethod}
                  onValueChange={(v) =>
                    setFormData({ ...formData, irrigationMethod: v })
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select irrigation method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flood">Flood</SelectItem>
                    <SelectItem value="drip">Drip</SelectItem>
                    <SelectItem value="sprinkler">Sprinkler</SelectItem>
                    <SelectItem value="rainfed">Rainfed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Isolation Observed */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Isolation Observed <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.isolationObserved}
                  onValueChange={(v) =>
                    setFormData({ ...formData, isolationObserved: v })
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select isolation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Crop */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Crop <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.crop}
                  onValueChange={(v) =>
                    setFormData({
                      ...formData,
                      crop: v,
                      currentStage:
                        v === "rice" ? "Area Measurement" : "Pre-Sowing",
                    })
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corn">Corn</SelectItem>
                    <SelectItem value="rice">Rice</SelectItem>
                    <SelectItem value="cotton">Cotton</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Hybrid Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Hybrid Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.hybrid}
                  onValueChange={(v) => setFormData({ ...formData, hybrid: v })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select hybrid" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="h1001">H1001</SelectItem>
                    <SelectItem value="h1002">H1002</SelectItem>
                    <SelectItem value="h1003">H1003</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Estimated Acreage */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Estimated Acreage <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  placeholder="Enter acreage"
                  value={formData.estimatedAcreage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedAcreage: e.target.value,
                    })
                  }
                  className="h-10"
                  step="0.1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Field Stages */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Current Stage
                </h3>
                <p className="text-xs text-slate-500">
                  Select the current field stage
                </p>
              </div>

              <Separator />

              <div className="flex flex-wrap gap-2">
                {FIELD_STAGES.map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() =>
                      setFormData({ ...formData, currentStage: stage.label })
                    }
                    className={`px-3 py-2 text-xs rounded-full border font-medium transition-colors ${
                      formData.currentStage === stage.label
                        ? "bg-[#4CAF50] text-white border-[#4CAF50]"
                        : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {stage.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Create Grower Dialog */}
      <Dialog
        open={showCreateGrowerDialog}
        onOpenChange={setShowCreateGrowerDialog}
      >
        <DialogContent className="max-w-full h-full m-0 rounded-none p-0 flex flex-col overflow-hidden">
          <DialogTitle className="sr-only">Create New Grower</DialogTitle>
          <DialogDescription className="sr-only">
            Fill in the grower details
          </DialogDescription>

          {/* Green Header */}
          <div className="px-4 py-3 border-b bg-[rgb(76,175,80)] text-white flex-shrink-0">
            <h2 className="text-lg font-bold">Add New Grower</h2>
            <p className="text-xs mt-1 text-white/80">
              Fill in the grower details
            </p>
          </div>

          <ScrollArea className="flex-1 overflow-hidden">
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-base">Grower Preferred Name *</Label>
                <Input
                  placeholder="Enter grower preferred name"
                  value={newGrowerData.preferredName}
                  onChange={(e) =>
                    setNewGrowerData({
                      ...newGrowerData,
                      preferredName: e.target.value,
                    })
                  }
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base">Grower Age</Label>
                <Input
                  type="number"
                  placeholder="Enter age"
                  value={newGrowerData.age}
                  onChange={(e) =>
                    setNewGrowerData({ ...newGrowerData, age: e.target.value })
                  }
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base">Father's Name</Label>
                <Input
                  placeholder="Enter father's name"
                  value={newGrowerData.fathersName}
                  onChange={(e) =>
                    setNewGrowerData({
                      ...newGrowerData,
                      fathersName: e.target.value,
                    })
                  }
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base">Phone Number (Optional)</Label>
                <Input
                  placeholder="+91 98765 43210"
                  value={newGrowerData.phone}
                  onChange={(e) =>
                    setNewGrowerData({
                      ...newGrowerData,
                      phone: e.target.value,
                    })
                  }
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base">Reference Number *</Label>
                <Input
                  placeholder="Enter reference number"
                  value={newGrowerData.referenceNumber}
                  onChange={(e) =>
                    setNewGrowerData({
                      ...newGrowerData,
                      referenceNumber: e.target.value,
                    })
                  }
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base">Village *</Label>
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
                    <SelectItem value="Rampur">Rampur</SelectItem>
                    <SelectItem value="Lakhanpur">Lakhanpur</SelectItem>
                    <SelectItem value="Sultanpur">Sultanpur</SelectItem>
                    <SelectItem value="Govindpur">Govindpur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-base">PAN No. (text)</Label>
                <Input
                  placeholder="Enter PAN number (e.g., ABCDE1234F)"
                  value={newGrowerData.panNumber}
                  maxLength={10}
                  onChange={(e) =>
                    setNewGrowerData({
                      ...newGrowerData,
                      panNumber: e.target.value,
                    })
                  }
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base">Upload PAN (Image)</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setNewGrowerData({
                      ...newGrowerData,
                      panImageFile: e.target.files?.[0] || null,
                    })
                  }
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base">Aadhaar No. (text)</Label>
                <Input
                  placeholder="Enter Aadhaar number"
                  value={newGrowerData.aadhaarNumber}
                  onChange={(e) =>
                    setNewGrowerData({
                      ...newGrowerData,
                      aadhaarNumber: e.target.value,
                    })
                  }
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-base">
                  Upload Aadhaar (file upload)
                </Label>
                <Input
                  type="file"
                  onChange={(e) =>
                    setNewGrowerData({
                      ...newGrowerData,
                      aadhaarImageFile: e.target.files?.[0] || null,
                    })
                  }
                  className="h-12 text-base"
                />
              </div>
            </div>
          </ScrollArea>

          {/* Dialog Footer */}
          <div className="p-4 border-t bg-white flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-10"
              onClick={() => setShowCreateGrowerDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-10 bg-[#4CAF50] hover:bg-[#388E3C]"
              onClick={() => {
                handleCreateNewGrower();
              }}
            >
              Create Grower
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer Buttons */}
      <div className="p-4 border-t bg-white flex gap-2">
        <Button variant="outline" className="flex-1 h-10" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          className="flex-1 h-10 bg-[#4CAF50] hover:bg-[#388E3C]"
          onClick={handleSave}
        >
          {isEditMode ? "Update Field" : "Save & Proceed"}
        </Button>
      </div>
    </div>
  );
}
