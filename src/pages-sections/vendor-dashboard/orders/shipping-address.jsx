import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";


// ==============================================================


// ==============================================================

export default function ShippingAddress({
  address,
  notes,
  phone,
  fullName
}) {
  return <Card sx={{
    px: 3,
    py: 4
  }}>
      <TextField rows={4} multiline fullWidth color="info" variant="outlined" label="Shipping Address" value={address} slotProps={{
      input: {
        readOnly: true
      }
    }} sx={{
      mb: 4
    }} />

      <TextField fullWidth color="info" variant="outlined" label="Customer Name" value={fullName || "N/A"} slotProps={{
      input: {
        readOnly: true
      }
    }} sx={{
      mb: 4
    }} />

      <TextField fullWidth color="info" variant="outlined" label="Phone Number" value={phone || "N/A"} slotProps={{
      input: {
        readOnly: true
      }
    }} sx={{
      mb: 4
    }} />

      <TextField rows={5} multiline fullWidth color="info" variant="outlined" label="Customer’s Note" value={notes || "No note provided."} slotProps={{
      input: {
        readOnly: true
      }
    }} />
    </Card>;
}