import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Camera, Video, Edit, Plus } from "lucide-react";
import { MediaEntry } from "./config/formDefaults";

interface PropertyMediaSectionProps {
  isMediaSectionOpen: boolean;
  setIsMediaSectionOpen: (v: boolean) => void;
  isMediaSaved: boolean;
  setIsMediaSaved: (v: boolean) => void;
  mediaEntries: MediaEntry[];
  setMediaEntries: (entries: MediaEntry[]) => void;
}

export function PropertyMediaSection({
  isMediaSectionOpen,
  setIsMediaSectionOpen,
  isMediaSaved,
  setIsMediaSaved,
  mediaEntries,
  setMediaEntries,
}: PropertyMediaSectionProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">
            Property Photos & Videos
          </h3>
          {isMediaSaved && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => {
                setIsMediaSectionOpen(true);
                setIsMediaSaved(false);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>

        {!isMediaSaved && !isMediaSectionOpen && (
          <Button
            className="w-full gap-2 bg-[#4CAF50] hover:bg-[#388E3C]"
            onClick={() => setIsMediaSectionOpen(true)}
          >
            <Plus className="h-4 w-4" /> Add Media
          </Button>
        )}

        {isMediaSaved && !isMediaSectionOpen && (
          <div className="space-y-3 pt-2">
            {mediaEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-3 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  {entry.type === "photo" ? (
                    <Camera className="h-4 w-4 text-slate-600" />
                  ) : (
                    <Video className="h-4 w-4 text-slate-600" />
                  )}
                  <span className="font-medium text-slate-900 capitalize">
                    {entry.type}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Date Captured</p>
                    <p className="font-medium text-slate-900">
                      {new Date(entry.dateCaptured).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Time Captured</p>
                    <p className="font-medium text-slate-900">
                      {entry.timeCaptured}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isMediaSectionOpen && (
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label>Media Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photo">Photo</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" className="w-full gap-2">
              <Camera className="h-4 w-4" />
              Capture/Upload Media
            </Button>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsMediaSectionOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#4CAF50] hover:bg-[#388E3C]"
                onClick={() => {
                  setIsMediaSectionOpen(false);
                  setIsMediaSaved(true);
                  setMediaEntries([
                    {
                      id: "1",
                      type: "photo",
                      dateCaptured: new Date().toISOString(),
                      timeCaptured: new Date().toLocaleTimeString(),
                    },
                  ]);
                }}
              >
                Save Media
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
