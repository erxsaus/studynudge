import { useState } from "react";
import { useLocation } from "wouter";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StudySessionCard from "@/components/StudySessionCard";
import CreateSessionDialog from "@/components/CreateSessionDialog";
import StudyNotesDialog from "@/components/StudyNotesDialog";
import EmptyState from "@/components/EmptyState";
import ThemeToggle from "@/components/ThemeToggle";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Session {
  id: string;
  name: string;
  description: string;
  theme: string;
  dailyTargetMinutes: number;
  todayMinutes?: number;
}

interface HomeProps {
  setActiveSession: (session: { name: string; targetMinutes: number; sessionId: string }) => void;
  sessions: Session[];
  onSaveStudyActivity: (sessionId: string, sessionName: string, duration: number, notes: string, media: File[], date: string) => void;
  refetchSessions: () => void;
}

export default function Home({ setActiveSession, sessions, onSaveStudyActivity, refetchSessions }: HomeProps) {
  const [, setLocation] = useLocation();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const { toast } = useToast();

  const createSessionMutation = useMutation({
    mutationFn: async (newSession: {
      name: string;
      description: string;
      theme: string;
      dailyTargetMinutes: number;
    }) => {
      return apiRequest("POST", "/api/sessions", newSession);
    },
    onSuccess: () => {
      refetchSessions();
      setCreateDialogOpen(false);
      toast({
        title: "Session created",
        description: "Your study session has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateSession = (newSession: {
    name: string;
    description: string;
    theme: string;
    dailyTargetMinutes: number;
  }) => {
    createSessionMutation.mutate(newSession);
  };

  const handleStartSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSession({
        name: session.name,
        targetMinutes: session.dailyTargetMinutes,
        sessionId: session.id,
      });
      setLocation("/timer");
    }
  };

  const handleOpenNotes = (session: { id: string; name: string }) => {
    setSelectedSession(session);
    setNotesDialogOpen(true);
  };

  const handleSaveNotes = (content: string, media: File[], date: string) => {
    if (selectedSession) {
      onSaveStudyActivity(selectedSession.id, selectedSession.name, 0, content, media, date);
      setNotesDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-xl font-semibold" data-testid="text-page-title">
            Study Sessions
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {sessions.length === 0 ? (
          <EmptyState
            title="No Study Sessions"
            description="Create your first study session to start tracking your learning progress"
            actionLabel="Create Session"
            onAction={() => setCreateDialogOpen(true)}
          />
        ) : (
          <div className="space-y-6">
            {Array.from(new Set(sessions.map(s => s.theme))).map(theme => (
              <div key={theme}>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span>{theme}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    ({sessions.filter(s => s.theme === theme).length})
                  </span>
                </h2>
                <div className="space-y-3">
                  {sessions
                    .filter(s => s.theme === theme)
                    .map((session) => (
                      <StudySessionCard
                        key={session.id}
                        {...session}
                        onStart={() => handleStartSession(session.id)}
                        onOpenNotes={() => handleOpenNotes({ id: session.id, name: session.name })}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Button
        size="icon"
        className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg"
        onClick={() => setCreateDialogOpen(true)}
        data-testid="button-create-session"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <CreateSessionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={handleCreateSession}
      />

      {selectedSession && (
        <StudyNotesDialog
          open={notesDialogOpen}
          onOpenChange={setNotesDialogOpen}
          sessionName={selectedSession.name}
          onSave={handleSaveNotes}
        />
      )}
    </div>
  );
}
