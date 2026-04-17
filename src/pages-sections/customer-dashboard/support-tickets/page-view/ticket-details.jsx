import { Fragment } from "react";

// LOCAL CUSTOM COMPONENTS
import MessageForm from "../message-form";
import ConversationCard from "../conversation-card";
import DashboardHeader from "../../dashboard-header";

// CUSTOM DATA MODEL


// ==========================================================


// ==========================================================

export function TicketDetailsPageView({
  ticket
}) {
  return <Fragment>
      <DashboardHeader title="Support Ticket" href="/support-tickets" />
      {ticket.conversation?.map((item, ind) => <ConversationCard message={item} key={ind} />)}
      <MessageForm />
    </Fragment>;
}