import { RefundSettingPageView } from "pages-sections/vendor-dashboard/refund-setting/page-view";
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
  return <RefundSettingPageView />;
}
