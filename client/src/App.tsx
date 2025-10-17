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
import WelcomeScreen from "@/components/WelcomeScreen";
import {
  loadUserData,
  saveUserData,
  createUser,
  getCurrentUser,
  getUserSessions,
  setUserSessions,
  addStudyActivity,
  getTodayMinutes,
  calculateStreak,
} from "./lib/userStorage";

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

function Router({ 
  activeSession, 
  setActiveSession,
  sessions,
  setSessions,
  currentUser,
  users,
  onAddUser,
  onSwitchUser,
  onDeleteUser,
  onSaveStudyActivity,
  currentStreak,
}: { 
  activeSession: { name: string; targetMinutes: number; sessionId: string } | null;
  setActiveSession: (session: { name: string; targetMinutes: number; sessionId: string } | null) => void;
  sessions: Session[];
  setSessions: (sessions: Session[]) => void;
  currentUser: User | null;
  users: User[];
  onAddUser: (name: string, photo?: string) => void;
  onSwitchUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onSaveStudyActivity: (sessionId: string, sessionName: string, duration: number, notes: string, media: File[], date: string) => void;
  currentStreak: number;
}) {
  return (
    <Switch>
      <Route path="/">
        <Home 
          setActiveSession={setActiveSession} 
          sessions={sessions}
          setSessions={setSessions}
          onSaveStudyActivity={onSaveStudyActivity}
        />
      </Route>
      <Route path="/timer">
        <Timer 
          activeSession={activeSession} 
          setActiveSession={setActiveSession}
          onSaveStudyActivity={onSaveStudyActivity}
        />
      </Route>
      <Route path="/progress" component={Progress} />
      <Route path="/profile">
        <Profile 
          sessions={sessions} 
          setSessions={setSessions}
          currentUser={currentUser}
          users={users}
          onAddUser={onAddUser}
          onSwitchUser={onSwitchUser}
          onDeleteUser={onDeleteUser}
          currentStreak={currentStreak}
        />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [userData, setUserData] = useState(() => loadUserData());
  const [activeSession, setActiveSession] = useState<{
    name: string;
    targetMinutes: number;
    sessionId: string;
  } | null>(null);

  const currentUser = getCurrentUser(userData);
  const [sessions, setSessions] = useState<Session[]>(() => {
    if (currentUser) {
      const userSessions = getUserSessions(userData, currentUser.id);
      return userSessions.map(session => ({
        ...session,
        todayMinutes: getTodayMinutes(userData, currentUser.id, session.id),
      }));
    }
    return [];
  });

  useEffect(() => {
    if (currentUser) {
      const sessionsWithoutTodayMinutes = sessions.map(({ todayMinutes, ...session }) => session);
      setUserSessions(userData, currentUser.id, sessionsWithoutTodayMinutes);
      saveUserData(userData);
    }
  }, [sessions, currentUser, userData]);

  const handleSaveStudyActivity = (
    sessionId: string,
    sessionName: string,
    durationMinutes: number,
    notes: string,
    media: File[],
    date: string
  ) => {
    if (!currentUser) return;

    const mediaUrls = media.map(file => URL.createObjectURL(file));
    
    addStudyActivity(userData, currentUser.id, {
      sessionId,
      sessionName,
      date,
      durationMinutes,
      notes,
      media: mediaUrls,
    });
    
    saveUserData(userData);
    
    setSessions(prev => prev.map(s => 
      s.id === sessionId 
        ? { ...s, todayMinutes: getTodayMinutes(userData, currentUser.id, sessionId) }
        : s
    ));
  };

  const handleWelcomeComplete = (name: string, photo?: string) => {
    const newUser = createUser(name, photo);
    const newUserData = {
      users: [newUser],
      currentUserId: newUser.id,
      sessions: { [newUser.id]: [] },
      activities: { [newUser.id]: [] },
    };
    setUserData(newUserData);
    saveUserData(newUserData);
    setSessions([]);
  };

  const handleAddUser = (name: string, photo?: string) => {
    const newUser = createUser(name, photo);
    const newUserData = {
      ...userData,
      users: [...userData.users, newUser],
      currentUserId: newUser.id,
      sessions: { ...userData.sessions, [newUser.id]: [] },
      activities: { ...userData.activities, [newUser.id]: [] },
    };
    setUserData(newUserData);
    saveUserData(newUserData);
    setSessions([]);
  };

  const handleSwitchUser = (userId: string) => {
    const newUserData = {
      ...userData,
      currentUserId: userId,
    };
    setUserData(newUserData);
    saveUserData(newUserData);
    setSessions(getUserSessions(newUserData, userId));
    setActiveSession(null);
  };

  const handleDeleteUser = (userId: string) => {
    const remainingUsers = userData.users.filter((u) => u.id !== userId);
    const newSessions = { ...userData.sessions };
    const newActivities = { ...userData.activities };
    delete newSessions[userId];
    delete newActivities[userId];
    
    const newCurrentUserId = userId === userData.currentUserId
      ? remainingUsers[0]?.id || null
      : userData.currentUserId;

    const newUserData = {
      users: remainingUsers,
      currentUserId: newCurrentUserId,
      sessions: newSessions,
      activities: newActivities,
    };
    
    setUserData(newUserData);
    saveUserData(newUserData);
    
    if (newCurrentUserId) {
      setSessions(getUserSessions(newUserData, newCurrentUserId));
    } else {
      setSessions([]);
    }
  };

  if (userData.users.length === 0) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WelcomeScreen onComplete={handleWelcomeComplete} />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Router 
            activeSession={activeSession} 
            setActiveSession={setActiveSession}
            sessions={sessions}
            setSessions={setSessions}
            currentUser={currentUser}
            users={userData.users}
            onAddUser={handleAddUser}
            onSwitchUser={handleSwitchUser}
            onDeleteUser={handleDeleteUser}
            onSaveStudyActivity={handleSaveStudyActivity}
            currentStreak={currentUser ? calculateStreak(userData, currentUser.id) : 0}
          />
          <BottomNav />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
