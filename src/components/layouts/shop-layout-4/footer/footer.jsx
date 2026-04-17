import Link from "next/link";
import Divider from "@mui/material/Divider";

// STYLED COMPONENT
import { StyledRoot } from "./styles";


// ==============================================================


// ==============================================================

export default function Footer({
  links
}) {
  return <StyledRoot>
      <Divider />

      <div className="links">
        {links.map(link => <Link key={link.id} href={link.url}>
            {link.title}
          </Link>)}
      </div>

      <p>© Copyright {new Date().getFullYear()} By UI LIB.</p>
    </StyledRoot>;
}