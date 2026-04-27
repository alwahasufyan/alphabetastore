import { cache } from "react";
import { fetchCategories, fetchProductsPage } from "utils/catalog";

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
  const response = await fetchProductsPage({
    category,
    page: currentPage,
    limit: PAGE_SIZE
  });

  const data = {
    totalProducts: response.pagination.total,
    pageSize: PAGE_SIZE,
    products: response.products
  };

  return data;
});

export default {
  getCategories,
  getProducts,
  getCategoriesTwo
};