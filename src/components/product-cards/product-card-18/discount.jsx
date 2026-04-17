"use client";

import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";


// STYLED COMPONENT
const StyledChip = styled(Chip, {
  shouldForwardProp: prop => prop !== "shape"
})(({
  shape,
  theme
}) => ({
  zIndex: 1,
  top: 15,
  left: 15,
  height: 28,
  fontSize: 12,
  borderRadius: 6,
  position: "absolute",
  color: theme.palette.common.black,
  border: `1px solid ${theme.palette.grey[100]}`,
  backgroundColor: theme.palette.common.white,
  ...(shape === "square" && {
    borderRadius: 0
  })
}));


// ==============================================================


// ==============================================================

export default function Discount({
  discount = 0,
  shape = "rounded",
  ...props
}) {
  return <StyledChip size="small" shape={shape} label={`${discount}% off`} {...props} />;
}