"use client";

import { Fragment, useEffect, useState } from "react";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

// CUSTOM COMPONENT
import CreditCard from "icons/CreditCard";
import DashboardHeader from "../../dashboard-header";
import { useAuth } from "contexts/AuthContext";
import { fetchMyProfile, PAYMENT_METHOD_OPTIONS, updateMyProfile } from "utils/users";


// ==============================================================


// ==============================================================

export function PaymentMethodsPageView() {
  const { setUser } = useAuth();
  const [preferredPaymentMethod, setPreferredPaymentMethod] = useState("COD");
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        setPageError("");
        const profile = await fetchMyProfile();

        if (!cancelled) {
          setPreferredPaymentMethod(profile.preferredPaymentMethod || "COD");
        }
      } catch (error) {
        if (!cancelled) {
          setPageError(error instanceof Error ? error.message : "Failed to load payment method.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setPageError("");
      setSuccessMessage("");

      const updatedProfile = await updateMyProfile({ preferredPaymentMethod });
      setUser(currentUser => currentUser ? {
        ...currentUser,
        ...updatedProfile
      } : updatedProfile);
      setSuccessMessage("Preferred payment method saved successfully.");
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Failed to save payment method.");
    } finally {
      setIsSaving(false);
    }
  };

  return <Fragment>
      <DashboardHeader Icon={CreditCard} title="Payment Methods" />

      {pageError ? <Alert severity="error" sx={{
      mb: 3
    }}>{pageError}</Alert> : null}

      {successMessage ? <Alert severity="success" sx={{
      mb: 3
    }}>{successMessage}</Alert> : null}

      {isLoading ? <Stack alignItems="center" justifyContent="center" py={6}>
          <CircularProgress color="info" />
        </Stack> : <Card sx={{
        padding: {
          xs: 3,
          sm: 4
        }
      }}>
          <Stack spacing={3} maxWidth={420}>
            <TextField select fullWidth label="Preferred Payment Method" value={preferredPaymentMethod} onChange={event => setPreferredPaymentMethod(event.target.value)}>
              {PAYMENT_METHOD_OPTIONS.map(option => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
            </TextField>

            <Button variant="contained" color="primary" onClick={handleSave} loading={isSaving} sx={{
            width: {
              sm: "fit-content",
              xs: "100%"
            }
          }}>
              Save Payment Method
            </Button>
          </Stack>
        </Card>}
    </Fragment>;
}