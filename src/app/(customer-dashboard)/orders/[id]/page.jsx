import { OrderDetailsPageView } from "pages-sections/customer-dashboard/orders/page-view";
export const metadata = {
  title: "Order Details - Bazaar Next.js E-commerce Template",
  description: "Bazaar is a React Next.js E-commerce template.",
  authors: [{
    name: "UI-LIB",
    url: "https://ui-lib.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default async function OrderDetails({
  params
}) {
  const {
    id
  } = await params;
  return <OrderDetailsPageView orderId={id} />;
}