"use client";

import { Fragment, useEffect, useState } from "react";

import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

// CUSTOM COMPONENTS
import User3 from "icons/User3";
import UserInfo from "../user-info";
import UserAnalytics from "../user-analytics";
import DashboardHeader from "../../dashboard-header";
import { fetchMyAddresses } from "utils/addresses";
import { fetchCustomerOrders } from "utils/orders";
import { fetchMyProfile } from "utils/users";
import { fetchWishlistItems } from "utils/wishlist";


// ============================================================


// ============================================================

const EMPTY_STATS = {
  orderCount: 0,
  addressCount: 0,
  wishlistCount: 0
};

export function ProfilePageView() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [pageError, setPageError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        setPageError("");

        const [profile, addresses, orders, wishlistItems] = await Promise.all([fetchMyProfile(), fetchMyAddresses(), fetchCustomerOrders(), fetchWishlistItems()]);

        if (cancelled) {
          return;
        }

        setUser(profile);
        setStats({
          orderCount: orders.length,
          addressCount: addresses.length,
          wishlistCount: wishlistItems.length
        });
      } catch (error) {
        if (!cancelled) {
          setPageError(error instanceof Error ? error.message : "Failed to load profile.");
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

  return <Fragment>
      <DashboardHeader title="My Profile" Icon={User3} />

      {pageError ? <Alert severity="error" sx={{
      mb: 3
    }}>{pageError}</Alert> : null}

      {isLoading ? <Stack alignItems="center" justifyContent="center" py={6}>
          <CircularProgress color="info" />
        </Stack> : null}

      {!isLoading && !pageError && user ? <>
          <UserAnalytics user={user} stats={stats} />
          <UserInfo user={user} />
        </> : null}
    </Fragment>;
}