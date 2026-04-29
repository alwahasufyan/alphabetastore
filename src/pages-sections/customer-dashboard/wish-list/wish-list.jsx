"use client";

import { Fragment, useEffect, useState } from "react";

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
import { fetchWishlistItemsPage } from "utils/wishlist";


// ==================================================================


// ==================================================================

export default function WishListPageView({
  initialPage = 1
}) {
  const searchParams = useSearchParams();
  const pageFromQuery = Number.parseInt(searchParams.get("page") || "", 10);
  const currentPage = Number.isFinite(pageFromQuery) && pageFromQuery > 0 ? pageFromQuery : Math.max(Number(initialPage) || 1, 1);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: currentPage,
    limit: 6,
    total: 0,
    totalPages: 1
  });
  const [pageError, setPageError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const pageSize = 6;

  useEffect(() => {
    let cancelled = false;

    const loadWishlist = async () => {
      try {
        if (!cancelled) {
          setIsLoading(true);
        }
        setPageError("");
        const response = await fetchWishlistItemsPage({
          page: currentPage,
          limit: pageSize
        });

        if (!cancelled) {
          setItems(Array.isArray(response?.items) ? response.items : []);
          setPagination(response?.pagination || {
            page: currentPage,
            limit: pageSize,
            total: 0,
            totalPages: 1
          });
        }
      } catch (error) {
        if (!cancelled) {
          setPageError(error instanceof Error ? error.message : "Failed to load wishlist.");
          setItems([]);
          setPagination({
            page: currentPage,
            limit: pageSize,
            total: 0,
            totalPages: 1
          });
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
  }, [currentPage]);

  const totalPages = Math.max(1, Number(pagination.totalPages || 1));

  return <Fragment>
      <DashboardHeader title="قائمة المفضلة" Icon={Favorite} />

      {pageError ? <Alert severity="error" sx={{
      mb: 3
    }}>{pageError}</Alert> : null}

      {isLoading ? <Stack alignItems="center" justifyContent="center" py={6}>
          <CircularProgress color="info" />
        </Stack> : null}

      {!isLoading && !pageError && items.length === 0 ? <Alert severity="info">قائمة المفضلة فارغة حاليًا.</Alert> : null}

      <Grid container spacing={3}>
        {!isLoading && !pageError ? items.map(item => <Grid size={{
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
            setPagination(current => ({
              ...current,
              total: Math.max(0, current.total - 1)
            }));
          }
        }} />
          </Grid>) : null}
      </Grid>

      <Pagination count={totalPages} page={Math.max(currentPage, 1)} />
    </Fragment>;
}