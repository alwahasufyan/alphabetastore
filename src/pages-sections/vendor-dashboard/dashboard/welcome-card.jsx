import Image from "next/image";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";

// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";
export default function WelcomeCard({
  totals
}) {
  const totalRevenue = Number(totals?.totalRevenueUsd || 0);
  const totalOrders = Number(totals?.totalOrders || 0);
  const totalProducts = Number(totals?.totalProducts || 0);

  return <Card sx={{
    p: 3,
    height: "100%",
    display: "flex",
    position: "relative",
    flexDirection: "column",
    justifyContent: "center",
    "& p": {
      color: "text.secondary"
    }
  }}>
      <Typography variant="h5" color="info" sx={{
      mb: 0.5
    }}>
        Alphabeta Store Overview
      </Typography>

      <p>Real-time metrics from your production database.</p>

      <Typography variant="h3" sx={{
      mt: 3
    }}>
        {totalOrders}
      </Typography>
      <p>Total Orders</p>

      <Typography variant="h3" sx={{
      mt: 1.5
    }}>
        {currency(totalRevenue, 0)}
      </Typography>
      <p>Total Revenue</p>

      <Typography variant="body1" sx={{ mt: 1.5 }}>
        Products: {totalProducts}
      </Typography>

      <Box sx={{
      right: 24,
      bottom: 0,
      position: "absolute",
      display: {
        xs: "none",
        sm: "block"
      }
    }}>
        <Image width={195} height={171} alt="Welcome" src="/assets/images/illustrations/dashboard/welcome.svg" />
      </Box>
    </Card>;
}