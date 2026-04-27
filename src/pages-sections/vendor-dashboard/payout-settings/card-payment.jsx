import { Fragment } from "react";

// MUI
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

export default function CardPayment() {
  return <Fragment>
      <Typography variant="h6" sx={{
      mb: 4
    }}>
        Card Payment
      </Typography>

      <Alert severity="info">
        إعدادات دفع البطاقة غير متاحة حاليًا لأن الواجهة الخلفية لا توفر نقطة حفظ أو معالجة لهذا النموذج.
      </Alert>
    </Fragment>;
}