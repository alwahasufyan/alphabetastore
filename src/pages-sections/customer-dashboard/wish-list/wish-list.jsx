"use client";

import { Fragment, useEffect, useMemo, useState } from "react";

import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Favorite from "@mui/icons-material/Favorite";
import { useSearchParams } from "next/navigation";

// CUSTOM COMPONENTS
import Pagination from "../pagination";
import DashboardHeader from "../dashboard-header";
import ProductCard17 from "components/product-cards/product-card-17";
import WishlistToggleButton from "components/wishlist/wishlist-toggle-button";
import { fetchWishlistItems } from "utils/wishlist";


// ==================================================================


// ==================================================================

export default function WishListPageView({
  initialPage = 1
}) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") || initialPage || 1);
  const [items, setItems] = useState([]);
  const [pageError, setPageError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadWishlist = async () => {
      try {
        setPageError("");
        const nextItems = await fetchWishlistItems();

        if (!cancelled) {
          setItems(nextItems);
        }
      } catch (error) {
        if (!cancelled) {
          setPageError(error instanceof Error ? error.message : "Failed to load wishlist.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadWishlist();

    return () => {
      cancelled = true;
    };
  }, []);

  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const paginatedItems = useMemo(() => {
    const offset = (Math.max(currentPage, 1) - 1) * pageSize;
    return items.slice(offset, offset + pageSize);
  }, [currentPage, items]);

  return <Fragment>
      <DashboardHeader title="قائمة المفضلة" Icon={Favorite} />

      {pageError ? <Alert severity="error" sx={{
      mb: 3
    }}>{pageError}</Alert> : null}

      {isLoading ? <Stack alignItems="center" justifyContent="center" py={6}>
          <CircularProgress color="info" />
        </Stack> : null}

      {!isLoading && !pageError && paginatedItems.length === 0 ? <Alert severity="info">قائمة المفضلة فارغة حاليًا.</Alert> : null}

      <Grid container spacing={3}>
        {!isLoading && !pageError ? paginatedItems.map(item => <Grid size={{
        lg: 4,
        sm: 6,
        xs: 12
      }} key={item.id}>
            <ProductCard17 bgWhite product={item.product} />

            <WishlistToggleButton productId={item.product.id} initialInWishlist variant="button" fullWidth sx={{
          mt: 2
        }} onChange={nextValue => {
          if (!nextValue) {
            setItems(currentItems => currentItems.filter(currentItem => currentItem.id !== item.id));
          }
        }} />
          </Grid>) : null}
      </Grid>

      <Pagination count={totalPages} />
    </Fragment>;
}