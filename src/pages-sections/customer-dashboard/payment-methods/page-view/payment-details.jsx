import { Fragment } from "react";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";

import DashboardHeader from "../../dashboard-header";

// CUSTOM DATA MODEL


// ==============================================================


// ==============================================================

export function PaymentDetailsPageView({
  payment
}) {
  return <Fragment>
      <DashboardHeader title="طرق الدفع" href="/payment-methods" />

      <Card sx={{
      padding: {
        xs: 3,
        sm: 4
      }
    }}>
        <Alert severity="info">
          تحرير بطاقات الدفع غير متاح حاليًا لأن الواجهة الخلفية لا تدعم بطاقات محفوظة بعد.
        </Alert>
      </Card>
    </Fragment>;
}