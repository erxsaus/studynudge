import * as client from "openid-client";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { signToken, verifyToken, createAuthCookie, getTokenFromCookies, clearAuthCookie } from "./jwt";
import { storage } from "./storage";

const getIssuerUrl = () => {
  return process.env.ISSUER_URL || "https://replit.com/oidc";
};

const getRedirectUri = (req?: VercelRequest) => {
  // Try to get domain from various sources
  let domain = process.env.VERCEL_URL || process.env.REPLIT_DOMAINS?.split(",")[0];
  
  // If not available, try to construct from request headers
  if (!domain && req) {
    const host = req.headers.host || req.headers["x-forwarded-host"];
    if (host) {
      domain = Array.isArray(host) ? host[0] : host;
    }
  }
  
  // Fallback to localhost for development
  if (!domain) {
    domain = "localhost:5000";
  }
  
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${domain}/api/auth/callback`;
};

let oidcConfig: client.Configuration | null = null;

async function getOidcConfig(): Promise<client.Configuration> {
  if (oidcConfig) return oidcConfig;
  
  const config = await client.discovery(
    new URL(getIssuerUrl()),
    process.env.REPL_ID || process.env.NEXT_PUBLIC_REPL_ID || "studyflow"
  );
  
  oidcConfig = config;
  return config;
}

export async function initiateLogin(req: VercelRequest, res: VercelResponse) {
  try {
    const config = await getOidcConfig();
    
    const codeVerifier = client.randomPKCECodeVerifier();
    const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);
    
    const authUrl = client.buildAuthorizationUrl(config, {
      redirect_uri: getRedirectUri(req),
      scope: "openid email profile",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });
    
    // Store code verifier in a temporary cookie (will be used in callback)
    res.setHeader("Set-Cookie", [
      `code_verifier=${codeVerifier}; HttpOnly; Secure=${process.env.NODE_ENV === "production"}; SameSite=Lax; Path=/; Max-Age=600`,
      `return_to=${req.headers.referer || "/"}; HttpOnly; Secure=${process.env.NODE_ENV === "production"}; SameSite=Lax; Path=/; Max-Age=600`
    ]);
    
    res.status(302);
    res.setHeader("Location", authUrl.href);
    res.end();
  } catch (error) {
    console.error("Login initiation error:", error);
    res.status(500).json({ error: "Failed to initiate login" });
  }
}

export async function handleCallback(req: VercelRequest, res: VercelResponse) {
  try {
    const config = await getOidcConfig();
    const currentUrl = new URL(`${getRedirectUri(req)}?${new URLSearchParams(req.query as any).toString()}`);
    
    // Get code verifier from cookie
    const cookies = req.headers.cookie || "";
    const codeVerifierMatch = cookies.match(/code_verifier=([^;]+)/);
    const returnToMatch = cookies.match(/return_to=([^;]+)/);
    const codeVerifier = codeVerifierMatch ? codeVerifierMatch[1] : null;
    const returnTo = returnToMatch ? decodeURIComponent(returnToMatch[1]) : "/";
    
    if (!codeVerifier) {
      throw new Error("Code verifier not found");
    }
    
    const tokens = await client.authorizationCodeGrant(config, currentUrl, {
      pkceCodeVerifier: codeVerifier,
      expectedState: undefined,
    });
    
    const claims = tokens.claims();
    
    if (!claims) {
      throw new Error("No claims in token");
    }
    
    // Upsert user in database
    await storage.upsertUser({
      id: claims.sub,
      email: claims.email as string,
      firstName: claims.first_name as string,
      lastName: claims.last_name as string,
      profileImageUrl: claims.profile_image_url as string,
    });
    
    // Create JWT token
    const jwtToken = signToken({
      sub: claims.sub,
      email: claims.email as string || null,
      firstName: claims.first_name as string || null,
      lastName: claims.last_name as string || null,
      profileImageUrl: claims.profile_image_url as string || null,
    });
    
    // Clear temporary cookies and set auth cookie
    res.setHeader("Set-Cookie", [
      createAuthCookie(jwtToken),
      `code_verifier=; HttpOnly; Path=/; Max-Age=0`,
      `return_to=; HttpOnly; Path=/; Max-Age=0`
    ]);
    
    res.status(302);
    res.setHeader("Location", returnTo);
    res.end();
  } catch (error) {
    console.error("Callback error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
}

export async function handleLogout(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Set-Cookie", clearAuthCookie());
  res.status(302);
  res.setHeader("Location", "/");
  res.end();
}

export async function getCurrentUser(req: VercelRequest, res: VercelResponse) {
  const token = getTokenFromCookies(req.headers.cookie);
  
  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  
  const payload = verifyToken(token);
  
  if (!payload) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
  
  try {
    const user = await storage.getUser(payload.sub);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

export function requireAuth(handler: (req: VercelRequest, res: VercelResponse, userId: string) => Promise<void | VercelResponse>) {
  return async (req: VercelRequest, res: VercelResponse) => {
    const token = getTokenFromCookies(req.headers.cookie);
    
    if (!token) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    
    const payload = verifyToken(token);
    
    if (!payload) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    
    await handler(req, res, payload.sub);
  };
}
