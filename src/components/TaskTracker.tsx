import React, { useState } from "react";
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Plus,
  Filter,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

interface Task {
  id: string;
  title: string;
  grower: string;
  plot: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed" | "overdue";
  priority: "low" | "medium" | "high";
  category: string;
}

const MOCK_TASKS: Task[] = [
  {
    id: "1",
    title: "Soil Testing - Field A",
    grower: "Ramesh Kumar",
    plot: "Field A (2.5 acres)",
    dueDate: "2024-12-05",
    status: "overdue",
    priority: "high",
    category: "Testing",
  },
  {
    id: "2",
    title: "Irrigation System Check",
    grower: "Suresh Patel",
    plot: "Field B (3.2 acres)",
    dueDate: "2024-12-06",
    status: "in-progress",
    priority: "medium",
    category: "Maintenance",
  },
  {
    id: "3",
    title: "Fertilizer Application",
    grower: "Anita Singh",
    plot: "Field C (1.8 acres)",
    dueDate: "2024-12-08",
    status: "pending",
    priority: "high",
    category: "Field Work",
  },
  {
    id: "4",
    title: "Pest Inspection",
    grower: "Vikram Reddy",
    plot: "Field D (4.1 acres)",
    dueDate: "2024-12-10",
    status: "pending",
    priority: "medium",
    category: "Inspection",
  },
  {
    id: "5",
    title: "Harvest Planning",
    grower: "Priya Sharma",
    plot: "Field E (2.9 acres)",
    dueDate: "2024-12-02",
    status: "completed",
    priority: "low",
    category: "Planning",
  },
];

export function TaskTracker() {
  const [filter, setFilter] = useState<
    "all" | "pending" | "in-progress" | "completed" | "overdue"
  >("all");

  const filteredTasks = MOCK_TASKS.filter((task) =>
    filter === "all" ? true : task.status === filter,
  );

  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-800 border-slate-300">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      default:
        return "border-l-blue-500";
    }
  };

  const stats = {
    total: MOCK_TASKS.length,
    pending: MOCK_TASKS.filter((t) => t.status === "pending").length,
    inProgress: MOCK_TASKS.filter((t) => t.status === "in-progress").length,
    overdue: MOCK_TASKS.filter((t) => t.status === "overdue").length,
    completed: MOCK_TASKS.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Task Tracker</h2>
            <p className="text-sm text-slate-500">Manage your field tasks</p>
          </div>
          <Button className="bg-[#10B981] hover:bg-[#0e9870] h-10 gap-2">
            <Plus className="h-5 w-5" />
            Add Task
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">Pending</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.pending}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500 opacity-20" />
            </div>
          </Card>
          <Card className="p-3 border-l-4 border-l-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">In Progress</p>
                <p className="text-2xl font-bold text-slate-900">
                  {stats.inProgress}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500 opacity-20" />
            </div>
          </Card>
          <Card className="p-3 border-l-4 border-l-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.overdue}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500 opacity-20" />
            </div>
          </Card>
          <Card className="p-3 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </Card>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b px-4 py-3 flex gap-2 overflow-x-auto">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className={filter === "all" ? "bg-[#10B981] hover:bg-[#0e9870]" : ""}
        >
          All ({stats.total})
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("pending")}
          className={
            filter === "pending" ? "bg-blue-500 hover:bg-blue-600" : ""
          }
        >
          Pending ({stats.pending})
        </Button>
        <Button
          variant={filter === "in-progress" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("in-progress")}
          className={
            filter === "in-progress" ? "bg-yellow-500 hover:bg-yellow-600" : ""
          }
        >
          In Progress ({stats.inProgress})
        </Button>
        <Button
          variant={filter === "overdue" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("overdue")}
          className={filter === "overdue" ? "bg-red-500 hover:bg-red-600" : ""}
        >
          Overdue ({stats.overdue})
        </Button>
      </div>

      {/* Task List */}
      <div className="p-4 space-y-3">
        {filteredTasks.map((task) => (
          <Card
            key={task.id}
            className={`border-l-4 ${getPriorityColor(task.priority)} p-4 shadow-sm`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-bold text-base text-slate-900">
                    {task.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">{task.grower}</p>
                </div>
                {getStatusBadge(task.status)}
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-1">
                  <CheckSquare className="h-4 w-4" />
                  <span>{task.plot}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Badge variant="outline" className="text-xs">
                  {task.category}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-[#10B981]"
                >
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CheckSquare className="h-16 w-16 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">No tasks found</p>
          <p className="text-sm text-slate-400 mt-1">
            Try adjusting your filters
          </p>
        </div>
      )}
    </div>
  );
}
