import { notFound } from "next/navigation";

// PAGE VIEW COMPONENT
import { ShopDetailsPageView } from "pages-sections/shops/page-view";

// API FUNCTIONS
import api from "utils/__api__/shop";
import { getFilters } from "utils/__api__/product-search";

// CUSTOM DATA MODEL

export const metadata = {
  title: "Shop Details - Alphabeta Store",
  description: "Alphabeta Store for the Libya market.",
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default async function ShopDetails({
  params
}) {
  const {
    slug
  } = await params;
  const shop = await api.getProductsBySlug(slug);
  const filters = await getFilters();
  if (!shop) notFound();
  return <ShopDetailsPageView shop={shop} filters={filters} />;
}
