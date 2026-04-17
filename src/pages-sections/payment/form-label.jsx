import Radio from "@mui/material/Radio";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";


// ==============================================================


// ==============================================================

export default function FormLabel({
  name,
  checked,
  title,
  handleChange
}) {
  return <FormControlLabel name={name} onChange={handleChange} label={<Typography variant="h5">{title}</Typography>} control={<Radio checked={checked} color="primary" size="small" />} />;
}