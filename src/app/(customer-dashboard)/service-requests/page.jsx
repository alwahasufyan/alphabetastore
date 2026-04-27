import { ServiceRequestsPageView } from "pages-sections/customer-dashboard/service-requests/page-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Service Requests - Alphabeta Store",
  description: "Alphabeta Store for the Libya market."
};

export default function ServiceRequestsPage() {
  return <ServiceRequestsPageView />;
}

