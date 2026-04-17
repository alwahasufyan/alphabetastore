"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { styled } from "@mui/material/styles";
import clsx from "clsx";


// STYLED COMPONENT
const StyledLink = styled(Link, {
  shouldForwardProp: prop => prop !== "active"
})(({
  theme,
  active
}) => ({
  position: "relative",
  
// transition: "color 150ms ease-in-out",
  transition: "color 0.3s cubic-bezier(0, 0, 0.2, 1) 0ms",
  color: active ? theme.palette.primary.main : "inherit",
  ":hover": {
    color: `${theme.palette.primary.main} !important`
  }
}));


// ==============================================================


// ==============================================================

export function NavLink({
  href,
  children,
  style,
  className,
  ...props
}) {
  const pathname = usePathname();
  const isActive = useMemo(() => {
    return href === "/" ? pathname === href : pathname.includes(href);
  }, [pathname, href]);
  return <StyledLink href={href} style={style} className={clsx(className)} active={isActive} {...props}>
      {children}
    </StyledLink>;
}