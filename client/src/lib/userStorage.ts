interface User {
  id: string;
  name: string;
  photo?: string;
  createdAt: string;
}

interface StudyActivity {
  id: string;
  sessionId: string;
  sessionName: string;
  date: string;
  durationMinutes: number;
  notes?: string;
  media?: string[];
  createdAt: string;
}

interface UserData {
  users: User[];
  currentUserId: string | null;
  sessions: Record<string, any[]>;
  activities: Record<string, StudyActivity[]>;
}

const STORAGE_KEY = 'studyflow_userdata';

export const loadUserData = (): UserData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (!data.activities) {
        data.activities = {};
      }
      return data;
    }
  } catch (error) {
    console.error('Failed to load user data:', error);
  }
  return {
    users: [],
    currentUserId: null,
    sessions: {},
    activities: {},
  };
};

export const saveUserData = (data: UserData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save user data:', error);
  }
};

export const createUser = (name: string, photo?: string): User => {
  return {
    id: Date.now().toString(),
    name,
    photo,
    createdAt: new Date().toISOString(),
  };
};

export const getCurrentUser = (data: UserData): User | null => {
  if (!data.currentUserId) return null;
  return data.users.find(u => u.id === data.currentUserId) || null;
};

export const getUserSessions = (data: UserData, userId: string) => {
  return data.sessions[userId] || [];
};

export const setUserSessions = (data: UserData, userId: string, sessions: any[]) => {
  data.sessions[userId] = sessions;
};

export const getUserActivities = (data: UserData, userId: string): StudyActivity[] => {
  return data.activities[userId] || [];
};

export const addStudyActivity = (
  data: UserData,
  userId: string,
  activity: Omit<StudyActivity, 'id' | 'createdAt'>
): StudyActivity => {
  const newActivity: StudyActivity = {
    ...activity,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  
  if (!data.activities[userId]) {
    data.activities[userId] = [];
  }
  
  data.activities[userId].push(newActivity);
  return newActivity;
};

export const calculateStreak = (data: UserData, userId: string): number => {
  const activities = getUserActivities(data, userId);
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

export const getTodayMinutes = (data: UserData, userId: string, sessionId: string): number => {
  const today = new Date().toISOString().split('T')[0];
  const activities = getUserActivities(data, userId);
  
  return activities
    .filter(a => a.sessionId === sessionId && a.date === today)
    .reduce((sum, a) => sum + a.durationMinutes, 0);
};

export type { User, StudyActivity, UserData };
