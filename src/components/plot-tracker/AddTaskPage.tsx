import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ArrowLeft } from "lucide-react";

interface TaskData {
  title: string;
  taskType: string;
  dueDate: string;
}

interface AddTaskPageProps {
  taskData: TaskData;
  setTaskData: (data: TaskData) => void;
  onClose: () => void;
}

export function AddTaskPage({
  taskData,
  setTaskData,
  onClose,
}: AddTaskPageProps) {
  const handleSave = () => {
    onClose();
    setTaskData({ title: "", taskType: "", dueDate: "" });
  };

  const handleCancel = () => {
    onClose();
    setTaskData({ title: "", taskType: "", dueDate: "" });
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="font-bold">Add Task</h2>
          <p className="text-sm text-slate-500">
            Create a new task for this plot
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="flex-1">
        <CardContent className="p-4 space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="Enter task title"
              value={taskData.title}
              onChange={(e) =>
                setTaskData({ ...taskData, title: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Task Type</Label>
            <Select
              value={taskData.taskType}
              onValueChange={(v) => setTaskData({ ...taskData, taskType: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select task type" />
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
            <Label>Due Date</Label>
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

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button variant="outline" className="flex-1" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          className="flex-1"
          onClick={handleSave}
          disabled={!taskData.title || !taskData.taskType || !taskData.dueDate}
        >
          Save Task
        </Button>
      </div>
    </div>
  );
}
