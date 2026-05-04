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
  logoUrl,
  siteName
}) {
  if (logoUrl) {
    return <Link href="/">
        <Image width={60} height={44} src={logoUrl} alt={siteName || "logo"} />
      </Link>;
  }
  return <Link href="/" style={{ textDecoration: "none" }}>
      <Box sx={{
      fontWeight: 700,
      fontSize: "1rem",
      color: "primary.main",
      whiteSpace: "nowrap"
    }}>
        {siteName || "Alphabeta Store"}
      </Box>
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