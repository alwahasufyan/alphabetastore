"use client";

import Link from "next/link";
import { useState } from "react";
import useCart from "hooks/useCart";

// STYLED COMPONENTS
import { StyledButton } from "./styles";


// ==============================================================


// ==============================================================

export default function AddToCart({
  product
}) {
  const {
    id,
    slug,
    title,
    thumbnail,
    price
  } = product;
  const [isLoading, setIsLoading] = useState(false);
  const {
    dispatch
  } = useCart();
  const handleCart = () => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      dispatch({
        type: "CHANGE_CART_AMOUNT",
        payload: {
          id,
          slug,
          price,
          title,
          thumbnail,
          qty: 1
        }
      });
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  };
  return <Link href="/mini-cart" scroll={false}>
      <StyledButton fullWidth disableElevation color="primary" loading={isLoading} onClick={handleCart} className="add-to-cart">
        Add To Cart
      </StyledButton>
    </Link>;
}