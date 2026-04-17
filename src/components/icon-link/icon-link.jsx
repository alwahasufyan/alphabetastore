import ArrowRightAlt from "@mui/icons-material/ArrowRightAlt";

// STYLED COMPONENT
import { StyledLink } from "./styles";


// ==============================================================


// ==============================================================

export default function IconLink({
  url,
  title,
  sx
}) {
  return <StyledLink href={url} sx={sx}>
      <span>{title}</span>
      <ArrowRightAlt fontSize="small" color="inherit" className="icon" />
    </StyledLink>;
}