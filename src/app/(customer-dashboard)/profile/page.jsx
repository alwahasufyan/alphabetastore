import { ProfilePageView } from "pages-sections/customer-dashboard/profile/page-view";

export const metadata = {
  title: "My Profile - Alphabeta Store",
  description: "Manage your Alphabeta customer profile.",
  authors: [{
    name: "UI-LIB",
    url: "https://ui-lib.com"
  }],
  keywords: ["e-commerce", "profile", "customer dashboard"]
};

export default async function Profile() {
  return <ProfilePageView />;
}