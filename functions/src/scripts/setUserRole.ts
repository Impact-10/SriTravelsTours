import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function initializeAdmin(): void {
  if (getApps().length > 0) {
    return;
  }

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson) as {
      project_id: string;
      client_email: string;
      private_key: string;
    };

    initializeApp({
      credential: cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key,
      }),
      projectId: serviceAccount.project_id,
    });

    return;
  }

  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    throw new Error(
      "No admin credentials found. Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_JSON.",
    );
  }

  initializeApp({
    credential: applicationDefault(),
    projectId: getRequiredEnv("FIREBASE_PROJECT_ID"),
  });
}

async function run(): Promise<void> {
  initializeAdmin();

  const targetUid = process.argv[2];
  const role = process.argv[3] as "user" | "admin" | undefined;

  if (!targetUid || (role !== "user" && role !== "admin")) {
    throw new Error("Usage: npm run role:set -- <uid> <user|admin>");
  }

  await getAuth().setCustomUserClaims(targetUid, {
    role,
    admin: role === "admin",
  });

  await getFirestore().collection("users").doc(targetUid).set(
    {
      uid: targetUid,
      role,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  process.stdout.write(`Role '${role}' assigned to '${targetUid}'.\n`);
}

run().catch((error: unknown) => {
  process.stderr.write(`Role assignment failed: ${String(error)}\n`);
  process.exit(1);
});
