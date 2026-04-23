import { cache } from "react";
import { FALLBACK_PRODUCT_IMAGE, fetchCategories, fetchProducts } from "utils/catalog";

function getActiveCategories(categories) {
  return (Array.isArray(categories) ? categories : []).filter(item => item?.isActive !== false);
}

const getProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(0, 12);
});

const getFlashProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(12, 24);
});

const getTopRatedProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(24, 36);
});

const getServices = cache(async () => {
  return [{
    id: "service-delivery",
    icon: "Truck",
    title: "Fast Delivery",
    description: "Quick shipping on all orders"
  }, {
    id: "service-payment",
    icon: "CreditCard",
    title: "Secure Payment",
    description: "Multiple safe payment options"
  }, {
    id: "service-quality",
    icon: "Verified",
    title: "Quality Checked",
    description: "Trusted products with verified quality"
  }];
});

const getCategories = cache(async () => {
  const categories = getActiveCategories(await fetchCategories());
  return categories.slice(0, 12).map(item => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    image: "/assets/images/products/apple-watch.png"
  }));
});

const getBrands = cache(async () => {
  const categories = getActiveCategories(await fetchCategories());
  return categories.slice(0, 8).map(item => ({
    id: item.id,
    slug: item.slug,
    name: `${item.name} Brand`,
    image: "/assets/images/brands/apple.png"
  }));
});

const getShops = cache(async () => {
  const categories = getActiveCategories(await fetchCategories());
  const thumbnails = ["hatil", "otobi", "steelcase", "zeiss"];

  return categories.slice(0, 8).map((item, index) => ({
    id: item.id,
    slug: item.slug,
    name: `${item.name} Shop`,
    thumbnail: thumbnails[index % thumbnails.length]
  }));
});

const getMainCarouselData = cache(async () => {
  const products = await fetchProducts();
  return products.slice(0, 4).map(item => ({
    id: item.id,
    title: item.title || item.name,
    description: item.shortDescription || item.description || "Explore curated picks and daily essentials",
    category: item.category?.name || "Featured",
    buttonLink: `/products/${item.slug}`,
    imgUrl: item.thumbnail || FALLBACK_PRODUCT_IMAGE
  }));
});

const getBlogs = cache(async () => {
  const products = await fetchProducts();
  return products.slice(0, 3).map(item => ({
    id: item.id,
    title: item.title || item.name,
    createdAt: item.createdAt || "Latest",
    thumbnail: item.thumbnail || FALLBACK_PRODUCT_IMAGE,
    description: item.shortDescription || item.description || "Helpful tips and product highlights"
  }));
});

const getClients = cache(async () => {
  return [{
    id: "client-1",
    image: "/assets/images/brands/apple.png"
  }, {
    id: "client-2",
    image: "/assets/images/brands/samsung.png"
  }, {
    id: "client-3",
    image: "/assets/images/brands/sony.png"
  }, {
    id: "client-4",
    image: "/assets/images/brands/xiaomi.png"
  }];
});

export default {
  getBrands,
  getServices,
  getCategories,
  getFlashProducts,
  getTopRatedProducts,
  getMainCarouselData,
  getBlogs,
  getProducts,
  getShops,
  getClients
};