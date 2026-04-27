import { CreateCategoryPageView } from "pages-sections/vendor-dashboard/categories/page-view";
export const metadata = {
  title: "Create Category - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default function CreateCategory() {
  return <CreateCategoryPageView />;
}
