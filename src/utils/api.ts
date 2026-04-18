import { getAccessToken } from "./auth";
import { ensureCartSessionId } from "./cart";

export const API_BASE_URL = "http://localhost:3001/api/v1";

type ApiMethod = "GET" | "POST" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: ApiMethod;
  body?: unknown;
};

function getErrorMessage(payload: unknown, fallback: string) {
  if (typeof payload === "string") {
    return payload;
  }

  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message?: unknown }).message;

    if (typeof message === "string") {
      return message;
    }

    if (Array.isArray(message)) {
      return message.join(", ");
    }
  }

  return fallback;
}

export async function apiRequest(path: string, options: RequestOptions = {}) {
  const { method = "GET", body } = options;
  const token = getAccessToken();
  const headers: Record<string, string> = {};
  const sessionId = ensureCartSessionId();

  if (method === "POST" || method === "PATCH") {
    headers["Content-Type"] = "application/json";
  }

  if (sessionId) {
    headers["x-session-id"] = sessionId;
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    cache: "no-store",
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(getErrorMessage(data, "Request failed"));
  }

  return data;
}

export function apiGet(path: string) {
  return apiRequest(path, { method: "GET" });
}

export function apiPost(path: string, body: unknown) {
  return apiRequest(path, { method: "POST", body });
}

export function apiPatch(path: string, body: unknown) {
  return apiRequest(path, { method: "PATCH", body });
}

export function apiDelete(path: string) {
  return apiRequest(path, { method: "DELETE" });
}