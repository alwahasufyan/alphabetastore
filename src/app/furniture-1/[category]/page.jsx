import { notFound } from "next/navigation";
import FurnitureOnePageView from "pages-sections/furniture-1/page-view";

// API FUNCTIONS
import api from "utils/__api__/furniture-1";
export const metadata = {
  title: "Furniture Shop - Alphabeta Store",
  description: "Alphabeta Store for the Libya market.",
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};


// ==============================================================


// ==============================================================

export default async function FurnitureShopWithCategory({
  params
}) {
  const {
    category: cat
  } = await params;
  const category = await api.getCategory(cat);
  if (!category) notFound();
  return <FurnitureOnePageView selected={category.title} />;
}
