import { apiDelete, apiGet, apiPatch, apiPost } from "./api";
import { FALLBACK_PRODUCT_IMAGE, normalizeProductImageUrl } from "./catalog";

export const ALL_PRODUCT_STATUS = "ALL";
export const ACTIVE_STATUS = "ACTIVE";
export const INACTIVE_STATUS = "INACTIVE";

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

export function getProductPrimaryImage(product) {
  const firstImage = ensureArray(product?.images).find(item => item?.imageUrl);
  return normalizeProductImageUrl(firstImage?.imageUrl || FALLBACK_PRODUCT_IMAGE);
}

function normalizeProductImages(images) {
  return ensureArray(images).map(image => ({
    ...image,
    imageUrl: normalizeProductImageUrl(image?.imageUrl)
  }));
}

function normalizeAdminProduct(product) {
  if (!product || typeof product !== "object") {
    return product;
  }

  return {
    ...product,
    images: normalizeProductImages(product.images)
  };
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

function buildAdminProductsQuery(filters = {}) {
  const params = new URLSearchParams();
  const query = filters.q?.trim() || filters.search?.trim();

  if (query) {
    params.set("q", query);
  }

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.status && filters.status !== ALL_PRODUCT_STATUS) {
    params.set("status", filters.status);
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export async function fetchAdminProducts(filters = {}) {
  const data = await apiGet(`/products${buildAdminProductsQuery(filters)}`);
  return ensureArray(data).map(normalizeAdminProduct);
}

export async function fetchAdminProductBySlug(slug) {
  const data = await apiGet(`/products/${encodeURIComponent(slug)}`);
  return normalizeAdminProduct(data);
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

export async function uploadAdminProductImages(id, files) {
  const formData = new FormData();

  files.forEach(file => {
    formData.append("files", file);
  });

  return apiPost(`/products/${id}/images`, formData);
}

export async function deleteAdminProductImage(id, imageId) {
  return apiDelete(`/products/${id}/images/${imageId}`);
}

export async function updateAdminProductStatus(id, isActive) {
  return updateAdminProduct(id, {
    status: isActive ? ACTIVE_STATUS : INACTIVE_STATUS
  });
}

export async function deleteAdminProduct(id) {
  return apiDelete(`/products/${id}`);
}