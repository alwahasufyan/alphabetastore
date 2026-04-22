import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { format } from "date-fns/format";

export default function OrderStatusHistoryCard({
  history = []
}) {
  return <Card sx={{
    p: 3
  }}>
      <Typography variant="h6" sx={{
        mb: 2
      }}>
        Status History
      </Typography>

      {!history.length ? <Typography color="text.secondary">No status history available.</Typography> : <Stack divider={<Divider flexItem />} spacing={2}>
          {history.map(entry => <Stack key={entry.id} spacing={0.5}>
              <Typography variant="subtitle2">{entry.statusLabel}</Typography>
              <Typography variant="body2" color="text.secondary">
                {entry.createdAt ? format(new Date(entry.createdAt), "dd MMM yyyy, hh:mm a") : "Unknown date"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {entry.changedByUser?.name ? `Updated by ${entry.changedByUser.name}` : "Updated automatically"}
              </Typography>
              {entry.note ? <Typography variant="body2">{entry.note}</Typography> : null}
            </Stack>)}
        </Stack>}
    </Card>;
}