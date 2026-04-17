import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

// LOCAL CUSTOM COMPONENT
import { SectionHeader } from "./section-header";


// ==============================================================


// ==============================================================

export function SectionCreator({
  title,
  children,
  seeMoreLink,
  ...others
}) {
  return <Box mb={7.5} {...others}>
      <Container className="pb-1">
        {title && <SectionHeader title={title} seeMoreLink={seeMoreLink} />}
        {children}
      </Container>
    </Box>;
}