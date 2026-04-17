import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Map as MapIcon, CheckCircle2, Sprout, Camera } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Plot } from "../data/mockData";
import { CORN_FIELD_STAGES, RICE_FIELD_STAGES } from "./config/fieldStages";
import { FieldStageData } from "./config/formDefaults";

interface FieldStagesSectionProps {
  selectedPlot: Plot;
  plotMapImage: string;
  activeFieldStage: string;
  setActiveFieldStage: (stage: string) => void;
  fieldStageData: FieldStageData;
  updateStageField: (stage: string, field: string, value: unknown) => void;
  isFieldSummaryOpen: boolean;
  setIsFieldSummaryOpen: (v: boolean) => void;
}

export function FieldStagesSection({
  selectedPlot,
  plotMapImage,
  activeFieldStage,
  setActiveFieldStage,
  fieldStageData,
  updateStageField,
  isFieldSummaryOpen,
  setIsFieldSummaryOpen,
}: FieldStagesSectionProps) {
  const FIELD_STAGES =
    selectedPlot.crop === "Rice" ? RICE_FIELD_STAGES : CORN_FIELD_STAGES;

  return (
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
              GPS field measurement is optional. You can proceed to other stages
              without measuring.
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
                    <p className="text-xs text-slate-500">Measured Acreage</p>
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
                    updateStageField("sowing", "maleLotNumber", e.target.value)
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
                    updateStageField("sowing", "maleIssuedAcre", e.target.value)
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
                  updateStageField("sowing", "femaleSowingDate", e.target.value)
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
                      updateStageField("vegetative", "plantRouging", opt)
                    }
                    className={`flex-1 py-2 rounded-md border text-sm font-medium capitalize transition-colors ${
                      fieldStageData.vegetative.plantRouging === opt
                        ? "bg-[#4CAF50] text-white border-[#4CAF50]"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
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
        {activeFieldStage === "flowering" && selectedPlot.crop !== "Rice" && (
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
                <Label className="text-xs">Off-Types Shedding Pollen (%)</Label>
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
                  updateStageField("flowering", "ffSilks", e.target.value)
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
                  <SelectItem value="waterlogging">Waterlogging</SelectItem>
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
                      updateStageField("flowering", "neighborShedding", opt)
                    }
                    className={`flex-1 py-2 rounded-md border text-sm font-medium capitalize transition-colors ${
                      fieldStageData.flowering.neighborShedding === opt
                        ? "bg-[#4CAF50] text-white border-[#4CAF50]"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
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
                      updateStageField("flowering", "isolationSufficient", opt)
                    }
                    className={`flex-1 py-2 rounded-md border text-sm font-medium capitalize transition-colors ${
                      fieldStageData.flowering.isolationSufficient === opt
                        ? "bg-[#4CAF50] text-white border-[#4CAF50]"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
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
              <Label className="text-xs">Nick with Contaminant Block</Label>
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
                    className={`flex-1 py-2 rounded-md border text-sm font-medium capitalize transition-colors ${
                      fieldStageData.flowering.nickWithContaminantBlock === opt
                        ? "bg-[#4CAF50] text-white border-[#4CAF50]"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    }`}
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
        {activeFieldStage === "quality" && selectedPlot.crop !== "Rice" && (
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
            <div className="space-y-2">
              <Label>Add Media</Label>
              <Button variant="outline" className="w-full gap-2">
                <Camera className="h-4 w-4" />
                Upload Photo/Video
              </Button>
            </div>
          </div>
        )}

        {/* ── Pre-Harvest ── */}
        {activeFieldStage === "pre-harvest" && selectedPlot.crop !== "Rice" && (
          <div className="space-y-3 pt-2 border-t">
            <div className="space-y-1.5">
              <Label className="text-xs">Male Destruction</Label>
              <div className="flex gap-2">
                {["yes", "no"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() =>
                      updateStageField("preHarvest", "maleDestruction", opt)
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
                    updateStageField("preHarvest", "diseaseIntensity", v)
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
                    <SelectItem value="waterlog">Waterlogging</SelectItem>
                    <SelectItem value="pest">Pest Attack</SelectItem>
                    <SelectItem value="weed">Weed Pressure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Pre-Harvest Cut Moisture (%)</Label>
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
              <Label className="text-xs">Estimated Yield — Final (Kg)</Label>
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
            <div className="space-y-2">
              <Label>Add Media</Label>
              <Button variant="outline" className="w-full gap-2">
                <Camera className="h-4 w-4" />
                Upload Photo/Video
              </Button>
            </div>
          </div>
        )}

        {/* ── Harvest ── */}
        {activeFieldStage === "harvest" && selectedPlot.crop !== "Rice" && (
          <div className="space-y-3 pt-2 border-t">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Male Date</Label>
                <Input
                  className="h-9 text-sm"
                  type="date"
                  value={fieldStageData.harvest.maleDate}
                  onChange={(e) =>
                    updateStageField("harvest", "maleDate", e.target.value)
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
                    updateStageField("harvest", "femaleDate", e.target.value)
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
                  updateStageField("harvest", "harvestWeight", e.target.value)
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
            <div className="space-y-2">
              <Label>Add Media</Label>
              <Button variant="outline" className="w-full gap-2">
                <Camera className="h-4 w-4" />
                Upload Photo/Video
              </Button>
            </div>
          </div>
        )}

        {/* ── Dispatch (Corn) ── */}
        {activeFieldStage === "dispatch" && selectedPlot.crop !== "Rice" && (
          <div className="space-y-3 pt-2 border-t">
            <div className="space-y-1.5">
              <Label className="text-xs">LR Number</Label>
              <Input
                className="h-9 text-sm"
                placeholder="Enter LR number"
                value={fieldStageData.dispatch.lrNumber}
                onChange={(e) =>
                  updateStageField("dispatch", "lrNumber", e.target.value)
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
                  updateStageField("dispatch", "truckNumber", e.target.value)
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
                  updateStageField("dispatch", "dispatchWeight", e.target.value)
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
          </div>
        )}

        {/* ── CCP ── */}
        {activeFieldStage === "ccp" && selectedPlot.crop !== "Rice" && (
          <div className="space-y-4 pt-2 border-t">
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Child Care Protection (CCP)
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Confirm whether any child below the age of 18 was found working
                on this field.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">
                Was any child found working on the field?
              </Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => updateStageField("ccp", "childWorking", "yes")}
                  className={`flex-1 py-2 rounded-md border text-sm font-medium transition-colors ${fieldStageData.ccp.childWorking === "yes" ? "bg-red-500 text-white border-red-500" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}
                >
                  Yes (Violation)
                </button>
                <button
                  type="button"
                  onClick={() => updateStageField("ccp", "childWorking", "no")}
                  className={`flex-1 py-2 rounded-md border text-sm font-medium transition-colors ${fieldStageData.ccp.childWorking === "no" ? "bg-[#4CAF50] text-white border-[#4CAF50]" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}
                >
                  No (Clear)
                </button>
              </div>
              {fieldStageData.ccp.childWorking === "yes" && (
                <div className="p-3 bg-red-50 rounded-md border border-red-200 mt-2">
                  <p className="text-xs text-red-700 font-semibold">
                    ⚠ Child labour violation detected. Report to your supervisor
                    immediately.
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
            <div className="space-y-2">
              <Label>Add Media</Label>
              <Button variant="outline" className="w-full gap-2">
                <Camera className="h-4 w-4" />
                Upload Photo/Video
              </Button>
            </div>
          </div>
        )}

        {/* ── RICE STAGES ── */}

        {/* Area Measurement */}
        {activeFieldStage === "area-measurement" && (
          <div className="space-y-4 pt-2 border-t">
            <p className="text-xs text-slate-500">
              GPS field measurement is optional. You can proceed to other stages
              without measuring.
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
                    <p className="text-xs text-slate-500">Measured Acreage</p>
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

        {/* Field Preparation */}
        {activeFieldStage === "field-preparation" && (
          <div className="space-y-3 pt-2 border-t">
            <div className="space-y-1.5">
              <Label className="text-xs">Irrigation Setup</Label>
              <Input className="h-9 text-sm" type="date" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">SSP Application</Label>
              <Input className="h-9 text-sm" type="date" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Puddling - 1st</Label>
              <Input className="h-9 text-sm" type="date" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Puddling - 2nd</Label>
              <Input className="h-9 text-sm" type="date" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Previous Parent</Label>
              <Input
                className="h-9 text-sm"
                placeholder="Enter previous parent"
              />
            </div>
          </div>
        )}

        {/* Sowing (Rice) */}
        {activeFieldStage === "sowing" && selectedPlot.crop === "Rice" && (
          <div className="space-y-3 pt-2 border-t">
            <div className="space-y-1.5">
              <Label className="text-xs">Parent Reference</Label>
              <Input
                className="h-9 text-sm"
                placeholder="Enter parent reference"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Female Sowing</Label>
              <Input className="h-9 text-sm" type="date" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Male Sowing</Label>
              <Input className="h-9 text-sm" type="date" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Sown Area</Label>
              <Input
                className="h-9 text-sm"
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>
        )}

        {/* Transplanting */}
        {activeFieldStage === "transplanting" && (
          <div className="space-y-3 pt-2 border-t">
            <div className="space-y-1.5">
              <Label className="text-xs">Male Transplanting</Label>
              <Input className="h-9 text-sm" type="date" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Female Transplanting</Label>
              <Input className="h-9 text-sm" type="date" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Transplanted Area</Label>
              <Input
                className="h-9 text-sm"
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Expected Yield</Label>
              <Input
                className="h-9 text-sm"
                type="number"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>
        )}

        {/* Isolation */}
        {activeFieldStage === "isolation" && (
          <div className="space-y-3 pt-2 border-t">
            <div className="space-y-1.5">
              <Label className="text-xs">Isolation Distance</Label>
              <Input className="h-9 text-sm" type="number" placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Variety</Label>
              <Input className="h-9 text-sm" placeholder="Enter variety" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Direction</Label>
              <Select>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "North",
                    "South",
                    "East",
                    "West",
                    "North-East",
                    "North-West",
                    "South-East",
                    "South-West",
                  ].map((d) => (
                    <SelectItem key={d} value={d.toLowerCase()}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Sowing Date</Label>
              <Input className="h-9 text-sm" type="date" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Transplanting Date</Label>
              <Input className="h-9 text-sm" type="date" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Flowering Date</Label>
              <Input className="h-9 text-sm" type="date" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Isolation Area</Label>
              <Input className="h-9 text-sm" type="number" placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Isolation Grade</Label>
              <Select>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {["A", "B", "C", "D", "F"].map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Fertilizer Management */}
        {activeFieldStage === "fertilizer-management" && (
          <div className="space-y-3 pt-2 border-t">
            <div className="space-y-1.5">
              <Label className="text-xs">Basal Dose</Label>
              <Input className="h-9 text-sm" type="date" />
            </div>
            {["1st", "2nd", "3rd", "Additional"].map((n) => (
              <div
                key={n}
                className="space-y-1.5 p-3 bg-slate-50 rounded-md border border-slate-200"
              >
                <p className="text-xs font-semibold text-slate-700">
                  {n} Top Dressing
                </p>
                <Input className="h-9 text-sm" type="date" placeholder="Date" />
                <Input className="h-9 text-sm" placeholder="Crop condition" />
                <Input className="h-9 text-sm" placeholder="Input name" />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label className="text-xs">Humivi-K Power Application</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 py-2 rounded-md border text-sm font-medium bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="flex-1 py-2 rounded-md border text-sm font-medium bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chemical Application */}
        {activeFieldStage === "chemical-application" && (
          <div className="space-y-3 pt-2 border-t">
            {["1st", "2nd", "3rd", "4th", "Additional"].map((n) => (
              <div
                key={n}
                className="space-y-1.5 p-3 bg-slate-50 rounded-md border border-slate-200"
              >
                <p className="text-xs font-semibold text-slate-700">
                  {n} Spray
                </p>
                <Input className="h-9 text-sm" type="date" placeholder="Date" />
                <Input className="h-9 text-sm" placeholder="Input name" />
              </div>
            ))}
          </div>
        )}

        {/* Agronomy */}
        {activeFieldStage === "agronomy" && (
          <div className="space-y-3 pt-2 border-t">
            {[
              "FN I",
              "FN II",
              "FN III",
              "FN IV (Feb I)",
              "FN IV (Mar I)",
              "FN IV (Mar II)",
            ].map((fn) => (
              <div key={fn} className="space-y-1.5">
                <Label className="text-xs">
                  Crop Agronomic Condition - {fn}
                </Label>
                <Select>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Excellent", "Good", "Fair", "Poor"].map((c) => (
                      <SelectItem key={c} value={c.toLowerCase()}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
            <div className="space-y-1.5">
              <Label className="text-xs">Reason for Poor Crop Condition</Label>
              <Input className="h-9 text-sm" placeholder="Enter reason" />
            </div>
          </div>
        )}

        {/* PPI Observation */}
        {activeFieldStage === "ppi-observation" && (
          <div className="space-y-3 pt-2 border-t">
            <div className="space-y-1.5">
              <Label className="text-xs">Male PPI</Label>
              <Input className="h-9 text-sm" type="date" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Female PPI</Label>
              <Input className="h-9 text-sm" type="date" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">PPI Status</Label>
              <Select>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {["Complete", "Partial", "Pending"].map((s) => (
                    <SelectItem key={s} value={s.toLowerCase()}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Yield Estimation on PPI</Label>
              <Input className="h-9 text-sm" type="number" placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Agronomical Condition</Label>
              <Input className="h-9 text-sm" placeholder="Enter condition" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Irrigation Water Status</Label>
              <Input
                className="h-9 text-sm"
                placeholder="Select or enter status"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Nick Adjustment</Label>
              <Input
                className="h-9 text-sm"
                placeholder="Enter nick adjustment"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Standard Acre</Label>
                <Input className="h-9 text-sm" type="number" placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Expected Yield</Label>
                <Input className="h-9 text-sm" type="number" placeholder="0" />
              </div>
            </div>
          </div>
        )}

        {/* Flowering (Rice) */}
        {activeFieldStage === "flowering" && selectedPlot.crop === "Rice" && (
          <div className="space-y-3 pt-2 border-t">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Female Flowering</Label>
                <Input className="h-9 text-sm" type="date" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Male Flowering</Label>
                <Input className="h-9 text-sm" type="date" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Parental Synchrony</Label>
              <Select>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Synchronized",
                    "Early Male",
                    "Late Male",
                    "Early Female",
                    "Late Female",
                  ].map((s) => (
                    <SelectItem
                      key={s}
                      value={s.toLowerCase().replace(/ /g, "-")}
                    >
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Crop Condition</Label>
              <Select>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {["Excellent", "Good", "Fair", "Poor"].map((c) => (
                    <SelectItem key={c} value={c.toLowerCase()}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Reason for Synchrony Mismatch</Label>
              <Input className="h-9 text-sm" placeholder="Enter reason" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Expected Seed Setting</Label>
              <Input className="h-9 text-sm" placeholder="0" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["GA3 - 1st", "GA3 - 2nd", "GA3 - 3rd", "Additional GA3"].map(
                (g) => (
                  <div key={g} className="space-y-1.5">
                    <Label className="text-xs">{g}</Label>
                    <Input className="h-9 text-sm" type="date" />
                  </div>
                ),
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Seed Setting at Maturity</Label>
              <Input className="h-9 text-sm" placeholder="0" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Expected Yield</Label>
                <Input className="h-9 text-sm" type="number" placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Standard Acre</Label>
                <Input className="h-9 text-sm" type="number" placeholder="0" />
              </div>
            </div>
          </div>
        )}

        {/* Rouging */}
        {activeFieldStage === "rouging" && (
          <div className="space-y-3 pt-2 border-t">
            {[
              { label: "1st Vegetative Rouging", hasGrade: true },
              { label: "Vegetative Rouging Date", hasGrade: false },
              { label: "2nd Vegetative Rouging", hasGrade: true },
              { label: "Pre-Flowering Rouging", hasGrade: true },
            ].map(({ label, hasGrade }) => (
              <div
                key={label}
                className={`space-y-1.5 ${hasGrade ? "p-3 bg-slate-50 rounded-md border border-slate-200" : ""}`}
              >
                <Label className="text-xs">{label}</Label>
                <Input className="h-9 text-sm" type="date" />
                {hasGrade && (
                  <Select>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A", "B", "C", "D", "F"].map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Flowering Daily Rouging
              </Label>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border border-slate-200 rounded-md overflow-hidden">
                  <thead className="bg-slate-50">
                    <tr>
                      {[
                        "Date",
                        "Off-type Male",
                        "Off-type Female",
                        "Remarks",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-2 py-1.5 text-left font-semibold text-slate-600 border-b border-slate-200"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="px-2 py-1">
                        <Input className="h-7 text-xs" type="date" />
                      </td>
                      <td className="px-2 py-1">
                        <Input
                          className="h-7 text-xs"
                          type="number"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-2 py-1">
                        <Input
                          className="h-7 text-xs"
                          type="number"
                          placeholder="0"
                        />
                      </td>
                      <td className="px-2 py-1">
                        <Input className="h-7 text-xs" placeholder="—" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs h-8"
              >
                + Add Row
              </Button>
            </div>
            {["Pre-Final Rouging", "Final Rouging"].map((label) => (
              <div key={label} className="space-y-1.5">
                <Label className="text-xs font-semibold">{label}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Off-type Male",
                    "Off-type Female",
                    "Volunteer Plants",
                    "Grade",
                  ].map((col) => (
                    <div key={col} className="space-y-1">
                      <p className="text-[10px] text-slate-500">{col}</p>
                      {col === "Grade" ? (
                        <Select>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Grade" />
                          </SelectTrigger>
                          <SelectContent>
                            {["A", "B", "C", "D", "F"].map((g) => (
                              <SelectItem key={g} value={g}>
                                {g}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          className="h-8 text-xs"
                          type="number"
                          placeholder="0"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="p-3 bg-green-50 rounded-md border border-green-200 space-y-2">
              <p className="text-xs font-semibold text-slate-700">
                Rouging Summary
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {["Total Rouged", "Avg / Day", "Final Grade"].map((m) => (
                  <div
                    key={m}
                    className="bg-white rounded-md border border-slate-200 p-2"
                  >
                    <p className="text-[10px] text-slate-500">{m}</p>
                    <p className="text-sm font-bold text-slate-800">—</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chopping & Harvesting */}
        {activeFieldStage === "chopping-harvesting" && (
          <div className="space-y-3 pt-2 border-t">
            <div className="space-y-1.5">
              <Label className="text-xs">Male Chopping</Label>
              <Input className="h-9 text-sm" type="date" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Female Harvesting</Label>
              <Input className="h-9 text-sm" type="date" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Harvested Area</Label>
              <Input className="h-9 text-sm" type="number" placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Quality Grade on Harvesting</Label>
              <Select>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {["A", "B", "C", "D", "F"].map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Yield Estimation</Label>
              <Input className="h-9 text-sm" type="number" placeholder="0" />
            </div>
          </div>
        )}

        {/* Dispatch (Rice) */}
        {activeFieldStage === "dispatch" && selectedPlot.crop === "Rice" && (
          <div className="space-y-3 pt-2 border-t">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Dispatch Date</Label>
                <Input className="h-9 text-sm" type="date" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Dispatch Time</Label>
                <Input className="h-9 text-sm" type="time" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Dispatch Bags</Label>
                <Input className="h-9 text-sm" type="number" placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Dispatch Qty (approx.)</Label>
                <Input className="h-9 text-sm" type="number" placeholder="0" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Dispatch Area</Label>
              <Input className="h-9 text-sm" type="number" placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Vehicle Number</Label>
              <Input className="h-9 text-sm" placeholder="e.g. MH01AB1234" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Moisture %</Label>
              <Input
                className="h-9 text-sm"
                type="number"
                step="0.1"
                placeholder="0.0"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Final Grade</Label>
              <Select>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {["A", "B", "C", "D", "F"].map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">SDN Number</Label>
                <Input className="h-9 text-sm" placeholder="Enter SDN" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">LR Number</Label>
                <Input className="h-9 text-sm" placeholder="Enter LR" />
              </div>
            </div>
          </div>
        )}

        {/* Post Dispatch */}
        {activeFieldStage === "post-dispatch" && (
          <div className="space-y-3 pt-2 border-t">
            <div className="space-y-1.5">
              <Label className="text-xs">Received Quantity</Label>
              <Input className="h-9 text-sm" type="number" placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Moisture at Plant (%)</Label>
              <Input
                className="h-9 text-sm"
                type="number"
                step="0.1"
                placeholder="0.0"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Remnant</Label>
              <Input className="h-9 text-sm" placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Physical Purity Loss</Label>
              <Input className="h-9 text-sm" type="number" placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Condition Quantity</Label>
              <Input className="h-9 text-sm" type="number" placeholder="0" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
