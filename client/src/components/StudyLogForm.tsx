import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Camera, Image as ImageIcon, X } from "lucide-react";

interface StudyLogFormProps {
  sessionName: string;
  minutesCompleted: number;
  onSave: (content: string, media: File[], date: string) => void;
  onCancel: () => void;
}

export default function StudyLogForm({
  sessionName,
  minutesCompleted,
  onSave,
  onCancel,
}: StudyLogFormProps) {
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

  return (
    <div className="min-h-screen p-6 pb-24">
      <Card className="p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-2" data-testid="text-log-title">
          Great work! 🎉
        </h2>
        <p className="text-muted-foreground mb-6">
          You studied <span className="font-semibold text-foreground">{sessionName}</span> for{" "}
          <span className="font-semibold text-foreground">{minutesCompleted} minutes</span>
        </p>

        <div className="space-y-4">
          <div>
            <Label htmlFor="study-date">Study Date</Label>
            <Input
              id="study-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              data-testid="input-study-date"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              What did you learn today?
            </label>
            <Textarea
              placeholder="Write about what you studied, key insights, or challenges you faced..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none"
              data-testid="input-study-notes"
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
                size="lg"
                className="gap-2"
                onClick={() => document.getElementById("photo-input")?.click()}
                data-testid="button-add-photo"
              >
                <ImageIcon className="h-4 w-4" />
                Photo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => document.getElementById("camera-input")?.click()}
                data-testid="button-add-camera"
              >
                <Camera className="h-4 w-4" />
                Camera
              </Button>
              <input
                id="photo-input"
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={handleMediaSelect}
              />
              <input
                id="camera-input"
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

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            data-testid="button-cancel-log"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSave(content, mediaFiles, date)}
            disabled={!content.trim()}
            className="flex-1"
            data-testid="button-save-log"
          >
            Save Log
          </Button>
        </div>
      </Card>
    </div>
  );
}
