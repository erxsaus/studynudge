import { useState } from "react";
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

interface CreateSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (session: {
    name: string;
    description: string;
    dailyTargetMinutes: number;
  }) => void;
}

export default function CreateSessionDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateSessionDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [targetMinutes, setTargetMinutes] = useState("30");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      name,
      description,
      dailyTargetMinutes: parseInt(targetMinutes),
    });
    setName("");
    setDescription("");
    setTargetMinutes("30");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Study Session</DialogTitle>
          <DialogDescription>
            Set up a new study session with your learning goals
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Session Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Mathematics"
              required
              data-testid="input-session-name"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will you study?"
              rows={3}
              data-testid="input-session-description"
            />
          </div>
          <div>
            <Label htmlFor="target">Daily Time Target (minutes)</Label>
            <Input
              id="target"
              type="number"
              min="5"
              max="480"
              value={targetMinutes}
              onChange={(e) => setTargetMinutes(e.target.value)}
              required
              data-testid="input-session-target"
            />
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              data-testid="button-cancel-create"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" data-testid="button-confirm-create">
              Create Session
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
