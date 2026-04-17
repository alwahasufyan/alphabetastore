
// LOCAL CUSTOM COMPONENTS
import LogoWithTitle from "./components/logo-title";
import SocialButtons from "./components/social-buttons";

// GLOBAL CUSTOM COMPONENTS
import FlexRowCenter from "components/flex-box/flex-row-center";

// COMMON STYLED COMPONENT
import { Wrapper } from "./styles";


// ==============================================================


// ==============================================================

export default function AuthLayout({
  children,
  bottomContent
}) {
  return <FlexRowCenter bgcolor="grey.50" flexDirection="column" minHeight="100vh" px={2}>
      <Wrapper elevation={6}>
        <LogoWithTitle />

        {children}

        <SocialButtons />

        {/* RENDER BOTTOM CONTENT BASED ON CONDITION */}
        {bottomContent}
      </Wrapper>
    </FlexRowCenter>;
}