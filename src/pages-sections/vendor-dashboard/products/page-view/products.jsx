"use client";

import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// GLOBAL CUSTOM COMPONENTS
import OverlayScrollbar from "components/overlay-scrollbar";
import { TableHeader, TablePagination } from "components/data-table";

// GLOBAL CUSTOM HOOK
import useMuiTable from "hooks/useMuiTable";

//  LOCAL CUSTOM COMPONENT
import ProductRow from "../product-row";
import SearchArea from "../../search-box";
import PageWrapper from "../../page-wrapper";
import { ACTIVE_STATUS, ALL_PRODUCT_STATUS, INACTIVE_STATUS, fetchAdminProducts, mapAdminProduct } from "utils/admin-catalog";

// TABLE HEADING DATA LIST
const tableHeading = [{
  id: "name",
  label: "Name",
  align: "left"
}, {
  id: "categoryName",
  label: "Category",
  align: "left"
}, {
  id: "price",
  label: "Price",
  align: "left"
}, {
  id: "status",
  label: "Status",
  align: "left"
}, {
  id: "action",
  label: "Action",
  align: "center"
}];


// =============================================================================


// =============================================================================

export default function ProductsPageView({
  products: initialProducts = []
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q")?.trim() || "";
  const statusFilter = searchParams.get("status") || ALL_PRODUCT_STATUS;
  const [products, setProducts] = useState(Array.isArray(initialProducts) ? initialProducts : []);
  const [isLoading, setIsLoading] = useState(!initialProducts?.length);
  const [pageError, setPageError] = useState("");

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setPageError("");

    try {
      const data = await fetchAdminProducts({
        q: searchTerm,
        status: statusFilter
      });
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => products.map(mapAdminProduct), [products]);

  const handleStatusChange = event => {
    const params = new URLSearchParams(searchParams);
    const nextStatus = event.target.value;

    if (nextStatus === ALL_PRODUCT_STATUS) {
      params.delete("status");
    } else {
      params.set("status", nextStatus);
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const {
    order,
    orderBy,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort
  } = useMuiTable({
    listData: filteredProducts
  });

  return <PageWrapper title="Product List">
      <SearchArea buttonText="Add Product" url="/admin/products/create" searchPlaceholder="Search Product..." extraContent={<TextField select size="small" label="Status" value={statusFilter} onChange={handleStatusChange} sx={{
      minWidth: 160
    }}>
            <MenuItem value={ALL_PRODUCT_STATUS}>All statuses</MenuItem>
            <MenuItem value={ACTIVE_STATUS}>Active</MenuItem>
            <MenuItem value={INACTIVE_STATUS}>Inactive</MenuItem>
          </TextField>} />

      {pageError ? <Alert severity="error" sx={{
      mb: 3
    }}>{pageError}</Alert> : null}

      <Card>
        <OverlayScrollbar>
          <TableContainer sx={{
          minWidth: 900
        }}>
            <Table>
              <TableHeader order={order} orderBy={orderBy} heading={tableHeading} onRequestSort={handleRequestSort} />

              <TableBody>
                {isLoading ? <tr>
                    <td colSpan={5}>
                      <Stack alignItems="center" justifyContent="center" py={6}>
                        <CircularProgress color="info" />
                      </Stack>
                    </td>
                  </tr> : filteredList.length ? filteredList.map(product => <ProductRow key={product.id} product={product} onChanged={loadProducts} onDeleted={deletedId => {
                setProducts(current => current.filter(item => item.id !== deletedId));
              }} />) : <tr>
                    <td colSpan={5}>
                      <Stack alignItems="center" justifyContent="center" py={6}>
                        <Typography color="text.secondary">No products found for the current filters.</Typography>
                      </Stack>
                    </td>
                  </tr>}
              </TableBody>
            </Table>
          </TableContainer>
        </OverlayScrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination onChange={handleChangePage} count={Math.ceil(filteredProducts.length / rowsPerPage)} />
        </Stack>
      </Card>
    </PageWrapper>;
}