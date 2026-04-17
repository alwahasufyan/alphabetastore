import { useFormContext, Controller } from "react-hook-form";
import FormHelperText from "@mui/material/FormHelperText";
import MuiCheckbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";


// ==============================================================


// ==============================================================

export default function Checkbox({
  name,
  size,
  color,
  ...other
}) {
  const {
    control
  } = useFormContext();
  return <Controller name={name} control={control} render={({
    field,
    fieldState: {
      error
    }
  }) => <div>
          <FormControlLabel control={<MuiCheckbox {...field} checked={field.value} size={size} color={color} />} {...other} />
          {Boolean(error) && <FormHelperText error>{error?.message}</FormHelperText>}
        </div>} />;
}