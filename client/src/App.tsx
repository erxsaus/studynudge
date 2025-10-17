import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import Home from "@/pages/Home";
import Timer from "@/pages/Timer";
import Progress from "@/pages/Progress";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/not-found";
import { loadSessionsFromStorage, saveSessionsToStorage } from "./lib/storage";

interface Session {
  id: string;
  name: string;
  description: string;
  theme: string;
  dailyTargetMinutes: number;
  todayMinutes?: number;
}

function Router({ 
  activeSession, 
  setActiveSession,
  sessions,
  setSessions,
}: { 
  activeSession: { name: string; targetMinutes: number } | null;
  setActiveSession: (session: { name: string; targetMinutes: number } | null) => void;
  sessions: Session[];
  setSessions: (sessions: Session[]) => void;
}) {
  return (
    <Switch>
      <Route path="/">
        <Home 
          setActiveSession={setActiveSession} 
          sessions={sessions}
          setSessions={setSessions}
        />
      </Route>
      <Route path="/timer">
        <Timer activeSession={activeSession} setActiveSession={setActiveSession} />
      </Route>
      <Route path="/progress" component={Progress} />
      <Route path="/profile">
        <Profile sessions={sessions} setSessions={setSessions} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [activeSession, setActiveSession] = useState<{
    name: string;
    targetMinutes: number;
  } | null>(null);

  const defaultSessions: Session[] = [
    {
      id: "1",
      name: "Mathematics",
      description: "Advanced calculus and linear algebra practice",
      theme: "School",
      dailyTargetMinutes: 60,
      todayMinutes: 30,
    },
    {
      id: "2",
      name: "Spanish",
      description: "Vocabulary building and conversation practice",
      theme: "Personal Development",
      dailyTargetMinutes: 45,
      todayMinutes: 45,
    },
    {
      id: "3",
      name: "Web Development",
      description: "Learning React and TypeScript fundamentals",
      theme: "Career",
      dailyTargetMinutes: 90,
      todayMinutes: 20,
    },
  ];

  const [sessions, setSessions] = useState<Session[]>(() => {
    const stored = loadSessionsFromStorage();
    return stored.length > 0 ? stored : defaultSessions;
  });

  useEffect(() => {
    saveSessionsToStorage(sessions);
  }, [sessions]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Router 
            activeSession={activeSession} 
            setActiveSession={setActiveSession}
            sessions={sessions}
            setSessions={setSessions}
          />
          <BottomNav />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
