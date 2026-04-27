"use client";

// MUI
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

export default function BrandForm(props) {
  return <Card className="p-3">
      <Typography variant="h5" sx={{ mb: 2 }}>
        إدارة العلامات التجارية
      </Typography>

      <Alert severity="info">
        إنشاء وتعديل العلامات التجارية غير متاح حاليًا لأن الواجهة الخلفية لا توفر API خاصًا بالعلامات التجارية بعد.
      </Alert>
    </Card>;
}