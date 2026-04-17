import Button from "@mui/material/Button";

// STYLED COMPONENTS
import { BannerCardWrapper } from "./styles";


// ==============================================================


// ==============================================================

export default function BannerCard({
  ImageComponent,
  tag,
  title
}) {
  return <BannerCardWrapper>
      {/* IMAGE COMPONENT */}
      {ImageComponent}

      <div className="content">
        <p className="tag">{tag}</p>
        <h6 className="title">{title}</h6>
        <p className="price">
          Start from <span>$40.45</span>
        </p>

        <Button variant="contained" color="orange">
          Shop Now
        </Button>
      </div>
    </BannerCardWrapper>;
}