import { EditBrandPageView } from "pages-sections/vendor-dashboard/brands/page-view";
export const metadata = {
  title: "Edit Brand - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default function BrandEdit() {
  return <EditBrandPageView />;
}
