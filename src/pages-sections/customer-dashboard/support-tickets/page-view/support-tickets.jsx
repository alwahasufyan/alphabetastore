"use client";

import { Fragment, useCallback, useEffect, useState } from "react";

// CUSTOM COMPONENTS
import Headset from "icons/Headset";
import TicketCard from "../ticket-card";
import DashboardHeader from "../../dashboard-header";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { TICKET_PRIORITY_OPTIONS, createTicket, fetchCustomerTickets } from "utils/tickets";

// CUSTOM DATA MODEL


// =============================================


// =============================================

export function TicketsPageView() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [formValues, setFormValues] = useState({
    subject: "",
    message: "",
    priority: "NORMAL"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTickets = useCallback(async () => {
    setPageError("");

    try {
      const data = await fetchCustomerTickets();
      setTickets(Array.isArray(data) ? data : []);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Failed to load tickets.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleFieldChange = event => {
    const {
      name,
      value
    } = event.target;

    setFormValues(current => ({
      ...current,
      [name]: value
    }));
  };

  const handleCreateTicket = async event => {
    event.preventDefault();
    setPageError("");
    setIsSubmitting(true);

    try {
      const createdTicket = await createTicket({
        subject: formValues.subject,
        message: formValues.message,
        priority: formValues.priority
      });

      setTickets(current => [createdTicket, ...current]);
      setFormValues({
        subject: "",
        message: "",
        priority: "NORMAL"
      });
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Failed to create the ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <Fragment>
      <DashboardHeader title="Support Ticket" Icon={Headset} />

      {pageError ? <Alert severity="error" sx={{
      mb: 3
    }}>{pageError}</Alert> : null}

      <Card sx={{
      p: 3,
      mb: 3
    }}>
        <Typography variant="h5" sx={{
        mb: 2
      }}>
          Open a new ticket
        </Typography>

        <form onSubmit={handleCreateTicket}>
          <Stack spacing={2}>
            <TextField name="subject" label="Subject" value={formValues.subject} onChange={handleFieldChange} required fullWidth />

            <TextField select name="priority" label="Priority" value={formValues.priority} onChange={handleFieldChange} fullWidth>
              {TICKET_PRIORITY_OPTIONS.map(option => <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>)}
            </TextField>

            <TextField name="message" label="Message" value={formValues.message} onChange={handleFieldChange} required fullWidth multiline rows={5} />

            <Stack direction="row" justifyContent="flex-end">
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Ticket"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>

      {isLoading ? <Stack alignItems="center" justifyContent="center" py={6}>
          <CircularProgress color="info" />
        </Stack> : tickets.length ? tickets.map(item => <TicketCard ticket={item} key={item.id} />) : <Card sx={{
      p: 4,
      textAlign: "center"
    }}>
          <Typography color="text.secondary">No support tickets yet.</Typography>
        </Card>}
    </Fragment>;
}