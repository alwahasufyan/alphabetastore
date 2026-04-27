import { notFound } from "next/navigation";
import GiftShopPageView from "pages-sections/gift-shop/page-view";

// API FUNCTIONS
import api from "utils/__api__/gift-shop";
export const metadata = {
  title: "Gift Shop - Alphabeta Store",
  description: "Alphabeta Store for the Libya market.",
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};


// ==============================================================


// ==============================================================

export default async function GiftShopWithCategory({
  params
}) {
  const {
    category: cat
  } = await params;
  const category = await api.getCategory(cat);
  if (!category) notFound();
  return <GiftShopPageView selected={category.title} />;
}
