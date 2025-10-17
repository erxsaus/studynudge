import {
  users,
  studySessions,
  studyActivities,
  type User,
  type UpsertUser,
  type StudySession,
  type InsertStudySession,
  type StudyActivity,
  type InsertStudyActivity,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Study session operations
  getUserSessions(userId: string): Promise<StudySession[]>;
  createSession(session: InsertStudySession): Promise<StudySession>;
  updateSession(id: string, session: Partial<InsertStudySession>): Promise<StudySession>;
  deleteSession(id: string): Promise<void>;
  
  // Study activity operations
  getUserActivities(userId: string): Promise<StudyActivity[]>;
  getSessionActivities(userId: string, sessionId: string): Promise<StudyActivity[]>;
  createActivity(activity: InsertStudyActivity): Promise<StudyActivity>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Study session operations
  async getUserSessions(userId: string): Promise<StudySession[]> {
    return await db
      .select()
      .from(studySessions)
      .where(eq(studySessions.userId, userId));
  }

  async createSession(session: InsertStudySession): Promise<StudySession> {
    const [newSession] = await db
      .insert(studySessions)
      .values(session)
      .returning();
    return newSession;
  }

  async updateSession(
    id: string,
    sessionData: Partial<InsertStudySession>
  ): Promise<StudySession> {
    const [updated] = await db
      .update(studySessions)
      .set(sessionData)
      .where(eq(studySessions.id, id))
      .returning();
    return updated;
  }

  async deleteSession(id: string): Promise<void> {
    await db.delete(studySessions).where(eq(studySessions.id, id));
  }

  // Study activity operations
  async getUserActivities(userId: string): Promise<StudyActivity[]> {
    return await db
      .select()
      .from(studyActivities)
      .where(eq(studyActivities.userId, userId))
      .orderBy(desc(studyActivities.date));
  }

  async getSessionActivities(
    userId: string,
    sessionId: string
  ): Promise<StudyActivity[]> {
    return await db
      .select()
      .from(studyActivities)
      .where(
        and(
          eq(studyActivities.userId, userId),
          eq(studyActivities.sessionId, sessionId)
        )
      )
      .orderBy(desc(studyActivities.date));
  }

  async createActivity(activity: InsertStudyActivity): Promise<StudyActivity> {
    const [newActivity] = await db
      .insert(studyActivities)
      .values(activity)
      .returning();
    return newActivity;
  }
}

export const storage = new DatabaseStorage();
