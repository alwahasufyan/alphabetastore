import { notFound } from "next/navigation";
import HealthBeautyPageView from "pages-sections/health-beauty/page-view";

// API FUNCTIONS
import api from "utils/__api__/healthbeauty-shop";
export const metadata = {
  title: "Health & Beauty - Bazaar Next.js E-commerce Template",
  description: "Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store",
  authors: [{
    name: "UI-LIB",
    url: "https://ui-lib.com"
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