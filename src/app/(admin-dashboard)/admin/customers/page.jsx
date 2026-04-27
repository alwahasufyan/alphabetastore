import FeatureUnavailablePage from "pages-sections/vendor-dashboard/feature-unavailable-page";
export const metadata = {
  title: "Customers - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default async function Customers() {
  return <FeatureUnavailablePage title="Customers" description="قائمة العملاء الإدارية غير مدعومة بعد في الواجهة الخلفية الحالية. لا يوجد endpoint إداري يعيد جميع العملاء بشكل موثوق." />;
}
