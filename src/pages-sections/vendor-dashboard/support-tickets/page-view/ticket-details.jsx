"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Fragment, useCallback, useEffect, useState } from "react";

import ConversationCard from "pages-sections/customer-dashboard/support-tickets/conversation-card";
import MessageForm from "pages-sections/customer-dashboard/support-tickets/message-form";
import PageWrapper from "pages-sections/vendor-dashboard/page-wrapper";
import { TICKET_STATUS_OPTIONS, fetchTicketById, postTicketMessage, updateAdminTicketStatus } from "utils/tickets";

export default function TicketDetailsPageView({
  ticketId
}) {
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [statusAction, setStatusAction] = useState("");

  const loadTicket = useCallback(async () => {
    setPageError("");

    try {
      const data = await fetchTicketById(ticketId);
      setTicket(data);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Failed to load ticket.");
    } finally {
      setIsLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  const handleReply = async message => {
    setIsSending(true);
    setPageError("");

    try {
      const updatedTicket = await postTicketMessage(ticketId, {
        message
      });

      setTicket(updatedTicket);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Failed to post reply.");
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  const handleStatusChange = async status => {
    setStatusAction(status);
    setPageError("");

    try {
      const updatedTicket = await updateAdminTicketStatus(ticketId, {
        status
      });

      setTicket(updatedTicket);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Failed to update status.");
    } finally {
      setStatusAction("");
    }
  };

  return <PageWrapper title={ticket?.subject || "Support Ticket"}>
      {pageError ? <Alert severity="error" sx={{
      mb: 3
    }}>{pageError}</Alert> : null}

      {isLoading ? <Stack alignItems="center" justifyContent="center" py={6}>
          <CircularProgress color="info" />
        </Stack> : ticket ? <Fragment>
          <Card sx={{
        p: 3,
        mb: 3
      }}>
            <Stack spacing={2}>
              <Stack direction={{
            xs: "column",
            md: "row"
          }} justifyContent="space-between" spacing={2}>
                <div>
                  <Typography variant="h5">{ticket.ticketNumber}</Typography>
                  <Typography color="text.secondary">{ticket.customer?.name || "Customer"}</Typography>
                  <Typography color="text.secondary">{ticket.customer?.email || ""}</Typography>
                </div>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label={ticket.priorityLabel} color={ticket.priority === "URGENT" ? "error" : "info"} />
                  <Chip label={ticket.statusLabel} color={ticket.status === "CLOSED" ? "default" : ticket.status === "IN_PROGRESS" ? "warning" : "success"} />
                </Stack>
              </Stack>

              <Stack direction={{
            xs: "column",
            sm: "row"
          }} spacing={1}>
                {TICKET_STATUS_OPTIONS.map(option => <Button key={option.value} variant={ticket.status === option.value ? "contained" : "outlined"} disabled={statusAction === option.value || ticket.status === option.value} onClick={() => handleStatusChange(option.value)}>
                    {statusAction === option.value ? "Updating..." : option.label}
                  </Button>)}
              </Stack>
            </Stack>
          </Card>

          {ticket.conversation?.map(item => <ConversationCard message={item} key={item.id} />)}
          <MessageForm onSubmit={handleReply} isSubmitting={isSending} submitLabel="Send Reply" />
        </Fragment> : null}
    </PageWrapper>;
}