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
    initialCategory || "All",
  );
  const [isAddTaskPageOpen, setIsAddTaskPageOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    state: "all",
    district: "all",
    taluka: "all",
    village: "all",
    growerId: "all",
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

  // Pre-fill state if a specific region is selected
  const initialState =
    selectedRegion !== "all" ? getStateDisplayName(selectedRegion) : "";

  const [taskData, setTaskData] = useState({
    state: initialState,
    district: "",
    taluka: "",
    village: "",
    grower: "",
    plotId: "",
    title: "",
    taskType: "",
    dueDate: "",
  });
  const [isRemarksDialogOpen, setIsRemarksDialogOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);
  const [remarks, setRemarks] = useState("");
  const [taskRemarks, setTaskRemarks] = useState<Record<number, string>>({});
  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>(
    {
      3: true, // Task 3 is initially completed
    },
  );

  const handleCheckboxChange = (taskId: number, isChecked: boolean) => {
    if (!isChecked) {
      // Unchecking - just update state
      setCompletedTasks((prev) => ({ ...prev, [taskId]: false }));
    } else {
      // Checking - open remarks dialog
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

  const categories = ["All", "Irrigation", "Pest Control", "Fertilizer"];

  const activeFilterCount = [
    filters.state !== "all",
    filters.district !== "all",
    filters.taluka !== "all",
    filters.village !== "all",
    filters.growerId !== "all",
  ].filter(Boolean).length;

  const pendingAdvisories = MOCK_ADVISORIES.filter(
    (a) => a.status !== "Completed",
  );
  const completedAdvisories = MOCK_ADVISORIES.filter(
    (a) => a.status === "Completed",
  );

  const filterList = (list: Advisory[]) => {
    // First filter by status category
    let filtered = list;
    if (activeCategory === "Overdue") {
      filtered = MOCK_ADVISORIES.filter((a) => a.status === "Overdue");
    } else if (activeCategory === "Pending") {
      filtered = MOCK_ADVISORIES.filter((a) => a.status === "Pending");
    } else if (activeCategory === "Completed") {
      filtered = MOCK_ADVISORIES.filter((a) => a.status === "Completed");
    }
    return filtered;
  };

  const filteredPending = filterList(pendingAdvisories);
  const filteredCompleted = filterList(completedAdvisories);
  const filteredOverdue = filterList(
    pendingAdvisories.filter((a) => a.status === "Overdue"),
  );

  // Get first pending advisory for the top card
  const pendingAdvisory = filteredPending[0];

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
                state: initialState,
                district: "",
                taluka: "",
                village: "",
                grower: "",
                plotId: "",
                title: "",
                taskType: "",
                dueDate: "",
              });
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
              <Label>State *</Label>
              {selectedRegion !== "all" ? (
                <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-900">
                  {taskData.state}
                </div>
              ) : (
                <Select
                  value={taskData.state}
                  onValueChange={(v) => setTaskData({ ...taskData, state: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Punjab">Punjab</SelectItem>
                    <SelectItem value="Haryana">Haryana</SelectItem>
                    <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="Gujarat">Gujarat</SelectItem>
                    <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label>District *</Label>
              <Select
                value={taskData.district}
                onValueChange={(v) => setTaskData({ ...taskData, district: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Districts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amritsar">Amritsar</SelectItem>
                  <SelectItem value="ludhiana">Ludhiana</SelectItem>
                  <SelectItem value="jalandhar">Jalandhar</SelectItem>
                  <SelectItem value="patiala">Patiala</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Taluka *</Label>
              <Select
                value={taskData.taluka}
                onValueChange={(v) => setTaskData({ ...taskData, taluka: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Talukas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beas">Beas</SelectItem>
                  <SelectItem value="raikot">Raikot</SelectItem>
                  <SelectItem value="nakodar">Nakodar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Village *</Label>
              <Select
                value={taskData.village}
                onValueChange={(v) => setTaskData({ ...taskData, village: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Villages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rampur">Rampur</SelectItem>
                  <SelectItem value="malkpur">Malkpur</SelectItem>
                  <SelectItem value="nakodar">Nakodar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Grower and Plot Section */}
            <div className="space-y-2">
              <Label>Grower *</Label>
              <Select
                value={taskData.grower}
                onValueChange={(v) => setTaskData({ ...taskData, grower: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Growers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="G001">G001 - Rajesh Kumar</SelectItem>
                  <SelectItem value="G002">G002 - Harpreet Singh</SelectItem>
                  <SelectItem value="G003">G003 - Amarjit Kaur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Field ID *</Label>
              <Select
                value={taskData.plotId}
                onValueChange={(v) => setTaskData({ ...taskData, plotId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Fields" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PB/AMRITSAR/RAMPUR/RK/01">
                    PB/AMRITSAR/RAMPUR/RK/01
                  </SelectItem>
                  <SelectItem value="PB/AMRITSAR/RAMPUR/RK/02">
                    PB/AMRITSAR/RAMPUR/RK/02
                  </SelectItem>
                  <SelectItem value="PB/LUDHIANA/MALKPUR/HS/03">
                    PB/LUDHIANA/MALKPUR/HS/03
                  </SelectItem>
                  <SelectItem value="PB/JALANDHAR/NAKODAR/AK/01">
                    PB/JALANDHAR/NAKODAR/AK/01
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Task Details Section */}
            <div className="space-y-2">
              <Label>Task Title *</Label>
              <Input
                placeholder="Enter task title"
                value={taskData.title}
                onChange={(e) =>
                  setTaskData({ ...taskData, title: e.target.value })
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
                  <SelectValue placeholder="All Task Types" />
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
                state: "",
                district: "",
                taluka: "",
                village: "",
                grower: "",
                plotId: "",
                title: "",
                taskType: "",
                dueDate: "",
              });
            }}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-[#4CAF50] hover:bg-[#388E3C]"
            onClick={() => {
              // Save task logic here
              setIsAddTaskPageOpen(false);
              setTaskData({
                state: "",
                district: "",
                taluka: "",
                village: "",
                grower: "",
                plotId: "",
                title: "",
                taskType: "",
                dueDate: "",
              });
            }}
            disabled={
              !taskData.state ||
              !taskData.district ||
              !taskData.taluka ||
              !taskData.village ||
              !taskData.grower ||
              !taskData.plotId ||
              !taskData.title ||
              !taskData.taskType ||
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
          <Button
            size="icon"
            className="bg-[#4CAF50] hover:bg-[#388E3C]"
            onClick={() => setIsAddTaskPageOpen(true)}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex gap-3 items-center justify-between bg-white p-3 rounded-lg border shadow-sm">
          {/* Filter Icon with Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-2">
                <Filter className="h-4 w-4" />
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="p-3 bg-slate-50 border-b">
                <h4 className="font-medium text-sm">Filters</h4>
                <p className="text-xs text-slate-500">
                  Filter tasks by location and grower
                </p>
              </div>
              <ScrollArea className="h-[400px]">
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
                        <SelectItem value="raikot">Raikot</SelectItem>
                        <SelectItem value="nakodar">Nakodar</SelectItem>
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
                        <SelectItem value="malkpur">Malkpur</SelectItem>
                        <SelectItem value="nakodar">Nakodar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Grower ID Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Grower ID</Label>
                    <Select
                      value={filters.growerId}
                      onValueChange={(v) =>
                        setFilters({ ...filters, growerId: v })
                      }
                    >
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="All Growers" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Growers</SelectItem>
                        <SelectItem value="G001">
                          G001 - Rajesh Kumar
                        </SelectItem>
                        <SelectItem value="G002">
                          G002 - Harpreet Singh
                        </SelectItem>
                        <SelectItem value="G003">
                          G003 - Amarjit Kaur
                        </SelectItem>
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
                      state: "all",
                      district: "all",
                      taluka: "all",
                      village: "all",
                      growerId: "all",
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
              placeholder="Search by Keywords, Plot ID, Grower Name or Village"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>
        </div>

        {/* Task Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <Button
            variant={activeCategory === "All" ? "default" : "outline"}
            size="sm"
            className={`h-8 text-xs whitespace-nowrap ${
              activeCategory === "All" ? "bg-[#4CAF50] hover:bg-[#388E3C]" : ""
            }`}
            onClick={() => setActiveCategory("All")}
          >
            All
          </Button>
          <Button
            variant={activeCategory === "Overdue" ? "default" : "outline"}
            size="sm"
            className={`h-8 text-xs whitespace-nowrap ${
              activeCategory === "Overdue"
                ? "bg-[#4CAF50] hover:bg-[#388E3C]"
                : ""
            }`}
            onClick={() => setActiveCategory("Overdue")}
          >
            Overdue
          </Button>
          <Button
            variant={activeCategory === "Pending" ? "default" : "outline"}
            size="sm"
            className={`h-8 text-xs whitespace-nowrap ${
              activeCategory === "Pending"
                ? "bg-[#4CAF50] hover:bg-[#388E3C]"
                : ""
            }`}
            onClick={() => setActiveCategory("Pending")}
          >
            Pending
          </Button>
          <Button
            variant={activeCategory === "Completed" ? "default" : "outline"}
            size="sm"
            className={`h-8 text-xs whitespace-nowrap ${
              activeCategory === "Completed"
                ? "bg-[#4CAF50] hover:bg-[#388E3C]"
                : ""
            }`}
            onClick={() => setActiveCategory("Completed")}
          >
            Completed
          </Button>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto space-y-2 pb-20">
          {/* Task 1 */}
          <Card className="border border-slate-200">
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  className="mt-0.5"
                  checked={completedTasks[1]}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(1, checked === true)
                  }
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium text-sm ${completedTasks[1] ? "line-through text-slate-400" : ""}`}
                  >
                    Apply Fertilizer
                  </p>
                  <div className="mt-1 space-y-0.5">
                    <p
                      className={`text-xs ${completedTasks[1] ? "text-slate-400" : "text-slate-600"}`}
                    >
                      <span className="font-medium">G001</span> - Rajesh Kumar
                    </p>
                    <p
                      className={`text-xs ${completedTasks[1] ? "text-slate-400" : "text-slate-500"}`}
                    >
                      PB/AMRITSAR/RAMPUR/RK/01
                    </p>
                    <p
                      className={`text-xs ${completedTasks[1] ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Rampur, Beas, Amritsar, Punjab
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      Irrigation
                    </Badge>
                    <span
                      className={`text-xs ${completedTasks[1] ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Due: Dec 10, 2024
                    </span>
                  </div>
                  {taskRemarks[1] && (
                    <div className="mt-2 p-2 bg-slate-50 rounded-md border border-slate-200">
                      <p className="text-xs font-medium text-slate-700">
                        Remarks:
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        {taskRemarks[1]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task 2 */}
          <Card className="border border-slate-200">
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  className="mt-0.5"
                  checked={completedTasks[2]}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(2, checked === true)
                  }
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium text-sm ${completedTasks[2] ? "line-through text-slate-400" : ""}`}
                  >
                    Pest Inspection
                  </p>
                  <div className="mt-1 space-y-0.5">
                    <p
                      className={`text-xs ${completedTasks[2] ? "text-slate-400" : "text-slate-600"}`}
                    >
                      <span className="font-medium">G002</span> - Harpreet Singh
                    </p>
                    <p
                      className={`text-xs ${completedTasks[2] ? "text-slate-400" : "text-slate-500"}`}
                    >
                      PB/LUDHIANA/MALKPUR/HS/03
                    </p>
                    <p
                      className={`text-xs ${completedTasks[2] ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Malkpur, Raikot, Ludhiana, Punjab
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      Monitoring
                    </Badge>
                    <span
                      className={`text-xs ${completedTasks[2] ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Due: Dec 12, 2024
                    </span>
                  </div>
                  {taskRemarks[2] && (
                    <div className="mt-2 p-2 bg-slate-50 rounded-md border border-slate-200">
                      <p className="text-xs font-medium text-slate-700">
                        Remarks:
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        {taskRemarks[2]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task 3 - Completed */}
          <Card className="border border-slate-200">
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  className="mt-0.5"
                  checked={completedTasks[3]}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(3, checked === true)
                  }
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium text-sm ${completedTasks[3] ? "line-through text-slate-400" : ""}`}
                  >
                    Soil Testing
                  </p>
                  <div className="mt-1 space-y-0.5">
                    <p
                      className={`text-xs ${completedTasks[3] ? "text-slate-400" : "text-slate-600"}`}
                    >
                      <span className="font-medium">G001</span> - Rajesh Kumar
                    </p>
                    <p
                      className={`text-xs ${completedTasks[3] ? "text-slate-400" : "text-slate-500"}`}
                    >
                      PB/AMRITSAR/RAMPUR/RK/02
                    </p>
                    <p
                      className={`text-xs ${completedTasks[3] ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Rampur, Beas, Amritsar, Punjab
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      Analysis
                    </Badge>
                    <span
                      className={`text-xs ${completedTasks[3] ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Due: Dec 5, 2024
                    </span>
                  </div>
                  {taskRemarks[3] && (
                    <div className="mt-2 p-2 bg-slate-50 rounded-md border border-slate-200">
                      <p className="text-xs font-medium text-slate-700">
                        Remarks:
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        {taskRemarks[3]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Task 4 */}
          <Card className="border border-slate-200">
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  className="mt-0.5"
                  checked={completedTasks[4]}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(4, checked === true)
                  }
                />
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium text-sm ${completedTasks[4] ? "line-through text-slate-400" : ""}`}
                  >
                    Weed Control
                  </p>
                  <div className="mt-1 space-y-0.5">
                    <p
                      className={`text-xs ${completedTasks[4] ? "text-slate-400" : "text-slate-600"}`}
                    >
                      <span className="font-medium">G003</span> - Amarjit Kaur
                    </p>
                    <p
                      className={`text-xs ${completedTasks[4] ? "text-slate-400" : "text-slate-500"}`}
                    >
                      PB/JALANDHAR/NAKODAR/AK/01
                    </p>
                    <p
                      className={`text-xs ${completedTasks[4] ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Nakodar, Nakodar, Jalandhar, Punjab
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      Maintenance
                    </Badge>
                    <span
                      className={`text-xs ${completedTasks[4] ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Due: Dec 15, 2024
                    </span>
                  </div>
                  {taskRemarks[4] && (
                    <div className="mt-2 p-2 bg-slate-50 rounded-md border border-slate-200">
                      <p className="text-xs font-medium text-slate-700">
                        Remarks:
                      </p>
                      <p className="text-xs text-slate-600 mt-1">
                        {taskRemarks[4]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Remarks Full Page */}
      {isRemarksDialogOpen && (
        <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in fade-in slide-in-from-bottom duration-300">
          {/* Green Header */}
          <div className="px-4 py-3 border-b bg-[rgb(76,175,80)] text-white flex justify-between items-center">
            <div className="flex-1">
              <h2 className="text-lg font-bold leading-none">Add Remarks</h2>
              <p className="text-xs mt-1 text-white/80">
                Add completion remarks for this task
              </p>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="remarks" className="text-base font-medium">
                  Remarks <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="remarks"
                  placeholder="Enter your remarks here..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={6}
                  className="resize-none text-base"
                />
              </div>
            </div>
          </div>

          {/* Footer with Buttons */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 h-10 text-sm"
                onClick={() => {
                  setIsRemarksDialogOpen(false);
                  setCurrentTaskId(null);
                  setRemarks("");
                }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-10 bg-[#4CAF50] hover:bg-[#388E3C] text-sm"
                onClick={handleRemarksSubmit}
                disabled={!remarks.trim()}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
