import { AdminServicesPageView } from "pages-sections/vendor-dashboard/services/page-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Services - Bazaar Next.js E-commerce Template",
  description: "Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store"
};

export default function AdminServicesPage() {
  return <AdminServicesPageView />;
}
