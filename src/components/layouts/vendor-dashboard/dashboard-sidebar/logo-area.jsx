import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// GLOBAL CUSTOM COMPONENT
import FlexBetween from "components/flex-box/flex-between";
import useSettings from "hooks/useSettings";

// LOCAL CUSTOM HOOK
import { useLayout } from "../dashboard-layout-context";

// STYLED COMPONENT
import { ChevronLeftIcon } from "./styles";
export default function LogoArea() {
  const {
    TOP_HEADER_AREA,
    COMPACT,
    sidebarCompact,
    handleSidebarCompactToggle
  } = useLayout();
  const { settings } = useSettings();
  const logoUrl = settings?.site_logo_url?.trim() || "";
  const siteName = settings?.site_name || "Alphabeta Store";
  return <FlexBetween p={2} maxHeight={TOP_HEADER_AREA} justifyContent={COMPACT ? "center" : "space-between"}>
      {logoUrl ? <Avatar alt={siteName} src={logoUrl} sx={{
      borderRadius: 0,
      width: "auto",
      marginLeft: COMPACT ? 0 : 1
    }} /> : <Typography variant="h6" sx={{
      fontWeight: 700,
      fontSize: COMPACT ? "0.85rem" : "1rem",
      color: "primary.main",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: COMPACT ? 40 : 160,
      marginLeft: COMPACT ? 0 : 1
    }}>
          {COMPACT ? siteName.charAt(0) : siteName}
        </Typography>}

      <ChevronLeftIcon color="disabled" compact={COMPACT} onClick={handleSidebarCompactToggle} sidebar_compact={sidebarCompact ? 1 : 0} />
    </FlexBetween>;
}
