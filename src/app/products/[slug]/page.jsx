// PAGE VIEW COMPONENT
import { ProductDetailsPageView } from "pages-sections/product-details/page-view";

export async function generateMetadata({
  params
}) {
  const {
    slug
  } = await params;
  return {
    title: `${slug} - Alphabeta Store`,
    description: "Alphabeta Store for the Libya market.",
    authors: [{
      name: "Alphabeta Store",
      url: "https://alphabeta.com"
    }],
    keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
  };
}
export default async function ProductDetails({
  params
}) {
  const {
    slug
  } = await params;
  return <ProductDetailsPageView slug={slug} />;
}
