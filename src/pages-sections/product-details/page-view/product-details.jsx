"use client";

import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

// LOCAL CUSTOM COMPONENTS
import ProductTabs from "../product-tabs";
import ProductIntro from "../product-intro";
import ProductDescription from "../product-description";
import { fetchProductBySlug } from "utils/catalog";

// CUSTOM DATA MODEL


// ==============================================================


// ==============================================================

export default function ProductDetailsPageView({
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
    return <Container className="mt-2 mb-2">
        <Typography>Loading...</Typography>
      </Container>;
  }

  if (error || !product) {
    return <Container className="mt-2 mb-2">
        <Typography>Failed to load products</Typography>
      </Container>;
  }

  return <Container className="mt-2 mb-2">
      {/* PRODUCT DETAILS INFO AREA */}
      <ProductIntro product={product} />

      {/* PRODUCT DESCRIPTION AND REVIEW */}
      <ProductTabs reviewCount={0} description={<ProductDescription description={product.description} />} reviews={<Typography color="text.secondary">No reviews available.</Typography>} />
    </Container>;
}