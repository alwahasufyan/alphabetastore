import { cache } from "react";
import { buildCategoryMenus, fetchCategories } from "utils/catalog";

const getLayoutData = cache(async () => {
  const categories = await fetchCategories();
  const navigation = buildCategoryMenus(categories).map(item => ({
    title: item.title,
    href: item.href
  }));

  const footerLinks = navigation.slice(0, 6).map(item => ({
    title: item.title,
    url: item.href
  }));

  return {
    topbar: {
      label: "Need help?",
      title: "support@alphabeta.com",
      languageOptions: [{
        title: "EN",
        value: "en"
      }],
      socials: []
    },
    header: {
      logo: "/assets/images/logo.svg",
      navigation
    },
    mobileNavigation: {
      logo: "/assets/images/logo.svg",
      version1: [{
        icon: "Home",
        title: "Home",
        href: "/"
      }, {
        icon: "CategoryOutline",
        title: "Categories",
        href: "/products/search"
      }, {
        icon: "Bag",
        title: "Cart",
        href: "/cart"
      }, {
        icon: "UserProfile",
        title: "Account",
        href: "/profile"
      }]
    },
    footer: {
      logo: "/assets/images/logo.svg",
      description: "Alphabeta store powered by real backend APIs.",
      playStoreUrl: "#",
      appStoreUrl: "#",
      about: footerLinks,
      customers: footerLinks,
      contact: {
        phone: "+1 000 000 0000",
        email: "support@alphabeta.com",
        address: "Alphabeta HQ"
      },
      socials: []
    }
  };
});
export default {
  getLayoutData
};