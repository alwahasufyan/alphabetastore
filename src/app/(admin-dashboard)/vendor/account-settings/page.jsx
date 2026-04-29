import { AccountSettingsPageView } from "pages-sections/vendor-dashboard/account-settings/page-view";
export const metadata = {
  title: "Account Settings - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};
export default function AccountSettings() {
  return <AccountSettingsPageView />;
}
