import { TicketsPageView } from "pages-sections/customer-dashboard/support-tickets/page-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Support Tickets - Alphabeta Store",
  description: `Alphabeta Store for the Libya market.`,
  authors: [{
    name: "Alphabeta Store",
    url: "https://alphabeta.com"
  }],
  keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
};


export default function SupportTickets() {
  return <TicketsPageView />;
}
