import { RefundRequestPageView } from "pages-sections/vendor-dashboard/refund-request/page-view";
import { API_BASE_URL } from "utils/api";
export const metadata = {
  title: "Refund Request - Bazaar Next.js E-commerce Template",
  description: `Bazaar is a React Next.js E-commerce template. Build SEO friendly Online store, delivery app and Multi vendor store`,
  authors: [{
    name: "UI-LIB",
    url: "https://ui-lib.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};

async function getRefundRequests() {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/refund-requests`, {
      cache: "no-store"
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (data?.success === true) {
      return Array.isArray(data.data) ? data.data : [];
    }

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function RefundRequest() {
  const requests = await getRefundRequests();
  return <RefundRequestPageView requests={requests} />;
}