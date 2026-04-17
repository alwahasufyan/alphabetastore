import Typography from "@mui/material/Typography";


// ==============================================================


// ==============================================================

export default function CountBox({
  digit = 365,
  title = "DAYS"
}) {
  return <Typography variant="h3">
      {digit}{" "}
      <Typography component="span" fontSize={14} fontWeight={500} color="grey.600">
        {title}
      </Typography>
    </Typography>;
}