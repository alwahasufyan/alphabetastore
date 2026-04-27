import { SellerPackagePageView } from "pages-sections/vendor-dashboard/seller-package/page-view";
export const metadata = {
  title: "Seller Package - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default async function SellerPackage() {
  return <SellerPackagePageView />;
}
