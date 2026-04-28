"use client";

import { useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

// LOCAL CUSTOM COMPONENTS
import Sales from "../sales";
import Card1 from "../card-1";
import Analytics from "../analytics";
import WelcomeCard from "../welcome-card";
import RecentPurchase from "../recent-purchase";
import StockOutProducts from "../stock-out-products";

import { fetchAdminDashboardSummary, EMPTY_SUMMARY } from "utils/dashboard";

export default function DashboardPageView() {
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [pageError, setPageError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadSummary = async () => {
      setPageError("");

      try {
        const nextSummary = await fetchAdminDashboardSummary();

        if (!cancelled) {
          setSummary(nextSummary);
        }
      } catch (error) {
        if (!cancelled) {
          setPageError(error instanceof Error ? error.message : "Failed to load dashboard summary.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadSummary();

    return () => {
      cancelled = true;
    };
  }, []);

  const hasActivity = useMemo(() => {
    const totals = summary.totals || {};
    const totalSignals = [
      totals.totalProducts,
      totals.totalCategories,
      totals.totalOrders,
      totals.outOfStockProducts,
      totals.totalRevenueUsd,
      totals.totalTickets,
      totals.openTickets,
      totals.inProgressTickets
    ].some(value => Number(value || 0) > 0);

    return totalSignals || summary.recentOrders.length > 0 || summary.monthly.some(item => Number(item?.salesUsd || 0) > 0 || Number(item?.orderCount || 0) > 0);
  }, [summary]);

  const cardList = useMemo(() => [{
    id: 1,
    title: "Products",
    amount1: String(summary.totals.totalProducts),
    amount2: summary.totals.totalProducts,
    color: "info.main",
    percentage: "0%"
  }, {
    id: 2,
    title: "Categories",
    amount1: String(summary.totals.totalCategories),
    amount2: summary.totals.totalCategories,
    color: "error.main",
    percentage: "0%"
  }, {
    id: 3,
    title: "Orders",
    amount1: String(summary.totals.totalOrders),
    amount2: summary.totals.totalOrders,
    color: "success.main",
    percentage: "0%"
  }, {
    id: 4,
    title: "Out of Stock",
    amount1: String(summary.totals.outOfStockProducts),
    amount2: summary.totals.outOfStockProducts,
    color: "error.main",
    percentage: "0%",
    status: "down"
  }], [summary]);

  if (isLoading) {
    return <Stack alignItems="center" justifyContent="center" py={8}>
        <CircularProgress color="info" />
      </Stack>;
  }

  if (pageError) {
    return <Card sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{pageError}</Alert>
        <Typography color="text.secondary">
          لا يمكن عرض إحصاءات لوحة التحكم حاليًا لأن تحميل البيانات الفعلية فشل.
        </Typography>
      </Card>;
  }

  if (!hasActivity) {
    return <Card sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          لا توجد بيانات تشغيلية بعد
        </Typography>
        <Typography color="text.secondary">
          ستظهر إحصاءات لوحة التحكم هنا بمجرد إضافة منتجات أو استقبال طلبات أو تسجيل نشاط فعلي في النظام.
        </Typography>
      </Card>;
  }

  return <div className="pt-2 pb-2">
      <Grid container spacing={3}>
        {/* WELCOME CARD SECTION */}
        <Grid size={{
        md: 6,
        xs: 12
      }}>
          <WelcomeCard totals={summary.totals} />
        </Grid>

        {/* ALL TRACKING CARDS */}
        <Grid container spacing={3} size={{
        md: 6,
        xs: 12
      }}>
          {cardList.map(item => <Grid size={{
          sm: 6,
          xs: 12
        }} key={item.id}>
              <Card1 title={item.title} color={item.color} amount1={item.amount1} amount2={item.amount2} percentage={item.percentage} status={item.status === "down" ? "down" : "up"} />
            </Grid>)}
        </Grid>

        {/* SALES AREA */}
        <Grid size={12}>
          <Sales totals={summary.totals} monthly={summary.monthly} />
        </Grid>

        {/* ANALYTICS AREA */}
        <Grid size={12}>
          <Analytics monthly={summary.monthly} />
        </Grid>

        {/* RECENT PURCHASE AREA */}
        <Grid size={{
        md: 7,
        xs: 12
      }}>
          <RecentPurchase recentOrders={summary.recentOrders} />
        </Grid>

        {/* STOCK OUT PRODUCTS */}
        <Grid size={{
        md: 5,
        xs: 12
      }}>
          <StockOutProducts outOfStockCount={summary.totals.outOfStockProducts} recentOrders={summary.recentOrders} />
        </Grid>
      </Grid>
    </div>;
}