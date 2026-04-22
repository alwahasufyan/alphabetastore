import { PaymentsPageView } from "pages-sections/vendor-dashboard/payments/page-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Payments - Bazaar Next.js E-commerce Template",
  description: "Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store",
  authors: [{
    name: "UI-LIB",
    url: "https://ui-lib.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

export default function PaymentsPage() {
  return <PaymentsPageView />;
}