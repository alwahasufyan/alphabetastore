import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { format } from "date-fns/format";

// GLOBAL CUSTOM COMPONENTS
import FlexBox from "components/flex-box/flex-box";

// CUSTOM DATA MODEL


// ==============================================================


// ==============================================================

export default function ConversationCard({
  message
}) {
  const {
    sender,
    date,
    text
  } = message;
  const senderName = sender?.name || "User";
  const senderRole = sender?.role || "CUSTOMER";

  return <FlexBox gap={2} mb={4}>
      <Avatar variant="rounded">
        {senderName.slice(0, 1).toUpperCase()}
      </Avatar>

      <div>
        <FlexBox alignItems="center" gap={1} flexWrap="wrap">
          <Typography variant="h5">{senderName}</Typography>
          <Chip size="small" label={senderRole === "ADMIN" ? "Admin" : "Customer"} color={senderRole === "ADMIN" ? "warning" : "default"} />
        </FlexBox>

        <Typography variant="body1" lineHeight={2} color="text.secondary">
          {date ? format(new Date(date), "hh:mm:a | dd MMM yyyy") : ""}
        </Typography>

        <Box borderRadius={2} sx={{
        lineHeight: 1.7,
        marginTop: "1rem",
        padding: "1rem 1.5rem",
        backgroundColor: senderRole === "ADMIN" ? "warning.50" : "grey.100"
      }}>
          <Typography variant="body1">{text}</Typography>
        </Box>
      </div>
    </FlexBox>;
}