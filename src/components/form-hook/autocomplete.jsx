import { useFormContext, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import MuiAutocomplete from "@mui/material/Autocomplete";


// ==============================================================


// ==============================================================

export default function Autocomplete({
  size,
  name,
  label,
  options,
  placeholder,
  ...other
}) {
  const {
    control,
    setValue
  } = useFormContext();
  return <Controller name={name} control={control} render={({
    field,
    fieldState: {
      error
    }
  }) => <MuiAutocomplete {...field} options={options} onChange={(_, newValue) => setValue(name, newValue, {
    shouldValidate: true
  })} renderInput={params => <TextField label={label} placeholder={placeholder} error={Boolean(error)} helperText={error?.message || ""} {...params} size={size} />} {...other} />} />;
}