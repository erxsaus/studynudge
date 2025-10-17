import { useState, useMemo } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import SessionProgressCard from "@/components/SessionProgressCard";
import StudyCalendar from "@/components/StudyCalendar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadUserData, getUserActivities } from "@/lib/userStorage";

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

interface ProgressProps {
  sessions: Session[];
  currentUser: User | null;
}

const SESSION_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899",
  "#06b6d4", "#f97316", "#14b8a6", "#a855f7", "#f43f5e"
];

export default function Progress({ sessions, currentUser }: ProgressProps) {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const sessionColors = useMemo(() => {
    const colorMap: Record<string, string> = {};
    sessions.forEach((session, index) => {
      colorMap[session.id] = SESSION_COLORS[index % SESSION_COLORS.length];
    });
    return colorMap;
  }, [sessions]);

  const userData = loadUserData();
  const activities = currentUser ? getUserActivities(userData, currentUser.id) : [];

  const sessionsWithStats = useMemo(() => {
    return sessions.map(session => {
      const sessionActivities = activities.filter(a => a.sessionId === session.id);
      const totalMinutes = sessionActivities.reduce((sum, a) => sum + a.durationMinutes, 0);
      const uniqueDates = new Set(sessionActivities.map(a => a.date));
      
      const sortedDates = Array.from(uniqueDates).sort().reverse();
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      for (const dateStr of sortedDates) {
        const activityDate = new Date(dateStr);
        activityDate.setHours(0, 0, 0, 0);
        const daysDiff = Math.floor((today.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === streak) {
          streak++;
        } else {
          break;
        }
      }
      
      return {
        id: session.id,
        name: session.name,
        theme: session.theme,
        totalMinutes,
        sessionsCount: sessionActivities.length,
        streak,
        color: sessionColors[session.id],
      };
    });
  }, [sessions, activities, sessionColors]);

  const allActivities = useMemo(() => {
    const activityMap: Record<string, any[]> = {};
    
    activities.forEach(activity => {
      if (!activityMap[activity.date]) {
        activityMap[activity.date] = [];
      }
      activityMap[activity.date].push({
        name: activity.sessionName,
        minutes: activity.durationMinutes,
        notes: activity.notes,
        color: sessionColors[activity.sessionId],
      });
    });
    
    return Object.entries(activityMap)
      .map(([date, sessions]) => ({
        date,
        sessions,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [activities, sessionColors]);

  const getSessionActivities = (sessionId: string) => {
    return allActivities
      .map(activity => ({
        ...activity,
        sessions: activity.sessions.filter(s => {
          const matchingActivity = activities.find(a => 
            a.date === activity.date && a.sessionName === s.name
          );
          return matchingActivity?.sessionId === sessionId;
        }),
      }))
      .filter(activity => activity.sessions.length > 0);
  };

  const selectedSessionData = sessionsWithStats.find(s => s.id === selectedSession);
  const sessionActivities = selectedSession && selectedSessionData 
    ? getSessionActivities(selectedSession)
    : allActivities;

  return (
    <div className="min-h-screen pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          {selectedSession ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedSession(null)}
              className="gap-2"
              data-testid="button-back-to-overview"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Overview
            </Button>
          ) : (
            <h1 className="text-xl font-semibold" data-testid="text-page-title">
              Progress
            </h1>
          )}
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {!selectedSession ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Study Sessions</h2>
              <div className="space-y-4">
                {Array.from(new Set(sessionsWithStats.map(s => s.theme))).map(theme => (
                  <div key={theme}>
                    <h3 className="text-base font-medium mb-3 flex items-center gap-2 text-muted-foreground">
                      <span>{theme}</span>
                      <span className="text-sm font-normal">
                        ({sessionsWithStats.filter(s => s.theme === theme).length})
                      </span>
                    </h3>
                    <div className="space-y-3">
                      {sessionsWithStats
                        .filter(s => s.theme === theme)
                        .map((session) => (
                          <SessionProgressCard
                            key={session.id}
                            {...session}
                            onClick={() => setSelectedSession(session.id)}
                          />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Calendar Overview</h2>
              <StudyCalendar activities={allActivities} />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedSessionData?.name}</h2>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{selectedSessionData?.sessionsCount} sessions</span>
                    <span>•</span>
                    <span>{Math.floor((selectedSessionData?.totalMinutes || 0) / 60)}h {(selectedSessionData?.totalMinutes || 0) % 60}m total</span>
                    <span>•</span>
                    <span>{selectedSessionData?.streak} day streak</span>
                  </div>
                </div>
                <div
                  className="h-16 w-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${selectedSessionData?.color}20` }}
                >
                  <div className="text-2xl font-bold" style={{ color: selectedSessionData?.color }}>
                    {Math.floor((selectedSessionData?.totalMinutes || 0) / 60)}h
                  </div>
                </div>
              </div>
            </Card>

            <div>
              <h3 className="text-lg font-semibold mb-4">Session Calendar</h3>
              <StudyCalendar activities={sessionActivities} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
