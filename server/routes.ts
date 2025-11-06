import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "passport";
import { setupGoogleAuth } from "./googleAuth";
import { setupLocalAuth, createLocalUser } from "./localAuth";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  insertStudySessionSchema,
  insertStudyActivitySchema,
} from "@shared/schema";

const PgSession = connectPgSimple(session);

// Authentication middleware
function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Not authenticated" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(
    session({
      store: new PgSession({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
        errorLog: console.error,
      }),
      secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: process.env.NODE_ENV === "production",
      },
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Setup authentication strategies
  setupGoogleAuth();
  setupLocalAuth();

  // Google OAuth routes
  app.get(
    "/api/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect("/");
    }
  );

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });

  // Registration schema
  const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  });

  // Registration endpoint
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validated = registerSchema.parse(req.body);

      // Check if user already exists
      const existingUsers = await db
        .select()
        .from(users)
        .where(eq(users.email, validated.email))
        .limit(1);

      if (existingUsers.length > 0) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Create new user
      const user = await createLocalUser(
        validated.email,
        validated.password,
        validated.firstName,
        validated.lastName
      );

      // Log in the user
      req.login(user, (err) => {
        if (err) {
          console.error("Login error after registration:", err);
          return res.status(500).json({ message: "Registration successful but login failed", error: err.message });
        }
        return res.json(user);
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid registration data", errors: error.errors });
      }
      if (!res.headersSent) {
        return res.status(500).json({ message: "Failed to register user" });
      }
    }
  });

  // Login endpoint
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: "Login failed" });
      }
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Login failed" });
        }
        res.json(user);
      });
    })(req, res, next);
  });

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Session routes
  app.get("/api/sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const sessions = await storage.getUserSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  app.post("/api/sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validated = insertStudySessionSchema.parse({
        ...req.body,
        userId,
      });
      const session = await storage.createSession(validated);
      res.json(session);
    } catch (error: any) {
      console.error("Error creating session:", error);
      res
        .status(400)
        .json({ message: error.message || "Failed to create session" });
    }
  });

  app.patch("/api/sessions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const validated = insertStudySessionSchema.partial().parse(req.body);
      const session = await storage.updateSession(id, validated);
      res.json(session);
    } catch (error: any) {
      console.error("Error updating session:", error);
      res
        .status(400)
        .json({ message: error.message || "Failed to update session" });
    }
  });

  app.delete("/api/sessions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSession(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting session:", error);
      res.status(500).json({ message: "Failed to delete session" });
    }
  });

  // Activity routes
  app.get("/api/activities", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const activities = await storage.getUserActivities(userId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  app.post("/api/activities", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const validated = insertStudyActivitySchema.parse({
        ...req.body,
        userId,
      });
      const activity = await storage.createActivity(validated);
      res.json(activity);
    } catch (error: any) {
      console.error("Error creating activity:", error);
      res
        .status(400)
        .json({ message: error.message || "Failed to create activity" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
