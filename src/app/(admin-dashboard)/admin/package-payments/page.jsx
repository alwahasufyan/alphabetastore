import FeatureUnavailablePage from "pages-sections/vendor-dashboard/feature-unavailable-page";
export const metadata = {
  title: "Package Payments - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default async function PackagePayments() {
  return <FeatureUnavailablePage title="Package Payments" description="مدفوعات الباقات غير متاحة حاليًا لأن هذه الميزة ما زالت بقايا من القالب ولا تملك API حقيقي في المنصة." />;
}
