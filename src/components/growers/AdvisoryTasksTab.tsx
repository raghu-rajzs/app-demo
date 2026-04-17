import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { AlertOctagon, Plus } from "lucide-react";
import { Advisory } from "../data/mockData";

interface AdvisoryTasksTabProps {
  pendingAdvisory: Advisory | undefined;
}

export function AdvisoryTasksTab({ pendingAdvisory }: AdvisoryTasksTabProps) {
  return (
    <div className="space-y-4">
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

      {/* Tasks */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Tasks</h3>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Task List */}
          <div className="space-y-2">
            <Card className="border border-slate-200">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <Checkbox className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">Apply Fertilizer</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Irrigation
                      </Badge>
                      <span className="text-xs text-slate-500">
                        Due: Dec 10, 2024
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200">
              <CardContent className="p-3">
                <div className="flex items-start gap-3">
                  <Checkbox className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">Pest Inspection</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Monitoring
                      </Badge>
                      <span className="text-xs text-slate-500">
                        Due: Dec 12, 2024
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
