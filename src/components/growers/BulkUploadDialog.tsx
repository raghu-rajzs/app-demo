import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Upload } from "lucide-react";

interface BulkUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BulkUploadDialog({ isOpen, onClose }: BulkUploadDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full h-full m-0 rounded-none sm:max-w-lg sm:h-auto sm:m-6 sm:rounded-lg">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle className="text-xl">Bulk Upload Growers</DialogTitle>
          <DialogDescription>
            Download the template, fill in the grower details, and upload the
            completed file.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="space-y-6 py-4">
            {/* Download Template Section */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Step 1: Download Template
              </Label>
              <div className="border-2 border-dashed border-[#10B981] rounded-lg p-4 bg-green-50">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-[#10B981] rounded-lg flex items-center justify-center shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-white"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">Growers_Template.xlsx</p>
                      <p className="text-xs text-slate-600">
                        Excel template with required fields
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    className="w-full h-12 bg-[#10B981] hover:bg-[#0e9870]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 mr-2"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                    Download Template
                  </Button>
                </div>
              </div>
            </div>

            {/* Upload File Section */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                Step 2: Upload Completed File
              </Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 bg-slate-50 active:bg-slate-100 transition-colors">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="font-medium mb-1">Tap to upload file</p>
                  <p className="text-sm text-slate-500 mb-4">
                    Excel files (.xlsx, .xls) up to 10MB
                  </p>
                  <Input
                    type="file"
                    className="hidden"
                    id="bulk-upload-file"
                    accept=".xlsx,.xls"
                  />
                  <label htmlFor="bulk-upload-file" className="w-full">
                    <Button variant="outline" size="lg" className="w-full">
                      Browse Files
                    </Button>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 px-4 pb-4 sm:flex-row">
          <Button
            className="w-full h-12 bg-[#10B981] hover:bg-[#0e9870] sm:w-auto"
            onClick={onClose}
          >
            Upload & Process
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 sm:w-auto"
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
