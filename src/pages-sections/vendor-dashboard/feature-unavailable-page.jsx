import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import PageWrapper from "./page-wrapper";

export default function FeatureUnavailablePage({
  title,
  description
}) {
  return <PageWrapper title={title}>
      <Card sx={{ p: 3 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          هذه الصفحة غير مفعلة حاليًا.
        </Alert>

        <Typography color="text.secondary">
          {description}
        </Typography>
      </Card>
    </PageWrapper>;
}