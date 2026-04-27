"use client";

import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { FALLBACK_PRODUCT_IMAGE } from "utils/catalog";

// STYLED COMPONENTS
import { PreviewImage, ProductImageWrapper } from "./styles";
export default function ProductGallery({
  images
}) {
  const galleryImages = images?.length ? images : [FALLBACK_PRODUCT_IMAGE];
  const [currentImage, setCurrentImage] = useState(0);
  const [resolvedImages, setResolvedImages] = useState(galleryImages);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    setResolvedImages(galleryImages);
    setCurrentImage(0);
  }, [images]);

  const handleImageError = index => {
    setResolvedImages(previous => previous.map((item, itemIndex) => itemIndex === index ? FALLBACK_PRODUCT_IMAGE : item));
  };

  return <Fragment>
      <ProductImageWrapper onClick={() => setZoomOpen(true)}>
        <Image fill alt="product" src={resolvedImages[currentImage] || FALLBACK_PRODUCT_IMAGE} sizes="(max-width: 768px) 100vw, 50vw" onError={() => handleImageError(currentImage)} />
      </ProductImageWrapper>

      <div className="preview-images">
        {resolvedImages.map((url, ind) => <PreviewImage key={ind} onClick={() => setCurrentImage(ind)} selected={currentImage === ind}>
            <Image fill alt="product" src={url || FALLBACK_PRODUCT_IMAGE} sizes="64px" onError={() => handleImageError(ind)} />
          </PreviewImage>)}
      </div>

      <Dialog open={zoomOpen} onClose={() => setZoomOpen(false)} maxWidth="lg" fullWidth>
        <DialogContent sx={{ p: 2 }}>
          <ProductImageWrapper sx={{ height: { md: 640, xs: 360 }, mb: 0, cursor: "zoom-out" }} onClick={() => setZoomOpen(false)}>
            <Image fill alt="product enlarged" src={resolvedImages[currentImage] || FALLBACK_PRODUCT_IMAGE} sizes="100vw" onError={() => handleImageError(currentImage)} />
          </ProductImageWrapper>
        </DialogContent>
      </Dialog>
    </Fragment>;
}