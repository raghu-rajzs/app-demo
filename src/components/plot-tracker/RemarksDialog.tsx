import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface RemarksDialogProps {
  remarks: string;
  setRemarks: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function RemarksDialog({
  remarks,
  setRemarks,
  onSubmit,
  onCancel,
}: RemarksDialogProps) {
  return (
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="remarks-input" className="text-base font-medium">
              Remarks <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="remarks-input"
              placeholder="Enter your remarks here..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={6}
              className="resize-none text-base"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 h-10 text-sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 h-10 bg-[#4CAF50] hover:bg-[#388E3C] text-sm"
            onClick={onSubmit}
            disabled={!remarks.trim()}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
