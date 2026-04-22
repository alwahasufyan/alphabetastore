import { redirect } from "next/navigation";

// TYPES

export const metadata = {
  title: "Payment Methods - Alphabeta Store",
  description: "Manage your preferred payment method.",
  authors: [{
    name: "UI-LIB",
    url: "https://ui-lib.com"
  }],
  keywords: ["e-commerce", "payment methods", "customer dashboard"]
};
export default async function PaymentMethodDetails({
  params
}) {
  await params;
  redirect("/payment-methods");
}