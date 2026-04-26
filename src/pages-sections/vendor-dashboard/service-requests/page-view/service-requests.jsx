"use client";

import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useState } from "react";

import PageWrapper from "pages-sections/vendor-dashboard/page-wrapper";
import {
  SERVICE_REQUEST_STATUS_OPTIONS,
  fetchAdminServiceRequests,
  updateAdminServiceRequestStatus
} from "utils/services";

export function AdminServiceRequestsPageView() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadRequests = useCallback(async () => {
    setErrorMessage("");

    try {
      const data = await fetchAdminServiceRequests();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load service requests.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleStatusChange = async (requestId, status) => {
    setErrorMessage("");

    try {
      const updatedRequest = await updateAdminServiceRequestStatus(requestId, {
        status
      });

      setRequests(current => current.map(item => item.id === updatedRequest.id ? updatedRequest : item));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update service request status.");
    }
  };

  return <PageWrapper title="Service Requests">
      {errorMessage ? <Alert severity="error" sx={{
      mb: 3
    }}>{errorMessage}</Alert> : null}

      <Card sx={{
      p: 3
    }}>
        {isLoading ? <Stack alignItems="center" py={6}>
            <CircularProgress color="info" />
          </Stack> : requests.length ? <Stack spacing={2}>
            {requests.map(item => <Card key={item.id} variant="outlined" sx={{
          p: 2
        }}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1">{item.service?.name || "Service"}</Typography>
                  <Typography variant="body2" color="text.secondary">Customer: {item.customerName}</Typography>
                  <Typography variant="body2" color="text.secondary">Phone: {item.customerPhone}</Typography>
                  <Typography variant="body2" color="text.secondary">Address: {item.addressText}</Typography>
                  {item.preferredDate ? <Typography variant="body2" color="text.secondary">Preferred Date: {String(item.preferredDate).slice(0, 10)}</Typography> : null}
                  {item.notes ? <Typography variant="body2" color="text.secondary">Notes: {item.notes}</Typography> : null}

                  <TextField select size="small" label="Status" value={item.status} onChange={event => handleStatusChange(item.id, event.target.value)} sx={{
                maxWidth: 220,
                mt: 1
              }}>
                    {SERVICE_REQUEST_STATUS_OPTIONS.map(option => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
                  </TextField>
                </Stack>
              </Card>)}
          </Stack> : <Typography color="text.secondary">No service requests found.</Typography>}
      </Card>
    </PageWrapper>;
}
