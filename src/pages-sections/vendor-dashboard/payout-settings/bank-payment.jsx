import { Fragment } from "react";

// MUI
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

export default function BankPayment() {
  return <Fragment>
      <Typography variant="h6" sx={{
      mb: 4
    }}>
        Bank Payment
      </Typography>

      <Alert severity="info">
        إعدادات التحويل البنكي غير متاحة حاليًا لأن الواجهة الخلفية لا توفر نقطة حفظ أو معالجة لهذا النموذج.
      </Alert>
    </Fragment>;
}