"use client";

import { Fragment, useCallback, useEffect, useState } from "react";

// LOCAL CUSTOM COMPONENTS
import MessageForm from "../message-form";
import ConversationCard from "../conversation-card";
import DashboardHeader from "../../dashboard-header";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { fetchTicketById, postTicketMessage } from "utils/tickets";

// CUSTOM DATA MODEL


// ==========================================================


// ==========================================================

export function TicketDetailsPageView({
  ticketId
}) {
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [isSending, setIsSending] = useState(false);

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

  const handlePostMessage = async message => {
    setIsSending(true);
    setPageError("");

    try {
      const updatedTicket = await postTicketMessage(ticketId, {
        message
      });

      setTicket(updatedTicket);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Failed to post message.");
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  return <Fragment>
      <DashboardHeader title={ticket?.subject || "Support Ticket"} href="/support-tickets" />

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
            <Stack direction={{
          xs: "column",
          sm: "row"
        }} spacing={2} justifyContent="space-between">
              <div>
                <Typography variant="h6">{ticket.ticketNumber}</Typography>
                <Typography color="text.secondary">{ticket.customer?.name || "-"}</Typography>
              </div>

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={ticket.priorityLabel} color={ticket.priority === "URGENT" ? "error" : "info"} />
                <Chip label={ticket.statusLabel} color={ticket.status === "CLOSED" ? "default" : ticket.status === "IN_PROGRESS" ? "warning" : "success"} />
              </Stack>
            </Stack>
          </Card>

          {ticket.conversation?.map(item => <ConversationCard message={item} key={item.id} />)}
          <MessageForm onSubmit={handlePostMessage} isSubmitting={isSending} />
        </Fragment> : null}
    </Fragment>;
}