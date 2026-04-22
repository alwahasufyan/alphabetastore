// MUI
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

// GLOBAL CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from "components/flex-box";
import { formatPreferredPaymentMethod } from "utils/users";


// ==============================================================


// ==============================================================

export default function UserAnalytics({
  user,
  stats
}) {
  const cards = [{
    title: stats.orderCount,
    subtitle: "Orders"
  }, {
    title: stats.addressCount,
    subtitle: "Saved Addresses"
  }, {
    title: stats.wishlistCount,
    subtitle: "Wishlist Items"
  }];

  return <Grid container spacing={3}>
      <Grid size={{
      md: 6,
      xs: 12
    }}>
        <Card elevation={0} sx={{
        gap: 2,
        height: "100%",
        display: "flex",
        border: "1px solid",
        alignItems: "center",
        padding: "1rem 1.5rem",
        borderColor: "grey.100"
      }}>
          <Avatar variant="rounded" sx={{
          height: 65,
          width: 65
        }}>{user.name.slice(0, 1).toUpperCase()}</Avatar>

          <FlexBetween flexWrap="wrap" flex={1}>
            <div>
              <Typography variant="h5">{user.name}</Typography>

              <FlexBox alignItems="center" gap={1}>
                <Typography variant="body1" color="text.secondary">
                  Preferred payment:
                </Typography>

                <Typography fontWeight={500} lineHeight={2} variant="body1" color="primary.main">
                  {formatPreferredPaymentMethod(user.preferredPaymentMethod)}
                </Typography>
              </FlexBox>
            </div>

            <Typography variant="body1" letterSpacing={3} color="text.secondary" textTransform="uppercase">
              {user.role}
            </Typography>
          </FlexBetween>
        </Card>
      </Grid>

      <Grid container spacing={3} size={{
      md: 6,
      xs: 12
    }}>
        {cards.map(item => <Grid size={{
        lg: 3,
        xs: 4
      }} key={item.subtitle}>
            <Card elevation={0} sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          padding: "1rem 1.25rem",
          borderColor: "grey.100",
          borderStyle: "solid",
          borderWidth: 1
        }}>
              <Typography variant="h3" color="primary">
                {item.title}
              </Typography>

              <Typography fontSize={13} variant="body1" color="text.secondary" sx={{
            textAlign: "center"
          }}>
                {item.subtitle}
              </Typography>
            </Card>
          </Grid>)}
      </Grid>
    </Grid>;
}