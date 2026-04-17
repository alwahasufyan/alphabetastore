import MobileCategoriesPageView from "./page-view";
import navbarNavigation from "data/navbarNavigation";
import { mobileNavigation } from "data/layout-data";
export default async function MobileCategories() {
  const data = {
    header: {
      navigation: navbarNavigation
    },
    mobileNavigation: {
      version1: mobileNavigation,
      logo: "/assets/images/bazaar-black-sm.svg"
    }
  };

  return <MobileCategoriesPageView data={data} />;
}