import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

interface WelcomeScreenProps {
  onComplete: (name: string, photo?: string) => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | undefined>();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim(), photo);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to StudyFlow</h1>
          <p className="text-muted-foreground">
            Let's get started by setting up your profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {photo ? (
                  <AvatarImage src={photo} alt="Profile" />
                ) : (
                  <AvatarFallback className="text-2xl">
                    {name.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                )}
              </Avatar>
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover-elevate"
              >
                <Camera className="h-4 w-4" />
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                  data-testid="input-welcome-photo"
                />
              </label>
            </div>
            <p className="text-sm text-muted-foreground">
              Add a profile photo (optional)
            </p>
          </div>

          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              autoFocus
              data-testid="input-welcome-name"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            data-testid="button-welcome-continue"
          >
            Continue
          </Button>
        </form>
      </Card>
    </div>
  );
}
