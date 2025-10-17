import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getCurrentUser } from "../../server/vercelAuth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  await getCurrentUser(req, res);
}
