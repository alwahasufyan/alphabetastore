import Image from "next/image";
import Typography from "@mui/material/Typography";

// STYLED COMPONENTS
import { ImageWrapper, StyledRoot } from "./styles";


// ===================================================


// ===================================================

export default function CategoryCard({
  imgUrl,
  title,
  available
}) {
  return <StyledRoot>
      <ImageWrapper>
        <Image alt={title} width={800} height={200} src={imgUrl} />
      </ImageWrapper>

      <Typography variant="h6">{title}</Typography>
      <Typography variant="body1">{available}</Typography>
    </StyledRoot>;
}