import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";


// ==============================================================


// ==============================================================

export function MobileHeader({
  children,
  ...props
}) {
  return <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" {...props}>
      {children}
    </Box>;
}


// ==================================================================


// ==================================================================

MobileHeader.Left = function ({
  children,
  ...props
}) {
  return <Box flex={1} {...props}>
      {children}
    </Box>;
};
MobileHeader.Logo = function ({
  logoUrl
}) {
  return <Link href="/">
      <Image width={60} height={44} src={logoUrl} alt="logo" />
    </Link>;
};


// ==================================================================


// ==================================================================

MobileHeader.Right = function ({
  children,
  ...props
}) {
  return <Box display="flex" justifyContent="end" flex={1} {...props}>
      {children}
    </Box>;
};