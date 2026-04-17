import { CategoriesPageView } from "pages-sections/vendor-dashboard/categories/page-view";
import { fetchCategories } from "utils/catalog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Categories - Bazaar Next.js E-commerce Template",
  description: `Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store`,
  authors: [{
    name: "UI-LIB",
    url: "https://ui-lib.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default async function Categories() {
  const categories = await fetchCategories();
  return <CategoriesPageView initialCategories={categories} />;
}