import type { VercelRequest, VercelResponse } from "@vercel/node";
import { initiateLogin } from "../../server/vercelAuth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  
  await initiateLogin(req, res);
}
