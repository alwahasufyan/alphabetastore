import ArrowRightAlt from "@mui/icons-material/ArrowRightAlt";

// STYLED COMPONENT
import { StyledButton, StyledHeadingRoot } from "./styles";


// ==============================================================


// ==============================================================

export default function Heading({
  title
}) {
  return <StyledHeadingRoot>
      <h2 className="title">{title}</h2>
      <StyledButton disableFocusRipple endIcon={<ArrowRightAlt fontSize="inherit" />}>
        View All
      </StyledButton>
    </StyledHeadingRoot>;
}