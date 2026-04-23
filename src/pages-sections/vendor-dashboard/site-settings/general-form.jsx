import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// MUI
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

import useSettings from "hooks/useSettings";
import { apiGet, apiPatch } from "utils/api";
import { FormProvider, TextField } from "components/form-hook";

const validationSchema = yup.object().shape({
  site_name: yup.string().required("site name is required"),
  theme: yup.string().required("theme is required"),
  primary_color: yup.string().matches(/^#[\dA-Fa-f]{6}$/, "Primary color must be a valid hex color"),
  enable_whatsapp: yup.string().oneOf(["true", "false"]).required("WhatsApp setting is required")
});

export default function GeneralForm() {
  const {
    refreshSettings,
    updateSettings
  } = useSettings();
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const initialValues = {
    site_name: "",
    theme: "default",
    primary_color: "#1976d2",
    enable_whatsapp: "true"
  };

  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });

  const {
    reset,
    handleSubmit,
    formState: {
      isSubmitting
    }
  } = methods;

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await apiGet("/settings");
        reset({
          site_name: String(response?.site_name || ""),
          theme: String(response?.theme || "default"),
          primary_color: String(response?.primary_color || "#1976d2"),
          enable_whatsapp: String(response?.enable_whatsapp ?? "true")
        });
      } catch {
        // Keep defaults when settings cannot be fetched.
      }
    };

    loadSettings();
  }, [reset]);

  const handleSubmitForm = handleSubmit(async values => {
    setSubmitError("");
    setSubmitSuccess("");

    const entries = [{
      key: "site_name",
      value: values.site_name
    }, {
      key: "theme",
      value: values.theme
    }, {
      key: "primary_color",
      value: values.primary_color
    }, {
      key: "enable_whatsapp",
      value: values.enable_whatsapp
    }];

    try {
      await Promise.all(entries.map(item => apiPatch("/admin/settings", item)));

      updateSettings({
        site_name: values.site_name,
        theme: values.theme,
        primary_color: values.primary_color,
        enable_whatsapp: values.enable_whatsapp
      });

      await refreshSettings();
      setSubmitSuccess("System settings updated successfully.");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to update settings.");
    }
  });

  return <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      <Grid container spacing={3}>
        {submitSuccess ? <Grid size={12}>
            <Alert severity="success">{submitSuccess}</Alert>
          </Grid> : null}

        {submitError ? <Grid size={12}>
            <Alert severity="error">{submitError}</Alert>
          </Grid> : null}

        <Grid size={{
        md: 6,
        xs: 12
      }}>
          <TextField fullWidth color="info" size="medium" name="site_name" label="Site Name" />
        </Grid>

        <Grid size={{
        md: 6,
        xs: 12
      }}>
          <TextField select fullWidth color="info" size="medium" name="enable_whatsapp" label="Enable WhatsApp">
            <MenuItem value="true">Enabled</MenuItem>
            <MenuItem value="false">Disabled</MenuItem>
          </TextField>
        </Grid>

        <Grid size={12}>
          <TextField fullWidth color="info" size="medium" name="theme" label="Theme" placeholder="default" />
        </Grid>

        <Grid size={12}>
          <TextField fullWidth color="info" size="medium" name="primary_color" label="Primary Color" placeholder="#1976d2" />
        </Grid>

        <Grid size={12}>
          <Button disabled={isSubmitting} type="submit" color="info" variant="contained">
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </Grid>
      </Grid>
    </FormProvider>;
}