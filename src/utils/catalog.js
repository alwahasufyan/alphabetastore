import { API_BASE_URL } from "./api";

export const FALLBACK_PRODUCT_IMAGE = "/assets/images/products/apple-watch.png";

const MISSING_PRODUCT_IMAGE_PATHS = new Set([
  "/assets/images/products/placeholder.png",
  "placeholder.png"
]);

function getBackendOrigin() {
  try {
    return new URL(API_BASE_URL).origin;
  } catch {
    return "";
  }
}

export function normalizeProductImageUrl(imageUrl) {
  const nextImageUrl = String(imageUrl || "").trim();

  if (!nextImageUrl || MISSING_PRODUCT_IMAGE_PATHS.has(nextImageUrl)) {
    return FALLBACK_PRODUCT_IMAGE;
  }

  if (/^https?:\/\//i.test(nextImageUrl)) {
    return nextImageUrl;
  }

  if (nextImageUrl.startsWith("/uploads/")) {
    const backendOrigin = getBackendOrigin();
    return backendOrigin ? `${backendOrigin}${nextImageUrl}` : nextImageUrl;
  }

  return nextImageUrl;
}

function buildCatalogQueryString(filters = {}) {
  const params = new URLSearchParams();
  const query = filters.q?.trim() || filters.search?.trim();

  if (query) {
    params.set("q", query);
  }

  if (filters.category) {
    params.set("category", filters.category);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.sort && filters.sort !== "relevance") {
    params.set("sort", filters.sort);
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

function unwrapEnvelope(payload) {
  if (payload && typeof payload === "object" && payload.success === true && "data" in payload) {
    return payload.data;
  }

  return payload;
}

function readEnvelopeErrorMessage(payload, fallbackMessage) {
  if (payload && typeof payload === "object" && payload.success === false && "message" in payload) {
    const message = payload.message;

    if (typeof message === "string") {
      return message;
    }

    if (Array.isArray(message)) {
      return message.join(", ");
    }
  }

  return fallbackMessage;
}

async function fetchCatalog(path, fallbackMessage, fallbackData) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store"
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(readEnvelopeErrorMessage(data, fallbackMessage));
    }

    return unwrapEnvelope(data);
  } catch (error) {
    // Keep static build resilient when backend is temporarily unavailable.
    if (typeof window === "undefined") {
      return fallbackData;
    }

    throw error instanceof Error ? error : new Error(fallbackMessage);
  }
}

function normalizeCategories(categories) {
  return (Array.isArray(categories) ? categories : []).filter(item => item?.isActive !== false);
}

function sortByName(items) {
  return [...items].sort((left, right) => left.name.localeCompare(right.name));
}

function createCategoryHref(slug) {
  return `/products/search?category=${encodeURIComponent(slug)}`;
}

export async function fetchCategories() {
  return fetchCatalog("/categories", "Failed to load categories", []);
}

export async function fetchProducts(filters = {}) {
  const products = await fetchCatalog(`/products${buildCatalogQueryString(filters)}`, "Failed to load products", []);
  return Array.isArray(products) ? products.map(mapCatalogProduct) : [];
}

export async function fetchProductBySlug(slug) {
  const product = await fetchCatalog(`/products/${encodeURIComponent(slug)}`, "Failed to load products", null);
  return mapCatalogProduct(product);
}

export function mapCatalogProduct(product) {
  const imageUrls = Array.isArray(product?.images) ? product.images.map(item => normalizeProductImageUrl(item?.imageUrl)).filter(Boolean) : [];
  const images = imageUrls.length ? imageUrls : [FALLBACK_PRODUCT_IMAGE];
  const price = Number(product?.price ?? 0);
  const categoryName = product?.category?.name || "";
  const categories = Array.isArray(product?.categories) ? product.categories.map(item => item?.name || item).filter(Boolean) : categoryName ? [categoryName] : [];

  return {
    ...product,
    title: product?.name || "Untitled Product",
    thumbnail: images[0],
    images,
    categories,
    price: Number.isFinite(price) ? price : 0,
    discount: 0,
    rating: 0,
    reviews: [],
    brand: null,
    shop: null,
    categoryName
  };
}

export function buildCategoryMenus(categories) {
  const normalized = normalizeCategories(categories);
  const topLevel = sortByName(normalized.filter(item => !item.parentId));

  return topLevel.map(parent => {
    const children = sortByName(normalized.filter(item => item.parentId === parent.id)).map(child => ({
      title: child.name,
      href: createCategoryHref(child.slug)
    }));

    return {
      title: parent.name,
      href: children[0]?.href || createCategoryHref(parent.slug),
      component: children.length ? "Grid" : undefined,
      children: children.length ? [{
        title: parent.name,
        children
      }] : undefined
    };
  });
}

export function buildMobileCategoryMenus(categories) {
  const normalized = normalizeCategories(categories);
  const topLevel = sortByName(normalized.filter(item => !item.parentId));

  return topLevel.map(parent => ({
    icon: "CategoryOutline",
    title: parent.name,
    href: createCategoryHref(parent.slug),
    children: sortByName(normalized.filter(item => item.parentId === parent.id)).map(child => ({
      title: child.name,
      href: createCategoryHref(child.slug)
    }))
  }));
}

export function buildProductFilters(categories) {
  const normalized = normalizeCategories(categories);
  const topLevel = sortByName(normalized.filter(item => !item.parentId));

  return {
    brands: [],
    others: [],
    colors: [],
    categories: topLevel.map(parent => {
      const children = sortByName(normalized.filter(item => item.parentId === parent.id)).map(child => ({
        title: child.name,
        slug: child.slug
      }));

      return children.length ? {
        title: parent.name,
        slug: parent.slug,
        children
      } : {
        title: parent.name,
        slug: parent.slug
      };
    })
  };
}

export function filterCatalogProducts(products, options = {}) {
  const {
    q,
    category,
    sort
  } = options;

  let filteredProducts = Array.isArray(products) ? [...products] : [];

  if (q) {
    const query = q.trim().toLowerCase();
    filteredProducts = filteredProducts.filter(product => {
      const haystacks = [product.title, product.description, product.shortDescription, product.category?.name];
      return haystacks.filter(Boolean).some(value => value.toLowerCase().includes(query));
    });
  }

  if (category) {
    filteredProducts = filteredProducts.filter(product => product.category?.slug === category);
  }

  if (sort === "asc") {
    filteredProducts.sort((left, right) => left.price - right.price);
  } else if (sort === "desc") {
    filteredProducts.sort((left, right) => right.price - left.price);
  } else if (sort === "date") {
    filteredProducts.sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
  }

  return filteredProducts;
}