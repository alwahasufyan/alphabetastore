"use client";

import dynamic from "next/dynamic";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@mui/material/styles";

// LOCAL CUSTOM COMPONENT
import Card2 from "./card-2";

// CHART OPTIONS
import * as options from "../chart-options";

// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
const ApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <Skeleton animation="wave" height={100} width={120} />
});


export default function Sales({
  totals,
  monthly
}) {
  const theme = useTheme();
  const monthlySales = Array.isArray(monthly) ? monthly.map(item => Number(item?.salesUsd || 0)) : [];
  const monthlyOrders = Array.isArray(monthly) ? monthly.map(item => Number(item?.orderCount || 0)) : [];

  const totalRevenue = Number(totals?.totalRevenueUsd || 0);
  const totalOrders = Number(totals?.totalOrders || 0);
  const totalProducts = Number(totals?.totalProducts || 0);
  const activeProducts = Number(totals?.activeProducts || 0);

  const productShare = totalProducts > 0 ? Math.round(activeProducts / totalProducts * 100) : 0;

  const weeklySeries = [{
    name: "Monthly Sales",
    data: monthlySales.length ? monthlySales : [0]
  }];

  const totalOrderSeries = [{
    name: "Monthly Orders",
    data: monthlyOrders.length ? monthlyOrders : [0]
  }];

  const hasChartData = monthlySales.some(value => value > 0) || monthlyOrders.some(value => value > 0) || totalRevenue > 0 || totalOrders > 0 || activeProducts > 0;

  if (!hasChartData) {
    return <Alert severity="info">
        No sales or order analytics available yet.
      </Alert>;
  }

  return <div>
      <Grid container spacing={3}>
        {/* WEEKLY SALE CHART */}
        <Grid size={{
        lg: 3,
        md: 6,
        xs: 12
      }}>
          <Card2 title="Revenue" percentage="0%" amount={currency(totalRevenue, 0)}>
            <ApexChart type="bar" width={150} height={130} series={weeklySeries} options={options.weeklyChartOptions(theme)} />
          </Card2>
        </Grid>

        {/* PRODUCT SHARE CHART */}
        <Grid size={{
        lg: 3,
        md: 6,
        xs: 12
      }}>
          <Card2 title="Product Share" percentage="0%" amount={`${productShare}%`}>
            <ApexChart width={140} height={200} series={[productShare]} type="radialBar" options={options.productShareChartOptions(theme)} />
          </Card2>
        </Grid>

        {/* TOTAL ORDERS CHART */}
        <Grid size={{
        lg: 3,
        md: 6,
        xs: 12
      }}>
          <Card2 title="Total Order" percentage="0%" amount={String(totalOrders)}>
            <ApexChart type="area" width={150} height={130} series={totalOrderSeries} options={options.totalOrderChartOptions(theme)} />
          </Card2>
        </Grid>

        {/* MARKET SHARE CHART */}
        <Grid size={{
        lg: 3,
        md: 6,
        xs: 12
      }}>
          <Card2 title="Active Products" percentage="0%" amount={String(activeProducts)}>
            <ApexChart height={300} width={140} type="radialBar" series={[productShare, 100 - productShare, 100]} options={options.marketShareChartOptions(theme)} />
          </Card2>
        </Grid>
      </Grid>
    </div>;
}