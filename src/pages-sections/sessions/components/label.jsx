import FormLabel from "@mui/material/FormLabel";
export default function Label({
  children
}) {
  return <FormLabel sx={{
    mb: 1,
    fontSize: 14,
    fontWeight: 500,
    display: "block",
    color: "text.secondary"
  }}>
      {children}
    </FormLabel>;
}