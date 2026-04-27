import { AdminServicesPageView } from "pages-sections/vendor-dashboard/services/page-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Services - Alphabeta Store",
  description: "Alphabeta Store for the Libya market."
};

export default function AdminServicesPage() {
  return <AdminServicesPageView />;
}

