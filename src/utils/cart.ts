const CART_STORAGE_KEY = "alphabeta_cart";
export const CART_RESET_EVENT = "alphabeta:cart-reset";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getStoredCart() {
  if (!canUseStorage()) return [];

  const rawCart = window.localStorage.getItem(CART_STORAGE_KEY);

  if (!rawCart) return [];

  try {
    const parsedCart = JSON.parse(rawCart);
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch {
    return [];
  }
}

export function saveStoredCart(cart) {
  if (!canUseStorage()) return;

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export function clearStoredCart() {
  if (!canUseStorage()) return;

  window.localStorage.removeItem(CART_STORAGE_KEY);
}

export function emitCartReset() {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new Event(CART_RESET_EVENT));
}