import Link from "next/link";

// MUI
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// GLOBAL CUSTOM HOOK
import useCart from "hooks/useCart";

// GLOBAL CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from "components/flex-box";

import { LIBYAN_CITIES } from "utils/libya";

// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";

export default function CheckoutForm() {
  const {
    state
  } = useCart();
  const getTotalPrice = () => state.cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  return <Card elevation={0} sx={{
    padding: 3,
    border: "1px solid",
    borderColor: "divider",
    backgroundColor: "grey.50"
  }}>
      <FlexBetween mb={2}>
        <Typography variant="body1" fontSize={16} fontWeight={600}>
          Total:
        </Typography>

        <Typography variant="body1" fontSize={18} fontWeight={600} lineHeight={1}>
          {currency(getTotalPrice())}
        </Typography>
      </FlexBetween>

      <Divider sx={{
      mb: 2
    }} />

      <FlexBox alignItems="center" columnGap={1} mb={2}>
        <Typography variant="body1" fontWeight={500}>
          Additional Comments
        </Typography>

        <Typography variant="body1" sx={{
        fontSize: 12,
        lineHeight: 1,
        padding: "2px 6px",
        borderRadius: "3px",
        bgcolor: "grey.200"
      }}>
          Note
        </Typography>
      </FlexBox>

      {/* COMMENTS TEXT FIELD */}
      <TextField variant="outlined" rows={3} fullWidth multiline />

      {/* APPLY VOUCHER TEXT FIELD */}
      <FlexBox alignItems="center" gap={1} my={2}>
        <TextField fullWidth size="small" label="Voucher" variant="outlined" placeholder="Voucher" />

        <Button variant="outlined" color="primary">
          Apply
        </Button>
      </FlexBox>

      <Divider sx={{
      mb: 2
    }} />

      <Typography variant="body1" fontWeight={500} sx={{
      mb: 2
    }}>
        Shipping Estimates
      </Typography>

      {/* COUNTRY TEXT FIELD */}
      <TextField fullWidth size="small" label="Country" value="Libya" variant="outlined" slotProps={{
      input: {
        readOnly: true
      }
    }} sx={{
      mb: 2
    }} />

      {/* STATE/CITY TEXT FIELD */}
      <TextField select fullWidth size="small" label="City" variant="outlined" defaultValue={LIBYAN_CITIES[0] || ""}>
        {LIBYAN_CITIES.map(city => <MenuItem value={city} key={city}>
            {city}
          </MenuItem>)}
      </TextField>

      <Button variant="outlined" color="primary" fullWidth sx={{
      my: 2
    }}>
        Calculate Shipping
      </Button>

      <Button fullWidth color="primary" href="/checkout" variant="contained" LinkComponent={Link}>
        Checkout Now
      </Button>
    </Card>;
}