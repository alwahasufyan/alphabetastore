import { PaymentsPageView } from "pages-sections/vendor-dashboard/payments/page-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Payments - Alphabeta Store",
  description: "Alphabeta Store for the Libya market.",
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

export default function PaymentsPage() {
  return <PaymentsPageView />;
}
