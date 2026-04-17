import { ProductsPageView } from "pages-sections/vendor-dashboard/products/page-view";
export const metadata = {
  title: "Products - Bazaar Next.js E-commerce Template",
  description: `Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store`,
  authors: [{
    name: "UI-LIB",
    url: "https://ui-lib.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default function Products() {
  return <ProductsPageView />;
}