import { PaymentMethodsPageView } from "pages-sections/customer-dashboard/payment-methods/page-view";
export const metadata = {
  title: "Payment Methods - Alphabeta Store",
  description: "Manage your preferred payment method.",
  authors: [{
    name: "UI-LIB",
    url: "https://ui-lib.com"
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