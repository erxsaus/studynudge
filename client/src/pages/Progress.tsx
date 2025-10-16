import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import SessionProgressCard from "@/components/SessionProgressCard";
import StudyCalendar from "@/components/StudyCalendar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Progress() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  // todo: remove mock functionality
  const sessions = [
    { 
      id: "1", 
      name: "Mathematics", 
      totalMinutes: 420, 
      sessionsCount: 8, 
      streak: 5,
      color: "#3b82f6"
    },
    { 
      id: "2", 
      name: "Spanish", 
      totalMinutes: 315, 
      sessionsCount: 7, 
      streak: 3,
      color: "#10b981"
    },
    { 
      id: "3", 
      name: "Web Development", 
      totalMinutes: 540, 
      sessionsCount: 6, 
      streak: 4,
      color: "#f59e0b"
    },
  ];

  // todo: remove mock functionality
  const allActivities = [
    {
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      sessions: [
        { name: "Mathematics", minutes: 60, notes: "Learned about derivatives and integration. The chain rule is starting to make more sense now.", color: "#3b82f6" },
        { name: "Spanish", minutes: 45, notes: "Practiced conjugating irregular verbs. Need to review ser and estar tomorrow.", color: "#10b981" },
      ],
    },
    {
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      sessions: [
        { name: "Web Development", minutes: 90, notes: "Built a React component with hooks. useState and useEffect are powerful!", color: "#f59e0b" },
      ],
    },
    {
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      sessions: [
        { name: "Mathematics", minutes: 45, color: "#3b82f6" },
        { name: "Spanish", minutes: 30, notes: "Vocabulary practice - learned 20 new words about food and cooking.", color: "#10b981" },
        { name: "Web Development", minutes: 60, color: "#f59e0b" },
      ],
    },
    {
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      sessions: [
        { name: "Mathematics", minutes: 60, notes: "Worked through calculus problems. Still struggling with optimization problems.", color: "#3b82f6" },
      ],
    },
    {
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      sessions: [
        { name: "Spanish", minutes: 50, color: "#10b981" },
        { name: "Web Development", minutes: 75, notes: "Learned about TypeScript interfaces and types. Much cleaner code now!", color: "#f59e0b" },
      ],
    },
  ];

  const getSessionActivities = (sessionName: string) => {
    return allActivities
      .map(activity => ({
        ...activity,
        sessions: activity.sessions.filter(s => s.name === sessionName),
      }))
      .filter(activity => activity.sessions.length > 0);
  };

  const selectedSessionData = sessions.find(s => s.id === selectedSession);
  const sessionActivities = selectedSession && selectedSessionData 
    ? getSessionActivities(selectedSessionData.name)
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
              <div className="space-y-3">
                {sessions.map((session) => (
                  <SessionProgressCard
                    key={session.id}
                    {...session}
                    onClick={() => setSelectedSession(session.id)}
                  />
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
