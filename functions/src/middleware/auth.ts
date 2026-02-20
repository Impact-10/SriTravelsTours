import { getAuth, type DecodedIdToken } from "firebase-admin/auth";
import type { Request, Response } from "express";

export type AuthenticatedRequest = Request & {
  auth: DecodedIdToken;
};

type AuthenticatedHandler = (req: AuthenticatedRequest, res: Response) => Promise<void> | void;

function getBearerToken(headerValue?: string): string | null {
  if (!headerValue) {
    return null;
  }

  const [scheme, token] = headerValue.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

export function withAuth(handler: AuthenticatedHandler) {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
      }

      const token = getBearerToken(req.header("authorization"));

      if (!token) {
        res.status(401).json({ error: "Missing or invalid Authorization header" });
        return;
      }

      const decoded = await getAuth().verifyIdToken(token, true);
      (req as AuthenticatedRequest).auth = decoded;

      await handler(req as AuthenticatedRequest, res);
    } catch (_error) {
      res.status(401).json({ error: "Unauthorized" });
    }
  };
}

export function withAdmin(handler: AuthenticatedHandler) {
  return withAuth(async (req, res) => {
    const isAdminClaim = req.auth.admin === true || req.auth.role === "admin";

    if (!isAdminClaim) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    await handler(req, res);
  });
}
