
// STYLED COMPONENTS
import { LeftContent, RightContent, StyledChip, StyledContainer, StyledRoot } from "./styles";


// ===============================================================


// ===============================================================

export function Topbar({
  bgColor,
  children,
  ...props
}) {
  return <StyledRoot bgColor={bgColor} {...props}>
      <StyledContainer>{children}</StyledContainer>
    </StyledRoot>;
}


// ===================================================================


// ===================================================================

Topbar.Left = function ({
  label,
  title,
  children,
  ...props
}) {
  return <LeftContent {...props}>
      <div className="tag">
        <StyledChip label={label} size="small" />
        <span>{title}</span>
      </div>
    </LeftContent>;
};


// ======================================================================


// ======================================================================

Topbar.Right = function ({
  children,
  ...props
}) {
  return <RightContent {...props}>{children}</RightContent>;
};