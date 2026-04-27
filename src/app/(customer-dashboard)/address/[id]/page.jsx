import { AddressDetailsPageView } from "pages-sections/customer-dashboard/address/page-view";

export async function generateMetadata({
  params
}) {
  const {
    id
  } = await params;
  return {
    title: `${id === "new" ? "Add" : "Edit"} Address - Alphabeta Store`,
    description: "Alphabeta Store for the Libya market.",
    authors: [{
      name: "Alphabeta Store",
      url: "https://alphabeta.com"
    }],
    keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
  };
}
export default async function Address({
  params
}) {
  const {
    id
  } = await params;
  return <AddressDetailsPageView addressId={id} />;
}
