import Container from "@mui/material/Container";

// STYLED COMPONENTS
import { ContentWrapper } from "./styles";


// ==============================================================


// ==============================================================

export default function StickyWrapper({
  SideNav,
  children,
  className
}) {
  return <Container>
      <ContentWrapper className={className}>
        <div className="sidebar">{SideNav}</div>
        <div className="content">{children}</div>
      </ContentWrapper>
    </Container>;
}