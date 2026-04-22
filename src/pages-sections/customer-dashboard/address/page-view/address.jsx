"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

// CUSTOM COMPONENT
import Location from "icons/Location";
import Pagination from "../../pagination";
import AddressListItem from "../address-item";
import DashboardHeader from "../../dashboard-header";
import { fetchMyAddresses } from "utils/addresses";

// CUSTOM DATA MODEL


// =======================================================


// =======================================================

export function AddressPageView({
  initialPage = 1
}) {
  const [addresses, setAddresses] = useState([]);
  const [pageError, setPageError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadAddresses = async () => {
      setPageError("");

      try {
        const nextAddresses = await fetchMyAddresses();
        if (!cancelled) {
          setAddresses(nextAddresses);
        }
      } catch (error) {
        if (!cancelled) {
          setPageError(error instanceof Error ? error.message : "Failed to load addresses.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadAddresses();

    return () => {
      cancelled = true;
    };
  }, []);

  const pageSize = 5;
  const currentPage = Math.max(initialPage, 1);
  const totalPages = Math.max(1, Math.ceil(addresses.length / pageSize));
  const paginatedAddresses = useMemo(() => {
    const offset = (currentPage - 1) * pageSize;
    return addresses.slice(offset, offset + pageSize);
  }, [addresses, currentPage]);

  return <Fragment>
      <DashboardHeader Icon={Location} title="My Addresses" />

      <Stack direction={{
      sm: "row",
      xs: "column"
    }} justifyContent="flex-end" mb={3}>
        <Button component={Link} href="/address/new" variant="contained" color="primary">
          Add Address
        </Button>
      </Stack>

      {pageError ? <Alert severity="error" sx={{
      mb: 3
    }}>{pageError}</Alert> : null}

      {isLoading ? <Stack alignItems="center" justifyContent="center" py={6}>
          <CircularProgress color="info" />
        </Stack> : null}

      {!isLoading && !pageError && paginatedAddresses.length === 0 ? <Alert severity="info">No saved addresses yet.</Alert> : null}

      {!isLoading && !pageError ? paginatedAddresses.map(address => <AddressListItem key={address.id} address={address} onDeleted={deletedId => {
      setAddresses(current => current.filter(item => item.id !== deletedId));
    }} />) : null}

      <Pagination count={totalPages} />
    </Fragment>;
}