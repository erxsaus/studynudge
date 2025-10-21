import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAuth } from "../../server/vercelAuth.js";
import { storage } from "../../server/storage.js";
import { insertStudySessionSchema } from "../../shared/schema.js";

async function handler(req: VercelRequest, res: VercelResponse, userId: string) {
  const { id } = req.query;
  
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid session ID" });
  }
  
  if (req.method === "PATCH") {
    try {
      const validated = insertStudySessionSchema.partial().parse(req.body);
      const session = await storage.updateSession(id, validated);
      res.status(200).json(session);
    } catch (error: any) {
      console.error("Error updating session:", error);
      res.status(400).json({ message: error.message || "Failed to update session" });
    }
  } else if (req.method === "DELETE") {
    try {
      await storage.deleteSession(id);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error deleting session:", error);
      res.status(500).json({ message: "Failed to delete session" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export default requireAuth(handler);
