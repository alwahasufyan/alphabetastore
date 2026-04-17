import { Fragment } from "react";
import { Heading, StyledLink } from "./styles";


// ==============================================================


// ==============================================================

export function FooterLinksWidget({
  links,
  title
}) {
  return <Fragment>
      <Heading>{title}</Heading>

      {links.map((item, ind) => <StyledLink href={item.url} key={ind}>
          {item.title}
        </StyledLink>)}
    </Fragment>;
}