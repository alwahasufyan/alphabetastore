import { cache } from "react";
import { FALLBACK_PRODUCT_IMAGE, fetchCategories, fetchProducts } from "utils/catalog";

function getActiveCategories(categories) {
  return (Array.isArray(categories) ? categories : []).filter(item => item?.isActive !== false);
}

function toSearchHref(slug) {
  return `/products/search?category=${encodeURIComponent(slug)}`;
}

// CUSTOM DATA MODELS

const getTopNewProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(0, 12);
});

const getTopSellingProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(12, 24);
});

const getFurnitureProducts = cache(async category => {
  if (!category) {
    return fetchProducts();
  }

  return fetchProducts({
    category
  });
});

const getFurnitureShopNavList = cache(async () => {
  const categories = getActiveCategories(await fetchCategories());
  const topLevel = categories.filter(item => !item.parentId);

  const categoryItem = topLevel.map(parent => {
    const children = categories.filter(item => item.parentId === parent.id).map(item => ({
      title: item.name,
      href: toSearchHref(item.slug)
    }));

    if (!children.length) {
      return {
        title: parent.name,
        href: toSearchHref(parent.slug)
      };
    }

    return {
      title: parent.name,
      child: children
    };
  });

  return [{
    category: "Browse Categories",
    categoryItem
  }];
});

const getMainCarouselData = cache(async () => {
  const products = await fetchProducts();
  return products.slice(0, 3).map(item => ({
    id: item.id,
    title: item.title || item.name,
    description: item.shortDescription || item.description || "Comfort-first furniture for modern homes",
    buttonText: "Shop Now",
    buttonLink: `/products/${item.slug}`,
    imgUrl: item.thumbnail || FALLBACK_PRODUCT_IMAGE
  }));
});

const getCategory = cache(async category => {
  const categories = getActiveCategories(await fetchCategories());
  return categories.find(item => item.slug === category) || null;
});
export default {
  getCategory,
  getTopNewProducts,
  getMainCarouselData,
  getFurnitureProducts,
  getTopSellingProducts,
  getFurnitureShopNavList
};