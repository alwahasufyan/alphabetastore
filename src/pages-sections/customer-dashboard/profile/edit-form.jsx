"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// MUI
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";

// GLOBAL CUSTOM COMPONENTS
import { FormProvider, TextField } from "components/form-hook";
import { useAuth } from "contexts/AuthContext";
import { PAYMENT_METHOD_OPTIONS, updateMyProfile } from "utils/users";

const validationSchema = yup.object().shape({
  name: yup.string().trim().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().trim().required("Phone is required"),
  preferredPaymentMethod: yup.string().required("Preferred payment method is required")
});


// ==============================================================


// ==============================================================

export default function ProfileEditForm({
  user,
  onSaved
}) {
  const { setUser } = useAuth();
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const initialValues = {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    preferredPaymentMethod: user?.preferredPaymentMethod || "COD"
  };
  const methods = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(validationSchema)
  });

  const {
    handleSubmit,
    reset,
    formState: {
      isSubmitting
    }
  } = methods;

  useEffect(() => {
    reset(initialValues);
  }, [reset, user]);

  const handleSubmitForm = handleSubmit(async values => {
    try {
      setSubmitError("");
      setSuccessMessage("");

      const updatedProfile = await updateMyProfile({
        name: values.name.trim(),
        phone: values.phone.trim(),
        preferredPaymentMethod: values.preferredPaymentMethod
      });

      setUser(currentUser => currentUser ? {
        ...currentUser,
        ...updatedProfile
      } : updatedProfile);
      onSaved?.(updatedProfile);
      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to update profile.");
    }
  });

  return <FormProvider methods={methods} onSubmit={handleSubmitForm}>
      {submitError ? <Alert severity="error" sx={{
      mb: 3
    }}>{submitError}</Alert> : null}

      {successMessage ? <Alert severity="success" sx={{
      mb: 3
    }}>{successMessage}</Alert> : null}

      <Grid container spacing={3}>
        <Grid size={{
        md: 6,
        xs: 12
      }}>
          <TextField size="medium" fullWidth name="name" label="Full Name" />
        </Grid>

        <Grid size={{
        md: 6,
        xs: 12
      }}>
          <TextField size="medium" fullWidth name="email" type="email" label="Email" disabled />
        </Grid>

        <Grid size={{
        md: 6,
        xs: 12
      }}>
          <TextField size="medium" fullWidth label="Phone" name="phone" />
        </Grid>

        <Grid size={{
        md: 6,
        xs: 12
      }}>
          <TextField select size="medium" fullWidth name="preferredPaymentMethod" label="Preferred Payment Method">
            {PAYMENT_METHOD_OPTIONS.map(option => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
          </TextField>
        </Grid>

        <Grid size={12}>
          <Button disableElevation size="large" type="submit" color="primary" variant="contained" loading={isSubmitting}>
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </FormProvider>;
}