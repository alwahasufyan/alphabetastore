import { cache } from "react";
import { fetchProductBySlug, fetchProducts } from "utils/catalog";

// get all product slug
const getSlugs = cache(async () => {
  const products = await fetchProducts();

  return products.map(item => ({
    params: {
      slug: item.slug
    }
  }));
});


// get product based on slug
const getProduct = cache(async slug => {
  return fetchProductBySlug(slug);
});


// search products
const searchProducts = cache(async (name, category) => {
  return fetchProducts({
    q: name,
    category
  });
});

// product reviews
const getProductReviews = cache(async () => {
  // Reviews are not part of the current MVP backend contract yet.
  return [];
});
export default {
  getSlugs,
  getProduct,
  searchProducts,
  getProductReviews
};