import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import StudySessionCard from "@/components/StudySessionCard";
import CreateSessionDialog from "@/components/CreateSessionDialog";
import EmptyState from "@/components/EmptyState";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [sessions, setSessions] = useState([
    {
      id: "1",
      name: "Mathematics",
      description: "Advanced calculus and linear algebra practice",
      dailyTargetMinutes: 60,
      todayMinutes: 30,
    },
    {
      id: "2",
      name: "Spanish",
      description: "Vocabulary building and conversation practice",
      dailyTargetMinutes: 45,
      todayMinutes: 45,
    },
    {
      id: "3",
      name: "Web Development",
      description: "Learning React and TypeScript fundamentals",
      dailyTargetMinutes: 90,
      todayMinutes: 20,
    },
  ]);

  const handleCreateSession = (newSession: {
    name: string;
    description: string;
    dailyTargetMinutes: number;
  }) => {
    setSessions([
      ...sessions,
      {
        id: Date.now().toString(),
        ...newSession,
        todayMinutes: 0,
      },
    ]);
  };

  const handleStartSession = (sessionId: string) => {
    console.log("Start session:", sessionId);
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
          <div className="space-y-4">
            {sessions.map((session) => (
              <StudySessionCard
                key={session.id}
                {...session}
                onStart={() => handleStartSession(session.id)}
              />
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
    </div>
  );
}
