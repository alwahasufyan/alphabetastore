import FeatureUnavailablePage from "pages-sections/vendor-dashboard/feature-unavailable-page";
export const metadata = {
  title: "Reviews - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default async function Reviews() {
  return <FeatureUnavailablePage title="Reviews" description="مراجعات المنتجات الإدارية غير مفعلة لأن المنصة لا توفر API فعليًا لقراءة أو إدارة المراجعات بعد." />;
}
