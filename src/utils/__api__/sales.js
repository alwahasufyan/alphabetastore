import { cache } from "react";
import { fetchCategories, fetchProducts } from "utils/catalog";

const getCategories = cache(async () => {
  const categories = await fetchCategories();
  return categories.map(item => ({
    title: item.name,
    slug: item.slug
  }));
});

const getCategoriesTwo = cache(async () => {
  return getCategories();
});

const getProducts = cache(async (page = 1, category) => {
  const PAGE_SIZE = 20;
  const currentPage = Math.max(Number(page) || 1, 1);
  const sourceProducts = await fetchProducts({
    category
  });
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentProducts = sourceProducts.slice(startIndex, startIndex + PAGE_SIZE);

  const data = {
    totalProducts: sourceProducts.length,
    pageSize: PAGE_SIZE,
    products: currentProducts
  };

  return data;
});

export default {
  getCategories,
  getProducts,
  getCategoriesTwo
};