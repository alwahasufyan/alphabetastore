import FeatureUnavailablePage from "pages-sections/vendor-dashboard/feature-unavailable-page";
export const metadata = {
  title: "Sellers - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default async function Sellers() {
  return <FeatureUnavailablePage title="Sellers" description="إدارة البائعين لم تُربط بعد بواجهة خلفية حقيقية، لذلك تم تعطيل هذه الصفحة بدل عرض بيانات فارغة مضللة." />;
}
