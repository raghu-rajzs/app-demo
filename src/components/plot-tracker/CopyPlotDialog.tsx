import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { MOCK_GROWERS, MOCK_PLOTS } from "../data/mockData";

interface CopyPlotData {
  season: string;
  state: string;
  district: string;
  grower: string;
  plotId: string;
}

interface CopyPlotDialogProps {
  isOpen: boolean;
  copyPlotData: CopyPlotData;
  setCopyPlotData: (data: CopyPlotData) => void;
  onProceed: (initialData: any) => void;
  onClose: () => void;
}

export function CopyPlotDialog({
  isOpen,
  copyPlotData,
  setCopyPlotData,
  onProceed,
  onClose,
}: CopyPlotDialogProps) {
  const handleProceed = () => {
    const plot = MOCK_PLOTS.find((p) => p.id === copyPlotData.plotId);
    if (plot) {
      onProceed({
        grower: plot.growerId,
        fieldAssistant: "rajiv-sharma",
        state: plot.state,
        district: plot.district,
        taluka: "taluka-x",
        village: "village-alpha",
        hybrid: "super-99",
        purpose: "all_hybrids",
        irrigation: plot.irrigationMethod?.toLowerCase() || "drip",
        planting: "manual",
        isolationVerified: "yes",
        crop: plot.crop?.toLowerCase() || "corn",
        sowingDate: "",
        estimatedAcreage: plot.acreage?.toString() || "",
      });
    }
    setCopyPlotData({
      season: "",
      state: "",
      district: "",
      grower: "",
      plotId: "",
    });
  };

  const handleClose = () => {
    setCopyPlotData({
      season: "",
      state: "",
      district: "",
      grower: "",
      plotId: "",
    });
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        className="max-w-full h-full m-0 rounded-none p-0 flex flex-col"
        hideCloseButton
      >
        <DialogTitle className="sr-only">Copy From Existing Plot</DialogTitle>
        <DialogDescription className="sr-only">
          Select an existing plot to copy data from
        </DialogDescription>

        {/* Green Header */}
        <div className="px-4 py-3 border-b bg-[rgb(76,175,80)] text-white flex items-center flex-shrink-0">
          <div className="flex-1">
            <h2 className="text-lg font-bold leading-none">
              Copy From Existing Plot
            </h2>
            <p className="text-xs text-white/80 mt-1">
              Select an existing plot to copy data from
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Season</Label>
              <Select
                value={copyPlotData.season}
                onValueChange={(v) =>
                  setCopyPlotData({ ...copyPlotData, season: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-kharif">2024 - Kharif</SelectItem>
                  <SelectItem value="2024-rabi">2024 - Rabi</SelectItem>
                  <SelectItem value="2023-kharif">2023 - Kharif</SelectItem>
                  <SelectItem value="2023-rabi">2023 - Rabi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>State</Label>
              <Select
                value={copyPlotData.state}
                onValueChange={(v) =>
                  setCopyPlotData({
                    ...copyPlotData,
                    state: v,
                    district: "",
                    grower: "",
                    plotId: "",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="punjab">Punjab</SelectItem>
                  <SelectItem value="haryana">Haryana</SelectItem>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                  <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>District</Label>
              <Select
                value={copyPlotData.district}
                onValueChange={(v) =>
                  setCopyPlotData({
                    ...copyPlotData,
                    district: v,
                    grower: "",
                    plotId: "",
                  })
                }
                disabled={!copyPlotData.state}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amritsar">Amritsar</SelectItem>
                  <SelectItem value="ludhiana">Ludhiana</SelectItem>
                  <SelectItem value="jalandhar">Jalandhar</SelectItem>
                  <SelectItem value="patiala">Patiala</SelectItem>
                  <SelectItem value="bathinda">Bathinda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Grower</Label>
              <Select
                value={copyPlotData.grower}
                onValueChange={(v) =>
                  setCopyPlotData({ ...copyPlotData, grower: v, plotId: "" })
                }
                disabled={!copyPlotData.district}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grower" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_GROWERS.map((grower) => (
                    <SelectItem key={grower.id} value={grower.id}>
                      {grower.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Plot ID</Label>
              <Select
                value={copyPlotData.plotId}
                onValueChange={(v) =>
                  setCopyPlotData({ ...copyPlotData, plotId: v })
                }
                disabled={!copyPlotData.grower}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_PLOTS.filter(
                    (p) => p.growerId === copyPlotData.grower,
                  ).map((plot) => (
                    <SelectItem key={plot.id} value={plot.id}>
                      {plot.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-white flex-shrink-0">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="text-sm px-3"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-[#4CAF50] hover:bg-[#388E3C] text-sm"
              onClick={handleProceed}
              disabled={!copyPlotData.plotId}
            >
              Proceed
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
