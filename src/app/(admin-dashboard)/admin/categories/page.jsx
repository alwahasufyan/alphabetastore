import { CategoriesPageView } from "pages-sections/vendor-dashboard/categories/page-view";
import { fetchCategories } from "utils/catalog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Categories - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default async function Categories() {
  const categories = await fetchCategories();
  return <CategoriesPageView initialCategories={categories} />;
}
