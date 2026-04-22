import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

// GLOBAL CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from "components/flex-box";

// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";


// ==============================================================


// ==============================================================

export default function TotalSummery({
  order
}) {
  return <Card sx={{
    px: 3,
    py: 4
  }}>
      <Typography variant="h5" sx={{
      mb: 2
    }}>
        Total Summary
      </Typography>

      <FlexBetween mb={1.5}>
        <Typography variant="body1" sx={{
        color: "grey.600"
      }}>
          Subtotal:
        </Typography>
        <Typography variant="h6">{currency(order.totalAmount)}</Typography>
      </FlexBetween>

      <FlexBetween mb={1.5}>
        <Typography variant="body1" sx={{
        color: "grey.600"
      }}>
          Shipping fee:
        </Typography>

        <Typography variant="h6">{currency(0)}</Typography>
      </FlexBetween>

      <FlexBetween mb={1.5}>
        <Typography variant="body1" sx={{
        color: "grey.600"
      }}>
          Discount(%):
        </Typography>

        <Typography variant="h6">{currency(0)}</Typography>
      </FlexBetween>

      <Divider sx={{
      my: 2
    }} />

      <FlexBetween mb={2}>
        <Typography variant="h6">Total</Typography>
        <Typography variant="h6">{currency(order.totalAmount)}</Typography>
      </FlexBetween>

      <Typography variant="body2" color="text.secondary">
        Payment method: {order.paymentMethod}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{
        mt: 1
      }}>
        Payment status: {order.paymentStatusLabel}
      </Typography>
    </Card>;
}