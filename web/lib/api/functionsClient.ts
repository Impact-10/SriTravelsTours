import { auth } from "@/lib/firebase/services";
import { getPublicEnv, optionalPublicEnv } from "@/lib/env";

function getFunctionsBaseUrl(): string {
  if (optionalPublicEnv.apiBaseUrl) {
    return optionalPublicEnv.apiBaseUrl.replace(/\/$/, "");
  }

  const region = optionalPublicEnv.functionsRegion;
  const projectId = getPublicEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID");

  return `https://${region}-${projectId}.cloudfunctions.net`;
}

async function getAuthToken(): Promise<string> {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("You must be logged in.");
  }

  return currentUser.getIdToken();
}

export async function functionsGet<T>(path: string): Promise<T> {
  const token = await getAuthToken();
  const response = await fetch(`${getFunctionsBaseUrl()}/${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.error ?? "Request failed");
  }

  return body as T;
}

export async function functionsPost<TResponse, TPayload>(
  path: string,
  payload: TPayload,
): Promise<TResponse> {
  const token = await getAuthToken();
  const response = await fetch(`${getFunctionsBaseUrl()}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(body.error ?? "Request failed");
  }

  return body as TResponse;
}
