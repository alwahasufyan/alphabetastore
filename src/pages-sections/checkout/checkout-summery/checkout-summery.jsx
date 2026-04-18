"use client";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

// LOCAL CUSTOM COMPONENT
import ListItem from "./list-item";

// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";

// GLOBAL CUSTOM HOOK
import useCart from "hooks/useCart";
export default function CheckoutSummary() {
  const {
    state
  } = useCart();

  const total = state.cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return <Card elevation={0} sx={theme => ({
    p: 3,
    backgroundColor: theme.palette.grey[50],
    border: `1px solid ${theme.palette.divider}`
  })}>
      <Typography variant="h5" sx={{
      mb: 2
    }}>
        Order Summary
      </Typography>

      <ListItem title="Subtotal" value={total} />
      <ListItem title="Delivery" value={0} />

      <Divider sx={{
      my: 2
    }} />

      <Typography variant="h2">{currency(total)}</Typography>

      <Stack spacing={1} mt={3}>
        <Typography variant="body2" color="text.secondary">
          Payment method: Cash on delivery.
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Your cart will be converted into an order immediately after submission.
        </Typography>
      </Stack>
    </Card>;
}