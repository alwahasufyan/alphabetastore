import { API_BASE_URL } from "./api";

export const FALLBACK_PRODUCT_IMAGE = "/assets/images/products/apple-watch.png";

async function fetchCatalog(path, fallbackMessage) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store"
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(fallbackMessage);
  }

  return data;
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
  return fetchCatalog("/categories", "Failed to load categories");
}

export async function fetchProducts() {
  const products = await fetchCatalog("/products", "Failed to load products");
  return Array.isArray(products) ? products.map(mapCatalogProduct) : [];
}

export async function fetchProductBySlug(slug) {
  const product = await fetchCatalog(`/products/${encodeURIComponent(slug)}`, "Failed to load products");
  return mapCatalogProduct(product);
}

export function mapCatalogProduct(product) {
  const imageUrls = Array.isArray(product?.images) ? product.images.map(item => item?.imageUrl).filter(Boolean) : [];
  const images = imageUrls.length ? imageUrls : [FALLBACK_PRODUCT_IMAGE];
  const price = Number(product?.price ?? 0);

  return {
    ...product,
    title: product?.name || "Untitled Product",
    thumbnail: images[0],
    images,
    price: Number.isFinite(price) ? price : 0,
    discount: 0,
    rating: 0,
    reviews: [],
    brand: null,
    shop: null,
    categoryName: product?.category?.name || ""
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
      const children = sortByName(normalized.filter(item => item.parentId === parent.id)).map(child => child.name);

      return children.length ? {
        title: parent.name,
        children
      } : {
        title: parent.name
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