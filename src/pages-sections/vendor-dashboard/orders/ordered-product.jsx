import Image from "next/image";

// MUI
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// GLOBAL CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from "components/flex-box";

// CUSTOM UTILS LIBRARY FUNCTION
import { currency } from "lib";

// CUSTOM DATA MODEL


// ==============================================================


// ==============================================================

export default function OrderedProduct({
  product
}) {
  const {
    product: productDetails,
    productName,
    unitPrice,
    quantity
  } = product || {};
  return <Box my={2} gap={2} display="grid" gridTemplateColumns={{
    md: "1fr 1fr",
    xs: "1fr"
  }}>
      <FlexBox flexShrink={0} gap={1.5} alignItems="center">
        <Avatar variant="rounded" sx={{
        height: 64,
        width: 64
      }}>
          <Image fill alt={productName} src={productDetails?.imageUrl} sizes="(64px, 64px)" />
        </Avatar>

        <div>
          <Typography variant="h6" sx={{
          mb: 1
        }}>
            {productName}
          </Typography>

          <FlexBox alignItems="center" gap={1}>
            <Typography variant="body1" sx={{
            color: "grey.600"
          }}>
              {currency(unitPrice)} x
            </Typography>

            <Box maxWidth={60}>
              <TextField value={quantity} type="number" fullWidth slotProps={{
              input: {
                readOnly: true
              }
            }} />
            </Box>
          </FlexBox>
        </div>
      </FlexBox>

      <FlexBetween flexShrink={0}>
        <Typography variant="body1" sx={{
        color: "grey.600"
      }}>
          Product slug: {productDetails?.slug || "N/A"}
        </Typography>
      </FlexBetween>
    </Box>;
}