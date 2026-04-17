import ChevronRight from "icons/ChevronRight";
import { RootContainer } from "./styles";


// =================================================================


// =================================================================

export default function AccordionHeader({
  sx,
  ref,
  children,
  open = false,
  showIcon = true,
  ...others
}) {
  return <RootContainer ref={ref} open={open} sx={sx} {...others}>
      {children}
      {showIcon && <ChevronRight className="caret" />}
    </RootContainer>;
}