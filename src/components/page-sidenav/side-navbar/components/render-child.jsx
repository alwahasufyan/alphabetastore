import Link from "next/link";
import { Circle, StyledList } from "../styles";


// ==============================================================


// ==============================================================

export const renderChild = (child, active) => {
  return child.map(({
    title,
    href
  }, index) => <Link href={href} key={index}>
      <StyledList active={active === title}>
        <Circle className="dot" />
        <p>{title}</p>
      </StyledList>
    </Link>);
};