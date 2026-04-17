"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// GLOBAL CUSTOM COMPONENT
import OverlayScrollbar from "components/overlay-scrollbar";

// LOCAL CUSTOM COMPONENT
import ButtonContent from "./components/button-content";
import SidebarAccordion from "./components/sidebar-accordion";

// STYLED COMPONENTS
import { NavItemButton } from "./styles";

// CUSTOM DATA MODEL


// ==============================================================


// ==============================================================

export default function SideNavbarTwo({
  navigation
}) {
  const pathname = usePathname();
  const renderLevels = data => {
    return data.map(item => {
      if (item.children) {
        return <SidebarAccordion key={item.name} item={item}>
            {renderLevels(item.children)}
          </SidebarAccordion>;
      }
      return <Link href={item.path} key={item.name}>
          <NavItemButton disableRipple disableTouchRipple active={pathname === item.path}>
            <ButtonContent name={item.name} icon={item.icon} />
          </NavItemButton>
        </Link>;
    });
  };
  return <OverlayScrollbar sx={{
    overflowX: "hidden",
    height: "calc(100dvh - (120px + 87px))"
  }}>
      {renderLevels(navigation)}
    </OverlayScrollbar>;
}