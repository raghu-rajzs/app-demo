import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { AddGrowerForm } from "./AddGrowerForm";
import { FormData } from "./config/formDefaults";

interface AddGrowerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingGrowerId: string | null;
  addStep: number;
  setAddStep: (step: number) => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
  selectedCropType: string;
  setSelectedCropType: (type: string) => void;
  onSubmit: () => void;
}

export function AddGrowerDialog({
  isOpen,
  onClose,
  editingGrowerId,
  addStep,
  setAddStep,
  formData,
  setFormData,
  selectedCropType,
  setSelectedCropType,
  onSubmit,
}: AddGrowerDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-full h-full m-0 rounded-none p-0">
        <DialogTitle className="sr-only">
          {editingGrowerId ? "Edit Grower" : "Add New Grower"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {editingGrowerId
            ? "Edit the grower details"
            : "Wizard to add a new grower and their plots."}
        </DialogDescription>

        {/* Green Header matching AddPlotWizard */}
        <div className="px-4 py-3 border-b bg-[rgb(76,175,80)] text-white flex justify-between items-center">
          <div className="flex-1">
            <h2 className="text-lg font-bold leading-none">
              {editingGrowerId ? "Edit Grower" : "Add New Grower"}
            </h2>
            <p className="text-xs text-[rgb(255,255,255)] mt-1">
              {editingGrowerId
                ? "Update grower details"
                : "Fill in the grower details"}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <AddGrowerForm
            addStep={addStep}
            setAddStep={setAddStep}
            formData={formData}
            setFormData={setFormData}
            selectedCropType={selectedCropType}
            setSelectedCropType={setSelectedCropType}
          />
        </div>

        {/* Footer with same button styling as AddPlotWizard */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 h-10 text-sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 h-10 bg-[#4CAF50] hover:bg-[#388E3C] text-sm"
              onClick={onSubmit}
            >
              {editingGrowerId ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
