import { EditProductPageView } from "pages-sections/vendor-dashboard/products/page-view";
export const metadata = {
  title: "Product - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default async function ProductEdit({
  params
}) {
  const resolvedParams = await params;

  return <EditProductPageView slug={resolvedParams.slug} />;
}
