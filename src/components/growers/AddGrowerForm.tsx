import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CheckCircle, MapPin } from "lucide-react";
import { FormData } from "./config/formDefaults";

interface AddGrowerFormProps {
  addStep: number;
  setAddStep: (step: number) => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
  selectedCropType: string;
  setSelectedCropType: (type: string) => void;
}

export const AddGrowerForm = React.memo(
  ({
    addStep,
    setAddStep,
    formData,
    setFormData,
    selectedCropType,
    setSelectedCropType,
  }: AddGrowerFormProps) => (
    <div className="space-y-4 py-2">
      {addStep === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div className="space-y-2">
            <Label className="text-base">Grower Preferred Name *</Label>
            <Input
              placeholder="Enter grower preferred name"
              className="h-12 text-base"
              value={formData.preferredName}
              onChange={(e) =>
                setFormData({ ...formData, preferredName: e.target.value })
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
            <Label className="text-base">Phone Number (Optional)</Label>
            <Input
              placeholder="+91 98765 43210"
              className="h-12 text-base"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base">Reference Number *</Label>
            <Input
              placeholder="Enter reference number"
              className="h-12 text-base"
              value={formData.referenceNumber}
              onChange={(e) =>
                setFormData({ ...formData, referenceNumber: e.target.value })
              }
            />
          </div>

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
                <SelectItem value="rampur">Rampur</SelectItem>
                <SelectItem value="lakhanpur">Lakhanpur</SelectItem>
                <SelectItem value="sultanpur">Sultanpur</SelectItem>
                <SelectItem value="govindpur">Govindpur</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-base">PAN No. (text)</Label>
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

          <div className="space-y-2">
            <Label className="text-base">Upload PAN (Image)</Label>
            <Input type="file" accept="image/*" className="h-12 text-base" />
          </div>

          <div className="space-y-2">
            <Label className="text-base">Aadhaar No. (text)</Label>
            <Input
              placeholder="Enter Aadhaar number"
              className="h-12 text-base"
              value={formData.aadhaarNumber}
              onChange={(e) =>
                setFormData({ ...formData, aadhaarNumber: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base">Upload Aadhaar (file upload)</Label>
            <Input type="file" className="h-12 text-base" />
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
  ),
);

AddGrowerForm.displayName = "AddGrowerForm";
