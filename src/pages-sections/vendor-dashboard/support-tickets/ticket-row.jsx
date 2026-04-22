import Link from "next/link";
import { format } from "date-fns/format";

// MUI ICON COMPONENTS
import Edit from "@mui/icons-material/Edit";
import Visibility from "@mui/icons-material/Visibility";
import Typography from "@mui/material/Typography";

// STYLED COMPONENTS
import { StatusWrapper, StyledTableRow, StyledTableCell, StyledIconButton } from "../styles";

// CUSTOM DATA MODEL


// ==============================================================


// ==============================================================

export default function TicketRow({
  ticket
}) {
  const {
    id,
    subject,
    customer,
    priorityLabel,
    statusLabel,
    createdAt,
    status
  } = ticket;
  return <StyledTableRow role="checkbox">
      <StyledTableCell align="left">
        <Typography fontWeight={600}>{subject}</Typography>
        <Typography variant="body2" color="text.secondary">{customer?.name || "Customer"}</Typography>
      </StyledTableCell>

      <StyledTableCell align="left">
        <StatusWrapper status={priorityLabel}>{priorityLabel}</StatusWrapper>
      </StyledTableCell>

      <StyledTableCell align="left">{createdAt ? format(new Date(createdAt), "MMM dd, yyyy") : ""}</StyledTableCell>
      <StyledTableCell align="left">
        <StatusWrapper status={statusLabel === "Open" ? "Pending" : statusLabel}>{statusLabel}</StatusWrapper>
      </StyledTableCell>

      <StyledTableCell align="center">
        <StyledIconButton LinkComponent={Link} href={`/admin/tickets/${id}`}>
          <Edit />
        </StyledIconButton>

        <StyledIconButton LinkComponent={Link} href={`/admin/tickets/${id}`}>
          <Visibility />
        </StyledIconButton>
      </StyledTableCell>
    </StyledTableRow>;
}