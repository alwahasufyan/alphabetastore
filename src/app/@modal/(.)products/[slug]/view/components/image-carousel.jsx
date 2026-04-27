"use client";

import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import { FALLBACK_PRODUCT_IMAGE } from "utils/catalog";

// GLOBAL CUSTOM COMPONENTS
import { Carousel, CarouselArrows, useCarousel } from "components/slider";
const carouselArrowStyles = {
  sx: {
    boxShadow: 0,
    color: "primary.main",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "transparent"
    }
  }
};
export default function ImageCarousel({
  images,
  title
}) {
  const safeImages = images?.length ? images : [FALLBACK_PRODUCT_IMAGE];
  const [resolvedImages, setResolvedImages] = useState(safeImages);
  const {
    ref,
    api,
    arrows
  } = useCarousel();

  useEffect(() => {
    setResolvedImages(safeImages);
  }, [images]);

  const handleImageError = index => {
    setResolvedImages(previous => previous.map((item, itemIndex) => itemIndex === index ? FALLBACK_PRODUCT_IMAGE : item));
  };

  return <Fragment>
      <Carousel ref={ref} api={api}>
        {resolvedImages.map((item, index) => <Box key={index} height={300} sx={{
        display: "flex",
        position: "relative",
        img: {
          objectFit: "contain",
          objectPosition: "center"
        }
      }}>
            <Image fill src={item || FALLBACK_PRODUCT_IMAGE} alt={title} sizes="100vw" onError={() => handleImageError(index)} />
          </Box>)}
      </Carousel>

      <CarouselArrows onClickNext={arrows.onClickNext} onClickPrev={arrows.onClickPrev} disableNext={arrows.disableNext} disablePrev={arrows.disablePrev} slotProps={{
      prev: carouselArrowStyles,
      next: carouselArrowStyles
    }} />
    </Fragment>;
}