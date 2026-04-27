
// PAGE VIEW COMPONENT
import { GroceryFourCategoriesPageView } from "pages-sections/grocery-4/page-view";

// CUSTOM DATA MODEL

export const metadata = {
  title: "Grocery 4 - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
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
