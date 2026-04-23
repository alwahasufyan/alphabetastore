import { cache } from "react";
import { FALLBACK_PRODUCT_IMAGE, fetchCategories, fetchProducts } from "utils/catalog";

function getActiveCategories(categories) {
  return (Array.isArray(categories) ? categories : []).filter(item => item?.isActive !== false);
}

const getProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(0, 12);
});

const getFeatureProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(12, 24);
});

const getSaleProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(24, 32);
});

const getPopularProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(32, 40);
});

const getLatestProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(40, 48);
});

const getBestWeekProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(48, 56);
});

const getBlogs = cache(async () => {
  const products = await fetchProducts();
  return products.slice(0, 3).map(item => ({
    id: item.id,
    title: item.title || item.name,
    createdAt: item.createdAt || "Latest",
    thumbnail: item.thumbnail || FALLBACK_PRODUCT_IMAGE,
    description: item.shortDescription || item.description || "Read the latest fashion trends and styling tips"
  }));
});

const getServices = cache(async () => {
  return [{
    id: "service-delivery",
    icon: "Truck",
    title: "Fast Delivery",
    description: "Quick shipping for every order"
  }, {
    id: "service-payment",
    icon: "CreditCard",
    title: "Secure Payment",
    description: "Safe checkout and payment flow"
  }, {
    id: "service-support",
    icon: "CustomerService",
    title: "Live Support",
    description: "Help whenever you need it"
  }];
});

const getCategories = cache(async () => {
  const categories = getActiveCategories(await fetchCategories());
  return categories.slice(0, 8).map(item => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    image: "/assets/images/products/apple-watch.png"
  }));
});

const getMainCarouselData = cache(async () => {
  const products = await fetchProducts();
  return products.slice(0, 4).map(item => ({
    id: item.id,
    title: item.title || item.name,
    description: item.shortDescription || item.description || "New arrivals picked for your style",
    imgUrl: item.thumbnail || FALLBACK_PRODUCT_IMAGE,
    buttonText: "Shop Now",
    buttonLink: `/products/${item.slug}`
  }));
});

const getBrands = cache(async () => {
  return [{
    id: "brand-1",
    image: "/assets/images/brands/adidas.png"
  }, {
    id: "brand-2",
    image: "/assets/images/brands/lacoste.png"
  }, {
    id: "brand-3",
    image: "/assets/images/brands/levis.png"
  }, {
    id: "brand-4",
    image: "/assets/images/brands/gucci.png"
  }, {
    id: "brand-5",
    image: "/assets/images/brands/chanel.png"
  }];
});

export default {
  getBlogs,
  getBrands,
  getProducts,
  getServices,
  getCategories,
  getSaleProducts,
  getLatestProducts,
  getPopularProducts,
  getFeatureProducts,
  getBestWeekProducts,
  getMainCarouselData
};