"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import BuildCircle from "@mui/icons-material/BuildCircle";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import DashboardHeader from "pages-sections/customer-dashboard/dashboard-header";
import {
  SERVICE_REQUEST_STATUS_OPTIONS,
  createServiceRequest,
  fetchMyServiceRequests,
  fetchPublicServices
} from "utils/services";
import { formatLibyaPhone, isValidLibyaPhone } from "utils/libya";

const initialFormState = {
  serviceId: "",
  customerName: "",
  customerPhone: "",
  preferredDate: "",
  addressText: "",
  notes: ""
};

export function ServiceRequestsPageView() {
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formValues, setFormValues] = useState(initialFormState);

  const validateForm = values => {
    const errors = {};

    if (!values.serviceId) {
      errors.serviceId = "Please select a service.";
    }

    const customerName = values.customerName.trim();
    if (customerName.length < 2) {
      errors.customerName = "Customer name must be at least 2 characters.";
    }

    if (!isValidLibyaPhone(values.customerPhone)) {
      errors.customerPhone = "Phone must be in +218XXXXXXXXX format.";
    }

    const addressText = values.addressText.trim();
    if (addressText.length < 5) {
      errors.addressText = "Address must be at least 5 characters.";
    }

    if (values.preferredDate) {
      const preferredDate = new Date(values.preferredDate);
      if (Number.isNaN(preferredDate.getTime())) {
        errors.preferredDate = "Preferred date is invalid.";
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (preferredDate < today) {
          errors.preferredDate = "Preferred date cannot be in the past.";
        }
      }
    }

    return errors;
  };

  const loadData = useCallback(async () => {
    setErrorMessage("");

    try {
      const [servicesData, requestsData] = await Promise.all([
        fetchPublicServices(),
        fetchMyServiceRequests()
      ]);

      setServices(Array.isArray(servicesData) ? servicesData : []);
      setRequests(Array.isArray(requestsData) ? requestsData : []);
      setFormValues(current => ({
        ...current,
        serviceId: current.serviceId || servicesData[0]?.id || ""
      }));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load service requests.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFieldChange = event => {
    const {
      name,
      value
    } = event.target;

    setFormValues(current => ({
      ...current,
      [name]: value
    }));

    setFieldErrors(current => ({
      ...current,
      [name]: ""
    }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setErrorMessage("");

    const errors = validateForm(formValues);

    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      setErrorMessage(Object.values(errors)[0]);
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});

    try {
      const createdRequest = await createServiceRequest({
        serviceId: formValues.serviceId,
        customerName: formValues.customerName.trim(),
        customerPhone: formatLibyaPhone(formValues.customerPhone),
        preferredDate: formValues.preferredDate || undefined,
        addressText: formValues.addressText.trim(),
        notes: formValues.notes.trim() || undefined
      });

      setRequests(current => [createdRequest, ...current]);
      setFormValues(current => ({
        ...initialFormState,
        serviceId: current.serviceId
      }));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create service request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <Fragment>
      <DashboardHeader title="Service Requests" Icon={BuildCircle} />

      {errorMessage ? <Alert severity="error" sx={{
      mb: 3
    }}>{errorMessage}</Alert> : null}

      <Card sx={{
      p: 3,
      mb: 3
    }}>
        <Typography variant="h5" sx={{
        mb: 2
      }}>
          Submit a service request
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField select name="serviceId" label="Service" value={formValues.serviceId} onChange={handleFieldChange} required fullWidth error={Boolean(fieldErrors.serviceId)} helperText={fieldErrors.serviceId || ""}>
              {services.map(service => <MenuItem key={service.id} value={service.id}>{service.name}</MenuItem>)}
            </TextField>

            <Grid container spacing={2}>
              <Grid size={{
              xs: 12,
              md: 6
            }}>
                  <TextField name="customerName" label="Customer Name" value={formValues.customerName} onChange={handleFieldChange} required fullWidth error={Boolean(fieldErrors.customerName)} helperText={fieldErrors.customerName || ""} />
              </Grid>

              <Grid size={{
              xs: 12,
              md: 6
            }}>
                  <TextField name="customerPhone" label="Customer Phone" value={formValues.customerPhone} onChange={handleFieldChange} onBlur={() => {
                  setFormValues(current => ({
                    ...current,
                    customerPhone: formatLibyaPhone(current.customerPhone)
                  }));
                }} required fullWidth error={Boolean(fieldErrors.customerPhone)} helperText={fieldErrors.customerPhone || "Use +218XXXXXXXXX"} />
              </Grid>
            </Grid>

              <TextField name="preferredDate" label="Preferred Date" type="date" value={formValues.preferredDate} onChange={handleFieldChange} slotProps={{
            inputLabel: {
              shrink: true
            }
            }} fullWidth error={Boolean(fieldErrors.preferredDate)} helperText={fieldErrors.preferredDate || ""} />

              <TextField name="addressText" label="Address" value={formValues.addressText} onChange={handleFieldChange} required fullWidth error={Boolean(fieldErrors.addressText)} helperText={fieldErrors.addressText || ""} />

            <TextField name="notes" label="Notes (optional)" value={formValues.notes} onChange={handleFieldChange} multiline rows={4} fullWidth />

            <Stack direction="row" justifyContent="flex-end">
              <Button type="submit" variant="contained" disabled={isSubmitting || !services.length}>
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>

      {isLoading ? <Stack alignItems="center" py={6}>
          <CircularProgress color="info" />
        </Stack> : <Card sx={{
      p: 3
    }}>
          <Typography variant="h6" sx={{
        mb: 2
      }}>
            My Service Requests
          </Typography>

          {requests.length ? <Stack spacing={2}>
              {requests.map(item => <Card key={item.id} variant="outlined" sx={{
            p: 2
          }}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle1">{item.service?.name || "Service"}</Typography>
                    <Typography variant="body2" color="text.secondary">Status: {SERVICE_REQUEST_STATUS_OPTIONS.find(option => option.value === item.status)?.label || item.status}</Typography>
                    <Typography variant="body2" color="text.secondary">Phone: {item.customerPhone}</Typography>
                    <Typography variant="body2" color="text.secondary">Address: {item.addressText}</Typography>
                    {item.notes ? <Typography variant="body2" color="text.secondary">Notes: {item.notes}</Typography> : null}
                  </Stack>
                </Card>)}
            </Stack> : <Typography color="text.secondary">No service requests yet.</Typography>}
        </Card>}
    </Fragment>;
}
