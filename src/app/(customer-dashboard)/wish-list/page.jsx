import { WishListPageView } from "pages-sections/customer-dashboard/wish-list";
export const metadata = {
  title: "Wish List - Alphabeta Store",
  description: "Manage your Alphabeta wishlist.",
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "wishlist", "customer dashboard"]
};


// ==============================================================


// ==============================================================

export default async function WishList({
  searchParams
}) {
  const resolvedSearchParams = await searchParams;
  return <WishListPageView initialPage={Number(resolvedSearchParams?.page || 1)} />;
}
