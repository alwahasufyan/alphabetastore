import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchProductBySlug } from "utils/catalog";
import { fetchCategories } from "utils/catalog";

// ─── Query keys ─────────────────────────────────────────────────────────────

export const QUERY_KEYS = {
  products: (filters) => ["products", filters ?? {}],
  product: (slugOrId) => ["products", "detail", slugOrId],
  categories: () => ["categories"],
};

// ─── Products ────────────────────────────────────────────────────────────────

/**
 * Fetch a paginated / filtered product list with React Query caching.
 *
 * @param {object} [filters] – same shape accepted by the catalog API
 * @param {object} [options] – extra react-query options (enabled, etc.)
 */
export function useProducts(filters, options) {
  return useQuery({
    queryKey: QUERY_KEYS.products(filters),
    queryFn: () => fetchProducts(filters),
    staleTime: 60 * 1000, // 1 minute
    ...options,
  });
}

/**
 * Fetch a single product by slug or ID.
 *
 * @param {string} slugOrId
 * @param {object} [options]
 */
export function useProduct(slugOrId, options) {
  return useQuery({
    queryKey: QUERY_KEYS.product(slugOrId),
    queryFn: () => fetchProductBySlug(slugOrId),
    enabled: Boolean(slugOrId),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
}

/**
 * Fetch all active categories.
 *
 * @param {object} [options]
 */
export function useCategories(options) {
  return useQuery({
    queryKey: QUERY_KEYS.categories(),
    queryFn: () => fetchCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes – matches server-side cache TTL
    ...options,
  });
}
