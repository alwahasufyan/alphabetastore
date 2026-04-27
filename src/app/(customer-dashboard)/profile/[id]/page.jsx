import { ProfileEditPageView } from "pages-sections/customer-dashboard/profile/page-view";

export const metadata = {
  title: "Edit Profile - Alphabeta Store",
  description: "Update your Alphabeta customer profile.",
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "profile", "customer dashboard"]
};

export default async function ProfileEdit({
  params
}) {
  const {
    id
  } = await params;
  return <ProfileEditPageView profileId={id} />;
}
