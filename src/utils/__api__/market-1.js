import { cache } from "react";
import { FALLBACK_PRODUCT_IMAGE, fetchCategories, fetchProducts } from "utils/catalog";

function getActiveCategories(categories) {
  return (Array.isArray(categories) ? categories : []).filter(item => item?.isActive !== false);
}

function toCategoryLink(slug) {
  return `/products/search?category=${encodeURIComponent(slug)}`;
}

const getMainCarousel = cache(async () => {
  const products = await fetchProducts();
  return products.slice(0, 4).map(item => ({
    id: item.id,
    title: item.title || item.name,
    description: item.shortDescription || item.description || "Discover new arrivals and daily deals",
    imgUrl: item.thumbnail || FALLBACK_PRODUCT_IMAGE,
    buttonText: "Shop Now",
    buttonLink: `/products/${item.slug}`
  }));
});

const getFlashDeals = cache(async () => {
  const products = await fetchProducts();
  return products.slice(0, 12);
});

const getCategories = cache(async () => {
  const categories = getActiveCategories(await fetchCategories());
  return categories.slice(0, 8).map(item => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    image: "/assets/images/products/apple-watch.png",
    href: toCategoryLink(item.slug)
  }));
});

const getJustForYou = cache(async () => {
  const products = await fetchProducts();
  return products.slice(12, 24);
});

const getNewArrivalList = cache(async () => {
  const products = await fetchProducts();
  return products.slice(24, 36);
});

const getShops = cache(async () => {
  const categories = getActiveCategories(await fetchCategories());
  return categories.slice(0, 6).map(item => ({
    id: item.id,
    name: `${item.name} Store`,
    slug: item.slug,
    profilePicture: "/assets/images/faces/7.png"
  }));
});

const getProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(0, 12);
});

const getBlogs = cache(async () => {
  const products = await fetchProducts();
  return products.slice(0, 3).map(item => ({
    id: item.id,
    title: item.title || item.name,
    createdAt: item.createdAt || "Latest",
    thumbnail: item.thumbnail || FALLBACK_PRODUCT_IMAGE,
    description: item.shortDescription || item.description || "Read practical shopping and product tips"
  }));
});

const getServiceList = cache(async () => {
  return [{
    id: "service-shipping",
    icon: "Truck",
    title: "Worldwide Delivery"
  }, {
    id: "service-return",
    icon: "Feedback",
    title: "30 Days Return"
  }, {
    id: "service-payment",
    icon: "CreditCard",
    title: "Secure Payment"
  }, {
    id: "service-support",
    icon: "CustomerService",
    title: "24/7 Support"
  }];
});

export default {
  getMainCarousel,
  getFlashDeals,
  getNewArrivalList,
  getProducts,
  getShops,
  getBlogs,
  getCategories,
  getServiceList,
  getJustForYou
};