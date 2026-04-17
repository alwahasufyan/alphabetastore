import IconComponent from "components/IconComponent";

// STYLED COMPONENTS
import { StyledRoot } from "./styles";


// ==============================================================


// ==============================================================

export default function ServiceCard3({
  icon,
  title,
  description
}) {
  return <StyledRoot>
      <IconComponent icon={icon} sx={{
      fontSize: 40
    }} />

      <div>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </StyledRoot>;
}