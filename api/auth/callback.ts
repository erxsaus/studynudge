import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCallback } from "../../server/vercelAuth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  await handleCallback(req, res);
}
