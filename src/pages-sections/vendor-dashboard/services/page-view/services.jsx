"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useMemo, useState } from "react";

import PageWrapper from "pages-sections/vendor-dashboard/page-wrapper";
import {
  createAdminService,
  deleteAdminService,
  fetchAdminServices,
  updateAdminService
} from "utils/services";

const initialFormState = {
  name: "",
  slug: "",
  description: "",
  basePrice: "",
  isActive: "true"
};

export function AdminServicesPageView() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formValues, setFormValues] = useState(initialFormState);

  const loadServices = useCallback(async () => {
    setErrorMessage("");

    try {
      const data = await fetchAdminServices();
      setServices(Array.isArray(data) ? data : []);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to load services.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const sortedServices = useMemo(() => [...services].sort((left, right) => {
    return left.name.localeCompare(right.name);
  }), [services]);

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

  const handleCreate = async event => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const createdService = await createAdminService({
        name: formValues.name,
        slug: formValues.slug || undefined,
        description: formValues.description,
        basePrice: formValues.basePrice ? Number(formValues.basePrice) : undefined,
        isActive: formValues.isActive === "true"
      });

      setServices(current => [createdService, ...current]);
      setFormValues(initialFormState);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to create service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async service => {
    setErrorMessage("");

    try {
      const updatedService = await updateAdminService(service.id, {
        isActive: !service.isActive
      });

      setServices(current => current.map(item => item.id === updatedService.id ? updatedService : item));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to update service status.");
    }
  };

  const handleDelete = async serviceId => {
    setErrorMessage("");

    try {
      await deleteAdminService(serviceId);
      setServices(current => current.filter(item => item.id !== serviceId));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Failed to delete service.");
    }
  };

  return <PageWrapper title="Services">
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
          Create service
        </Typography>

        <form onSubmit={handleCreate}>
          <Stack spacing={2}>
            <Grid container spacing={2}>
              <Grid size={{
              xs: 12,
              md: 6
            }}>
                <TextField name="name" label="Service Name" value={formValues.name} onChange={handleFieldChange} required fullWidth />
              </Grid>

              <Grid size={{
              xs: 12,
              md: 6
            }}>
                <TextField name="slug" label="Slug (optional)" value={formValues.slug} onChange={handleFieldChange} fullWidth />
              </Grid>
            </Grid>

            <TextField name="description" label="Description" value={formValues.description} onChange={handleFieldChange} required fullWidth multiline rows={3} />

            <Grid container spacing={2}>
              <Grid size={{
              xs: 12,
              md: 6
            }}>
                <TextField name="basePrice" label="Base Price (optional)" value={formValues.basePrice} onChange={handleFieldChange} type="number" fullWidth />
              </Grid>

              <Grid size={{
              xs: 12,
              md: 6
            }}>
                <TextField select name="isActive" label="Status" value={formValues.isActive} onChange={handleFieldChange} fullWidth>
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <Stack direction="row" justifyContent="flex-end">
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Service"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Card>

      <Card sx={{
      p: 3
    }}>
        <Typography variant="h5" sx={{
        mb: 2
      }}>
          Service List
        </Typography>

        {isLoading ? <Stack alignItems="center" py={6}>
            <CircularProgress color="info" />
          </Stack> : sortedServices.length ? <Stack spacing={2}>
            {sortedServices.map(service => <Card key={service.id} variant="outlined" sx={{
          p: 2
        }}>
                <Stack spacing={1}>
                  <Typography variant="subtitle1">{service.name}</Typography>
                  <Typography variant="body2" color="text.secondary">Status: {service.isActive ? "Active" : "Inactive"}</Typography>
                  {service.basePrice !== null ? <Typography variant="body2" color="text.secondary">Base Price: {service.basePrice}</Typography> : null}
                  <Typography variant="body2" color="text.secondary">{service.description}</Typography>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" variant="outlined" onClick={() => handleToggleStatus(service)}>
                      {service.isActive ? "Mark Inactive" : "Mark Active"}
                    </Button>

                    <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(service.id)}>
                      Delete
                    </Button>
                  </Stack>
                </Stack>
              </Card>)}
          </Stack> : <Typography color="text.secondary">No services found.</Typography>}
      </Card>
    </PageWrapper>;
}
