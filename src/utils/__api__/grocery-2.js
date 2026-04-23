import { cache } from "react";
import { FALLBACK_PRODUCT_IMAGE, fetchCategories, fetchProducts } from "utils/catalog";

function getActiveCategories(categories) {
  return (Array.isArray(categories) ? categories : []).filter(item => item?.isActive !== false);
}

function buildCategoryHref(slug) {
  return `/products/search?category=${encodeURIComponent(slug)}`;
}

const getServices = cache(async () => {
  return [{
    id: "delivery",
    icon: "Truck",
    title: "Fast Delivery",
    description: "Get products delivered quickly"
  }, {
    id: "quality",
    icon: "Verified",
    title: "Quality Products",
    description: "Carefully selected items"
  }, {
    id: "support",
    icon: "CustomerService",
    title: "24/7 Support",
    description: "We are here when you need help"
  }];
});

const getCategories = cache(async () => {
  const categories = getActiveCategories(await fetchCategories());
  return categories.slice(0, 6).map(item => ({
    id: item.id,
    name: item.name,
    image: "/assets/images/products/apple-watch.png",
    description: "Fresh picks for your daily needs",
    slug: item.slug
  }));
});

const getDiscountBannerList = cache(async () => {
  const products = await fetchProducts();
  return products.slice(0, 3).map((item, index) => ({
    id: item.id,
    subtitle: "Limited Time Offer",
    title: item.title || item.name,
    shopUrl: `/products/${item.slug}`,
    imgUrl: item.thumbnail || FALLBACK_PRODUCT_IMAGE,
    bgColor: index % 2 === 0 ? "#E3F2FD" : "#FFF3E0"
  }));
});

const getNavigationList = cache(async () => {
  const categories = getActiveCategories(await fetchCategories());
  const topLevel = categories.filter(item => !item.parentId);

  return topLevel.map(parent => {
    const children = categories.filter(item => item.parentId === parent.id).map(item => ({
      title: item.name,
      href: buildCategoryHref(item.slug)
    }));

    if (!children.length) {
      return {
        title: parent.name,
        href: buildCategoryHref(parent.slug),
        icon: "Categories"
      };
    }

    return {
      title: parent.name,
      icon: "Categories",
      child: children
    };
  });
});

const getFeaturedProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(0, 12);
});

const getBestSellProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(12, 24);
});

const getBestHomeProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(24, 36);
});

const getDairyProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(36, 48);
});

const getTestimonials = cache(async () => {
  return [{
    id: "testimonial-1",
    comment: "Fast delivery and great product quality.",
    user: {
      name: "Alphabeta Customer",
      avatar: "/assets/images/faces/7.png"
    }
  }, {
    id: "testimonial-2",
    comment: "Checkout was simple and support was helpful.",
    user: {
      name: "Happy Buyer",
      avatar: "/assets/images/faces/6.png"
    }
  }];
});

const getMainCarousel = cache(async () => {
  const products = await fetchProducts();
  return products.slice(0, 3).map(item => ({
    id: item.id,
    title: item.title || item.name,
    description: item.shortDescription || item.description || "Explore our latest products",
    imgUrl: item.thumbnail || FALLBACK_PRODUCT_IMAGE
  }));
});

export default {
  getServices,
  getCategories,
  getTestimonials,
  getMainCarousel,
  getDairyProducts,
  getNavigationList,
  getFeaturedProducts,
  getBestSellProducts,
  getBestHomeProducts,
  getDiscountBannerList
};