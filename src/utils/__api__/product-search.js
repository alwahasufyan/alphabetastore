import { cache } from "react";
import {
  buildProductFilters,
  fetchCategories,
  fetchProducts,
  filterCatalogProducts
} from "utils/catalog";

export const getFilters = cache(async () => {
  const categories = await fetchCategories();
  return buildProductFilters(categories);
});

export const getProducts = cache(async ({
  q,
  page,
  sort,
  sale,
  prices,
  colors,
  brands,
  rating,
  category
}) => {
  const PAGE_SIZE = 12;
  const currentPage = Math.max(Number(page) || 1, 1);

  const products = await fetchProducts({
    q,
    category,
    sort
  });

  const filteredProducts = filterCatalogProducts(products, {
    q,
    category,
    sort
  }).filter(item => {
    if (sale && !(Number(item?.discount || 0) > 0)) {
      return false;
    }

    if (rating && Number(item?.rating || 0) < Number(rating)) {
      return false;
    }

    if (prices && Array.isArray(prices) && prices.length === 2) {
      const minPrice = Number(prices[0]);
      const maxPrice = Number(prices[1]);
      const value = Number(item?.price || 0);

      if (Number.isFinite(minPrice) && value < minPrice) {
        return false;
      }

      if (Number.isFinite(maxPrice) && value > maxPrice) {
        return false;
      }
    }

    if (colors?.length) {
      return false;
    }

    if (brands?.length) {
      return false;
    }

    return true;
  });

  const firstIndex = (currentPage - 1) * PAGE_SIZE;
  const pagedProducts = filteredProducts.slice(firstIndex, firstIndex + PAGE_SIZE);

  return {
    products: pagedProducts,
    pageCount: Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE)),
    totalProducts: filteredProducts.length,
    firstIndex,
    lastIndex: Math.max(firstIndex + pagedProducts.length - 1, firstIndex)
  };
});