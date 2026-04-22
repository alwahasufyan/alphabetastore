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
    title: `Support Ticket ${slug} - Bazaar Next.js E-commerce Template`,
    description: "Bazaar is a React Next.js E-commerce template.",
    authors: [{
      name: "UI-LIB",
      url: "https://ui-lib.com"
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