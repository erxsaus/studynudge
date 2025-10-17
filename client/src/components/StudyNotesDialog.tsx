import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Image as ImageIcon, X } from "lucide-react";

interface StudyNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionName: string;
  onSave: (content: string, media: File[], date: string) => void;
}

export default function StudyNotesDialog({
  open,
  onOpenChange,
  sessionName,
  onSave,
}: StudyNotesDialogProps) {
  const today = new Date().toISOString().split('T')[0];
  const [content, setContent] = useState("");
  const [date, setDate] = useState(today);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles([...mediaFiles, ...Array.from(e.target.files)]);
    }
  };

  const removeMedia = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(content, mediaFiles, date);
    setContent("");
    setDate(new Date().toISOString().split('T')[0]);
    setMediaFiles([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Study Notes</DialogTitle>
          <DialogDescription>
            Record your daily notes for {sessionName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="notes-date">Study Date</Label>
            <Input
              id="notes-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              data-testid="input-notes-date"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              What are you learning today?
            </label>
            <Textarea
              placeholder="Write about key concepts, insights, questions, or anything you want to remember..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[250px] resize-none"
              data-testid="input-notes-content"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {content.length} characters
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Add photos or videos (optional)
            </label>
            <div className="flex gap-2 flex-wrap">
              <Button
                type="button"
                variant="outline"
                size="default"
                className="gap-2"
                onClick={() => document.getElementById("notes-photo-input")?.click()}
                data-testid="button-add-photo"
              >
                <ImageIcon className="h-4 w-4" />
                Photo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="default"
                className="gap-2"
                onClick={() => document.getElementById("notes-camera-input")?.click()}
                data-testid="button-add-camera"
              >
                <Camera className="h-4 w-4" />
                Camera
              </Button>
              <input
                id="notes-photo-input"
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={handleMediaSelect}
              />
              <input
                id="notes-camera-input"
                type="file"
                accept="image/*,video/*"
                capture="environment"
                className="hidden"
                onChange={handleMediaSelect}
              />
            </div>

            {mediaFiles.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {mediaFiles.map((file, index) => (
                  <div key={index} className="relative aspect-square bg-muted rounded-md flex items-center justify-center">
                    <span className="text-xs text-muted-foreground truncate px-2">
                      {file.name}
                    </span>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removeMedia(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            data-testid="button-cancel-notes"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!content.trim()}
            className="flex-1"
            data-testid="button-save-notes"
          >
            Save Notes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
