"use client";

import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";


// STYLED COMPONENT
const StyledChip = styled(Chip, {
  shouldForwardProp: prop => prop !== "shape"
})(({
  shape
}) => ({
  zIndex: 1,
  top: "15px",
  left: "15px",
  paddingLeft: 3,
  paddingRight: 3,
  fontWeight: 500,
  borderRadius: 8,
  fontSize: "10px",
  position: "absolute",
  ...(shape === "square" && {
    borderRadius: 0
  })
}));


// ==============================================================


// ==============================================================

export default function DiscountChip({
  discount = 0,
  shape = "rounded",
  ...props
}) {
  return discount > 0 ? <StyledChip size="small" shape={shape} label={`${discount}% off`} {...props} /> : null;
}