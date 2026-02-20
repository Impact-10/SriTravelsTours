import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

import { optionalPublicEnv } from "@/lib/env";
import { getFirebaseClientApp } from "@/lib/firebase/client";

const app = getFirebaseClientApp();

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const functions = getFunctions(app, optionalPublicEnv.functionsRegion);
