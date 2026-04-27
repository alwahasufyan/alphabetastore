import { EditCategoryPageView } from "pages-sections/vendor-dashboard/categories/page-view";
export const metadata = {
  title: "Edit Category - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default async function EditCategory({
  params
}) {
  const resolvedParams = await params;

  return <EditCategoryPageView slug={resolvedParams.slug} />;
}
