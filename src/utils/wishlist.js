import { apiDelete, apiGet, apiPost } from "./api";
import { mapCatalogProduct } from "./catalog";

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

export function mapWishlistItem(item) {
  const product = item?.product || {};

  return {
    id: item?.id || "",
    createdAt: item?.createdAt || null,
    product: {
      ...mapCatalogProduct(product),
      categories: product?.category?.name ? [product.category.name] : []
    }
  };
}

export async function fetchWishlistItems() {
  const data = await apiGet("/wishlist");
  return ensureArray(data).map(mapWishlistItem);
}

export async function addWishlistItem(productId) {
  const data = await apiPost("/wishlist", { productId });
  return mapWishlistItem(data);
}

export async function removeWishlistItem(productId) {
  return apiDelete(`/wishlist/${productId}`);
}