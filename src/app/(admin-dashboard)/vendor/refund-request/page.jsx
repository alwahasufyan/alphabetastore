import { RefundRequestPageView } from "pages-sections/vendor-dashboard/refund-request/page-view";
import { API_BASE_URL } from "utils/api";
export const metadata = {
  title: "Refund Request - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
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
