import { useState } from "react";
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

function Router({ activeSession, setActiveSession }: { 
  activeSession: { name: string; targetMinutes: number } | null;
  setActiveSession: (session: { name: string; targetMinutes: number } | null) => void;
}) {
  return (
    <Switch>
      <Route path="/">
        <Home setActiveSession={setActiveSession} />
      </Route>
      <Route path="/timer">
        <Timer activeSession={activeSession} setActiveSession={setActiveSession} />
      </Route>
      <Route path="/progress" component={Progress} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [activeSession, setActiveSession] = useState<{
    name: string;
    targetMinutes: number;
  } | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Router activeSession={activeSession} setActiveSession={setActiveSession} />
          <BottomNav />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
