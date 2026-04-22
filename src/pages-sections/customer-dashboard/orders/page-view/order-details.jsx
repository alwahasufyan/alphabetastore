"use client";

import { Fragment, useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

// LOCAL CUSTOM COMPONENTS
import OrderSummery from "../order-summery";
import OrderProgress from "../order-progress";
import OrderedProducts from "../ordered-products";
import DashboardHeader from "../../dashboard-header";
import { fetchCustomerOrderById } from "utils/orders";
import OrderStatusHistoryCard from "components/orders/order-status-history-card";

export function OrderDetailsPageView({
  orderId
}) {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadOrder = async () => {
      setPageError("");

      try {
        const nextOrder = await fetchCustomerOrderById(orderId);
        if (!cancelled) {
          setOrder(nextOrder);
        }
      } catch (error) {
        if (!cancelled) {
          setPageError(error instanceof Error ? error.message : "Failed to load order details.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  return <Fragment>
      <DashboardHeader href="/orders" title="Order Details" />

      {pageError ? <Alert severity="error" sx={{
      mb: 3
    }}>{pageError}</Alert> : null}

      {isLoading ? <Stack alignItems="center" justifyContent="center" py={6}>
          <CircularProgress color="info" />
        </Stack> : null}

      {!isLoading && !pageError && order ? <>
          <OrderProgress status={order.rawStatus} statusLabel={order.statusLabel} />

          <OrderedProducts order={order} />

          <OrderStatusHistoryCard history={order.statusHistory} />

          <OrderSummery order={order} />
        </> : null}
    </Fragment>;
}