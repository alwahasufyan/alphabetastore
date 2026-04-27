import { AddressPageView } from "pages-sections/customer-dashboard/address/page-view";
export const metadata = {
  title: "Address - Alphabeta Store",
  description: "Alphabeta Store for the Libya market.",
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};


// ==============================================================


// ==============================================================

export default async function Address({
  searchParams
}) {
  const resolvedSearchParams = await searchParams;
  return <AddressPageView initialPage={Number(resolvedSearchParams?.page || 1)} />;
}
