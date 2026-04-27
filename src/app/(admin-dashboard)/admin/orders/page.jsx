import { OrdersPageView } from "pages-sections/vendor-dashboard/orders/page-view";
export const metadata = {
  title: "Orders - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default function Orders() {
  return <OrdersPageView />;
}
