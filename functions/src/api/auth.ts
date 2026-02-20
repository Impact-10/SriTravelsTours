import { getAuth } from "firebase-admin/auth";
import { FieldValue } from "firebase-admin/firestore";
import { defineSecret } from "firebase-functions/params";
import { onRequest } from "firebase-functions/v2/https";

import { db } from "../firebase";
import { withAdmin, withAuth } from "../middleware/auth";

const region = "asia-south1";
const adminBootstrapSecret = defineSecret("ADMIN_BOOTSTRAP_SECRET");

type SetRolePayload = {
  uid?: string;
  role?: "user" | "admin";
};

export const whoAmI = onRequest({ region }, withAuth(async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  res.status(200).json({
    uid: req.auth.uid,
    claims: req.auth,
  });
}));

export const bootstrapFirstAdmin = onRequest(
  { region, secrets: [adminBootstrapSecret] },
  withAuth(async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const providedSecret = req.header("x-bootstrap-secret");

    if (!providedSecret || providedSecret !== adminBootstrapSecret.value()) {
      res.status(403).json({ error: "Invalid bootstrap secret" });
      return;
    }

    const existingAdminSnapshot = await db
      .collection("users")
      .where("role", "==", "admin")
      .limit(1)
      .get();

    if (!existingAdminSnapshot.empty) {
      res.status(409).json({ error: "Admin already exists" });
      return;
    }

    await getAuth().setCustomUserClaims(req.auth.uid, {
      role: "admin",
      admin: true,
    });

    await db.collection("users").doc(req.auth.uid).set(
      {
        uid: req.auth.uid,
        role: "admin",
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    res.status(200).json({
      success: true,
      uid: req.auth.uid,
      role: "admin",
    });
  }),
);

export const setUserRole = onRequest({ region }, withAdmin(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const payload = req.body as SetRolePayload;
  const targetUid = payload.uid?.trim();
  const role = payload.role;

  if (!targetUid || (role !== "admin" && role !== "user")) {
    res.status(400).json({ error: "Invalid payload. Expected: { uid, role }" });
    return;
  }

  await getAuth().setCustomUserClaims(targetUid, {
    role,
    admin: role === "admin",
  });

  await db.collection("users").doc(targetUid).set(
    {
      uid: targetUid,
      role,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  res.status(200).json({ success: true, uid: targetUid, role });
}));
