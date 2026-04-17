
// PAGE VIEW COMPONENT
import { GroceryFourCategoriesPageView } from "pages-sections/grocery-4/page-view";

// CUSTOM DATA MODEL

export const metadata = {
  title: "Grocery 4 - Bazaar Next.js E-commerce Template",
  description: `Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store`,
  authors: [{
    name: "UI-LIB",
    url: "https://ui-lib.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default async function GroceryCategories({
  params
}) {
  const {
    slug
  } = await params;
  return <GroceryFourCategoriesPageView slug={slug} />;
}