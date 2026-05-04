import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

// LOCAL CUSTOM COMPONENTS
import LogoArea from "./logo-area";
import LayoutDrawer from "../../layout-drawer";
import MultiLevelMenu from "./multi-level-menu";
import useSettings from "hooks/useSettings";

// LOCAL CUSTOM HOOK
import { useLayout } from "../dashboard-layout-context";

// STYLED COMPONENT
import { SidebarWrapper } from "./styles";
export default function DashboardSidebar() {
  const {
    sidebarCompact,
    TOP_HEADER_AREA,
    showMobileSideBar,
    handleSidebarHover,
    handleCloseMobileSidebar
  } = useLayout();
  const downLg = useMediaQuery(theme => theme.breakpoints.down("lg"));
  const { settings } = useSettings();
  const logoUrl = settings?.site_logo_url?.trim() || "";
  const siteName = settings?.site_name || "Alphabeta Store";
  if (downLg) {
    return <LayoutDrawer open={showMobileSideBar ? true : false} onClose={handleCloseMobileSidebar}>
        <Box p={2} maxHeight={TOP_HEADER_AREA} display="flex" alignItems="center">
          {logoUrl ? <img alt={siteName} src={logoUrl} width={105} height={50} style={{ objectFit: "contain", marginLeft: 8 }} /> : <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main", ml: 1 }}>{siteName}</Typography>}
        </Box>

        <MultiLevelMenu />
      </LayoutDrawer>;
  }
  return <SidebarWrapper compact={sidebarCompact ? 1 : 0} onMouseEnter={() => handleSidebarHover(true)} onMouseLeave={() => sidebarCompact && handleSidebarHover(false)}>
      {/* SIDEBAR TOP LOGO SECTION */}
      <LogoArea />

      {/* SIDEBAR NAVIGATION SECTION */}
      <MultiLevelMenu />
    </SidebarWrapper>;
}