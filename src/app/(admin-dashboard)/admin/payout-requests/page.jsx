import FeatureUnavailablePage from "pages-sections/vendor-dashboard/feature-unavailable-page";
export const metadata = {
  title: "Payout Requests - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default async function PayoutRequests() {
  return <FeatureUnavailablePage title="Payout Requests" description="طلبات السحب غير متاحة لأن الواجهة الخلفية لا توفر endpoint لهذه البيانات حتى الآن." />;
}
