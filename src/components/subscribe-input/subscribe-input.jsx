import TextField from "@mui/material/TextField";

// STYLED COMPONENT
import { StyledButton } from "./styles";


// ==============================================================


// ==============================================================

export default function SubscribeInput({
  fullWidth,
  slotProps,
  inputSx,
  buttonSx,
  variant = "outlined",
  buttonText = "SUBSCRIBE",
  placeholder = "Enter Your Mail Here",
  ...props
}) {
  const INPUT_PROPS = {
    endAdornment: <StyledButton sx={buttonSx}>{buttonText}</StyledButton>,
    sx: {
      border: 0,
      padding: 0,
      borderRadius: 2,
      backgroundColor: "white",
      ...inputSx
    }
  };
  return <TextField variant={variant} fullWidth={fullWidth} placeholder={placeholder} slotProps={{
    input: INPUT_PROPS
  }} {...props} />;
}