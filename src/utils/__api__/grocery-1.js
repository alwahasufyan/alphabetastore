import { cache } from "react";
import { fetchCategories, fetchProducts } from "utils/catalog";

function mapGroceryNavigation(categories) {
  const allCategories = Array.isArray(categories) ? categories : [];
  const topLevel = allCategories.filter(item => item?.isActive !== false && !item?.parentId);

  return topLevel.map(parent => {
    const children = allCategories.filter(item => item?.isActive !== false && item?.parentId === parent.id);
    const categoryItem = (children.length ? children : [parent]).map(item => ({
      title: item.name,
      href: `/grocery-1/${item.slug}`
    }));

    return {
      category: parent.name,
      categoryItem
    };
  });
}

const getGrocery1Navigation = cache(async () => {
  const categories = await fetchCategories();
  return mapGroceryNavigation(categories);
});

const getPopularProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(0, 12);
});

const getTrendingProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(12, 24);
});

const getProducts = cache(async category => {
  return fetchProducts(category ? {
    category
  } : {});
});

const getServices = cache(async () => {
  return [];
});

const getCategory = cache(async category => {
  const categories = await fetchCategories();
  const matchedCategory = (Array.isArray(categories) ? categories : []).find(item => item?.slug === category);

  if (!matchedCategory) {
    return null;
  }

  return {
    title: matchedCategory.name,
    slug: matchedCategory.slug
  };
});

export default {
  getCategory,
  getServices,
  getProducts,
  getPopularProducts,
  getTrendingProducts,
  getGrocery1Navigation
};