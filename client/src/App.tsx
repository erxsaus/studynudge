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
}: { 
  activeSession: { name: string; targetMinutes: number } | null;
  setActiveSession: (session: { name: string; targetMinutes: number } | null) => void;
  sessions: Session[];
  setSessions: (sessions: Session[]) => void;
  currentUser: User | null;
  users: User[];
  onAddUser: (name: string, photo?: string) => void;
  onSwitchUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
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
        <Profile 
          sessions={sessions} 
          setSessions={setSessions}
          currentUser={currentUser}
          users={users}
          onAddUser={onAddUser}
          onSwitchUser={onSwitchUser}
          onDeleteUser={onDeleteUser}
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
  } | null>(null);

  const currentUser = getCurrentUser(userData);
  const [sessions, setSessions] = useState<Session[]>(() => {
    if (currentUser) {
      return getUserSessions(userData, currentUser.id);
    }
    return [];
  });

  useEffect(() => {
    if (currentUser) {
      setUserSessions(userData, currentUser.id, sessions);
      saveUserData(userData);
    }
  }, [sessions, currentUser, userData]);

  const handleWelcomeComplete = (name: string, photo?: string) => {
    const newUser = createUser(name, photo);
    const newUserData = {
      users: [newUser],
      currentUserId: newUser.id,
      sessions: { [newUser.id]: [] },
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
    delete newSessions[userId];
    
    const newCurrentUserId = userId === userData.currentUserId
      ? remainingUsers[0]?.id || null
      : userData.currentUserId;

    const newUserData = {
      users: remainingUsers,
      currentUserId: newCurrentUserId,
      sessions: newSessions,
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
          />
          <BottomNav />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
