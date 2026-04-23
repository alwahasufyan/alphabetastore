import { OrderConfirmationPageView } from "pages-sections/order-confirmation";
export const metadata = {
  title: "Order Confirmation - Alphabeta",
  description: "Order confirmation and payment status for Alphabeta storefront",
  authors: [{
    name: "ALPHABETA"
  }],
  keywords: ["alphabeta", "order", "confirmation", "next.js"]
};
export default function OrderConfirmation() {
  return <OrderConfirmationPageView />;
}