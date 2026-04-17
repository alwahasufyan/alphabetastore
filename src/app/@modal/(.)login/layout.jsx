"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

// MUI
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
export default function LoginModalPage({
  children
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme => theme.breakpoints.down("xs"));
  useEffect(() => {
    if (pathname !== "/login") {
      router.replace(pathname);
    }
  }, [pathname, router]);
  if (pathname !== "/login") return null;
  const handleClose = () => {
    router.back();
  };
  return <Dialog open scroll="body" fullWidth={isMobile} onClose={handleClose} sx={{
    zIndex: 9999
  }}>
      {children}
    </Dialog>;
}