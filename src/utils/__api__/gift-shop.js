import { cache } from "react";
import { fetchCategories, fetchProducts } from "utils/catalog";

function mapSideNavigation(categories) {
  const allCategories = Array.isArray(categories) ? categories : [];
  const topLevel = allCategories.filter(item => item?.isActive !== false && !item?.parentId);

  return topLevel.map(parent => {
    const children = allCategories.filter(item => item?.isActive !== false && item?.parentId === parent.id);
    const categoryItem = (children.length ? children : [parent]).map(item => ({
      title: item.name,
      href: `/gift-shop/${item.slug}`
    }));

    return {
      category: parent.name,
      categoryItem
    };
  });
}

const getMainCarouselData = cache(async () => {
  const products = await fetchProducts();

  return products.slice(0, 4).map(item => ({
    id: item.id,
    title: item.title || item.name,
    subTitle: item.category?.name || "Gift collection",
    buttonText: "Shop Now",
    imgUrl: item.thumbnail
  }));
});

const getCategoryNavigation = cache(async () => {
  const categories = await fetchCategories();
  return mapSideNavigation(categories);
});

const getPopularProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(0, 12);
});

const getTopSailedProducts = cache(async () => {
  const products = await fetchProducts();
  return products.slice(12, 24);
});

const getAllProducts = cache(async category => {
  return fetchProducts(category ? {
    category
  } : {});
});

const getServiceList = cache(async () => {
  return [{
    icon: "Truck",
    title: "Fast delivery",
    description: "Quick shipping across Libya"
  }, {
    icon: "Security",
    title: "Secure checkout",
    description: "Protected payment process"
  }, {
    icon: "CustomerService",
    title: "Support",
    description: "Dedicated customer support"
  }];
});

const getTopCategories = cache(async () => {
  const categories = await fetchCategories();
  return (Array.isArray(categories) ? categories : []).filter(item => item?.isActive !== false).slice(0, 8).map(item => ({
    id: item.id,
    name: item.name,
    image: "/assets/images/products/apple-watch.png",
    description: "Browse curated gift picks"
  }));
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
  getAllProducts,
  getServiceList,
  getTopCategories,
  getPopularProducts,
  getMainCarouselData,
  getTopSailedProducts,
  getCategoryNavigation
};