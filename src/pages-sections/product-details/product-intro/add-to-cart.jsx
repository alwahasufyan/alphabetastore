"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";

// GLOBAL CUSTOM HOOK
import useCart from "hooks/useCart";

// CUSTOM DATA MODEL


// ================================================================


// ================================================================

export default function AddToCart({
  product
}) {
  const {
    id,
    price,
    title,
    slug,
    thumbnail
  } = product;
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const {
    dispatch
  } = useCart();
  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await dispatch({
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

      router.push("/mini-cart", {
        scroll: false
      });
    } finally {
      setLoading(false);
    }
  };
  return <Button color="primary" variant="contained" loading={isLoading} onClick={handleAddToCart} sx={{
    mb: 4.5,
    px: "1.75rem",
    height: 40
  }}>
      Add to Cart
    </Button>;
}