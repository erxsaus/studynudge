import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ThemeToggle from "@/components/ThemeToggle";
import EditSessionDialog from "@/components/EditSessionDialog";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import UserManagement from "@/components/UserManagement";
import { useToast } from "@/hooks/use-toast";
import { exportSessionsData, importSessionsData } from "@/lib/storage";
import { Bell, BellOff, Smartphone, Mail, Edit2, Trash2, Tag, Download, Upload } from "lucide-react";
import { useState, useRef } from "react";

interface Session {
  id: string;
  name: string;
  description: string;
  theme: string;
  dailyTargetMinutes: number;
  todayMinutes?: number;
}

interface User {
  id: string;
  name: string;
  photo?: string;
  createdAt: string;
}

interface ProfileProps {
  sessions: Session[];
  setSessions: (sessions: Session[]) => void;
  currentUser: User | null;
  users: User[];
  onAddUser: (name: string, photo?: string) => void;
  onSwitchUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export default function Profile({ 
  sessions, 
  setSessions,
  currentUser,
  users,
  onAddUser,
  onSwitchUser,
  onDeleteUser,
}: ProfileProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [streakReminder, setStreakReminder] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleEnableNotifications = async () => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === "granted");
      console.log("Notification permission:", permission);
    }
  };

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
    setSessions(
      sessions.map((s) =>
        s.id === id
          ? { ...s, ...updates }
          : s
      )
    );
  };

  const handleDeleteClick = (session: Session) => {
    setSelectedSession(session);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSession) {
      setSessions(sessions.filter((s) => s.id !== selectedSession.id));
      setDeleteDialogOpen(false);
      setSelectedSession(null);
    }
  };

  const handleExport = () => {
    exportSessionsData(sessions);
    toast({
      title: "Data Exported",
      description: "Your study sessions have been downloaded as a backup file.",
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedSessions = await importSessionsData(file);
      setSessions(importedSessions);
      toast({
        title: "Data Imported",
        description: `Successfully imported ${importedSessions.length} study session(s).`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import data. Please check the file format.",
        variant: "destructive",
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
            <Avatar className="h-16 w-16">
              {currentUser?.photo ? (
                <AvatarImage src={currentUser.photo} alt={currentUser.name} />
              ) : (
                <AvatarFallback className="text-2xl">
                  {currentUser?.name.charAt(0).toUpperCase() || "?"}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold" data-testid="text-user-name">
                {currentUser?.name || "User"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Member since {currentUser ? new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
              </p>
            </div>
          </div>
        </Card>

        <UserManagement
          users={users}
          currentUserId={currentUser?.id || null}
          onAddUser={onAddUser}
          onSwitchUser={onSwitchUser}
          onDeleteUser={onDeleteUser}
        />

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
          <h3 className="text-lg font-semibold mb-3">Data Management</h3>
          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-1">Backup & Restore</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Export your data to backup or migrate to another device
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleExport}
                    className="gap-2"
                    data-testid="button-export-data"
                  >
                    <Download className="h-4 w-4" />
                    Export Data
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleImportClick}
                    className="gap-2"
                    data-testid="button-import-data"
                  >
                    <Upload className="h-4 w-4" />
                    Import Data
                  </Button>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                    data-testid="input-import-file"
                  />
                </div>
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
