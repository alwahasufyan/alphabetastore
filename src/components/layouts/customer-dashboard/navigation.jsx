"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

// CUSTOM COMPONENTS
import NavItem from "./nav-item";
import { useAuth } from "contexts/AuthContext";

// STYLED COMPONENTS
import { MainContainer } from "./styles";
const MENUS = [{
  title: "DASHBOARD",
  list: [{
    count: 5,
    icon: "Packages",
    href: "/orders",
    title: "Orders"
  }, {
    count: 19,
    icon: "HeartLine",
    href: "/wish-list",
    title: "Wishlist"
  }, {
    count: 1,
    icon: "Headset",
    href: "/support-tickets",
    title: "Support Tickets"
  }]
}, {
  title: "ACCOUNT SETTINGS",
  list: [{
    icon: "User3",
    href: "/profile",
    title: "Profile Info"
  }, {
    count: 16,
    icon: "Location",
    href: "/address",
    title: "Addresses"
  }, {
    count: 4,
    icon: "CreditCard",
    href: "/payment-methods",
    title: "Payment Methods"
  }]
}];
export function Navigation() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return <MainContainer>
      {MENUS.map(item => <Box mt={2} key={item.title}>
          <Typography fontSize={12} variant="body1" fontWeight={500} color="text.secondary" textTransform="uppercase" sx={{
        padding: ".75rem 1.75rem"
      }}>
            {item.title}
          </Typography>

          {item.list.map(listItem => <NavItem item={listItem} key={listItem.title} />)}
        </Box>)}

      <Box px={4} mt={6} pb={2}>
        <Button disableElevation variant="outlined" color="primary" fullWidth onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </MainContainer>;
}