import { cache } from "react";
import axios from "utils/axiosInstance";
import { buildCategoryMenus, fetchCategories } from "utils/catalog";

const getLayoutData = cache(async () => {
  const [categories, settingsResponse] = await Promise.all([fetchCategories(), axios.get("/settings")]);
  const settings = settingsResponse.data;
  const defaultLanguage = settings?.default_language === "en" ? "en" : "ar";
  const isArabic = defaultLanguage === "ar";

  const navigation = buildCategoryMenus(categories).map(item => ({
    title: item.title,
    href: item.href
  }));

  const footerLinks = navigation.slice(0, 6).map(item => ({
    title: item.title,
    url: item.href
  }));
  const dashboardShortcut = {
    title: isArabic ? "لوحة التحكم" : "Dashboard",
    url: "/vendor/dashboard"
  };
  const aboutShortcut = {
    title: isArabic ? "معلومات عنا" : "About Us",
    url: "/"
  };

  return {
    topbar: {
      label: isArabic ? "هل تحتاج مساعدة؟" : "Need help?",
      title: settings?.support_email || "support@alphabeta.com",
      languageOptions: [{
        title: "AR",
        value: "ar"
      }, {
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
        title: isArabic ? "الرئيسية" : "Home",
        href: "/"
      }, {
        icon: "CategoryOutline",
        title: isArabic ? "الفئات" : "Categories",
        href: "/products/search"
      }, {
        icon: "Bag",
        title: isArabic ? "السلة" : "Cart",
        href: "/cart"
      }, {
        icon: "UserProfile",
        title: isArabic ? "الحساب" : "Account",
        href: "/profile"
      }]
    },
    footer: {
      logo: "/assets/images/logo.svg",
      description: isArabic ? "Alphabeta Store مدعوم بواجهات خلفية حقيقية." : "Alphabeta Store powered by real backend APIs.",
      playStoreUrl: "#",
      appStoreUrl: "#",
      about: [aboutShortcut, dashboardShortcut, ...footerLinks].slice(0, 8),
      customers: [dashboardShortcut, ...footerLinks].slice(0, 8),
      contact: {
        phone: settings?.shop_phone || "+218000000000",
        email: settings?.support_email || "support@alphabeta.com",
        address: settings?.shop_address || "Tripoli, Libya"
      },
      socials: []
    }
  };
});
export default {
  getLayoutData
};