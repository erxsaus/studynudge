import { useState } from "react";
import FocusTimer from "@/components/FocusTimer";
import StudyLogForm from "@/components/StudyLogForm";
import EmptyState from "@/components/EmptyState";
import ThemeToggle from "@/components/ThemeToggle";

interface TimerProps {
  activeSession: { name: string; targetMinutes: number; sessionId: string } | null;
  setActiveSession: (session: { name: string; targetMinutes: number; sessionId: string } | null) => void;
  onSaveStudyActivity: (sessionId: string, sessionName: string, duration: number, notes: string, media: File[], date: string) => void;
}

export default function Timer({ activeSession, setActiveSession, onSaveStudyActivity }: TimerProps) {
  const [showLogForm, setShowLogForm] = useState(false);
  const [completedMinutes, setCompletedMinutes] = useState(0);
  const [completedSession, setCompletedSession] = useState<{ name: string; sessionId: string } | null>(null);

  const handleComplete = (minutes: number) => {
    if (activeSession) {
      setCompletedMinutes(minutes);
      setCompletedSession({ name: activeSession.name, sessionId: activeSession.sessionId });
      setShowLogForm(true);
      setActiveSession(null);
    }
  };

  const handleSaveLog = (content: string, media: File[], date: string) => {
    if (completedSession) {
      onSaveStudyActivity(completedSession.sessionId, completedSession.name, completedMinutes, content, media, date);
      setShowLogForm(false);
      setCompletedSession(null);
    }
  };

  const handleCancel = () => {
    setActiveSession(null);
    setShowLogForm(false);
    setCompletedSession(null);
  };

  if (showLogForm && completedSession) {
    return (
      <StudyLogForm
        sessionName={completedSession.name}
        minutesCompleted={completedMinutes}
        onSave={handleSaveLog}
        onCancel={handleCancel}
      />
    );
  }

  if (!activeSession) {
    return (
      <div className="min-h-screen pb-20">
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Focus Timer</h1>
            <ThemeToggle />
          </div>
        </header>
        <main className="max-w-2xl mx-auto">
          <EmptyState
            title="No Active Session"
            description="Start a study session from the Study tab to begin your focus timer"
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Focus Timer</h1>
          <ThemeToggle />
        </div>
      </header>
      <FocusTimer
        sessionName={activeSession.name}
        targetMinutes={activeSession.targetMinutes}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </div>
  );
}
