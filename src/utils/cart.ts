const CART_SESSION_KEY = "alphabeta_cart_session_id";
export const CART_RESET_EVENT = "alphabeta:cart-reset";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function createSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `cart_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getCartSessionId() {
  if (!canUseStorage()) return null;

  return window.localStorage.getItem(CART_SESSION_KEY);
}

export function ensureCartSessionId() {
  if (!canUseStorage()) return;

  const existingSessionId = getCartSessionId();

  if (existingSessionId) {
    return existingSessionId;
  }

  const nextSessionId = createSessionId();
  window.localStorage.setItem(CART_SESSION_KEY, nextSessionId);
  return nextSessionId;
}

export function clearCartSession() {
  if (!canUseStorage()) return;

  window.localStorage.removeItem(CART_SESSION_KEY);
}

export function emitCartReset(options = { resetSession: true }) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent(CART_RESET_EVENT, {
    detail: options
  }));
}