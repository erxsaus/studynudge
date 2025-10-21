import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleLogout } from "../../server/vercelAuth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  await handleLogout(req, res);
}
