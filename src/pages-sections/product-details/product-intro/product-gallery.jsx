"use client";

import Image from "next/image";
import { Fragment, useState } from "react";
import { FALLBACK_PRODUCT_IMAGE } from "utils/catalog";

// STYLED COMPONENTS
import { PreviewImage, ProductImageWrapper } from "./styles";
export default function ProductGallery({
  images
}) {
  const galleryImages = images?.length ? images : [FALLBACK_PRODUCT_IMAGE];
  const [currentImage, setCurrentImage] = useState(0);
  return <Fragment>
      <ProductImageWrapper>
        <Image fill alt="product" src={galleryImages[currentImage]} sizes="(400px 400px)" />
      </ProductImageWrapper>

      <div className="preview-images">
        {galleryImages.map((url, ind) => <PreviewImage key={ind} onClick={() => setCurrentImage(ind)} selected={currentImage === ind}>
            <Image fill alt="product" src={url} sizes="(48px 48px)" />
          </PreviewImage>)}
      </div>
    </Fragment>;
}