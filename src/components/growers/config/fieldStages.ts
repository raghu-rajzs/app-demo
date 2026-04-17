// Control variable: set to false to show "Vegetative" instead of "Transplanting"
export const DISPLAY_TRANSPLANTING_LABEL = true;

export const getStageDisplayLabel = (stageValue: string | undefined): string => {
  if (stageValue === "Vegetative" && DISPLAY_TRANSPLANTING_LABEL) {
    return "Transplanting";
  }
  return stageValue ?? "";
};

export const CORN_FIELD_STAGES = [
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

export const RICE_FIELD_STAGES = [
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
