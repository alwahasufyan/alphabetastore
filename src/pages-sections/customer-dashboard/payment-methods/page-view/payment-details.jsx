import { Fragment } from "react";
import Card from "@mui/material/Card";

// LOCAL CUSTOM COMPONENT
import PaymentForm from "../payment-form";
import DashboardHeader from "../../dashboard-header";

// CUSTOM DATA MODEL


// ==============================================================


// ==============================================================

export function PaymentDetailsPageView({
  payment
}) {
  return <Fragment>
      <DashboardHeader title="Add New Payment" href="/payment-methods" />

      <Card sx={{
      padding: {
        xs: 3,
        sm: 4
      }
    }}>
        <PaymentForm payment={payment} />
      </Card>
    </Fragment>;
}