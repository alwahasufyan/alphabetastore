import { AccountSettingsPageView } from "pages-sections/vendor-dashboard/account-settings/page-view";
export const metadata = {
  title: "Account Settings - Next.js E-commerce Template",
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
