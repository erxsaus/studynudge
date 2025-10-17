import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery, useMutation } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import Home from "@/pages/Home";
import Timer from "@/pages/Timer";
import Progress from "@/pages/Progress";
import Profile from "@/pages/Profile";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import type { StudySession, StudyActivity, User } from "@shared/schema";

interface Session extends StudySession {
  todayMinutes?: number;
}

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [activeSession, setActiveSession] = useState<{
    name: string;
    targetMinutes: number;
    sessionId: string;
  } | null>(null);

  const { data: sessions = [], refetch: refetchSessions } = useQuery<Session[]>({
    queryKey: ["/api/sessions"],
    enabled: isAuthenticated,
  });

  const { data: activities = [] } = useQuery<StudyActivity[]>({
    queryKey: ["/api/activities"],
    enabled: isAuthenticated,
  });

  const saveActivityMutation = useMutation({
    mutationFn: async (data: {
      sessionId: string;
      sessionName: string;
      durationMinutes: number;
      notes: string;
      media: File[];
      date: string;
    }) => {
      const mediaUrls = data.media.map(file => URL.createObjectURL(file));
      return apiRequest("POST", "/api/activities", {
        sessionId: data.sessionId,
        sessionName: data.sessionName,
        date: data.date,
        durationMinutes: data.durationMinutes,
        notes: data.notes || null,
        media: mediaUrls.length > 0 ? mediaUrls : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
    },
  });

  const handleSaveStudyActivity = (
    sessionId: string,
    sessionName: string,
    durationMinutes: number,
    notes: string,
    media: File[],
    date: string
  ) => {
    saveActivityMutation.mutate({
      sessionId,
      sessionName,
      durationMinutes,
      notes,
      media,
      date,
    });
  };

  const calculateStreak = (): number => {
    if (activities.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const uniqueDates = Array.from(new Set(activities.map(a => a.date))).sort().reverse();
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (const dateStr of uniqueDates) {
      const activityDate = new Date(dateStr);
      activityDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  if (isLoading || !isAuthenticated) {
    return <Landing />;
  }

  const currentStreak = calculateStreak();

  return (
    <Switch>
      <Route path="/">
        <Home 
          setActiveSession={setActiveSession} 
          sessions={sessions}
          onSaveStudyActivity={handleSaveStudyActivity}
          refetchSessions={refetchSessions}
        />
      </Route>
      <Route path="/timer">
        <Timer 
          activeSession={activeSession} 
          setActiveSession={setActiveSession}
          onSaveStudyActivity={handleSaveStudyActivity}
        />
      </Route>
      <Route path="/progress">
        <Progress 
          sessions={sessions}
          activities={activities}
        />
      </Route>
      <Route path="/profile">
        <Profile 
          sessions={sessions} 
          currentUser={user as User | null}
          currentStreak={currentStreak}
          refetchSessions={refetchSessions}
        />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Router />
          <BottomNav />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
