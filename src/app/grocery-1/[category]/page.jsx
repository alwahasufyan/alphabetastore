import { notFound } from "next/navigation";
import GroceryOnePageView from "pages-sections/grocery-1/page-view";

// API FUNCTIONS
import api from "utils/__api__/grocery-1";
export const metadata = {
  title: "Grocery 1 - Alphabeta Store",
  description: "Alphabeta Store for the Libya market.",
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};


// ==============================================================


// ==============================================================

export default async function GroceryOneWithCategory({
  params
}) {
  const {
    category: cat
  } = await params;
  const category = await api.getCategory(cat);
  if (!category) notFound();
  return <GroceryOnePageView selected={category.title} />;
}
