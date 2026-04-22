import { clearTokens, getAccessToken, getRefreshToken, saveAccessToken } from "./auth";
import { ensureCartSessionId } from "./cart";

const DEFAULT_API_BASE_URL = "http://localhost:3001/api/v1";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || DEFAULT_API_BASE_URL;

type ApiMethod = "GET" | "POST" | "PATCH" | "DELETE";

type RequestOptions = {
  method?: ApiMethod;
  body?: unknown;
  retryOnUnauthorized?: boolean;
};

let refreshRequest: Promise<string | null> | null = null;

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

function isFormData(value: unknown): value is FormData {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

function buildHeaders(method: ApiMethod, token?: string | null, body?: unknown) {
  const headers: Record<string, string> = {};
  const sessionId = ensureCartSessionId();

  if ((method === "POST" || method === "PATCH") && !isFormData(body)) {
    headers["Content-Type"] = "application/json";
  }

  if (sessionId) {
    headers["x-session-id"] = sessionId;
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function parseJsonResponse(response: Response) {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  if (!refreshRequest) {
    refreshRequest = (async () => {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ refreshToken }),
      });

      const data = await parseJsonResponse(response);

      if (!response.ok || !data?.accessToken) {
        clearTokens();
        return null;
      }

      saveAccessToken(data.accessToken);
      return data.accessToken;
    })().finally(() => {
      refreshRequest = null;
    });
  }

  return refreshRequest;
}

export async function apiRequest(path: string, options: RequestOptions = {}) {
  const { method = "GET", body, retryOnUnauthorized = true } = options;
  const token = getAccessToken();
  const headers = buildHeaders(method, token, body);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    cache: "no-store",
    body: body ? isFormData(body) ? body : JSON.stringify(body) : undefined,
  });

  const data = await parseJsonResponse(response);

  if (
    response.status === 401 &&
    retryOnUnauthorized &&
    path !== "/auth/refresh" &&
    path !== "/auth/login"
  ) {
    const nextAccessToken = await refreshAccessToken();

    if (nextAccessToken) {
      return apiRequest(path, {
        method,
        body,
        retryOnUnauthorized: false,
      });
    }
  }

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