import { TicketDetailsPageView } from "pages-sections/customer-dashboard/support-tickets/page-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params
}) {
  const {
    slug
  } = await params;
  return {
    title: `Support Ticket ${slug} - Alphabeta Store`,
    description: "Alphabeta Store for the Libya market.",
    authors: [{
      name: "Alphabeta Store",
      url: "https://alphabeta.com"
    }],
    keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
  };
}
export default async function SupportTicketDetails({
  params
}) {
  const {
    slug
  } = await params;
  return <TicketDetailsPageView ticketId={slug} />;
}
