import { cache } from "react";
import { fetchCategories, fetchProductBySlug, fetchProducts } from "utils/catalog";

const getAllProducts = cache(async () => {
  return fetchProducts();
});
const getAllProductsBySlug = cache(async () => {
  return fetchProducts();
});
const getStories = cache(async () => {
  const products = await fetchProducts();

  return products.slice(0, 8).map(item => ({
    id: item.id,
    title: item.title || item.name,
    image: item.thumbnail || "/assets/images/products/apple-watch.png",
    imageBig: item.thumbnail || "/assets/images/products/apple-watch.png",
    url: item.slug ? `/products/${encodeURIComponent(item.slug)}` : "/products/search"
  }));
});
const getCategories = cache(async () => {
  const categories = await fetchCategories();

  return categories.map(item => ({
    name: item?.name || "Category",
    path: item?.slug ? `/gadget-3/categories/${encodeURIComponent(item.slug)}` : "/products/search"
  }));
});
const getBreadcrumb = cache(async slug => {
  try {
    const product = await fetchProductBySlug(slug);

    return [{
      title: product?.category?.name || "Products",
      href: "/products/search"
    }, {
      title: product?.title || product?.name || "Product",
      href: `/products/${encodeURIComponent(slug)}`
    }];
  } catch {
    return [{
      title: "Products",
      href: "/products/search"
    }];
  }
});
export default {
  getAllProducts,
  getStories,
  getCategories,
  getBreadcrumb,
  getAllProductsBySlug
};