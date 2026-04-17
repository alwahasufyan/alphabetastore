import MuiContainer from "@mui/material/Container";
export default function Container({
  children,
  sx,
  ...props
}) {
  return <MuiContainer sx={{
    mb: {
      xs: 6,
      sm: 10
    },
    ...sx
  }} {...props}>
      {children}
    </MuiContainer>;
}