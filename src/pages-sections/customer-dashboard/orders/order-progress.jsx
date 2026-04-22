"use client";

import { Fragment } from "react";
import { format } from "date-fns/format";

// MUI
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import Done from "@mui/icons-material/Done";

// CUSTOM ICON COMPONENTS
import PackageBox from "icons/PackageBox";
import TruckFilled from "icons/TruckFilled";
import Delivery from "icons/Delivery";

// GLOBAL CUSTOM COMPONENTS
import { FlexBetween, FlexBox } from "components/flex-box";

// CUSTOM DATA MODEL


// STYLED COMPONENTS
const StyledFlexbox = styled(FlexBetween)(({
  theme
}) => ({
  flexWrap: "wrap",
  marginTop: "2rem",
  marginBottom: "2rem",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column"
  },
  "& .line": {
    height: 2,
    minWidth: 50,
    flex: "1 1 0",
    [theme.breakpoints.down("sm")]: {
      flex: "unset",
      height: 50,
      minWidth: 4
    }
  }
}));
const StyledAvatar = styled(Avatar)(({
  theme
}) => ({
  top: -5,
  right: -5,
  width: 20,
  height: 20,
  position: "absolute",
  color: theme.palette.primary.main,
  backgroundColor: theme.palette.primary.light,
  boxShadow: theme.shadows[1],
  "& svg": {
    fontSize: 16
  }
}));
const StyledStatusAvatar = styled(Avatar)(({
  theme
}) => ({
  width: 64,
  height: 64,
  transition: "all 0.3s ease",
  "&.completed": {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main
  },
  "&.pending": {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.grey[100]
  }
}));
const DeliveryDateBox = styled("div")(({
  theme
}) => ({
  textAlign: "center",
  padding: "0.5rem 1rem",
  transition: "all 0.3s ease",
  color: theme.palette.primary.main,
  borderRadius: Number(theme.shape.borderRadius) * 3,
  backgroundColor: theme.palette.primary.light
}));


// ==============================================================


// ==============================================================

const ORDER_STEPS = [{
  icon: PackageBox,
  label: "Pending",
  value: "PENDING"
}, {
  icon: TruckFilled,
  label: "Confirmed",
  value: "CONFIRMED"
}, {
  icon: Delivery,
  label: "Processing",
  value: "PROCESSING"
}, {
  icon: Done,
  label: "Delivered",
  value: "DELIVERED"
}];
export default function OrderProgress({
  status,
  statusLabel
}) {
  const statusIndex = ORDER_STEPS.findIndex(item => item.value === status);
  const isCancelled = status === "CANCELLED";

  return <Card elevation={0} sx={{
    mb: 4,
    p: "2rem 1.5rem",
    border: "1px solid",
    borderColor: isCancelled ? "error.light" : "grey.100"
  }}>
      {isCancelled ? <DeliveryDateBox style={{
      backgroundColor: "#fdecea",
      color: "#d32f2f"
    }}>
          Current Status <b>{statusLabel}</b>
        </DeliveryDateBox> : null}

      {!isCancelled ? <>
      <StyledFlexbox>
        {ORDER_STEPS.map((step, ind) => <Fragment key={step.value}>
            <Box position="relative">
              <StyledStatusAvatar alt={`shipping-step-${ind + 1}`} className={ind <= statusIndex ? "completed" : "pending"}>
                <step.icon color="inherit" fontSize="large" />
              </StyledStatusAvatar>

              {ind < statusIndex && <StyledAvatar alt="completed-step">
                  <Done color="inherit" />
                </StyledAvatar>}
            </Box>

            {ind < ORDER_STEPS.length - 1 && <Box className="line" bgcolor={ind < statusIndex ? "primary.main" : "grey.100"} />}
          </Fragment>)}
      </StyledFlexbox>

      <FlexBox justifyContent={{
      xs: "center",
      sm: "flex-end"
    }}>
        <DeliveryDateBox>
          Current Status <b>{statusLabel}</b>
        </DeliveryDateBox>
      </FlexBox>
      </> : null}
    </Card>;
}