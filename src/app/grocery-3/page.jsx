import GroceryThreePageView from "pages-sections/grocery-3/page-view";
export const metadata = {
  title: "Grocery 3 - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default async function GroceryThree() {
  return <GroceryThreePageView />;
}
