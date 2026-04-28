"use client";

import { memo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// MUI
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";

// CUSTOM GLOBAL COMPONENTS
import FlexBetween from "components/flex-box/flex-between";

// CUSTOM UTILITY FUNCTION
import { renderProductCount } from "lib";


// ==============================================================


// ==============================================================

export default memo(function ProductPagination({
  page,
  perPage,
  totalProducts
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handleChangePage = (_, page) => {
    const params = new URLSearchParams(searchParams);
    if (page === 1) params.delete("page");else params.set("page", page.toString());
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };
  if (totalProducts <= perPage) return <FlexBetween flexWrap="wrap" my={8}>
      <Typography fontWeight={500} variant="body1">
        {renderProductCount(page, perPage, totalProducts)}
      </Typography>
    </FlexBetween>;
  return <FlexBetween flexWrap="wrap" my={8}>
      <Typography fontWeight={500} variant="body1">
        {renderProductCount(page, perPage, totalProducts)}
      </Typography>

      <Pagination page={page} color="primary" variant="outlined" onChange={handleChangePage} count={Math.ceil(totalProducts / perPage)} />
    </FlexBetween>;
});