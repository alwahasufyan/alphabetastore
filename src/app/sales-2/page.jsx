import { SalesTwoPageView } from "pages-sections/sales/page-view";

// SALES API FUNCTIONS
import api from "utils/__api__/sales";
export const metadata = {
  title: "Sales 2 - Alphabeta Store",
  description: "Alphabeta Store for the Libya market.",
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};


// ==============================================================


// ==============================================================

export default async function SalesTwo({
  searchParams
}) {
  const {
    page
  } = await searchParams;
  const currentPage = +page || 1;
  const data = await api.getProducts(currentPage);
  if (!data) {
    return <div>Failed to load</div>;
  }
  if (!data.products) {
    return <div>No products found</div>;
  }
  return <SalesTwoPageView page={currentPage} products={data.products} pageSize={data.pageSize} totalProducts={data.totalProducts} />;
}
