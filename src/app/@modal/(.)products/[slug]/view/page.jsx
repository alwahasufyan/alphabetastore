import ProductQuickViewLoader from "./components/product-quick-view-loader";
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
export default async function QuickViewPage({
  params
}) {
  const {
    slug
  } = await params;
  return <ProductQuickViewLoader slug={slug} />;
}
