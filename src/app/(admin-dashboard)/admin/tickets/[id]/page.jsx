import TicketDetailsPageView from "pages-sections/vendor-dashboard/support-tickets/page-view/ticket-details";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params
}) {
  const {
    id
  } = await params;

  return {
    title: `Ticket ${id} - Bazaar Next.js E-commerce Template`,
    description: "Bazaar is a React Next.js E-commerce template.",
    authors: [{
      name: "UI-LIB",
      url: "https://ui-lib.com"
    }],
    keywords: ["e-commerce", "e-commerce template", "next.js", "react"]
  };
}

export default async function AdminTicketDetailsPage({
  params
}) {
  const {
    id
  } = await params;

  return <TicketDetailsPageView ticketId={id} />;
}