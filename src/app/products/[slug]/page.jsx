// PAGE VIEW COMPONENT
import { ProductDetailsPageView } from "pages-sections/product-details/page-view";

export async function generateMetadata({
  params
}) {
  const {
    slug
  } = await params;
  return {
    title: `${slug} - Bazaar Next.js E-commerce Template`,
    description: "Bazaar is a React Next.js E-commerce template.",
    authors: [{
      name: "UI-LIB",
      url: "https://ui-lib.com"
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