import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";

// GLOBAL CUSTOM COMPONENTS
import { NavLink } from "components/nav-link";
const ACCORDION_STYLES = {
  "&:not(:last-child)": {
    borderBottom: 0
  },
  "&:before": {
    display: "none"
  }
};
const ACCORDION_SUMMARY_STYLES = {
  padding: 0,
  minHeight: 48,
  boxShadow: "none",
  "& .Mui-expanded": {
    color: "primary.main",
    margin: 0
  },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    margin: 0,
    "& .MuiSvgIcon-root": {
      color: "primary.main"
    }
  }
};
export const renderLevels = (data, handleClose) => {
  return data.map((item, index) => {
    const href = item.url || item.href;

    if (item.child) {
      return <Accordion square key={index} elevation={0} disableGutters sx={ACCORDION_STYLES}>
          <AccordionSummary expandIcon={<ExpandMore />} sx={ACCORDION_SUMMARY_STYLES}>
            <Typography variant="h6">{item.title}</Typography>
          </AccordionSummary>

          <Box mx={2}>{renderLevels(item.child, handleClose)}</Box>
        </Accordion>;
    }
    if (item.extLink) {
      return <Typography variant="h6" sx={{
        py: 1
      }} key={index}>
          <NavLink href={href || "/"}>{item.title}</NavLink>
        </Typography>;
    }

    if (!href) {
      return <Box key={index} py={1}>
          <Typography variant="h6">{item.title}</Typography>
        </Box>;
    }

    return <Box key={index} py={1}>
        <NavLink href={href} onClick={handleClose}>
          {item.title}
        </NavLink>
      </Box>;
  });
};