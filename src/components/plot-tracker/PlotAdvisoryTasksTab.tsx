import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { AlertOctagon, Plus, Search } from "lucide-react";
import { Advisory } from "../data/mockData";
import { RemarksDialog } from "./RemarksDialog";

interface PlotAdvisoryTasksTabProps {
  pendingAdvisory: Advisory | undefined;
  onAddTask: () => void;
}

export function PlotAdvisoryTasksTab({
  pendingAdvisory,
  onAddTask,
}: PlotAdvisoryTasksTabProps) {
  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>(
    { 3: true },
  );
  const [taskRemarks, setTaskRemarks] = useState<Record<number, string>>({});
  const [isRemarksOpen, setIsRemarksOpen] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);
  const [remarks, setRemarks] = useState("");

  const handleCheckboxChange = (taskId: number, isChecked: boolean) => {
    if (!isChecked) {
      setCompletedTasks((prev) => ({ ...prev, [taskId]: false }));
    } else {
      setCurrentTaskId(taskId);
      setRemarks("");
      setIsRemarksOpen(true);
    }
  };

  const handleRemarksSubmit = () => {
    if (currentTaskId !== null) {
      setTaskRemarks((prev) => ({ ...prev, [currentTaskId]: remarks }));
      setCompletedTasks((prev) => ({ ...prev, [currentTaskId]: true }));
      setIsRemarksOpen(false);
      setCurrentTaskId(null);
      setRemarks("");
    }
  };

  const TASKS = [
    {
      id: 1,
      title: "Apply Fertilizer",
      type: "Irrigation",
      due: "Dec 10, 2024",
    },
    {
      id: 2,
      title: "Pest Inspection",
      type: "Monitoring",
      due: "Dec 12, 2024",
    },
    { id: 3, title: "Soil Testing", type: "Analysis", due: "Dec 5, 2024" },
    { id: 4, title: "Weed Control", type: "Maintenance", due: "Dec 15, 2024" },
  ];

  return (
    <div className="space-y-4 relative">
      {/* Pending Advisory */}
      {pendingAdvisory && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-amber-900 flex items-center gap-2">
                <AlertOctagon className="h-5 w-5" /> Pending Advisory
              </h3>
              <Badge
                variant="outline"
                className="bg-amber-100 text-amber-800 border-amber-300"
              >
                High Priority
              </Badge>
            </div>
            <div>
              <p className="font-medium text-amber-900">
                {pendingAdvisory.title}
              </p>
              <p className="text-sm text-amber-700 mt-1">
                {pendingAdvisory.action}
              </p>
            </div>
            <Button
              size="sm"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white border-none"
            >
              Execute Advisory
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tasks Card */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Tasks</h3>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={onAddTask}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Filter Tabs + Search */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button size="sm" variant="outline" className="h-7 text-xs">
                All
              </Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs">
                Overdue
              </Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs">
                Pending
              </Button>
              <Button size="sm" variant="ghost" className="h-7 text-xs">
                Completed
              </Button>
            </div>
            <Button size="icon" variant="ghost" className="h-7 w-7 ml-auto">
              <Search className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Task List */}
          <div className="space-y-2">
            {TASKS.map((task) => (
              <Card key={task.id} className="border border-slate-200">
                <CardContent className="p-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      className="mt-0.5"
                      checked={completedTasks[task.id]}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(task.id, checked === true)
                      }
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium text-sm ${completedTasks[task.id] ? "line-through text-slate-400" : ""}`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {task.type}
                        </Badge>
                        <span
                          className={`text-xs ${completedTasks[task.id] ? "text-slate-400" : "text-slate-500"}`}
                        >
                          Due: {task.due}
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
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Remarks Overlay */}
      {isRemarksOpen && (
        <RemarksDialog
          remarks={remarks}
          setRemarks={setRemarks}
          onSubmit={handleRemarksSubmit}
          onCancel={() => {
            setIsRemarksOpen(false);
            setCurrentTaskId(null);
            setRemarks("");
          }}
        />
      )}
    </div>
  );
}
