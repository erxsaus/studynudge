import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ThemeToggle from "@/components/ThemeToggle";
import EditSessionDialog from "@/components/EditSessionDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import BadgeSystem from "@/components/BadgeSystem";
import { useToast } from "@/hooks/use-toast";
import { Bell, BellOff, Smartphone, LogOut, Edit2, Trash2, Tag } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

interface Session {
  id: string;
  name: string;
  description: string;
  theme: string;
  dailyTargetMinutes: number;
  todayMinutes?: number;
}

interface ProfileProps {
  sessions: Session[];
  currentUser: User | null;
  currentStreak: number;
  refetchSessions: () => void;
}

export default function Profile({ 
  sessions, 
  currentUser,
  currentStreak,
  refetchSessions,
}: ProfileProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [streakReminder, setStreakReminder] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const { toast } = useToast();

  const handleEnableNotifications = async () => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === "granted");
    }
  };

  const updateSessionMutation = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<Session> }) => {
      return apiRequest("PATCH", `/api/sessions/${data.id}`, data.updates);
    },
    onSuccess: () => {
      refetchSessions();
      setEditDialogOpen(false);
      toast({
        title: "Session updated",
        description: "Your study session has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteSessionMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/sessions/${id}`);
    },
    onSuccess: () => {
      refetchSessions();
      setDeleteDialogOpen(false);
      setSelectedSession(null);
      toast({
        title: "Session deleted",
        description: "Your study session has been deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEditSession = (session: Session) => {
    setSelectedSession(session);
    setEditDialogOpen(true);
  };

  const handleSaveSession = (
    id: string,
    updates: {
      name: string;
      description: string;
      theme: string;
      dailyTargetMinutes: number;
    }
  ) => {
    updateSessionMutation.mutate({ id, updates });
  };

  const handleDeleteClick = (session: Session) => {
    setSelectedSession(session);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSession) {
      deleteSessionMutation.mutate(selectedSession.id);
    }
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const getUserDisplayName = () => {
    if (!currentUser) return "User";
    if (currentUser.firstName && currentUser.lastName) {
      return `${currentUser.firstName} ${currentUser.lastName}`;
    }
    if (currentUser.firstName) return currentUser.firstName;
    if (currentUser.email) return currentUser.email;
    return "User";
  };

  const getUserInitials = () => {
    if (!currentUser) return "?";
    if (currentUser.firstName) return currentUser.firstName.charAt(0).toUpperCase();
    if (currentUser.email) return currentUser.email.charAt(0).toUpperCase();
    return "?";
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
            <Avatar className="h-16 w-16">
              {currentUser?.profileImageUrl ? (
                <AvatarImage src={currentUser.profileImageUrl} alt={getUserDisplayName()} />
              ) : (
                <AvatarFallback className="text-2xl">
                  {getUserInitials()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold" data-testid="text-user-name">
                {getUserDisplayName()}
              </h2>
              <p className="text-sm text-muted-foreground">
                {currentUser?.email || ""}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="gap-2"
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </Card>

        <BadgeSystem currentStreak={currentStreak} />

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

        <div>
          <h3 className="text-lg font-semibold mb-3">Manage Sessions</h3>
          <Card className="divide-y">
            {sessions.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No study sessions yet. Create one from the Study tab.
              </div>
            ) : (
              sessions.map((session) => (
                <div key={session.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-medium" data-testid={`text-manage-session-${session.id}`}>
                          {session.name}
                        </h4>
                        <Badge variant="outline" className="gap-1">
                          <Tag className="h-3 w-3" />
                          {session.theme}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {session.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Daily target: {session.dailyTargetMinutes} minutes
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEditSession(session)}
                        data-testid={`button-edit-session-${session.id}`}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleDeleteClick(session)}
                        data-testid={`button-delete-session-${session.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>
      </main>

      <EditSessionDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        session={selectedSession}
        onSave={handleSaveSession}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        sessionName={selectedSession?.name || ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
