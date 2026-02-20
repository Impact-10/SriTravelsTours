import { FirebaseApp, FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";

import { getPublicEnv, optionalPublicEnv } from "@/lib/env";

export function getFirebaseOptions(): FirebaseOptions {
  return {
    apiKey: getPublicEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: getPublicEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: getPublicEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: getPublicEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: getPublicEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: getPublicEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
    measurementId: optionalPublicEnv.firebaseMeasurementId,
  };
}

export function getFirebaseClientApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp(getFirebaseOptions());
}
