import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Study sessions table
export const studySessions = pgTable("study_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  theme: text("theme").notNull(),
  dailyTargetMinutes: integer("daily_target_minutes").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStudySessionSchema = createInsertSchema(studySessions).omit({
  id: true,
  createdAt: true,
});

export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;
export type StudySession = typeof studySessions.$inferSelect;

// Study activities table
export const studyActivities = pgTable("study_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  sessionId: varchar("session_id")
    .notNull()
    .references(() => studySessions.id, { onDelete: "cascade" }),
  sessionName: text("session_name").notNull(),
  date: text("date").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  notes: text("notes"),
  media: text("media").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStudyActivitySchema = createInsertSchema(studyActivities).omit({
  id: true,
  createdAt: true,
});

export type InsertStudyActivity = z.infer<typeof insertStudyActivitySchema>;
export type StudyActivity = typeof studyActivities.$inferSelect;
