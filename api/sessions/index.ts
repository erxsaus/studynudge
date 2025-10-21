import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "../../server/vercelAuth.js";
import { storage } from "../../server/storage.js";
import { insertStudySessionSchema } from "../../shared/schema.js";

async function handler(req: VercelRequest, res: VercelResponse, userId: string) {
  if (req.method === "GET") {
    try {
      const sessions = await storage.getUserSessions(userId);
      res.status(200).json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  } else if (req.method === "POST") {
    try {
      const validated = insertStudySessionSchema.parse({
        ...req.body,
        userId,
      });
      const session = await storage.createSession(validated);
      res.status(200).json(session);
    } catch (error: any) {
      console.error("Error creating session:", error);
      res.status(400).json({ message: error.message || "Failed to create session" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export default requireAuth(handler);
