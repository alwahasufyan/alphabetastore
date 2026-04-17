
// STYLED COMPONENT
import { StyledScrollbar } from "./styles";


// =============================================================


// =============================================================

export default function OverlayScrollbar({
  sx,
  children,
  className
}) {
  return <StyledScrollbar defer sx={sx} className={className} options={{
    scrollbars: {
      autoHide: "leave",
      autoHideDelay: 100
    }
  }}>
      {children}
    </StyledScrollbar>;
}