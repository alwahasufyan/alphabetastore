import { cache } from "react";
import { fetchCategories, fetchProducts, mapCatalogProduct } from "utils/catalog";

function buildSectionCategory(title, children) {
  return {
    title,
    children
  };
}

async function getCatalogProducts() {
  const products = await fetchProducts();
  return products.map(mapCatalogProduct);
}

const getProducts = cache(async () => {
  return getCatalogProducts();
});
const getServices = cache(async () => {
  return [];
});
const getCategories = cache(async () => {
  const categories = await fetchCategories();

  return categories.map(item => ({
    id: item.id,
    name: item.name,
    image: "/assets/images/market-2/product-1.png",
    slug: item.slug
  }));
});
const getBrands = cache(async () => {
  const products = await getCatalogProducts();

  return products.slice(0, 10).map((item, index) => ({
    id: item.id || index,
    image: item.thumbnail || "/assets/images/brands/mac.png"
  }));
});
const getMainCarouselData = cache(async () => {
  const products = await getCatalogProducts();

  return products.slice(0, 3).map(item => ({
    id: item.id,
    category: item.category?.name || "Category",
    title: item.title || item.name,
    imgUrl: item.thumbnail,
    description: item.shortDescription || item.description || "",
    buttonLink: `/products/${item.slug}`
  }));
});
const getElectronicsProducts = cache(async () => {
  const products = await getCatalogProducts();

  return {
    category: buildSectionCategory("Electronics", ["Featured", "Top Deals", "Accessories"]),
    products: products.slice(0, 10)
  };
});
const getMenFashionProducts = cache(async () => {
  const products = await getCatalogProducts();

  return {
    category: buildSectionCategory("Men Fashion", ["Apparel", "Shoes", "Accessories"]),
    products: products.slice(10, 20)
  };
});
const getWomenFashionProducts = cache(async () => {
  const products = await getCatalogProducts();

  return {
    category: buildSectionCategory("Women Fashion", ["Apparel", "Bags", "Accessories"]),
    products: products.slice(20, 30)
  };
});
export default {
  getBrands,
  getProducts,
  getServices,
  getCategories,
  getMainCarouselData,
  getMenFashionProducts,
  getElectronicsProducts,
  getWomenFashionProducts
};