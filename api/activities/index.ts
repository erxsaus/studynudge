import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "../../server/vercelAuth.js";
import { storage } from "../../server/storage.js";
import { insertStudyActivitySchema } from "../../shared/schema.js";

async function handler(req: VercelRequest, res: VercelResponse, userId: string) {
  if (req.method === "GET") {
    try {
      const { sessionId } = req.query;
      const activities = sessionId && typeof sessionId === "string"
        ? await storage.getSessionActivities(userId, sessionId)
        : await storage.getUserActivities(userId);
      res.status(200).json(activities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  } else if (req.method === "POST") {
    try {
      const validated = insertStudyActivitySchema.parse({
        ...req.body,
        userId,
      });
      const activity = await storage.createActivity(validated);
      res.status(200).json(activity);
    } catch (error: any) {
      console.error("Error creating activity:", error);
      res.status(400).json({ message: error.message || "Failed to create activity" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export default requireAuth(handler);
