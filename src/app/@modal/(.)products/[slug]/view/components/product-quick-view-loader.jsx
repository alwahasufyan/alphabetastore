"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ProductQuickView from "./product-quick-view";
import { fetchProductBySlug } from "utils/catalog";

export default function ProductQuickViewLoader({
  slug
}) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetchProductBySlug(slug);

        if (!active) return;

        setProduct(response);
      } catch {
        if (!active) return;

        setProduct(null);
        setError("Failed to load products");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return <Box p={4}>
        <Typography>جاري تحميل المنتج...</Typography>
      </Box>;
  }

  if (error || !product) {
    return <Box p={4}>
        <Typography>تعذر تحميل المنتج.</Typography>
      </Box>;
  }

  return <ProductQuickView product={product} />;
}