import FeatureUnavailablePage from "pages-sections/vendor-dashboard/feature-unavailable-page";
export const metadata = {
  title: "Vendor Payouts - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default async function VendorPayouts() {
  return <FeatureUnavailablePage title="Payouts" description="سجل السحوبات الخاص بالبائع غير متاح حاليًا لعدم وجود endpoint حقيقي يغذّي هذه الصفحة." />;
}
