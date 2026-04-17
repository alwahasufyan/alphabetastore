import Link from "next/link";
import Typography from "@mui/material/Typography";

// STYLED COMPONENTS
import { StyledWrapper } from "./styles";


// ==============================================================


// ==============================================================

export default function BannerTwo({
  children,
  title,
  description
}) {
  return <StyledWrapper>
      <Link href="#">
        {children}

        <div className="text-content">
          <Typography variant="h2" className="title">
            {title}
          </Typography>

          <Typography variant="body1" className="description">
            {description}
          </Typography>
        </div>
      </Link>
    </StyledWrapper>;
}