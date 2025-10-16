import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import ThemeToggle from "@/components/ThemeToggle";
import { Bell, BellOff, Smartphone, Mail } from "lucide-react";
import { useState } from "react";

export default function Profile() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [streakReminder, setStreakReminder] = useState(true);

  const handleEnableNotifications = async () => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === "granted");
      console.log("Notification permission:", permission);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-xl font-semibold" data-testid="text-page-title">
            Profile
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">S</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold" data-testid="text-user-name">
                Study User
              </h2>
              <p className="text-sm text-muted-foreground">Member since Oct 2025</p>
            </div>
          </div>
        </Card>

        <div>
          <h3 className="text-lg font-semibold mb-3">Notifications</h3>
          <Card className="divide-y">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {notificationsEnabled ? (
                    <Bell className="h-5 w-5 text-primary" />
                  ) : (
                    <BellOff className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      {notificationsEnabled ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                </div>
                {!notificationsEnabled && (
                  <Button
                    size="sm"
                    onClick={handleEnableNotifications}
                    data-testid="button-enable-notifications"
                  >
                    Enable
                  </Button>
                )}
              </div>
            </div>
            
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Daily Reminder</p>
                <p className="text-sm text-muted-foreground">
                  Remind me to study every day
                </p>
              </div>
              <Switch
                checked={dailyReminder}
                onCheckedChange={setDailyReminder}
                data-testid="switch-daily-reminder"
              />
            </div>

            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Streak Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Notify when streak is about to break
                </p>
              </div>
              <Switch
                checked={streakReminder}
                onCheckedChange={setStreakReminder}
                data-testid="switch-streak-reminder"
              />
            </div>
          </Card>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Install App</h3>
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <Smartphone className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="font-medium mb-1">Add to Home Screen</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Install StudyFlow on your device for the best experience and offline access
                </p>
                <Button variant="outline" data-testid="button-install-pwa">
                  Install App
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium mb-1">Contact & Support</p>
              <p className="text-sm text-muted-foreground">
                Questions or feedback? We'd love to hear from you.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
