import Button from "@mui/material/Button";

// STYLED COMPONENTS
import { BannerWrapper, ContentWrapper } from "./styles";


// ==============================================================


// ==============================================================

export default function Banner2({
  ImageComponent,
  title,
  isContentCenter = false
}) {
  return <BannerWrapper>
      {/* BACKGROUND IMAGE */}
      {ImageComponent}

      <ContentWrapper center={isContentCenter}>
        <p className="tag">New Arrivals</p>
        <h3 className="title">{title}</h3>

        <Button variant="contained" color="orange" size="large">
          Shop Now
        </Button>
      </ContentWrapper>
    </BannerWrapper>;
}