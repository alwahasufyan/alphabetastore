import { PaymentMethodsPageView } from "pages-sections/customer-dashboard/payment-methods/page-view";
export const metadata = {
  title: "Payment Methods - Alphabeta Store",
  description: "Manage your preferred payment method.",
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "payment methods", "customer dashboard"]
};


// ==============================================================


// ==============================================================

export default async function PaymentMethods({
  searchParams
}) {
  await searchParams;
  return <PaymentMethodsPageView />;
}
