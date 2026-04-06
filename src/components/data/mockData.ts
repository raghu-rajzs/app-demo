import {
  Users,
  Map as MapIcon,
  BarChart3,
  ClipboardList,
  Sprout,
  BookOpen,
  CheckSquare,
} from "lucide-react";

// Types
export type Plot = {
  id: string;
  name: string;
  growerId: string;
  growerName: string;
  village: string;
  acreage: number;
  crop: "Corn" | "Rice" | "Cotton";
  hybrid: string;
  sowingDate: string;
  status: "Healthy" | "Mild Stress" | "Moderate Stress" | "Severe Stress";
  stressReason?: "Moisture Deficiency" | "Pest" | "Disease" | "Soil Issue";
  waterLodging: boolean;
  heatStress: boolean;
  soilMoisture: "Dry" | "Moderate" | "Optimal" | "High";
  pestObserved: boolean;
  diseaseObserved: boolean;
  coordinates: { lat: number; lng: number }[]; // Simple polygon rep
  auditStatus?: "audited" | "pending";
  stage?:
    | "Sowing"
    | "Vegetative"
    | "Detassling"
    | "Harvest"
    | "Dispatch"
    | "Transplanting"
    | "PPI"
    | "Flowering";
  expectedStage?:
    | "Sowing"
    | "Vegetative"
    | "Detassling"
    | "Harvest"
    | "Dispatch"
    | "Transplanting"
    | "PPI"
    | "Flowering";
};

export type Grower = {
  id: string;
  name: string; // Preferred Name
  agreementName: string; // Agreement Name
  age: number;
  fathersName: string;
  phone: string;
  alternatePhone?: string;
  village: string;
  region: string;
  block: string;
  unit: string;
  location: string; // Territory for Rice, Location for Corn
  cropType: "Corn" | "Rice";
  category: "Small" | "Medium" | "Large"; // Farmer Category
  plots: string[]; // Plot IDs
  yieldForecast: number;
  image: string;
  panNumber: string;
};

export type Advisory = {
  id: string;
  title: string;
  reason: string;
  action: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "Completed" | "Overdue";
  date: string;
  plotId?: string;
};

// Helper data for generation
const states = ["PB", "HR", "UP", "MP", "GJ", "RJ", "MH"];
const cities = {
  PB: ["AMRITSAR", "LUDHIANA", "JALANDHAR", "PATIALA"],
  HR: ["KARNAL", "HISAR", "ROHTAK", "PANIPAT"],
  UP: ["MEERUT", "AGRA", "LUCKNOW", "KANPUR"],
  MP: ["INDORE", "BHOPAL", "JABALPUR", "GWALIOR"],
  GJ: ["AHMEDABAD", "SURAT", "RAJKOT", "VADODARA"],
  RJ: ["JAIPUR", "JODHPUR", "KOTA", "UDAIPUR"],
  MH: ["PUNE", "NASHIK", "NAGPUR", "AURANGABAD"],
};

const villages = [
  "RAMPUR",
  "LAKHANPUR",
  "SULTANPUR",
  "RAJAPUR",
  "GOVINDPUR",
  "NANDPUR",
  "SHIVPUR",
  "MADHAVPUR",
  "KRISHNAPUR",
  "GOPINATH",
  "BALRAMPUR",
  "HARIPUR",
  "RAMGARH",
  "FATEHPUR",
  "JAIPUR",
  "BISHNUPUR",
  "MAHESHPUR",
  "GANESHPUR",
  "SRIPUR",
  "DAYALPUR",
];

const growerNames = [
  "Rajesh Kumar",
  "Suresh Patel",
  "Amit Singh",
  "Vijay Sharma",
  "Ramesh Yadav",
  "Manoj Gupta",
  "Anil Verma",
  "Sanjay Joshi",
  "Rakesh Reddy",
  "Dinesh Kaur",
  "Harish Chaudhary",
  "Prakash Thakur",
  "Mohan Rao",
  "Ravi Desai",
  "Kiran Patil",
  "Ajay Mehta",
  "Santosh Kumar",
  "Deepak Chauhan",
  "Naveen Malhotra",
  "Ashok Nair",
  "Mukesh Agarwal",
  "Pankaj Saxena",
  "Rohit Mishra",
  "Sachin Pandey",
  "Vinod Tiwari",
  "Anand Jain",
  "Raju Das",
  "Ganesh Naik",
  "Sunil Pillai",
  "Mahesh Shetty",
  "Krishna Iyer",
  "Shyam Kapoor",
  "Pradeep Shah",
  "Vikas Bhatt",
  "Gopal Rana",
];

const plotNames = [
  "North Field",
  "South Plot",
  "East Section",
  "West Block",
  "Central Farm",
  "Hill Side",
  "Valley View",
  "River Bank",
  "Upper Field",
  "Lower Tract",
  "Main Plot",
  "Side Field",
  "Corner Plot",
  "Back Field",
  "Front Section",
  "Big Field",
  "Small Plot",
  "Wide Section",
  "Long Tract",
  "Square Field",
];

const crops: ("Corn" | "Rice" | "Cotton")[] = ["Corn", "Rice", "Cotton"];
const hybrids = {
  Corn: ["Super-99", "Mega-125", "Power-X", "Gold-Pro", "Elite-200"],
  Rice: ["Rice-Gold", "Basmati-X", "Premium-1121", "Hybrid-99", "Super-Rice"],
  Cotton: [
    "Cotton-BT",
    "Hybrid-Cotton",
    "Super-BT",
    "Elite-Cotton",
    "Premium-BT",
  ],
};

const statuses: (
  | "Healthy"
  | "Mild Stress"
  | "Moderate Stress"
  | "Severe Stress"
)[] = ["Healthy", "Mild Stress", "Moderate Stress", "Severe Stress"];
const stressReasons: (
  | "Moisture Deficiency"
  | "Pest"
  | "Disease"
  | "Soil Issue"
)[] = ["Moisture Deficiency", "Pest", "Disease", "Soil Issue"];
const soilMoistureTypes: ("Dry" | "Moderate" | "Optimal" | "High")[] = [
  "Dry",
  "Moderate",
  "Optimal",
  "High",
];

const cornStages = [
  "Sowing",
  "Vegetative",
  "Detassling",
  "Harvest",
  "Dispatch",
] as const;
const riceStages = [
  "Sowing",
  "Transplanting",
  "PPI",
  "Flowering",
  "Harvest",
  "Dispatch",
] as const;

// Helper function to calculate expected stage based on days since sowing
function getExpectedStage(
  sowingDate: string,
  crop: "Corn" | "Rice" | "Cotton",
): string {
  const today = new Date();
  const sowing = new Date(sowingDate);
  const daysSinceSowing = Math.floor(
    (today.getTime() - sowing.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (crop === "Corn") {
    if (daysSinceSowing < 7) return "Sowing";
    if (daysSinceSowing < 50) return "Vegetative";
    if (daysSinceSowing < 60) return "Detassling";
    if (daysSinceSowing < 80) return "Harvest";
    return "Dispatch";
  } else if (crop === "Rice" || crop === "Cotton") {
    if (daysSinceSowing < 7) return "Sowing";
    if (daysSinceSowing < 30) return "Transplanting";
    if (daysSinceSowing < 50) return "PPI";
    if (daysSinceSowing < 65) return "Flowering";
    if (daysSinceSowing < 85) return "Harvest";
    return "Dispatch";
  }
  return "Sowing";
}

// Generate growers
function generateGrowers(): Grower[] {
  const growers: Grower[] = [];
  const images = [
    "https://images.unsplash.com/photo-1719154718540-8ef3d94e7712?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    "https://github.com/shadcn.png",
  ];

  const units = ["Unit North", "Unit South", "Unit East", "Unit West"];
  const locations = ["Location A", "Location B", "Location C", "Location D"];
  const territories = [
    "Territory 1",
    "Territory 2",
    "Territory 3",
    "Territory 4",
  ];
  const blocks = ["Block A", "Block B", "Block C", "Block D"];
  const cropTypes: Array<"Corn" | "Rice"> = ["Corn", "Rice"];

  for (let i = 0; i < 35; i++) {
    const name = growerNames[i % growerNames.length];
    const village = villages[Math.floor(Math.random() * villages.length)];
    const category: "Small" | "Medium" | "Large" =
      i % 3 === 0 ? "Large" : i % 3 === 1 ? "Medium" : "Small";
    const cropType = cropTypes[i % cropTypes.length];
    const unit = units[i % units.length];
    const block = blocks[i % blocks.length];
    const location =
      cropType === "Rice"
        ? territories[i % territories.length]
        : locations[i % locations.length];

    growers.push({
      id: `g${i + 1}`,
      name: `${name} ${i > growerNames.length - 1 ? i - growerNames.length + 1 : ""}`.trim(),
      agreementName:
        `${name} (Agreement) ${i > growerNames.length - 1 ? i - growerNames.length + 1 : ""}`.trim(),
      age: 30 + Math.floor(Math.random() * 40),
      fathersName: "Father " + name,
      phone: `+91 ${98700 + i} ${43210 + i}`,
      alternatePhone: `+91 ${95500 + i} ${12345 + i}`,
      panNumber: `PAN${String(1000 + i).slice(-4)}${String.fromCharCode(65 + (i % 26))}`,
      village,
      region: `${villages[i % villages.length]} Region`,
      unit,
      block,
      location,
      cropType,
      category,
      plots: [],
      yieldForecast:
        category === "Large"
          ? 10000 + Math.floor(Math.random() * 5000)
          : category === "Medium"
            ? 4000 + Math.floor(Math.random() * 3000)
            : 1500 + Math.floor(Math.random() * 1500),
      image: images[i % images.length],
    });
  }

  return growers;
}

// Generate plots
function generatePlots(growers: Grower[]): Plot[] {
  const plots: Plot[] = [];
  let plotCounter = 0;

  // Track plot numbers per unique location+grower combination
  const plotCountMap: { [key: string]: number } = {};

  for (let i = 0; i < 124; i++) {
    const grower = growers[i % growers.length];
    const state = states[Math.floor(Math.random() * states.length)];
    const cityList = cities[state as keyof typeof cities];
    const city = cityList[Math.floor(Math.random() * cityList.length)];
    const village = villages[Math.floor(Math.random() * villages.length)];
    const initials = grower.name
      .split(" ")
      .map((n) => n[0])
      .join("");

    // Create unique key for this location+grower combination
    const locationKey = `${state}/${city}/${village}/${initials}`;

    // Increment plot count for this specific location+grower
    if (!plotCountMap[locationKey]) {
      plotCountMap[locationKey] = 0;
    }
    plotCountMap[locationKey]++;

    const plotId = `${locationKey}/${String(plotCountMap[locationKey]).padStart(2, "0")}`;

    const crop = crops[Math.floor(Math.random() * crops.length)];
    const hybrid =
      hybrids[crop][Math.floor(Math.random() * hybrids[crop].length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const stages = crop === "Corn" ? cornStages : riceStages;
    const stage = stages[Math.floor(Math.random() * stages.length)];
    const hasStress = status !== "Healthy";
    const stressReason = hasStress
      ? stressReasons[Math.floor(Math.random() * stressReasons.length)]
      : undefined;

    // 70% audited, 30% pending
    const auditStatus: "audited" | "pending" =
      Math.random() < 0.7 ? "audited" : "pending";

    // Generate sowing date (last 3 months)
    const baseDate = new Date("2024-06-01");
    const randomDays = Math.floor(Math.random() * 90);
    const sowingDate = new Date(baseDate);
    sowingDate.setDate(baseDate.getDate() + randomDays);

    const plot: Plot = {
      id: plotId,
      name: plotNames[i % plotNames.length],
      growerId: grower.id,
      growerName: grower.name,
      village,
      acreage: parseFloat((0.5 + Math.random() * 4.5).toFixed(1)),
      crop,
      hybrid,
      sowingDate: sowingDate.toISOString().split("T")[0],
      status,
      stressReason,
      waterLodging: Math.random() < 0.15,
      heatStress: Math.random() < 0.2,
      soilMoisture:
        soilMoistureTypes[Math.floor(Math.random() * soilMoistureTypes.length)],
      pestObserved: stressReason === "Pest" || Math.random() < 0.1,
      diseaseObserved: stressReason === "Disease" || Math.random() < 0.08,
      coordinates: [],
      auditStatus,
      stage: stage as any,
      expectedStage: getExpectedStage(
        sowingDate.toISOString().split("T")[0],
        crop,
      ) as any,
    };

    plots.push(plot);
    grower.plots.push(plotId);
  }

  return plots;
}

// Generate the data
export const MOCK_GROWERS = generateGrowers();
export const MOCK_PLOTS = generatePlots(MOCK_GROWERS);

export const MOCK_ADVISORIES: Advisory[] = [
  {
    id: "a1",
    title: "Irrigation Required",
    reason: "Moisture Deficiency",
    action: "Apply 2 hours of drip irrigation",
    priority: "High",
    status: "Pending",
    date: "2024-08-01",
    plotId: MOCK_PLOTS[1]?.id,
  },
  {
    id: "a2",
    title: "Pest Control Spray",
    reason: "Fall Armyworm Risk",
    action: "Spray Recommended Pesticide X",
    priority: "High",
    status: "Overdue",
    date: "2024-07-28",
    plotId: MOCK_PLOTS[3]?.id,
  },
  {
    id: "a3",
    title: "Fertilizer Application",
    reason: "Growth Stage",
    action: "Apply Urea top dressing",
    priority: "Medium",
    status: "Completed",
    date: "2024-07-25",
    plotId: MOCK_PLOTS[0]?.id,
  },
  {
    id: "a4",
    title: "Disease Treatment",
    reason: "Leaf Blight Detected",
    action: "Apply fungicide spray",
    priority: "High",
    status: "Pending",
    date: "2024-08-02",
    plotId: MOCK_PLOTS[5]?.id,
  },
  {
    id: "a5",
    title: "Weed Control",
    reason: "Excessive Weed Growth",
    action: "Manual weeding recommended",
    priority: "Medium",
    status: "Pending",
    date: "2024-08-03",
    plotId: MOCK_PLOTS[7]?.id,
  },
];

export const NAV_ITEMS = [
  { label: "Analytics", icon: BarChart3, id: "analytics" },
  { label: "Field Tracker", icon: MapIcon, id: "plots" },
  { label: "Grower Profiles", icon: Users, id: "growers" },
  { label: "Advisory Insights", icon: ClipboardList, id: "advisory" },
  { label: "Task Tracker", icon: CheckSquare, id: "tasks" },
  { label: "Resources", icon: BookOpen, id: "resources" },
];
