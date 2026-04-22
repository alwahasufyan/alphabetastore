"use client";

import { useEffect, useState } from "react";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { format } from "date-fns/format";

// GLOBAL CUSTOM COMPONENTS
import FlexBox from "components/flex-box/flex-box";
import { ORDER_STATUS_OPTIONS, formatOrderStatus, updateAdminOrderStatus } from "utils/orders";


// ==============================================================


// ==============================================================

export default function OrderActions({
  id,
  createdAt,
  status,
  statusLabel,
  onUpdated
}) {
  const [nextStatus, setNextStatus] = useState(status);
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    setNextStatus(status);
  }, [status]);

  const handleSave = async () => {
    setActionError("");
    setIsSaving(true);

    try {
      const updatedOrder = await updateAdminOrderStatus(id, {
        status: nextStatus,
        ...(note.trim() ? {
          note: note.trim()
        } : {})
      });

      setNote("");
      onUpdated?.(updatedOrder);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Failed to update order status.");
    } finally {
      setIsSaving(false);
    }
  };

  return <div>
      <FlexBox flexWrap="wrap" alignItems="center" columnGap={4} rowGap={1}>
        <Typography variant="body1" sx={{
        span: {
          color: "grey.600"
        }
      }}>
          <span>Order ID:</span> {id}
        </Typography>

        <Typography variant="body1" sx={{
        span: {
          color: "grey.600"
        }
      }}>
          <span>Placed on:</span> {format(new Date(createdAt), "dd MMM, yyyy")}
        </Typography>
      </FlexBox>

      {actionError ? <Alert severity="error" sx={{
      my: 3
    }}>{actionError}</Alert> : null}

      <FlexBox gap={3} my={3} flexDirection={{
      sm: "row",
      xs: "column"
    }}>
        <TextField fullWidth color="info" size="medium" variant="outlined" label="Customer Order Status" value={statusLabel || formatOrderStatus(status)} slotProps={{
        input: {
          readOnly: true
        }
      }} />

        <TextField select fullWidth color="info" size="medium" value={nextStatus} label="Next Status" onChange={event => setNextStatus(event.target.value)} slotProps={{
        select: {
          IconComponent: () => <KeyboardArrowDown sx={{
            color: "grey.600",
            mr: 1
          }} />
        }
      }}>
          {ORDER_STATUS_OPTIONS.map(option => <MenuItem value={option.value} key={option.value}>
              {option.label}
            </MenuItem>)}
        </TextField>
      </FlexBox>

      <TextField fullWidth multiline rows={3} color="info" size="medium" label="Status Update Note (optional)" value={note} onChange={event => setNote(event.target.value)} sx={{
      mb: 3
    }} />

      <FlexBox justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Typography variant="body2" color="text.secondary">
          Current label: {statusLabel || formatOrderStatus(status)}
        </Typography>

        <Button variant="contained" color="info" onClick={handleSave} disabled={isSaving || nextStatus === status}>
          {isSaving ? "Updating..." : "Update Status"}
        </Button>
      </FlexBox>
    </div>;
}