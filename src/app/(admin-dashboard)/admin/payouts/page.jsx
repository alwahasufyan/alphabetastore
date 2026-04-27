import FeatureUnavailablePage from "pages-sections/vendor-dashboard/feature-unavailable-page";
export const metadata = {
  title: "Payouts - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default async function Payouts() {
  return <FeatureUnavailablePage title="Payouts" description="سجل السحوبات غير متاح لأن المنصة الحالية لا تملك مصدر بيانات حقيقي لهذه الشاشة." />;
}
