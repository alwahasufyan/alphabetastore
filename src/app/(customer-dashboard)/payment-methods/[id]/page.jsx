import { redirect } from "next/navigation";

// TYPES

export const metadata = {
  title: "Payment Methods - Alphabeta Store",
  description: "Manage your preferred payment method.",
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "payment methods", "customer dashboard"]
};
export default async function PaymentMethodDetails({
  params
}) {
  await params;
  redirect("/payment-methods");
}
