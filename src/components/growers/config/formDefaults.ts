export const DEFAULT_FORM_DATA = {
  preferredName: "",
  age: "",
  fathersName: "",
  panNumber: "",
  phone: "",
  referenceNumber: "",
  village: "",
  aadhaarNumber: "",
  unit: "",
  location: "",
  cropType: "Corn",
};

export type FormData = typeof DEFAULT_FORM_DATA;

export type FilterState = {
  unit: string;
  location: string;
  block: string;
  village: string;
  hybrid: string;
};

export const DEFAULT_FILTERS: FilterState = {
  unit: "all",
  location: "all",
  block: "all",
  village: "all",
  hybrid: "all",
};

export const DEFAULT_FIELD_STAGE_DATA = {
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
};

export type FieldStageData = typeof DEFAULT_FIELD_STAGE_DATA;

export type MediaEntry = {
  id: string;
  type: string;
  dateCaptured: string;
  timeCaptured: string;
};
