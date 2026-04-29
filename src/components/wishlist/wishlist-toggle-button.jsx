"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";

import { isLoggedIn } from "utils/auth";
import { addWishlistItem, removeWishlistItem } from "utils/wishlist";

export default function WishlistToggleButton({
  productId,
  initialInWishlist = false,
  onChange,
  variant = "icon",
  sx,
  size = "small",
  fullWidth = false
}) {
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(initialInWishlist);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsInWishlist(initialInWishlist);
  }, [initialInWishlist]);

  const handleToggle = async event => {
    event.preventDefault();
    event.stopPropagation();

    if (!isLoggedIn()) {
      window.location.assign("/login");
      return;
    }

    setIsLoading(true);

    try {
      const nextValue = !isInWishlist;

      if (nextValue) {
        await addWishlistItem(productId);
      } else {
        await removeWishlistItem(productId);
      }

      setIsInWishlist(nextValue);
      onChange?.(nextValue);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Failed to update wishlist.");
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "button") {
    return <Button color={isInWishlist ? "secondary" : "primary"} variant={isInWishlist ? "outlined" : "contained"} onClick={handleToggle} disabled={isLoading} startIcon={isLoading ? <CircularProgress color="inherit" size={16} /> : isInWishlist ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />} sx={sx} fullWidth={fullWidth}>
        {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      </Button>;
  }

  return <IconButton size={size} onClick={handleToggle} disabled={isLoading} sx={sx} aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}>
      {isLoading ? <CircularProgress size={18} color="inherit" /> : isInWishlist ? <Favorite color="primary" fontSize="small" /> : <FavoriteBorder fontSize="small" />}
    </IconButton>;
}