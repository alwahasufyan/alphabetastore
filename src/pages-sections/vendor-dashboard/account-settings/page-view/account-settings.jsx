"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// MUI
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

// GLOBAL CUSTOM COMPONENTS
import { FormProvider, TextField } from "components/form-hook";

// LOCAL CUSTOM COMPONENT
import PageWrapper from "../../page-wrapper";
import CoverPicSection from "../cover-pic-section";
import { apiGet, apiPatch } from "utils/api";
import { useAuth } from "contexts/AuthContext";
import { useTranslation } from "react-i18next";
const validationSchema = yup.object().shape({
  contact: yup.string().required("Phone is required"),
  last_name: yup.string().required("Last name is required"),
  first_name: yup.string().required("First name is required"),
  email: yup.string().email("Invalid Email").required("Email is required")
});
export default function AccountSettingsPageView() {
  const {
    setUser
  } = useAuth();
  const {
    t
  } = useTranslation();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const initialValues = {
    email: "",
    contact: "",
    last_name: "",
    first_name: ""
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
    let mounted = true;

    const loadProfile = async () => {
      try {
        const profile = await apiGet("/users/me");
        const nameParts = String(profile?.name || "").trim().split(/\s+/).filter(Boolean);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ");

        if (!mounted) return;

        reset({
          first_name: firstName,
          last_name: lastName,
          email: String(profile?.email || ""),
          contact: String(profile?.phone || "")
        });
      } catch (error) {
        if (mounted) {
          setSubmitError(error instanceof Error ? error.message : t("failedToLoadData"));
        }
      } finally {
        if (mounted) {
          setLoadingProfile(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [reset, t]);

  const handleSubmitForm = handleSubmit(async values => {
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const updatedProfile = await apiPatch("/users/me", {
        name: `${values.first_name} ${values.last_name}`.trim(),
        phone: values.contact.trim()
      });

      setUser(updatedProfile);
      setSubmitSuccess(t("profileUpdated"));
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : t("failedToLoadData"));
    }
  });

  if (loadingProfile) {
    return <PageWrapper title={t("accountSettingsTitle")}>
        <Stack alignItems="center" justifyContent="center" py={6}>
          <CircularProgress color="info" />
        </Stack>
      </PageWrapper>;
  }

  return <PageWrapper title={t("accountSettingsTitle")}>
      <Card className="p-2">
        {/* COVER SECTION */}
        <CoverPicSection />

        {/* FORM SECTION */}
        <FormProvider methods={methods} onSubmit={handleSubmitForm}>
          {submitSuccess ? <Alert severity="success" sx={{ mb: 3 }}>{submitSuccess}</Alert> : null}
          {submitError ? <Alert severity="error" sx={{ mb: 3 }}>{submitError}</Alert> : null}

          <Grid container spacing={3}>
            <Grid size={{
            md: 6,
            xs: 12
          }}>
              <TextField fullWidth size="medium" name="first_name" label={t("firstName")} />
            </Grid>

            <Grid size={{
            md: 6,
            xs: 12
          }}>
              <TextField fullWidth size="medium" name="last_name" label={t("lastName")} />
            </Grid>

            <Grid size={{
            md: 6,
            xs: 12
          }}>
              <TextField fullWidth name="email" type="email" label={t("Email")} size="medium" disabled />
            </Grid>

            <Grid size={{
            md: 6,
            xs: 12
          }}>
              <TextField fullWidth type="tel" size="medium" label={t("Phone")} name="contact" />
            </Grid>

            <Grid size={12}>
              <Button type="submit" variant="contained" color="info" loading={isSubmitting}>
                {t("Save Changes")}
              </Button>
            </Grid>
          </Grid>
        </FormProvider>
      </Card>
    </PageWrapper>;
}