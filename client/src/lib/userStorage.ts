interface User {
  id: string;
  name: string;
  photo?: string;
  createdAt: string;
}

interface UserData {
  users: User[];
  currentUserId: string | null;
  sessions: Record<string, any[]>;
}

const STORAGE_KEY = 'studyflow_userdata';

export const loadUserData = (): UserData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load user data:', error);
  }
  return {
    users: [],
    currentUserId: null,
    sessions: {},
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
