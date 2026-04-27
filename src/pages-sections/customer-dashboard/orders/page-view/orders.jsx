"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import { useSearchParams } from "next/navigation";

// CUSTOM COMPONENTS
import Packages from "icons/Packages";
import OrderRow from "../order-row";
import Pagination from "../../pagination";
import DashboardHeader from "../../dashboard-header";
import { fetchCustomerOrders } from "utils/orders";

export function OrdersPageView({
  initialPage = 1
}) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") || initialPage || 1);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      setPageError("");

      try {
        const nextOrders = await fetchCustomerOrders();
        if (!cancelled) {
          setOrders(nextOrders);
        }
      } catch (error) {
        if (!cancelled) {
          setPageError(error instanceof Error ? error.message : "Failed to load orders.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, []);

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(orders.length / pageSize));
  const paginatedOrders = useMemo(() => {
    const offset = (Math.max(currentPage, 1) - 1) * pageSize;
    return orders.slice(offset, offset + pageSize);
  }, [currentPage, orders]);

  return <Fragment>
      <DashboardHeader Icon={Packages} title="طلباتي" />

      {pageError ? <Alert severity="error" sx={{
      mb: 3
    }}>{pageError}</Alert> : null}

      {isLoading ? <Stack alignItems="center" justifyContent="center" py={6}>
          <CircularProgress color="info" />
        </Stack> : null}

      {!isLoading && !pageError && paginatedOrders.length === 0 ? <Alert severity="info">لا توجد طلبات حتى الآن.</Alert> : null}

      {!isLoading && !pageError ? paginatedOrders.map(order => <OrderRow order={order} key={order.id} />) : null}

      <Pagination count={totalPages} />
    </Fragment>;
}