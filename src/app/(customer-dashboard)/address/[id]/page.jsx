import { AddressDetailsPageView } from "pages-sections/customer-dashboard/address/page-view";

export async function generateMetadata({
  params
}) {
  const {
    id
  } = await params;
  return {
    title: `${id === "new" ? "Add" : "Edit"} Address - Bazaar Next.js E-commerce Template`,
    description: "Bazaar is a React Next.js E-commerce template.",
    authors: [{
      name: "UI-LIB",
      url: "https://ui-lib.com"
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