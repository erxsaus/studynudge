import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface EditSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: {
    id: string;
    name: string;
    description: string;
    theme: string;
    dailyTargetMinutes: number;
  } | null;
  onSave: (
    id: string,
    updates: {
      name: string;
      description: string;
      theme: string;
      dailyTargetMinutes: number;
    }
  ) => void;
}

export default function EditSessionDialog({
  open,
  onOpenChange,
  session,
  onSave,
}: EditSessionDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [theme, setTheme] = useState("");
  const [targetMinutes, setTargetMinutes] = useState("30");

  useEffect(() => {
    if (session) {
      setName(session.name);
      setDescription(session.description);
      setTheme(session.theme);
      setTargetMinutes(session.dailyTargetMinutes.toString());
    }
  }, [session]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (session) {
      onSave(session.id, {
        name,
        description,
        theme,
        dailyTargetMinutes: parseInt(targetMinutes),
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Study Session</DialogTitle>
          <DialogDescription>
            Update your study session details
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Session Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Mathematics"
              required
              data-testid="input-edit-session-name"
            />
          </div>
          <div>
            <Label htmlFor="edit-theme">Theme</Label>
            <Input
              id="edit-theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g., School, Personal Development, Career"
              required
              data-testid="input-edit-session-theme"
            />
          </div>
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will you study?"
              rows={3}
              data-testid="input-edit-session-description"
            />
          </div>
          <div>
            <Label htmlFor="edit-target">Daily Time Target (minutes)</Label>
            <Input
              id="edit-target"
              type="number"
              min="5"
              max="480"
              value={targetMinutes}
              onChange={(e) => setTargetMinutes(e.target.value)}
              required
              data-testid="input-edit-session-target"
            />
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              data-testid="button-cancel-edit"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" data-testid="button-save-edit">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
