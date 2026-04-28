import FeatureUnavailablePage from "pages-sections/vendor-dashboard/feature-unavailable-page";
export const metadata = {
  title: "Refund Setting - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default async function RefundSetting() {
  return <FeatureUnavailablePage title="Refund Setting" description="إعدادات الاسترجاع الحالية مجرد واجهة قالب غير مربوطة بإعدادات فعلية في الواجهة الخلفية، لذلك تم إخفاؤها من التنقل وتعطيلها كميزة غير مكتملة." />;
}
