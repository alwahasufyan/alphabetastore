import { apiDelete, apiGet, apiPatch, apiPost } from "./api";
import { FALLBACK_PRODUCT_IMAGE } from "./catalog";

export const ACTIVE_STATUS = "ACTIVE";
export const INACTIVE_STATUS = "INACTIVE";

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

export function getProductPrimaryImage(product) {
  const firstImage = ensureArray(product?.images).find(item => item?.imageUrl);
  return firstImage?.imageUrl || FALLBACK_PRODUCT_IMAGE;
}

export function mapAdminProduct(product) {
  const price = Number(product?.price ?? 0);
  const status = product?.status || ACTIVE_STATUS;

  return {
    ...product,
    name: product?.name || "Untitled Product",
    categoryName: product?.category?.name || "Unassigned",
    image: getProductPrimaryImage(product),
    price: Number.isFinite(price) ? price : 0,
    status,
    isActive: status === ACTIVE_STATUS
  };
}

export function parseImageUrls(value = "") {
  return [...new Set(String(value).split(/[\n,]/).map(item => item.trim()).filter(Boolean))];
}

export function serializeImageUrls(images) {
  return ensureArray(images).map(item => typeof item === "string" ? item : item?.imageUrl).filter(Boolean).join("\n");
}

export async function fetchAdminProducts() {
  const data = await apiGet("/products");
  return ensureArray(data);
}

export async function fetchAdminProductBySlug(slug) {
  return apiGet(`/products/${encodeURIComponent(slug)}`);
}

export async function fetchAdminCategories() {
  const data = await apiGet("/categories");
  return ensureArray(data);
}

export async function createAdminProduct(payload) {
  return apiPost("/products", payload);
}

export async function updateAdminProduct(id, payload) {
  return apiPatch(`/products/${id}`, payload);
}

export async function updateAdminProductStatus(id, isActive) {
  return updateAdminProduct(id, {
    status: isActive ? ACTIVE_STATUS : INACTIVE_STATUS
  });
}

export async function deleteAdminProduct(id) {
  return apiDelete(`/products/${id}`);
}