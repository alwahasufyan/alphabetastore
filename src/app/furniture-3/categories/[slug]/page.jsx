
// PAGE VIEW COMPONENT
import { FurnitureThreeCategoriesPageView } from "pages-sections/furniture-3/page-view";

// CUSTOM DATA MODEL

export const metadata = {
  title: "Furniture Products - Alphabeta Store",
  description: "Alphabeta Store for the Libya market.",
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default async function FurnitureThreeCategories({
  params
}) {
  const {
    slug
  } = await params;
  return <FurnitureThreeCategoriesPageView slug={slug} />;
}
