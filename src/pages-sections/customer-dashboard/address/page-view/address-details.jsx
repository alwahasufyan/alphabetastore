"use client";

import { Fragment, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

// CUSTOM COMPONENT
import AddressForm from "../address-form";
import DashboardHeader from "../../dashboard-header";
import { fetchMyAddressById } from "utils/addresses";

// CUSTOM DATA MODEL


// =============================================================


// =============================================================

export function AddressDetailsPageView({
  addressId
}) {
  const [address, setAddress] = useState(null);
  const [pageError, setPageError] = useState("");
  const [isLoading, setIsLoading] = useState(addressId !== "new");

  useEffect(() => {
    let cancelled = false;

    if (addressId === "new") {
      setAddress(null);
      setIsLoading(false);
      return () => {
        cancelled = true;
      };
    }

    const loadAddress = async () => {
      setPageError("");

      try {
        const nextAddress = await fetchMyAddressById(addressId);
        if (!cancelled) {
          setAddress(nextAddress);
        }
      } catch (error) {
        if (!cancelled) {
          setPageError(error instanceof Error ? error.message : "Failed to load address.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadAddress();

    return () => {
      cancelled = true;
    };
  }, [addressId]);

  return <Fragment>
      <DashboardHeader href="/address" title={addressId === "new" ? "Add Address" : "Edit Address"} />

      {pageError ? <Alert severity="error" sx={{
      mb: 3
    }}>{pageError}</Alert> : null}

      {isLoading ? <Stack alignItems="center" justifyContent="center" py={6}>
          <CircularProgress color="info" />
        </Stack> : null}

      {!isLoading && !pageError ? <Card sx={{
      padding: {
        xs: 3,
        sm: 4
      }
    }}>
        <AddressForm address={address} addressId={addressId} />
      </Card> : null}
    </Fragment>;
}