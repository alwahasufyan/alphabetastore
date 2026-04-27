import FeatureUnavailablePage from "pages-sections/vendor-dashboard/feature-unavailable-page";
export const metadata = {
  title: "Earning History - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default async function EarningHistory() {
  return <FeatureUnavailablePage title="Earning History" description="سجل الأرباح غير متاح لأن الـ backend الحالي لا يوفر endpoint فعليًا لهذه البيانات." />;
}
