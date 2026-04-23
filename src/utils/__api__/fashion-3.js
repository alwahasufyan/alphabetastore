import { cache } from "react";
import { FALLBACK_PRODUCT_IMAGE, fetchProducts } from "utils/catalog";

// CUSTOM DATA MODELS

const getProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(0, 18);
});

const getBestProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(18, 30);
});

const getMainCarouselData = cache(async () => {
  const products = await fetchProducts();
  return products.slice(0, 4).map(item => ({
    id: item.id,
    title: item.title || item.name,
    description: item.shortDescription || item.description || "Discover modern fashion essentials",
    imgUrl: item.thumbnail || FALLBACK_PRODUCT_IMAGE,
    buttonText: "Shop Now",
    buttonLink: `/products/${item.slug}`
  }));
});

const getServices = cache(async () => {
  return [{
    id: "service-delivery",
    icon: "Truck",
    title: "Fast Delivery",
    description: "Reliable delivery on every order"
  }, {
    id: "service-quality",
    icon: "Verified",
    title: "Quality Assured",
    description: "Carefully selected products"
  }, {
    id: "service-support",
    icon: "CustomerService",
    title: "Customer Support",
    description: "Friendly support team"
  }];
});

const getBlogs = cache(async () => {
  const products = await fetchProducts();
  return products.slice(0, 3).map(item => ({
    id: item.id,
    title: item.title || item.name,
    createdAt: item.createdAt || "Latest",
    thumbnail: item.thumbnail || FALLBACK_PRODUCT_IMAGE,
    description: item.shortDescription || item.description || "Style ideas and shopping inspiration"
  }));
});

const getBrands = cache(async () => {
  return [{
    id: "brand-1",
    image: "/assets/images/brands/adidas.png"
  }, {
    id: "brand-2",
    image: "/assets/images/brands/gucci.png"
  }, {
    id: "brand-3",
    image: "/assets/images/brands/chanel.png"
  }, {
    id: "brand-4",
    image: "/assets/images/brands/puma.png"
  }];
});
export default {
  getProducts,
  getBestProducts,
  getMainCarouselData,
  getServices,
  getBlogs,
  getBrands
};