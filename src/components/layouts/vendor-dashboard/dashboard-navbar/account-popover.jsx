"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { useAuth } from "contexts/AuthContext";

const Divider = styled("div")(({ theme }) => ({
  margin: "0.5rem 0",
  border: `1px dashed ${theme.palette.grey[200]}`
}));

export default function AccountPopover() {
  const router = useRouter();
  const { t } = useTranslation();
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);
  const displayName = String(user?.name || "Alphabeta Admin").trim() || "Alphabeta Admin";
  const displayRole = user?.role === "ADMIN" ? t("adminRole") : user?.role === "CUSTOMER" ? t("customerRole") : String(user?.role || t("adminRole"));

  const handleLogout = async () => {
    handleClose();
    await logout();
    window.location.assign("/login");
  };

  return <div>
      <IconButton sx={{
      padding: 0
    }} aria-haspopup="true" onClick={event => setAnchorEl(event.currentTarget)} aria-expanded={open ? "true" : undefined} aria-controls={open ? "account-menu" : undefined}>
        <Avatar alt={displayName} src="/assets/images/avatars/001-man.svg" />
      </IconButton>

      <Menu open={open} id="account-menu" anchorEl={anchorEl} onClose={handleClose} onClick={handleClose} transformOrigin={{
      horizontal: "right",
      vertical: "top"
    }} anchorOrigin={{
      horizontal: "right",
      vertical: "bottom"
    }} slotProps={{
      paper: {
        elevation: 0,
        sx: {
          mt: 1,
          boxShadow: 2,
          minWidth: 200,
          borderRadius: "8px",
          overflow: "visible",
          border: "1px solid",
          borderColor: "grey.200",
          "& .MuiMenuItem-root:hover": {
            backgroundColor: "grey.200"
          },
          "&:before": {
            top: 0,
            right: 14,
            zIndex: 0,
            width: 10,
            height: 10,
            content: '\"\"',
            display: "block",
            position: "absolute",
            borderTop: "1px solid",
            borderLeft: "1px solid",
            borderColor: "grey.200",
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)"
          }
        }
      }
    }}>
        <Box px={2} pt={1}>
          <Typography variant="h6">{displayName}</Typography>
          <Typography variant="body1" sx={{
          fontSize: 12,
          color: "grey.500"
        }}>
            {displayRole}
          </Typography>
        </Box>

        <Divider />
        <MenuItem component={Link} href="/vendor/account-settings">{t("My Profile")}</MenuItem>
        <MenuItem component={Link} href="/admin/orders">{t("My Orders")}</MenuItem>
        <MenuItem component={Link} href="/vendor/site-settings">{t("siteSettingsTitle")}</MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>{t("Logout")}</MenuItem>
      </Menu>
    </div>;
}