import Box from "@mui/material/Box";

// STYLED COMPONENT
import { ListIconWrapper } from "../styles";

// CUSTOM ICON COMPONENTS
import Icons from "icons/grocery-4";


// ==============================================================


// ==============================================================

export default function ButtonContent({
  icon,
  name
}) {
  let content = null;
  if (icon) {
    const Icon = Icons[icon];
    content = <ListIconWrapper>
        <Icon />
      </ListIconWrapper>;
  } else {
    content = <Box marginRight="0.6rem" />;
  }
  return <Box display="flex" alignItems="center">
      {content}
      {name}
    </Box>;
}