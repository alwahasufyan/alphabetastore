
// PAGE VIEW COMPONENT
import { GadgetThreeCategoriesPageView } from "pages-sections/gadget-3/page-view";

// CUSTOM DATA MODEL

export const metadata = {
  title: "Gadget Products - Alphabeta Store",
  description: "Alphabeta Store for the Libya market.",
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default async function GadgetThreeCategories({
  params
}) {
  const {
    slug
  } = await params;
  return <GadgetThreeCategoriesPageView slug={slug} />;
}
