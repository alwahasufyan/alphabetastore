"use client";

import Image from "next/image";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";


// STYLED COMPONENTS
const CardWrapper = styled(Box)({
  display: "flex",
  overflow: "hidden",
  position: "relative",
  borderRadius: ".5rem"
});
const CardContent = styled("div")(({
  theme
}) => ({
  top: 0,
  left: 32,
  zIndex: 1,
  height: "100%",
  display: "flex",
  position: "absolute",
  flexDirection: "column",
  justifyContent: "center",
  ...(theme.direction === "rtl" && {
    left: "auto",
    right: 32,
    textAlign: "right"
  })
}));


// ========================================================


// ========================================================

export default function BannerCard({
  img,
  children,
  imageFull,
  ...props
}) {
  return <CardWrapper {...props}>
      <Image src={img} width={330} height={239} alt="category" style={{
      width: "100%",
      objectFit: "cover",
      height: imageFull ? "100%" : "auto"
    }} />
      <CardContent>{children}</CardContent>
    </CardWrapper>;
}