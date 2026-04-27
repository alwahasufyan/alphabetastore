import { notFound } from "next/navigation";

// API FUNCTIONS
import api from "utils/__api__/shop";

// PAGE VIEW COMPONENT
import { ShopsPageView } from "pages-sections/shops/page-view";
export const metadata = {
  title: "Shops - Alphabeta Store",
  description: "Alphabeta Store for the Libya market.",
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default async function Shops() {
  const {
    shops,
    meta
  } = await api.getShopList();
  if (!shops) return notFound();
  return <ShopsPageView shops={shops} lastIndex={meta.lastIndex} totalPages={meta.totalPages} firstIndex={meta.firstIndex} totalShops={meta.totalShops} />;
}
