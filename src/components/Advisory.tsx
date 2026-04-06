import React, { useState } from "react";
import { MOCK_ADVISORIES, Advisory } from "./data/mockData";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  CheckCircle,
  Phone,
  ArrowRight,
  Clock,
  AlertTriangle,
  Calendar,
  AlertOctagon,
  Plus,
  Search,
  Filter,
  ArrowLeft,
} from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";

interface AdvisoryInsightsProps {
  initialCategory?: string;
  selectedRegion?: string;
}

export function AdvisoryInsights({
  initialCategory,
  selectedRegion = "all",
}: AdvisoryInsightsProps = {}) {
  const [activeCategory, setActiveCategory] = useState(
    initialCategory || "Overdue",
  );
  const [isAddTaskPageOpen, setIsAddTaskPageOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    hybrid: "all",
    unit: "all",
    location: "all",
    village: "all",
  });

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

  const [taskData, setTaskData] = useState({
    unit: "",
    location: "",
    village: "",
    fieldIds: [] as string[],
    title: "",
    taskType: "",
    responseType: "",
    dueDate: "",
  });
  const [responseType, setResponseType] = useState("");
  const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);
  const [remarks, setRemarks] = useState("");
  const [taskRemarks, setTaskRemarks] = useState<Record<number, string>>({});
  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>(
    {
      3: true, // Soil Moisture Check is initially completed
    },
  );

  const handleCheckboxChange = (taskId: number, isChecked: boolean) => {
    if (!isChecked) {
      setCompletedTasks((prev) => ({ ...prev, [taskId]: false }));
    } else {
      setCurrentTaskId(taskId);
      setRemarks("");
      setIsRemarksDialogOpen(true);
    }
  };

  const handleRemarksSubmit = () => {
    if (currentTaskId !== null) {
      setTaskRemarks((prev) => ({ ...prev, [currentTaskId]: remarks }));
      setCompletedTasks((prev) => ({ ...prev, [currentTaskId]: true }));
      setIsRemarksDialogOpen(false);
      setCurrentTaskId(null);
      setRemarks("");
    }
  };

  const activeFilterCount = [
    filters.hybrid !== "all",
    filters.unit !== "all",
    filters.location !== "all",
    filters.village !== "all",
  ].filter(Boolean).length;

  // Mock tasks with relative due dates (based on April 6, 2026)
  const today = new Date("2026-04-06");
  const mockTasks = [
    {
      id: 1,
      title: "Apply Fertilizer",
      grower: "G001",
      growerName: "Rajesh Kumar",
      fieldId: "PB/AMRITSAR/RAMPUR/RK/01",
      location: "Rampur, Beas, Amritsar, Punjab",
      type: "Irrigation",
      dueDate: new Date("2026-04-04"),
      responseType: "Numerical",
    },
    {
      id: 2,
      title: "Pest Inspection",
      grower: "G002",
      growerName: "Harpreet Singh",
      fieldId: "PB/LUDHIANA/MALKPUR/HS/03",
      location: "Malkpur, Raikot, Ludhiana, Punjab",
      type: "Monitoring",
      dueDate: new Date("2026-04-06"),
      responseType: "MCQ",
    },
    {
      id: 3,
      title: "Soil Moisture Check",
      grower: "G001",
      growerName: "Rajesh Kumar",
      fieldId: "PB/AMRITSAR/RAMPUR/RK/02",
      location: "Rampur, Beas, Amritsar, Punjab",
      type: "Analysis",
      dueDate: new Date("2026-04-03"),
      responseType: "Text",
      completed: true,
    },
    {
      id: 4,
      title: "Irrigation Scheduling",
      grower: "G003",
      growerName: "Amarjit Kaur",
      fieldId: "PB/JALANDHAR/NAKODAR/AK/01",
      location: "Nakodar, Nakodar, Jalandhar, Punjab",
      type: "Maintenance",
      dueDate: new Date("2026-04-08"),
      responseType: "Text",
    },
    {
      id: 5,
      title: "Crop Stage Update",
      grower: "G002",
      growerName: "Harpreet Singh",
      fieldId: "PB/LUDHIANA/MALKPUR/HS/01",
      location: "Malkpur, Raikot, Ludhiana, Punjab",
      type: "Monitoring",
      dueDate: new Date("2026-04-10"),
      responseType: "MCQ",
    },
    {
      id: 6,
      title: "Detasseling Progress",
      grower: "G001",
      growerName: "Rajesh Kumar",
      fieldId: "PB/AMRITSAR/RAMPUR/RK/01",
      location: "Rampur, Beas, Amritsar, Punjab",
      type: "Monitoring",
      dueDate: new Date("2026-04-12"),
      responseType: "Numerical",
    },
  ];

  const getCategory = (task: (typeof mockTasks)[0]) => {
    if (task.completed || completedTasks[task.id]) return "Completed";
    const due = task.dueDate;
    const todayDate = new Date(today);
    todayDate.setHours(0, 0, 0, 0);
    const dueDate = new Date(due);
    dueDate.setHours(0, 0, 0, 0);
    const sevenDaysFromNow = new Date(todayDate);
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    if (dueDate < todayDate) return "Overdue";
    if (dueDate.getTime() === todayDate.getTime()) return "Today";
    if (dueDate <= sevenDaysFromNow) return "Upcoming";
    return "Upcoming";
  };

  const filteredTasks = mockTasks
    .filter((task) => {
      if (activeCategory === "Overdue") return getCategory(task) === "Overdue";
      if (activeCategory === "Today") return getCategory(task) === "Today";
      if (activeCategory === "Upcoming")
        return getCategory(task) === "Upcoming";
      if (activeCategory === "Completed")
        return getCategory(task) === "Completed";
      return true;
    })
    .filter((task) => {
      if (!searchQuery) return true;
      return (
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.growerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.fieldId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    })
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  const categoryCounts = {
    Overdue: mockTasks.filter((t) => getCategory(t) === "Overdue").length,
    Today: mockTasks.filter((t) => getCategory(t) === "Today").length,
    Upcoming: mockTasks.filter((t) => getCategory(t) === "Upcoming").length,
    Completed: mockTasks.filter((t) => getCategory(t) === "Completed").length,
  };

  // If add task page is open, show the full page form
  if (isAddTaskPageOpen) {
    return (
      <div className="space-y-4 h-full flex flex-col">
        {/* Header with Back Button */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setIsAddTaskPageOpen(false);
              setTaskData({
                unit: "",
                location: "",
                village: "",
                fieldIds: [],
                title: "",
                taskType: "",
                responseType: "",
                dueDate: "",
              });
              setResponseType("");
            }}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h2 className="font-bold">Add Task</h2>
            <p className="text-sm text-slate-500">Create a new advisory task</p>
          </div>
        </div>

        {/* Add Task Form */}
        <Card className="flex-1 overflow-y-auto">
          <CardContent className="p-4 space-y-4">
            {/* Location Section */}
            <div className="space-y-2">
              <Label>
                Unit <span className="text-slate-400 text-xs">(Optional)</span>
              </Label>
              <Select
                value={taskData.unit}
                onValueChange={(v) => setTaskData({ ...taskData, unit: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unit-north">Unit North</SelectItem>
                  <SelectItem value="unit-south">Unit South</SelectItem>
                  <SelectItem value="unit-east">Unit East</SelectItem>
                  <SelectItem value="unit-west">Unit West</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Location{" "}
                <span className="text-slate-400 text-xs">(Optional)</span>
              </Label>
              <Select
                value={taskData.location}
                onValueChange={(v) => setTaskData({ ...taskData, location: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="location-a">Location A</SelectItem>
                  <SelectItem value="location-b">Location B</SelectItem>
                  <SelectItem value="location-c">Location C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Village{" "}
                <span className="text-slate-400 text-xs">(Optional)</span>
              </Label>
              <Select
                value={taskData.village}
                onValueChange={(v) => setTaskData({ ...taskData, village: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Village" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rampur">Rampur</SelectItem>
                  <SelectItem value="lakhanpur">Lakhanpur</SelectItem>
                  <SelectItem value="sultanpur">Sultanpur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Field(s) *</Label>
              <div className="border rounded-md p-2 bg-white min-h-[42px]">
                <div className="flex flex-wrap gap-1 mb-1">
                  {taskData.fieldIds.map((fid) => (
                    <span
                      key={fid}
                      className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 text-xs px-2 py-0.5 rounded-full"
                    >
                      {fid}
                      <button
                        onClick={() =>
                          setTaskData({
                            ...taskData,
                            fieldIds: taskData.fieldIds.filter(
                              (f) => f !== fid,
                            ),
                          })
                        }
                        className="text-green-500 hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    className="w-full pl-7 pr-2 py-1 text-xs border-t border-slate-200 outline-none bg-transparent"
                    placeholder="Search fields..."
                  />
                </div>
                <div className="mt-1 space-y-1 max-h-32 overflow-y-auto">
                  {[
                    "PB/AMRITSAR/RAMPUR/RK/01",
                    "PB/AMRITSAR/RAMPUR/RK/02",
                    "PB/LUDHIANA/MALKPUR/HS/03",
                    "PB/JALANDHAR/NAKODAR/AK/01",
                  ].map((fid) => (
                    <div
                      key={fid}
                      className={`flex items-center gap-2 p-1.5 rounded cursor-pointer text-xs hover:bg-slate-50 ${taskData.fieldIds.includes(fid) ? "bg-green-50" : ""}`}
                      onClick={() => {
                        if (taskData.fieldIds.includes(fid)) {
                          setTaskData({
                            ...taskData,
                            fieldIds: taskData.fieldIds.filter(
                              (f) => f !== fid,
                            ),
                          });
                        } else {
                          setTaskData({
                            ...taskData,
                            fieldIds: [...taskData.fieldIds, fid],
                          });
                        }
                      }}
                    >
                      <div
                        className={`h-3.5 w-3.5 rounded border flex items-center justify-center ${taskData.fieldIds.includes(fid) ? "bg-[#4CAF50] border-[#4CAF50]" : "border-slate-300"}`}
                      >
                        {taskData.fieldIds.includes(fid) && (
                          <span className="text-white text-[8px]">✓</span>
                        )}
                      </div>
                      <span className="font-mono">{fid}</span>
                    </div>
                  ))}
                  <div
                    className="flex items-center gap-2 p-1.5 text-xs text-[#4CAF50] font-semibold cursor-pointer hover:bg-green-50 rounded"
                    onClick={() =>
                      setTaskData({
                        ...taskData,
                        fieldIds: [
                          "PB/AMRITSAR/RAMPUR/RK/01",
                          "PB/AMRITSAR/RAMPUR/RK/02",
                          "PB/LUDHIANA/MALKPUR/HS/03",
                          "PB/JALANDHAR/NAKODAR/AK/01",
                        ],
                      })
                    }
                  >
                    Select All
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Task Details Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Task Title *</Label>
                <span className="text-xs text-slate-400">
                  {taskData.title.length}/40
                </span>
              </div>
              <Input
                placeholder="Enter task title (max 40 characters)"
                value={taskData.title}
                maxLength={40}
                onChange={(e) =>
                  setTaskData({
                    ...taskData,
                    title: e.target.value.slice(0, 40),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Task Type *</Label>
              <Select
                value={taskData.taskType}
                onValueChange={(v) => setTaskData({ ...taskData, taskType: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Task Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="irrigation">Irrigation</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="analysis">Analysis</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="fertilization">Fertilization</SelectItem>
                  <SelectItem value="pest-control">Pest Control</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Response Type *</Label>
              <Select
                value={taskData.responseType}
                onValueChange={(v) => {
                  setTaskData({ ...taskData, responseType: v });
                  setResponseType(v);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Response Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Text">Text</SelectItem>
                  <SelectItem value="MCQ">MCQ (Single / Multiple)</SelectItem>
                  <SelectItem value="Numerical">Numerical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dynamic preview based on response type */}
            {responseType === "MCQ" && (
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <p className="text-xs font-semibold text-slate-600 mb-2">
                  MCQ Options Preview
                </p>
                <div className="space-y-1.5">
                  {["Option A", "Option B", "Option C", "Option D"].map(
                    (opt) => (
                      <div
                        key={opt}
                        className="flex items-center gap-2 text-xs text-slate-500"
                      >
                        <div className="h-3.5 w-3.5 rounded-full border border-slate-300" />
                        <span>{opt}</span>
                      </div>
                    ),
                  )}
                </div>
                <p className="text-[9px] text-slate-400 mt-2">
                  Options will be configurable in next step
                </p>
              </div>
            )}

            {responseType === "Numerical" && (
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <p className="text-xs font-semibold text-slate-600 mb-2">
                  Numerical Input Preview
                </p>
                <div className="h-8 border border-slate-300 rounded bg-white flex items-center px-3">
                  <span className="text-xs text-slate-400">
                    Enter number...
                  </span>
                </div>
              </div>
            )}

            {responseType === "Text" && (
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <p className="text-xs font-semibold text-slate-600 mb-2">
                  Text Response Preview
                </p>
                <div className="h-16 border border-slate-300 rounded bg-white flex items-start p-2">
                  <span className="text-xs text-slate-400">
                    Enter text response...
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Input
                type="date"
                value={taskData.dueDate}
                onChange={(e) =>
                  setTaskData({ ...taskData, dueDate: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setIsAddTaskPageOpen(false);
              setTaskData({
                unit: "",
                location: "",
                village: "",
                fieldIds: [],
                title: "",
                taskType: "",
                responseType: "",
                dueDate: "",
              });
              setResponseType("");
            }}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-[#4CAF50] hover:bg-[#388E3C]"
            onClick={() => {
              setIsAddTaskPageOpen(false);
              setTaskData({
                unit: "",
                location: "",
                village: "",
                fieldIds: [],
                title: "",
                taskType: "",
                responseType: "",
                dueDate: "",
              });
              setResponseType("");
            }}
            disabled={
              taskData.fieldIds.length === 0 ||
              !taskData.title ||
              !taskData.taskType ||
              !taskData.responseType ||
              !taskData.dueDate
            }
          >
            Save Task
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-3 h-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Advisory Tasks</h2>
            <p className="text-sm text-slate-500">Manage field tasks</p>
          </div>
          <button
            className="flex items-center gap-1.5 bg-[#4CAF50] hover:bg-[#388E3C] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
            onClick={() => setIsAddTaskPageOpen(true)}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Task
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex gap-2 items-center bg-white p-2.5 rounded-lg border shadow-sm">
          {/* Filter Icon with Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 shrink-0"
              >
                <Filter className="h-4 w-4" />
                <span className="text-xs">Filter</span>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="start">
              <div className="p-3 bg-slate-50 border-b">
                <h4 className="font-medium text-sm">Filters</h4>
                <p className="text-xs text-slate-500">
                  Filter tasks by criteria
                </p>
              </div>
              <ScrollArea className="h-[320px]">
                <div className="p-4 space-y-4">
                  {/* Hybrid */}
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
                  {/* Unit */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Unit</Label>
                    <Select
                      value={filters.unit}
                      onValueChange={(v) => setFilters({ ...filters, unit: v })}
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
                  {/* Location */}
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
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  {/* Village */}
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
                        <SelectItem value="malkpur">Malkpur</SelectItem>
                        <SelectItem value="nakodar">Nakodar</SelectItem>
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
                  onClick={() =>
                    setFilters({
                      hybrid: "all",
                      unit: "all",
                      location: "all",
                      village: "all",
                    })
                  }
                >
                  Clear All
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-2 top-2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search tasks, grower or field ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
        </div>

        {/* Task Category Tabs with Counts */}
        <div className="flex items-center gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {(["Overdue", "Today", "Upcoming", "Completed"] as const).map(
            (cat) => {
              const count = categoryCounts[cat];
              const isActive = activeCategory === cat;
              const colorMap: Record<string, string> = {
                Overdue: isActive
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-red-500 border-red-200 hover:bg-red-50",
                Today: isActive
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-orange-500 border-orange-200 hover:bg-orange-50",
                Upcoming: isActive
                  ? "bg-[#4CAF50] text-white border-[#4CAF50]"
                  : "bg-white text-[#4CAF50] border-green-200 hover:bg-green-50",
                Completed: isActive
                  ? "bg-slate-600 text-white border-slate-600"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50",
              };
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-full border whitespace-nowrap transition-colors ${colorMap[cat]}`}
                >
                  {cat}
                  <span
                    className={`text-[9px] font-bold rounded-full px-1.5 py-0 min-w-[18px] text-center ${isActive ? "bg-white/25" : "bg-current/10 opacity-75"}`}
                  >
                    {count}
                  </span>
                </button>
              );
            },
          )}
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto space-y-2 pb-20">
          {filteredTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Calendar className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">No tasks in this category</p>
            </div>
          )}
          {filteredTasks.map((task) => {
            const category = getCategory(task);
            const isCompleted = completedTasks[task.id] || task.completed;
            const dueDateStr = task.dueDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const borderColor =
              category === "Overdue"
                ? "#ef5350"
                : category === "Today"
                  ? "#ff9800"
                  : category === "Upcoming"
                    ? "#4CAF50"
                    : "#94a3b8";
            return (
              <Card
                key={task.id}
                className="border border-slate-200"
                style={{ borderLeft: `3px solid ${borderColor}` }}
              >
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      className="mt-0.5 shrink-0"
                      checked={isCompleted}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(task.id, checked === true)
                      }
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-semibold text-sm ${isCompleted ? "line-through text-slate-400" : "text-slate-800"}`}
                      >
                        {task.title}
                      </p>
                      <div className="mt-1 space-y-0.5">
                        <p
                          className={`text-xs ${isCompleted ? "text-slate-400" : "text-slate-600"}`}
                        >
                          <span className="font-medium">{task.grower}</span> ·{" "}
                          {task.growerName}
                        </p>
                        <p
                          className={`text-xs font-mono ${isCompleted ? "text-slate-400" : "text-slate-500"}`}
                        >
                          {task.fieldId}
                        </p>
                        <p
                          className={`text-xs ${isCompleted ? "text-slate-400" : "text-slate-500"}`}
                        >
                          {task.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {task.type}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs text-blue-600 border-blue-200 bg-blue-50"
                        >
                          {task.responseType}
                        </Badge>
                        <span
                          className={`text-xs font-medium ${
                            category === "Overdue"
                              ? "text-red-500"
                              : category === "Today"
                                ? "text-orange-500"
                                : "text-slate-500"
                          }`}
                        >
                          Due: {dueDateStr}
                        </span>
                      </div>
                      {taskRemarks[task.id] && (
                        <div className="mt-2 p-2 bg-slate-50 rounded-md border border-slate-200">
                          <p className="text-xs font-medium text-slate-700">
                            Remarks:
                          </p>
                          <p className="text-xs text-slate-600 mt-1">
                            {taskRemarks[task.id]}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Task Completion Remarks Dialog */}
        <Dialog
          open={isRemarksDialogOpen}
          onOpenChange={setIsRemarksDialogOpen}
        >
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Complete Task</DialogTitle>
              <DialogDescription>
                {currentTaskId ? (
                  <span className="font-semibold text-slate-800 text-sm">
                    {mockTasks.find((t) => t.id === currentTaskId)?.title}
                  </span>
                ) : null}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {currentTaskId &&
                (() => {
                  const task = mockTasks.find((t) => t.id === currentTaskId);
                  if (!task) return null;
                  return (
                    <div>
                      {task.responseType === "Text" && (
                        <div className="space-y-2">
                          <Label className="text-sm">Response *</Label>
                          <Textarea
                            placeholder="Enter your text response..."
                            className="h-20"
                          />
                        </div>
                      )}
                      {task.responseType === "MCQ" && (
                        <div className="space-y-2">
                          <Label className="text-sm">Select Answer *</Label>
                          <div className="space-y-2">
                            {[
                              "Option A",
                              "Option B",
                              "Option C",
                              "Option D",
                            ].map((opt) => (
                              <div
                                key={opt}
                                className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-slate-50"
                              >
                                <div className="h-4 w-4 rounded-full border-2 border-slate-300" />
                                <span className="text-sm">{opt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {task.responseType === "Numerical" && (
                        <div className="space-y-2">
                          <Label className="text-sm">Numerical Value *</Label>
                          <Input
                            type="number"
                            placeholder="Enter value"
                            className="h-10"
                          />
                        </div>
                      )}
                    </div>
                  );
                })()}
              <div className="space-y-2">
                <Label className="text-sm">Remarks (Optional)</Label>
                <Textarea
                  placeholder="Add any remarks about task completion..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="h-16"
                />
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsRemarksDialogOpen(false);
                  setCurrentTaskId(null);
                  setRemarks("");
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#4CAF50] hover:bg-[#388E3C]"
                onClick={handleRemarksSubmit}
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
