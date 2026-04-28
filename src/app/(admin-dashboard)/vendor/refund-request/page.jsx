import FeatureUnavailablePage from "pages-sections/vendor-dashboard/feature-unavailable-page";
export const metadata = {
  title: "Refund Request - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

export default async function RefundRequest() {
  return <FeatureUnavailablePage title="Refund Request" description="طلبات الاسترجاع الخاصة بالبائع غير مفعلة حاليًا لأن المنصة لا توفر عقدًا خلفيًا مكتملًا لهذه الميزة." />;
}
