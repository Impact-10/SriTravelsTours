import { getAuth } from "firebase-admin/auth";
import { onDocumentWritten } from "firebase-functions/v2/firestore";

const region = "asia-south1";

export const syncRoleClaims = onDocumentWritten(
  {
    region,
    document: "users/{uid}",
  },
  async (event) => {
    const uid = event.params.uid as string;
    const beforeRole = event.data?.before.data()?.role as "user" | "admin" | undefined;
    const afterRole = event.data?.after.data()?.role as "user" | "admin" | undefined;

    if (!afterRole || beforeRole === afterRole) {
      return;
    }

    const auth = getAuth();
    const userRecord = await auth.getUser(uid);

    await auth.setCustomUserClaims(uid, {
      ...(userRecord.customClaims ?? {}),
      role: afterRole,
      admin: afterRole === "admin",
    });
  },
);
