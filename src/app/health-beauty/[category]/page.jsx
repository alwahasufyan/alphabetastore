import { notFound } from "next/navigation";
import HealthBeautyPageView from "pages-sections/health-beauty/page-view";

// API FUNCTIONS
import api from "utils/__api__/healthbeauty-shop";
export const metadata = {
  title: "Health & Beauty - Alphabeta Store",
  description: "Alphabeta Store for the Libya market.",
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};


// ==============================================================


// ==============================================================

export default async function HealthBeautyWithCategory({
  params
}) {
  const {
    category: cat
  } = await params;
  const category = await api.getCategory(cat);
  if (!category) notFound();
  return <HealthBeautyPageView selected={category.title} />;
}
